import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';


import storage from 'redux-persist/lib/storage';

import enquerySlice from "./slice/enquerySlice";

import salesPersonData from "./slice/salesPersonData";

import quoteSlice from "./slice/quoteSlice";

const rootReducer = combineReducers({

    enquery:enquerySlice,
    salesPerson:salesPersonData,
    quote:quoteSlice,

});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

