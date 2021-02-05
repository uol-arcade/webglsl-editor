// Constants
import * as actionTypes from './actionTypes'

export const toggleChangedMessage = () => {
    return {
        type: actionTypes.PREVIEW_VIEW_TOGGLE_TOGGLED
    }
};

export const editorUpdateVertFragErrors = errors => 
{
    return {
        type: actionTypes.EDITOR_VERTFRAG_ERRORS_UPDATED,
        payload: errors
    };
}

export const editorUpdateVertFragSrc = (vert, frag) => 
{
    return {
        type: actionTypes.EDITOR_VERTFRAG_ERRORS_UPDATED,
        payload: { vert, frag }
    };
}