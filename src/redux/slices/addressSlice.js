import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../api/ApiClient";

const initialState = {
  addresses: [],
  editingAddress: null,
  loading: false,
  error: null
};
export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/api/rider/kit-address");
      console.log("Fetched addresses:", response);
      return response.data; // expect array
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch addresses");
    }
  }
);

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
  extraReducers: builder => {
    builder
      .addCase(fetchAddresses.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addAddress,
  updateAddress,
  setEditingAddress,
  clearEditingAddress,
  
} = addressSlice.actions;

export default addressSlice.reducer;
