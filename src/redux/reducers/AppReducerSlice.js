import { PREVIEW_VIEW_TOGGLE_TOGGLED } from '../actionTypes'

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

export default function(state = APP_INITIAL_STATE, action) 
{
    if (action.type == PREVIEW_VIEW_TOGGLE_TOGGLED)
    {
        //It's manual? Set to auto
        if(state.previewMode == "manual")
            return setPreviewMode(state, 'auto');

        //And vice-versa...
        else
            return setPreviewMode(state, 'manual');
    }

    return state;
}
