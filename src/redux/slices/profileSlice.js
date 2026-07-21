import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/ApiClient';

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async () => {
    const res = await apiClient.get('/api/rider/profile/rider/profile');
    return res.data?.data;
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (formData) => {
    await apiClient.put('/api/rider/profile/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // re-fetch updated profile
    const res = await apiClient.get('/api/rider/profile/rider/profile');
    return res.data?.data;
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    loading: false,
  },
  reducers: {
    clearProfile: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
