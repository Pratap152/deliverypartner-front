export const orderUIConfig = {
  PICKUP_ASSIGNED: {
    showMap: false, // No map on order details
    headerIcon: 'map-marker',
    label: "Order Details",
    bottomButtons: [
      {
        label: 'Navigate',
        type: 'primary',
        navigateTo: 'MapScreen',
        nextStatus: 'AT_RESTAURANT', // Status that will be set when arriving
      },
    ],
  },

  AT_RESTAURANT: {
    showMap: false,
    headerIcon: 'store',
    label: "Order Pickup",
    bottomButtons: [
      {
        label: 'Order Picked up',
        type: 'primary',
        nextStatus: 'ORDER_PICKED_UP',
      },
    ],
  },

  ORDER_PICKED_UP: {
    showMap: false,
    headerIcon: 'bike',
    label: "Order Details",
    bottomButtons: [
      {
        label: 'Navigate',
        type: 'primary',
        navigateTo: 'MapScreen',
        nextStatus: 'AT_DROP',
      },
    ],
  },

  AT_DROP: {
    showMap: false,
    headerIcon: 'map-marker-check',
    label: "Arrived to Drop Location",
    bottomButtons: [
      {
        label: 'Arrived at Drop Location',
        type: 'primary',
        nextStatus: 'ORDER_DELIVERED',
      },
    ],
  },

  ORDER_DELIVERED: {
    showMap: false,
    headerIcon: 'check-circle',
    label: "Delivered Successfully",
    bottomButtons: [],
  },
};


