

//Gets the app reducer
export const getAppReducer = store => store.appReducer;

//Preview mode
export const getPreviewMode = store => getAppReducer(store).previewMode;

//Get frag & vert src, errors, and compile status
export const getVertSrc = store => getAppReducer(store).vertSrc;
export const getFragSrc = store => getAppReducer(store).fragSrc;
//--
export const getCompileErrors = store => getAppReducer(store).errors;
export const getDetailedErrors = store => getCompileErrors(store).detailed;
export const getPrettyErrors   = store => getCompileErrors(store).pretty;
//--
export const getCompileStatus = store => getAppReducer(store).compileStatus;


//Three js stuff
export const getThreeJsRenderer     = store => getAppReducer(store).threejs.renderer;
export const getThreeJsLoadStatus   = store => getAppReducer(store).threejs.loadStatus;
export const getThreeJsObject       = store => getAppReducer(store).threejs.obj;
export const getThreeJsObjectSource = store => getAppReducer(store).threejs.objSource;


//Settings
export const getSettings = store => getAppReducer(store).settings;