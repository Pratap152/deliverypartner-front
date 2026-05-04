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
        label: 'Navigate to Pickup',
        type: 'primary',
        action: 'navigateToPickup', // only navigation
        navigateTo: 'MapScreen',
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
  // 2️⃣ EN ROUTE TO PICKUP (UI STATE ONLY)
  // =========================
  EN_ROUTE_TO_PICKUP: {
    showMap: true,
    headerIcon: 'location',

    bottomButtons: [
      {
        label: 'Reached Restaurant',
        type: 'primary',
        action: 'pickupOrder', // 🔥 calls /pickup API
      },
    ],
  },

  // =========================
  // 3️⃣ PICKED_UP (FROM API)
  // =========================
  PICKED_UP: {
    showMap: true,
    headerIcon: 'call',

    bottomButtons: [
      {
        label: 'Navigate to Drop',
        type: 'primary',
        action: 'navigateToDrop',
        navigateTo: 'MapScreen',
      },
    ],
  },

  // =========================
  // 4️⃣ EN ROUTE TO DROP (UI STATE ONLY)
  // =========================
  EN_ROUTE_TO_DROP: {
    showMap: false,
    headerIcon: 'call',

    secondaryButtons: [
      {
        label: 'Customer not responding',
        action: 'openCancelModal',
      },
    ],

    bottomButtons: [
      {
        label: 'Order Delivered',
        type: 'primary',
        action: 'deliverOrder', // 🔥 calls /deliver API
      },
    ],
  },

  // =========================
  // 5️⃣ DELIVERED (FINAL STATE)
  // =========================
  DELIVERED: {
    showMap: false,
    headerIcon: 'check',

    bottomButtons: [],
  },

  // =========================
  // 6️⃣ CANCELLED
  // =========================
  CANCELLED: {
    showMap: false,
    headerIcon: 'close',

    bottomButtons: [],
  },
};