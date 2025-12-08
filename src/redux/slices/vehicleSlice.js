import { createSlice } from '@reduxjs/toolkit';

const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState: {
    selectedVehicle: null, // bike / ev / null
  },
  reducers: {
    setSelectedVehicle: (state, action) => {
      state.selectedVehicle = action.payload;
    },
  },
});

export const { setSelectedVehicle } = vehicleSlice.actions;
export default vehicleSlice.reducer;
