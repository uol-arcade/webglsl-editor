

//Gets the app reducer
export const getAppReducer = store => store.appReducer;

//Preview mode
export const getPreviewMode = store => getAppReducer(store).previewMode;

//Get frag & vert src
export const getVertSrc = store => getAppReducer(store).vertSrc;
export const getFragSrc = store => getAppReducer(store).fragSrc;