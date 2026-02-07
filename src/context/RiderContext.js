import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import { Alert } from "react-native";
import { navigate } from "../navigation/RootNavigation"; // Root navigation
import { ORDER_STATUS } from "../config/orderStates";
import WEBSITE_URL from '../../src/utils/host';
import { OrdersAPI } from "../api/api";
import { orderService } from '../services/order/OrderService';
import { tokenService } from '../services/TokenService';
import OrderQueueModal from '../components/order/OrderQueueModal';

const RiderContext = createContext();

export const RiderProvider = ({ children }) => {
  const socketRef = useRef(null);

  // Multi-Order Queue State
  const [orderQueue, setOrderQueue] = useState([]); // Array of { id, data, countdown, receivedAt }
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const [status, setStatus] = useState("DISCONNECTED"); // Socket status: DISCONNECTED, CONNECTING, CONNECTED, ERROR
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  // Load access token on mount
  useEffect(() => {
    const loadToken = async () => {
      const { accessToken } = await tokenService.get();
      setAccessToken(accessToken);
      console.log('📡 Access token loaded:', accessToken ? 'YES' : 'NO');
    };
    loadToken();
  }, []);

  // New states for rider status
  const [riderStatus, setRiderStatus] = useState(null); // { isOnline, lastLoginAt, lastLogoutAt, totalOnlineMinutesToday }
  const [isGoingOnline, setIsGoingOnline] = useState(false);
  const [isGoingOffline, setIsGoingOffline] = useState(false);
  const [actuallyOnline, setActuallyOnline] = useState(false); // Track actual online state separate from socket

  /** ---------------------------
   * SOCKET CONNECTION (Internal)
   * --------------------------*/
  const connectSocket = () => {
    console.log("\n📡 === CONNECTING SOCKET ===");
    console.log("📡 Current socketRef:", socketRef.current ? "EXISTS" : "NULL");

    if (socketRef.current) {
      console.log("📡 Socket already exists, skipping connection");
      return;
    }

    if (!accessToken) {
      console.log("❌ Cannot connect socket: accessToken is null");
      return;
    }

    setStatus("CONNECTING");
    const wsUrl = `wss://delivarypartner.onrender.com/ws?type=RIDER_NOTIFICATION&token=${accessToken}`;
    console.log("📡 Creating new WebSocket to:", wsUrl);
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("🟢 === SOCKET CONNECTED ===");
      console.log("🟢 Rider ONLINE — socket connected");
      console.log("🟢 readyState:", ws.readyState);
      setStatus("CONNECTED");
    };

    ws.onmessage = (event) => {
      console.log("\n📩 === WEBSOCKET MESSAGE RECEIVED ===");
      console.log("📩 Raw event.data:", event.data);
      try {
        const data = JSON.parse(event.data);
        console.log("📩 Parsed data:", JSON.stringify(data, null, 2));
        console.log("📩 Message type:", data.type);

        // if (data.type === "ORDER_POPUP") {
        //   console.log("🔔 ORDER_POPUP received! Adding to queue...");
        //   addOrderToQueue(data);
        // } else {
        //   console.log("📩 Unknown message type, ignoring:", data.type);
        // }
        if (data.type === "ORDER_POPUP") {
  console.log("🔔 ORDER_POPUP received! Adding to queue...");
  addOrderToQueue(data);

} else if (data.type === "ORDER_CANCELLED") {
  console.log("🚫 ORDER_CANCELLED received:", data.orderId);

  // 1️⃣ Remove from queue if it exists
  removeOrderFromQueue(data.orderId);

  // 2️⃣ Clear expanded order if needed
  setExpandedOrderId(prev =>
    prev === data.orderId ? null : prev
  );

  // 3️⃣ Optional: Notify rider
  Alert.alert(
    "Order Cancelled",
    "Order was cancelled by the system.",
  );

  // 4️⃣ Optional: Force navigation away from order flow
  navigate("HomeDashboard"); // <-- MUST exist in navigator

} else {
  console.log("📩 Unknown message type, ignoring:", data.type);
}

      } catch (e) {
        console.log("🔴 WS message parse error:", e);
        console.log("🔴 Raw data that failed:", event.data);
      }
    };

    ws.onerror = (e) => {
      console.log("\n🔴 === WEBSOCKET ERROR ===");
      console.log("🔴 WS error:", e);
      console.log("🔴 Error message:", e?.message);
      setStatus("ERROR");
    };

    ws.onclose = (e) => {
      console.log("\n⚪ === SOCKET CLOSED ===");
      console.log("⚪ Close code:", e?.code);
      console.log("⚪ Close reason:", e?.reason);
      console.log("⚪ Was clean:", e?.wasClean);
      setStatus("DISCONNECTED");
      socketRef.current = null;
      setOrderQueue([]); // Clear queue on disconnect
    };
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setOrderQueue([]); // Clear queue on disconnect
    setStatus("DISCONNECTED");
  };

  /** ---------------------------
   * GO ONLINE (API + Socket)
   * --------------------------*/
  const goOnline = async () => {
    console.log("\n🔵 === GO ONLINE FLOW STARTED ===");
    console.log("🔵 Current status:", status);
    console.log("🔵 isGoingOnline:", isGoingOnline);
    console.log("🔵 isGoingOffline:", isGoingOffline);

    // Prevent double-tap
    if (isGoingOnline || isGoingOffline || status === "CONNECTED" || status === "CONNECTING") {
      console.log("⚠️ goOnline blocked: already in progress or connected");
      return;
    }

    console.log("🔵 Step 1: Setting isGoingOnline = true");
    setIsGoingOnline(true);

    try {
      // 1. Call API first
      console.log("🔵 Step 2: Calling API - setRiderOnline()");
      const response = await orderService.setRiderOnline();
      console.log("🔵 Step 3: API Response:", JSON.stringify(response));

      if (response?.success) {
        console.log("✅ Step 4: API Success - Rider is now ONLINE");

        // Store rider status data
        if (response.riderStatus) {
          console.log("🔵 Step 5: Storing riderStatus:", JSON.stringify(response.riderStatus));
          setRiderStatus(response.riderStatus);
        }

        // 2. Connect socket on API success
        console.log("🔵 Step 6: Connecting WebSocket...");
        setActuallyOnline(true); // Mark as online
        connectSocket();
        console.log("🟢 === GO ONLINE FLOW COMPLETED ===");
      } else {
        throw new Error(response?.message || "Failed to go online");
      }
    } catch (error) {
      console.log("❌ goOnline failed:", error);

      const errorMessage = error?.response?.data?.message || error?.message || "";

      // EDGE CASE: If rider is already online, treat as success
      if (errorMessage.toLowerCase().includes("already online")) {
        console.log("🔵 EDGE CASE: Rider already online - syncing state");
        setActuallyOnline(true); // Set online state
        connectSocket();
        console.log("🟢 === GO ONLINE FLOW COMPLETED (Already Online) ===");
        return;
      }

      // Show error to user for other errors
      Alert.alert("Connection Error", errorMessage || "Failed to go online. Please try again.");

      // Keep current state (offline)
      setStatus("DISCONNECTED");
    } finally {
      setIsGoingOnline(false);
    }
  };

  /** ---------------------------
   * GO OFFLINE (API + Socket)
   * --------------------------*/
  const goOffline = async () => {
    console.log("\n🔴 === GO OFFLINE FLOW STARTED ===");
    console.log("🔴 Current status:", status);
    console.log("🔴 isGoingOnline:", isGoingOnline);
    console.log("🔴 isGoingOffline:", isGoingOffline);

    // Prevent double-tap
    if (isGoingOnline || isGoingOffline) {
      console.log("⚠️ goOffline blocked: already in progress");
      return;
    }

    console.log("🔴 Step 1: Setting isGoingOffline = true");
    setIsGoingOffline(true);

    try {
      // 1. Call API first
      console.log("🔴 Step 2: Calling API - setRiderOffline()");
      const response = await orderService.setRiderOffline();
      console.log("🔴 Step 3: API Response:", JSON.stringify(response));

      if (response?.success) {
        console.log("✅ Step 4: API Success - Rider is now OFFLINE");

        // Store rider status data
        if (response.riderStatus) {
          console.log("🔴 Step 5: Storing riderStatus:", JSON.stringify(response.riderStatus));
          setRiderStatus(response.riderStatus);
        }

        // 2. Disconnect socket on API success
        console.log("🔴 Step 6: Disconnecting WebSocket...");
        setActuallyOnline(false); // Mark as offline
        disconnectSocket();
        console.log("⚪ === GO OFFLINE FLOW COMPLETED ===");
      } else {
        throw new Error(response?.message || "Failed to go offline");
      }
    } catch (error) {
      console.log("❌ goOffline failed:", error);

      const errorMessage = error?.response?.data?.message || error?.message || "";

      // EDGE CASE: If rider is already offline, treat as success
      if (errorMessage.toLowerCase().includes("already offline")) {
        console.log("🔴 EDGE CASE: Rider already offline - syncing state");
        setActuallyOnline(false); // Set offline state
        disconnectSocket();
        console.log("⚪ === GO OFFLINE FLOW COMPLETED (Already Offline) ===");
        return;
      }

      // Show error to user for other errors
      Alert.alert("Connection Error", errorMessage || "Failed to go offline. Please try again.");

      // Keep current state (socket stays connected)
    } finally {
      setIsGoingOffline(false);
    }
  };

  /** ---------------------------
   * ORDER QUEUE MANAGEMENT
   * --------------------------*/

  // Define MAX_QUEUE_SIZE constant
  const MAX_QUEUE_SIZE = 5;

  /**
   * Add new order to queue
   * Edge Cases: Duplicates, max size, auto-expand
   */
  const addOrderToQueue = (orderData) => {
    console.log("🔵 addOrderToQueue called with:", orderData.orderId);

    const newOrder = {
      id: orderData.orderId,
      data: orderData,
      countdown: 20,
      receivedAt: Date.now()
    };

    setOrderQueue(prev => {
      // EDGE CASE 1: Prevent duplicate orders
      if (prev.some(o => o.id === newOrder.id)) {
        console.log("⚠️ Duplicate order ignored:", newOrder.id);
        return prev;
      }

      // EDGE CASE 2: Enforce max queue size
      let updated = [newOrder, ...prev];
      if (updated.length > MAX_QUEUE_SIZE) {
        console.log(`⚠️ Queue full, removing oldest order`);
        updated = updated.slice(0, MAX_QUEUE_SIZE);
      }

      console.log("✅ Order added to queue. Queue size:", updated.length);
      return updated;
    });

    // Auto-expand the newest order
    setExpandedOrderId(newOrder.id);
  };

  /**
   * Remove order from queue
   */
  const removeOrderFromQueue = (orderId) => {
    console.log("🗑️ Removing order from queue:", orderId);

    setOrderQueue(prev => {
      const updated = prev.filter(o => o.id !== orderId);

      // If we removed the expanded order, expand the next one
      if (orderId === expandedOrderId && updated.length > 0) {
        setExpandedOrderId(updated[0].id);
      }

      console.log("✅ Order removed. Remaining:", updated.length);
      return updated;
    });
  };

  /**
   * Expand specific order
   */
  const expandOrder = (orderId) => {
    console.log("📖 Expanding order:", orderId);
    setExpandedOrderId(orderId);
  };

  /**
   * Countdown management for all orders in queue
   * Updates every second, removes expired orders
   */
  useEffect(() => {
    if (orderQueue.length === 0) return;

    console.log("⏱️ Starting countdown interval for", orderQueue.length, "orders");

    const interval = setInterval(() => {
      setOrderQueue(prev => {
        const updated = prev
          .map(order => ({
            ...order,
            countdown: order.countdown - 1
          }))
          .filter(order => {
            // Remove expired orders
            if (order.countdown <= 0) {
              console.log("⏱️ Order expired, auto-removing:", order.id);
              return false;
            }
            return true;
          });

        // If queue became empty, clear expanded ID
        if (updated.length === 0) {
          setExpandedOrderId(null);
        }

        return updated;
      });
    }, 1000);

    return () => {
      console.log("⏱️ Clearing countdown interval");
      clearInterval(interval);
    };
  }, [orderQueue.length]); // Re-run when queue size changes

  /** ---------------------------
   * ORDER ACTIONS
   * --------------------------*/
  const acceptOrder = async (orderId) => {
    if (!orderId) {
      console.log("❌ acceptOrder: orderId is required");
      return;
    }

    const orderToAccept = orderQueue.find(o => o.id === orderId);
    if (!orderToAccept) {
      console.log("❌ Order not found in queue:", orderId);
      Alert.alert("Error", "Order not found");
      return;
    }

    try {
      setLoading(true);

      console.log("🟢 Accepting order:", orderId);
      const res = await orderService.acceptOrder(orderId);

      // Use orderId from response
      const assignedOrderId = res.data.orderId;
      console.log("✅ Order Accepted:", assignedOrderId);

      // Remove from queue
      removeOrderFromQueue(orderId);

      // Navigate to order details
      navigate("OrderDetailsScreen", {
        orderId: assignedOrderId,
        status: ORDER_STATUS.PICKUP_ASSIGNED,
      });
    } catch (err) {
      console.log("❌ Accept failed", err);

      // EDGE CASE: 409 Conflict - order already assigned
      if (err.response?.status === 409) {
        try {
          console.log("🔄 Attempting to verify order status...");
          const details = await orderService.getOrderDetails(orderId);

          if (details) {
            console.log("✅ Recovered 409: Order is valid. Proceeding.");
            removeOrderFromQueue(orderId);
            navigate("OrderDetailsScreen", {
              orderId: orderId,
              status: ORDER_STATUS.PICKUP_ASSIGNED,
            });
            return;
          }
        } catch (recErr) {
          console.log("❌ Recovery failed", recErr);
        }
      }

      // If genuine error, remove from queue
      removeOrderFromQueue(orderId);
      Alert.alert("Error", "Failed to accept order. It may have been assigned to another rider.");
    } finally {
      setLoading(false);
    }
  };

  const rejectOrder = async (orderId) => {
    if (!orderId) {
      console.log("❌ rejectOrder: orderId is required");
      return;
    }

    try {
      console.log("❌ Rejecting order:", orderId);
      await orderService.rejectOrder(orderId);
      console.log("✅ Order Rejected:", orderId);

      // Remove from queue
      removeOrderFromQueue(orderId);
    } catch (err) {
      console.log("❌ Reject failed", err);
      // Still remove from queue even if API fails
      removeOrderFromQueue(orderId);
    }
  };



  // Computed values
  const isSocketConnected = status === "CONNECTED";
  const isOnline = actuallyOnline; // Use actuallyOnline state instead of socket status
  const isLoading = isGoingOnline || isGoingOffline;

  return (
    <RiderContext.Provider value={{
      orderQueue,
      expandedOrderId,
      goOnline,
      goOffline,
      acceptOrder,
      rejectOrder,
      expandOrder,
      isOnline,
      status,
      riderStatus,
      isGoingOnline,
      isGoingOffline,
      isLoading
    }}>
      {children}

      {/* 🔥 GLOBAL ORDER QUEUE MODAL - Multi-Order System */}
      <OrderQueueModal
        visible={orderQueue.length > 0}
        orderQueue={orderQueue}
        expandedOrderId={expandedOrderId}
        loading={loading}
        onAccept={acceptOrder}
        onReject={rejectOrder}
        onExpand={expandOrder}
        onClose={() => setOrderQueue([])} // Close and clear all orders
      />
    </RiderContext.Provider>
  );
};

export const useRider = () => useContext(RiderContext);
