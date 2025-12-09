import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  aadhaar: false,
  pan: false,
  dl: false,
};

const documentsVerificationSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    verifyDocument: (state, action) => {
      state[action.payload] = true;
    },
  },
});

export const { verifyDocument } = documentsVerificationSlice.actions;

export default documentsVerificationSlice.reducer;
