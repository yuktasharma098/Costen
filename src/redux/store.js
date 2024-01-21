import {createStore} from "redux";

import rootReducer from "./reducers";
import { persistStore,persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session";
const persistConfig={
    key:'persist-key',
    storage
}
const persistedReducer=persistReducer(persistConfig,rootReducer)
const store=createStore(persistedReducer)
const persistor=persistStore(store)
// const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export default store
export {persistor}
