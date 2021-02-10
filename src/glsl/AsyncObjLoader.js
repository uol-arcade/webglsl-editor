import { dispatch } from 'redux'
import store from '../redux/store'

import { threejsUpdateLoadStatus, threejsUpdateObject } from '../redux/actions'
import config from '../cfg/config.json'

import * as THREE from 'three'
import { RawShaderMaterial, Vector2 } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

export const loader = new OBJLoader();

export const loadPromise = async(path) =>
{
    return new Promise(resolve => 
    {
        loader.load(path, resolve, null, null)
    });
}

export const loadObjectThunk = (path) => async(dispatch, getState) =>
{
    //Set to loading
    dispatch(threejsUpdateLoadStatus("loading"));

    //Load
    const obj = await loadPromise(path);

    //Artificial delay 
    if(config.artificialObjLoadDelay)
        await new Promise(r => setTimeout(r, 100));

    //Set to not loading & update object
    dispatch(threejsUpdateLoadStatus("not-loading"));

    //Return the object
    return obj;
}

export const loadObjectData = async (path) =>
{
    //Dispatch 
    return store.dispatch(loadObjectThunk(path));
}

export const setLoadObjectPath = (path) =>
{
    store.dispatch(threejsUpdateObject(path));
}