import { configureStore } from '@reduxjs/toolkit';
import vehicleReducer from './slices/vehicleSlice';

export const store = configureStore({
  reducer: {
    vehicle: vehicleReducer,
  },
});
