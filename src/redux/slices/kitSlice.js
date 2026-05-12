import { createSlice } from '@reduxjs/toolkit';

const kitSlice = createSlice({
  name: 'kit',
  initialState: {
    isCompleted: false,
    apiResponse: null,
    deliveryMode: null,
  },
  reducers: {
    setKitCompleted: (state, action) => {
      state.isCompleted = true;
      state.apiResponse = action.payload.apiResponse;
      state.deliveryMode = action.payload.deliveryMode;
    },
    resetKit: (state) => {
      state.isCompleted = false;
      state.apiResponse = null;
      state.deliveryMode = null;
    },
  },
});

export const { setKitCompleted, resetKit } = kitSlice.actions;
export default kitSlice.reducer;