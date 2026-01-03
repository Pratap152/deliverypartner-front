// import { ORDER_STATUS } from './orderStates';

// export const orderUIConfig = {
//   [ORDER_STATUS.PICKED_UP]: {
//     headerIcon: 'help',
//     bottomButtons: [
//       { label: 'Order Picked Up', type: 'primary' },
//     ],
//   },

//   [ORDER_STATUS.ARRIVED]: {
//     headerIcon: 'call',
//     bottomButtons: [
//       { label: 'Customer Not Responding', type: 'secondary' },
//       { label: 'Arrived at Drop Location', type: 'primary' },
//     ],
//   },

//   [ORDER_STATUS.DELIVERED]: {
//     headerIcon: 'help',
//     bottomButtons: [
//       { label: 'Order Delivered', type: 'primary' },
//     ],
//   },
// };
// 2nd example
// import { ORDER_STATUS } from './orderStates';

// export const orderUIConfig = {
//   [ORDER_STATUS.PICKUP_ASSIGNED]: {
//     headerIcon: 'help',
//     primaryAction: {
//       label: 'Navigate to Pickup',
//       nextStatus: ORDER_STATUS.AT_RESTAURANT,
//     },
//   },

//   [ORDER_STATUS.AT_RESTAURANT]: {
//     headerIcon: 'call',
//     primaryAction: {
//       label: 'Order Picked Up',
//       nextStatus: ORDER_STATUS.ORDER_PICKED_UP,
//     },
//   },

//   [ORDER_STATUS.ORDER_PICKED_UP]: {
//     headerIcon: 'help',
//     primaryAction: {
//       label: 'Navigate to Drop',
//       nextStatus: ORDER_STATUS.AT_DROP,
//     },
//   },

//   [ORDER_STATUS.AT_DROP]: {
//     headerIcon: 'call',
//     primaryAction: {
//       label: 'Order Delivered',
//       nextStatus: ORDER_STATUS.ORDER_DELIVERED,
//     },
//   },

//   [ORDER_STATUS.ORDER_DELIVERED]: {
//     headerIcon: 'success',
//     primaryAction: null,
//   },
// };
export const orderUIConfig = {
  PICKUP_ASSIGNED: {
    bottomButtons: [
      {
        label: 'Navigate to Pickup',
        type: 'primary',
        nextStatus: 'AT_RESTAURANT',
        navigateTo: 'Map',
      },
    ],
  },

  AT_RESTAURANT: {
    bottomButtons: [
      {
        label: 'Order Picked Up',
        type: 'primary',
        nextStatus: 'ORDER_PICKED_UP',
      },
    ],
  },

  ORDER_PICKED_UP: {
    bottomButtons: [
      {
        label: 'Navigate to Drop',
        type: 'primary',
        nextStatus: 'AT_DROP',
        navigateTo: 'Map',
      },
    ],
  },

  AT_DROP: {
    bottomButtons: [
      {
        label: 'Order Delivered',
        type: 'primary',
        nextStatus: 'ORDER_DELIVERED',
      },
    ],
  },

  ORDER_DELIVERED: {
    bottomButtons: [],
  },
};
