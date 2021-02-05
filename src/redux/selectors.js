

//Gets the app reducer
export const getAppReducer = store => store.appReducer;

//Preview mode
export const getPreviewMode = store => getAppReducer(store).previewMode;