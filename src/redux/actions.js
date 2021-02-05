// Constants
import * as actionTypes from './actionTypes'

export const toggleChangedMessage = () => {
    return {
        type: actionTypes.PREVIEW_VIEW_TOGGLE_TOGGLED
    }
};

export const editorUpdateVertFragErrors = (detailedErrors, prettyErrors) => 
{
    return {
        type: actionTypes.EDITOR_VERTFRAG_ERRORS_UPDATED,
        payload: { 
            errors : {
                detailed: detailedErrors,
                pretty: prettyErrors
            }
        }
    };
}

export const editorUpdateVertFragSrc = (vert, frag) => 
{
    return {
        type: actionTypes.EDITOR_VERTFRAG_SRC_UPDATED,
        payload: { vert, frag }
    };
}

export const editorUpdateCompileStatus = (status) =>
{
    return {
        type: actionTypes.EDITOR_UPDATE_COMPILE_STATUS,
        payload: { status }
    }
}

export const threejsUpdateRenderer = renderer =>
{
    return {
        type: actionTypes.THREEJS_UPDATE_RENDERER,
        payload: { renderer }
    }
}