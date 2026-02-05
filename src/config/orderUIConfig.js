
export const orderUIConfig = {
  PICKUP_ASSIGNED: {
    showMap: true, // Map Visible
    headerIcon: 'help',
    bottomButtons: [
      {
        label: 'Navigate to Pickup',
        type: 'primary',
        nextStatus: 'AT_RESTAURANT', // Map should direct here
        navigateTo: 'Map',
      },
    ],
  },




  AT_RESTAURANT: {
    showMap: false, // Map Hidden
    headerIcon: 'call',
    bottomButtons: [
      {
        label: 'Order Picked Up',
        type: 'primary',
        // navigateTo: 'MapScreen', // Removing navigation to trigger direct status update
        nextStatus: 'ORDER_PICKED_UP', // Will call pickupOrder API
      },
    ],
  },

  ORDER_PICKED_UP: {
    showMap: true, // Map Visible
    headerIcon: 'call',
    bottomButtons: [
      {
        label: 'Navigate to Drop',
        type: 'primary',
        nextStatus: 'AT_DROP', // Bypass QR Scanner, go directly to AT_DROP
        navigateTo: 'Map',
      },
    ],
  },

  // Intermediate state if needed, or MapScreen handles the transition to QR
  QR_SCAN_REQUIRED: {
    showMap: false,
    navigateTo: 'QRScannerScreen',
  },

  AT_DROP: {
    showMap: false, // Map Hidden
    headerIcon: 'call',
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
    // triggering navigation to Success screen handled in component
  },
};
