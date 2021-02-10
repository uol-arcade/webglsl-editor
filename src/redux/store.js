import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

//Import reducer slices
import appReducer from './reducers/AppReducerSlice'


//Create root reducer
const rootReducer = combineReducers({ appReducer });

//Create a new store
const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

//aaaand export it
export default store;