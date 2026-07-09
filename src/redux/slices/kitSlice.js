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
        apiResponse,
        deliveryMode,
        addressData,
        selectedZone,
        source,
        kitItems,
        totalAmount,
        paymentType,
        selectedPaymentMethod,
      } = action.payload || {};

      if (!riderId) return;

      if (!state.riders) {
        state.riders = {};
      }

      const existingRiderState = state.riders[riderId] || {};

      state.riders[riderId] = {
        ...existingRiderState,
        currentStep:
          currentStep !== undefined
            ? currentStep
            : existingRiderState.currentStep ?? null,
        apiResponse:
          apiResponse !== undefined
            ? apiResponse
            : existingRiderState.apiResponse ?? null,
        deliveryMode:
          deliveryMode !== undefined
            ? deliveryMode
            : existingRiderState.deliveryMode ?? null,
        addressData:
          addressData !== undefined
            ? addressData
            : existingRiderState.addressData ?? null,
        selectedZone:
          selectedZone !== undefined
            ? selectedZone
            : existingRiderState.selectedZone ?? null,
        source:
          source !== undefined
            ? source
            : existingRiderState.source ?? null,
        kitItems:
          kitItems !== undefined
            ? kitItems
            : existingRiderState.kitItems ?? null,
        totalAmount:
          totalAmount !== undefined
            ? totalAmount
            : existingRiderState.totalAmount ?? null,
        paymentType:
          paymentType !== undefined
            ? paymentType
            : existingRiderState.paymentType ?? null,
        selectedPaymentMethod:
          selectedPaymentMethod !== undefined
            ? selectedPaymentMethod
            : existingRiderState.selectedPaymentMethod ?? null,
        kitCompleted: existingRiderState.kitCompleted ?? false,
      };
    },

    setKitCompleted: (state, action) => {
      const {
        riderId,
        kitCompleted,
        apiResponse,
        deliveryMode,
        currentStep,
        addressData,
        selectedZone,
        source,
        kitItems,
        totalAmount,
        paymentType,
        selectedPaymentMethod,
      } = action.payload || {};

      if (!riderId) return;

      if (!state.riders) {
        state.riders = {};
      }

      const existingRiderState = state.riders[riderId] || {};

      state.riders[riderId] = {
        ...existingRiderState,
        kitCompleted:
          kitCompleted !== undefined
            ? kitCompleted
            : true,
        apiResponse:
          apiResponse !== undefined
            ? apiResponse
            : existingRiderState.apiResponse ?? null,
        deliveryMode:
          deliveryMode !== undefined
            ? deliveryMode
            : existingRiderState.deliveryMode ?? null,
        currentStep:
          currentStep !== undefined
            ? currentStep
            : existingRiderState.currentStep ?? null,
        addressData:
          addressData !== undefined
            ? addressData
            : existingRiderState.addressData ?? null,
        selectedZone:
          selectedZone !== undefined
            ? selectedZone
            : existingRiderState.selectedZone ?? null,
        source:
          source !== undefined
            ? source
            : existingRiderState.source ?? null,
        kitItems:
          kitItems !== undefined
            ? kitItems
            : existingRiderState.kitItems ?? null,
        totalAmount:
          totalAmount !== undefined
            ? totalAmount
            : existingRiderState.totalAmount ?? null,
        paymentType:
          paymentType !== undefined
            ? paymentType
            : existingRiderState.paymentType ?? null,
        selectedPaymentMethod:
          selectedPaymentMethod !== undefined
            ? selectedPaymentMethod
            : existingRiderState.selectedPaymentMethod ?? null,
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