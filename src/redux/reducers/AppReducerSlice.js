import * as actionTypes from '../actionTypes'

//GLSL template imports
import * as GLSLCompiler from '../../glsl/compiler/GLSLCompiler'
import VERT_SHADER_TEMPLATE from '../../glsl/templates/vert.glsl'
import FRAG_SHADER_TEMPLATE from '../../glsl/templates/frag.glsl'

//The initial state
export const APP_INITIAL_STATE =
{
    previewMode: "manual",
    vertSrc: VERT_SHADER_TEMPLATE,
    fragSrc: FRAG_SHADER_TEMPLATE,
    threejs: {
        renderer: null
    },
    errors: {
        detailed: [],
        pretty: []
    },
    compileStatus: GLSLCompiler.COMPILE_STATUS_PASS
}

const setPreviewMode = (state, mode) => 
{
    return {
        ...state,
        previewMode: mode
    };
}

const setVertFragSrc = (state, vert, frag) =>
{
    return {
        ...state, 
        vertSrc: vert,
        fragSrc: frag
    };
}

const setVertFragErrors = (state, errors) =>
{
    return {
        ...state,
        errors: errors
    }
}

const setThreeJSRenderer = (state, renderer) =>
{
    return {
        ...state, 
        threejs: {
            ...state.threejs,
            renderer: renderer
        }
    }
}

const setCompileStatus = (state, status) => 
{
    return {
        ...state,
        compileStatus: status
    }
}

export default function(state = APP_INITIAL_STATE, action) 
{
    if (action.type == actionTypes.PREVIEW_VIEW_TOGGLE_TOGGLED)
    {
        //It's manual? Set to auto
        if(state.previewMode == "manual")
            return setPreviewMode(state, 'auto');

        //And vice-versa...
        else
            return setPreviewMode(state, 'manual');
    }

    if(action.type == actionTypes.EDITOR_VERTFRAG_SRC_UPDATED)
        return setVertFragSrc(state, action.payload.vert, action.payload.frag);

    if(action.type == actionTypes.EDITOR_VERTFRAG_ERRORS_UPDATED)
        return setVertFragErrors(state, action.payload.errors);

    if(action.type == actionTypes.THREEJS_UPDATE_RENDERER)
        return setThreeJSRenderer(state, action.payload.renderer);

    if(action.type == actionTypes.EDITOR_UPDATE_COMPILE_STATUS)
        return setCompileStatus(state, status);


    return state;
}
