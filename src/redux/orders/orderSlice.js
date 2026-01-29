// // import { createSlice } from '@reduxjs/toolkit';
// // import { ORDER_STATUS } from '../../config/orderStates';

// // const orderSlice = createSlice({
// //   name: 'order',
// //   initialState: {
// //     activeOrder: null,
// //     status: null,
// //   },
// //   reducers: {
// //     setActiveOrder: (state, action) => {
// //       state.activeOrder = action.payload;
// //       state.status = ORDER_STATUS.PICKUP_ASSIGNED;
// //     },

// //     updateOrderStatus: (state, action) => {
// //       state.status = action.payload;
// //     },

// //     clearOrder: (state) => {
// //       state.activeOrder = null;
// //       state.status = null;
// //     },
// //   },
// // });

// // export const {
// //   setActiveOrder,
// //   updateOrderStatus,
// //   clearOrder,
// // } = orderSlice.actions;

// // export default orderSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';
// import { ORDER_STATUS } from '../../config/orderStates';

// const initialState = {
//   activeOrder: null,
// };

// const orderSlice = createSlice({
//   name: 'orders',
//   initialState,

//   reducers: {
//     setActiveOrder: (state, action) => {
//       state.activeOrder = action.payload;
//     },

//     updateOrderStatus: (state, action) => {
//       if (state.activeOrder) {
//         state.activeOrder.status = action.payload;
//       }
//     },

//     clearOrder: (state) => {
//       state.activeOrder = null;
//     },
//   },
// });

// export const {
//   setActiveOrder,
//   updateOrderStatus,
//   clearOrder,
// } = orderSlice.actions;

// export default orderSlice.reducer;

// redux/orders/orderSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { ORDER_STATUS } from '../../config/orderStates';

const initialState = {
  activeOrder: null,
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,

  reducers: {
    setActiveOrder: (state, action) => {
      state.activeOrder = action.payload;
      state.error = null;
    },

    updateOrderStatus: (state, action) => {
      if (state.activeOrder) {
        state.activeOrder.status = action.payload;
      }
    },

    setOrderLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setOrderError: (state, action) => {
      state.error = action.payload;
    },

    clearOrder: (state) => {
      state.activeOrder = null;
      state.error = null;
    },

    // Add this to update full order details
    updateOrderDetails: (state, action) => {
      if (state.activeOrder) {
        state.activeOrder = {
          ...state.activeOrder,
          ...action.payload,
        };
      }
    },
  },
});

export const {
  setActiveOrder,
  updateOrderStatus,
  setOrderLoading,
  setOrderError,
  clearOrder,
  updateOrderDetails,
} = orderSlice.actions;

export default orderSlice.reducer;