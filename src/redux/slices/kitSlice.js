import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

const initialState = {
  riders: {},
};

const kitSlice = createSlice({
  name: 'kit',
  initialState,
  reducers: {
    setKitFlowStep: (state, action) => {
      const {
        riderId,
        currentStep,
        apiResponse = null,
        deliveryMode = null,
        addressData = null,
        selectedZone = null,
      } = action.payload || {};

      if (!riderId) return;

      if (!state.riders) {
        state.riders = {};
      }

      state.riders[riderId] = {
        ...(state.riders[riderId] || {}),
        currentStep: currentStep ?? state.riders[riderId]?.currentStep ?? null,
        apiResponse: apiResponse ?? state.riders[riderId]?.apiResponse ?? null,
        deliveryMode: deliveryMode ?? state.riders[riderId]?.deliveryMode ?? null,
        addressData: addressData ?? state.riders[riderId]?.addressData ?? null,
        selectedZone: selectedZone ?? state.riders[riderId]?.selectedZone ?? null,
        kitCompleted: state.riders[riderId]?.kitCompleted ?? false,
      };
    },

    setKitCompleted: (state, action) => {
      const riderId = action.payload?.riderId;
      if (!riderId) return;

      if (!state.riders) {
        state.riders = {};
      }

      state.riders[riderId] = {
        ...(state.riders[riderId] || {}),
        kitCompleted: action.payload?.kitCompleted ?? true,
        apiResponse: action.payload?.apiResponse ?? state.riders[riderId]?.apiResponse ?? null,
        deliveryMode: action.payload?.deliveryMode ?? state.riders[riderId]?.deliveryMode ?? null,
        currentStep: action.payload?.currentStep ?? 'SuccessScreen',
        addressData: action.payload?.addressData ?? state.riders[riderId]?.addressData ?? null,
        selectedZone: action.payload?.selectedZone ?? state.riders[riderId]?.selectedZone ?? null,
      };
    },

    clearKitCompleted: (state, action) => {
      const riderId = action.payload?.riderId;

      if (!state.riders) {
        state.riders = {};
      }

      if (riderId) {
        delete state.riders[riderId];
      }
    },

    clearAllKitCompleted: state => {
      state.riders = {};
    },
  },
  extraReducers: builder => {
    builder.addCase(PURGE, () => initialState);
  },
});

export const {
  setKitFlowStep,
  setKitCompleted,
  clearKitCompleted,
  clearAllKitCompleted,
} = kitSlice.actions;

export default kitSlice.reducer;