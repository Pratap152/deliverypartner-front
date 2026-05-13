import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

import vehicleReducer from './slices/vehicleSlice';
import addressReducer from './slices/addressSlice';
import notificationsReducer from './slices/notificationSlice';
import profileReducer from './slices/profileSlice';
import kitReducer from './slices/kitSlice';

const rootReducer = combineReducers({
  address: addressReducer,
  vehicle: vehicleReducer,
  notifications: notificationsReducer,
  profile: profileReducer,
  kit: kitReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['kit'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);