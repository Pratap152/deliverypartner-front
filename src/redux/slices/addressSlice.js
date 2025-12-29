import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: null,       // single address object
  isEditing: false,    // tells input screen mode
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    // ✅ Create or overwrite address
    assignAddress: (state, action) => {
      state.address = action.payload;
      state.isEditing = false;
    },

    // ✅ Start editing existing address
    startEditingAddress: (state) => {
      state.isEditing = true;
    },

    // ✅ Update existing address
    updateAddress: (state, action) => {
      state.address = {
        ...state.address,
        ...action.payload,
      };
      state.isEditing = false;
    },

    // ✅ Clear address (optional: logout / reset)
    clearAddress: (state) => {
      state.address = null;
      state.isEditing = false;
    },
  },
});

export const {
  assignAddress,
  updateAddress,
  startEditingAddress,
  clearAddress,
} = addressSlice.actions;

export default addressSlice.reducer;

