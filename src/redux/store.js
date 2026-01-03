import { configureStore } from '@reduxjs/toolkit';
import vehicleReducer from './slices/vehicleSlice';
import documentsReducer from './slices/documentsVerificationSlice';
import addressReducer from "./slices/addressSlice";

export const store = configureStore({
  reducer: {
    address: addressReducer,
    vehicle: vehicleReducer,
    documents: documentsReducer,
  },
});
