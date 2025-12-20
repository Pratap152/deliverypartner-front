import { configureStore } from '@reduxjs/toolkit';
import vehicleReducer from './slices/vehicleSlice';
import documentsReducer from './slices/documentsVerificationSlice';

export const store = configureStore({
  reducer: {
    vehicle: vehicleReducer,
    documents: documentsReducer,
  },
});
