import { configureStore } from '@reduxjs/toolkit'

//Import reducer slices
import appReducer from './reducers/AppReducerSlice'

//Create a new store
const store = configureStore({
    reducer: {
        app: appReducer
    }
});

//aaaand export it
export default store;