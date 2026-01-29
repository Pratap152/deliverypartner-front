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
        navigateTo: 'MapScreen',
        nextStatus: 'AT_DROP', // Will navigate to drop location
      },
    ],
  },

  ORDER_PICKED_UP: {
    // This state exists for API compatibility but shouldn't be visited in normal flow
    showMap: false,
    headerIcon: 'bike',
    label: "Out for Delivery",
    bottomButtons: [
      {
        label: 'Navigate to Drop',
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
        label: 'Order Delivered',
        type: 'primary',
        nextStatus: 'ORDER_DELIVERED',
      },
    ],
    secondaryButtons: [
      {
        label: 'Customer Not Responding',
        type: 'secondary',
        action: 'openModal', // Opens CustomerNotResponding modal
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


