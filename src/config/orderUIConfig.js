export const orderUIConfig = {

  // =========================
  // 1️⃣ ASSIGNED (FROM API)
  // =========================
  ASSIGNED: {
    showMap: true,
    headerIcon: 'help',
    label: "New order assigned",
    bottomButtons: [
      {
        label: 'Start to Pickup',
        type: 'primary',
        action: 'enRouteToPickup', 
      },
    ],
    secondaryButtons: [
      {
        label: 'Reject Order',
        action: 'rejectOrder',
      },
    ],
  },

  // =========================
  // 2️⃣ RIDER_EN_ROUTE_TO_PICKUP (FROM API)
  // =========================
  RIDER_EN_ROUTE_TO_PICKUP: {
    showMap: true,
    headerIcon: 'location',
    label: "Heading to pickup",
    bottomButtons: [
      {
        label: 'Navigate to Pickup',
        type: 'primary',
        action: 'navigateToPickup', // navigation
        navigateTo: 'MapScreen',
      },
    ],
  },

  // =========================
  // 3️⃣ RIDER_ARRIVED_AT_PICKUP (FROM API)
  // =========================
  RIDER_ARRIVED_AT_PICKUP: {
    showMap: true,
    headerIcon: 'location',
    label: "Arrived at pickup",
    bottomButtons: [
      {
        label: 'Confirm Pickup',
        type: 'primary',
        action: 'pickupOrder', // 🔥 calls /pickup API
      },
    ],
  },

  // =========================
  // 4️⃣ PICKED_UP (FROM API)
  // =========================
  PICKED_UP: {
    showMap: true,
    headerIcon: 'call',
    label: "Order picked up",
    bottomButtons: [
      {
        label: 'Start Delivery',
        type: 'primary',
        action: 'inTransit', // 🔥 calls /in-transit API
      },
    ],
  },

  // =========================
  // 5️⃣ IN_TRANSIT (FROM API)
  // =========================
  IN_TRANSIT: {
    showMap: false,
    headerIcon: 'call',
    label: "Heading to drop",
    secondaryButtons: [
      {
        label: 'Customer not responding',
        action: 'openCancelModal',
      },
    ],
    bottomButtons: [
      {
        label: 'Navigate to Drop',
        type: 'primary',
        action: 'navigateToDrop', // navigation
        navigateTo: 'MapScreen',
      },
    ],
  },

  // =========================
  // 6️⃣ RIDER_ARRIVED_AT_DROP (FROM API)
  // =========================
  RIDER_ARRIVED_AT_DROP: {
    showMap: false,
    headerIcon: 'call',
    label: "Arrived at drop",
    secondaryButtons: [
      {
        label: 'Customer not responding',
        action: 'openCancelModal',
      },
    ],
    bottomButtons: [
      {
        label: 'Deliver Order',
        type: 'primary',
        action: 'deliverOrder', // 🔥 calls /deliver API
      },
    ],
  },

  // =========================
  // 7️⃣ DELIVERED (FINAL STATE)
  // =========================
  DELIVERED: {
    showMap: false,
    headerIcon: 'check',
    label: "Delivered",
    bottomButtons: [],
  },

  // =========================
  // 8️⃣ CANCELLED
  // =========================
  CANCELLED: {
    showMap: false,
    headerIcon: 'close',
    label: "Cancelled",
    bottomButtons: [],
  },
};