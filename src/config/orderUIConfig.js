

export const orderUIConfig = {

  // =========================
  // 1️⃣ ASSIGNED
  // =========================
  ASSIGNED: {
    showMap: true,
    headerIcon: 'help',
    label: "New order assigned",
    bottomButtons: [
      {
        label: "Navigate to Pickup",
        type: "primary",
        action: "navigateToPickup",
        navigateTo: "MapScreen",
      },
    ],
    secondaryButtons: [
      {
        label: "Reject Order",
        action: "rejectOrder",
      },
    ],
  },

  // =========================
  // 2️⃣ RIDER_EN_ROUTE_TO_PICKUP
  // =========================
  RIDER_EN_ROUTE_TO_PICKUP: {
  showMap: true,
  headerIcon: "location",
  label: "Heading to Pickup",
  bottomButtons: [
    {
      label: "Continue Navigation",
      type: "primary",
      action: "continueToPickup",
      navigateTo: "MapScreen",
    },
  ],
},

  // =========================
  // 3️⃣ RIDER_ARRIVED_AT_PICKUP
  // =========================
  RIDER_ARRIVED_AT_PICKUP: {
    showMap: true,
    headerIcon: "location",
    label: "Arrived at Restaurant",
    bottomButtons: [
      {
        label: "Order Picked Up",
        type: "primary",
        action: "pickupOrder",
      },
    ],
  },

  // =========================
  // 4️⃣ PICKED_UP
  // (Backend status only - user won't stay on this screen)
  // =========================
  PICKED_UP: {
    showMap: true,
    headerIcon:"call",
    label:"Order Picked Up",
    bottomButtons: [
      {
        label: "Start Delivery",
        type: "primary",
        action: "inTransit",
      },
    ],
  },

  // =========================
  // 5️⃣ IN_TRANSIT
  // =========================
  IN_TRANSIT: {
    showMap: false,
    headerIcon: "call",
    label: "Heading to drop",
    secondaryButtons: [
      {
        label: "Customer not responding",
        action: "openCancelModal",
      },
    ],
    bottomButtons: [
      {
        label: "Navigate to Drop",
        type: "primary",
        action: "navigateToDrop",
        navigateTo: "MapScreen",
      },
    ],
  },

  // =========================
  // 6️⃣ RIDER_ARRIVED_AT_DROP
  // =========================
  RIDER_ARRIVED_AT_DROP: {
    showMap: false,
    headerIcon: "call",
    label: "Arrived at Drop",
    secondaryButtons: [
      {
        label: "Customer not responding",
        action: "openCancelModal",
      },
    ],
    bottomButtons: [
      {
        label: "Deliver Order",
        type: "primary",
        action: "deliverOrder",
      },
    ],
  },

  // =========================
  // 7️⃣ DELIVERED
  // =========================
  DELIVERED: {
    showMap: false,
    headerIcon: "check",
    label: "Delivered",
    bottomButtons: [],
  },

  // =========================
  // 8️⃣ CANCELLED
  // =========================
  CANCELLED: {
    showMap: false,
    headerIcon: "close",
    label: "Cancelled",
    bottomButtons: [],
  },
};