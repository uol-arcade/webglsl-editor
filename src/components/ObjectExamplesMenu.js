import React from 'react'
import objExamples from '../cfg/object-examples.json'
import { connect } from 'react-redux'
import * as actionTypes from '../redux/actionTypes'
import axios from 'axios'

import { threejsUpdateLoadStatus, threejsUpdateObject } from '../redux/actions'
import MenuPopout from './MenuPopout'
import * as AsyncObjLoader from '../glsl/AsyncObjLoader'

class ObjectExamplesMenu extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    onExampleClick(item)
    {
        //Load the shader
        AsyncObjLoader.setLoadObjectPath(item.obj);
    }

    render()
    {        
        //Just make a popout menu
        return <MenuPopout onItemClicked={this.onExampleClick.bind(this)} data={objExamples}/>
    }
}


const mapDispatchToProps = dispatch => ({
    loadShader: (vert, frag) => dispatch(async () =>
    {
        //Dispatch load status update
        dispatch(threejsUpdateLoadStatus("loading"));

        //Get vert + frag
        const vertSrc = await axios.get(vert);
        const fragSrc = await axios.get(frag);

        //Dispatch load status update
        dispatch(threejsUpdateLoadStatus("not-loading"));

        //Dispatch with that data
        dispatch({
            type: actionTypes.ASYNC_LOAD_SHADER_EXAMPLE,
            payload: {
                vert: vertSrc.data,
                frag: fragSrc.data
            }
        })
    })
});

export default connect(null, mapDispatchToProps, null, { forwardRef: true })(ObjectExamplesMenu);