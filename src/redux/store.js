import { configureStore } from '@reduxjs/toolkit';
import vehicleReducer from './slices/vehicleSlice';
import addressReducer from './slices/addressSlice';
import { earningsApi } from '../api/earnings.api';

export const store = configureStore({
  reducer: {
    address: addressReducer,
    vehicle: vehicleReducer,
    [earningsApi.reducerPath]: earningsApi.reducer,
  },
  middleware: getDefault =>
    getDefault({ serializableCheck: false }).concat(
      earningsApi.middleware
    ),
});
