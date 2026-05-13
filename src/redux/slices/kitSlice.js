import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

const initialState = {
  kitCompleted: false,
  riderId: null,
  apiResponse: null,
  deliveryMode: null,
};

const kitSlice = createSlice({
  name: 'kit',
  initialState,
  reducers: {
    setKitCompleted: (state, action) => {
      state.kitCompleted = action.payload?.kitCompleted ?? true;
      state.riderId = action.payload?.riderId ?? null;
      state.apiResponse = action.payload?.apiResponse ?? null;
      state.deliveryMode = action.payload?.deliveryMode ?? null;
    },
    clearKitCompleted: state => {
      state.kitCompleted = false;
      state.riderId = null;
      state.apiResponse = null;
      state.deliveryMode = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(PURGE, () => initialState);
  },
});

export const { setKitCompleted, clearKitCompleted } = kitSlice.actions;
export default kitSlice.reducer;