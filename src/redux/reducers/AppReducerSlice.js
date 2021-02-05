
const setPreviewMode = (state, mode) => 
{
    return {
        ...state,
        previewMode: mode
    };
}

//The initial state
export const APP_INITIAL_STATE =
{
    previewMode: "manual"
}

import { createSlice } from '@reduxjs/toolkit'


export default function appReducer(state = APP_INITIAL_STATE, action) 
{
    if(action.type == 'previewMode/togglePreviewMode')
    {
        if(state.previewMode == "manual")
            return setPreviewMode('auto');
        else
            return setPreviewMode('manual');
    }

    return state;
}
