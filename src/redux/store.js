import { configureStore } from '@reduxjs/toolkit';

import vehicleReducer from './slices/vehicleSlice';
import addressReducer from './slices/addressSlice';
import notificationsReducer from './slices/notificationSlice';
import profileReducer from './slices/profileSlice';
import kitReducer from './slices/kitSlice';

export const store = configureStore({
  reducer: {
    address: addressReducer,
    vehicle: vehicleReducer,
    notifications: notificationsReducer,
    profile: profileReducer,
    kit: kitReducer,
  },
});
