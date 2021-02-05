import { combineReducers, createStore } from 'redux'

//Import reducer slices
import appReducer from './reducers/AppReducerSlice'

//Create root reducer
const rootReducer = combineReducers({ appReducer });

//Create a new store
const store = createStore(rootReducer);

//aaaand export it
export default store;