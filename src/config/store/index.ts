import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import reducers from '../reducers';
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER
  } from 'redux-persist'

import storage from 'redux-persist/lib/storage';

const persistConfig  = {
	key: 'app',
	storage,
	whitelist: ["theme", "wallet"]
}

const persistedReducers = persistReducer(persistConfig, reducers);

export const store = configureStore({
	reducer: persistedReducers,
	middleware: getDefaultMiddleware({
		serializableCheck: {
			ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
		}
	})
});

export let persistor = persistStore(store)

