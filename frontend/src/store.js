import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer'; // Import your combined reducers
import process from 'process';

const persistConfig = {
  key: 'root', // This key is used to persist the entire state
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [ thunk], // Add Thunk middleware
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

// Export the store and persistor for use in your application
export default { store, persistor };
