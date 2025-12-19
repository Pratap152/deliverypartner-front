import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addresses: [],
  editingAddress: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    addAddress: (state, action) => {
      state.addresses.push(action.payload);
    },
    updateAddress: (state, action) => {
      state.addresses = state.addresses.map(item =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    setEditingAddress: (state, action) => {
      state.editingAddress = action.payload;
    },
    clearEditingAddress: (state) => {
      state.editingAddress = null;
    },
  },
});

export const {
  addAddress,
  updateAddress,
  setEditingAddress,
  clearEditingAddress,
} = addressSlice.actions;

export default addressSlice.reducer;
