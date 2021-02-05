import * as actionTypes from '../actionTypes'

//GLSL template imports
import VERT_SHADER_TEMPLATE from '../../glsl/templates/vert.glsl'
import FRAG_SHADER_TEMPLATE from '../../glsl/templates/frag.glsl'

//The initial state
export const APP_INITIAL_STATE =
{
    previewMode: "manual",
    vertSrc: VERT_SHADER_TEMPLATE,
    fragSrc: FRAG_SHADER_TEMPLATE
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
    console.log(state);

    return {
        ...state, 
        vertSrc: vert,
        fragSrc: frag
    };
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

    return state;
}
