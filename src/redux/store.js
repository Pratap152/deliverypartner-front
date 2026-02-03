import { configureStore } from '@reduxjs/toolkit';

import vehicleReducer from './slices/vehicleSlice';
import addressReducer from './slices/addressSlice';
import notificationsReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    address: addressReducer,
    vehicle: vehicleReducer,
    notifications: notificationsReducer,
  },
});
