import { configureStore } from '@reduxjs/toolkit';
import vehicleReducer from './slices/vehicleSlice';
import addressReducer from './slices/addressSlice';

export const store = configureStore({
  reducer: {
    address: addressReducer,
    vehicle: vehicleReducer,
  },
});
