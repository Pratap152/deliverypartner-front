import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { navigate } from "../navigation/RootNavigation"; // Root navigation
import { ORDER_STATUS } from "../config/orderStates";
import WEBSITE_URL from '../../src/utils/host';
import { OrdersAPI } from "../api/api";
import { orderService } from '../services/order/OrderService';
import { tokenService } from '../services/TokenService';

const RiderContext = createContext();

export const RiderProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("DISCONNECTED"); // Socket status: DISCONNECTED, CONNECTING, CONNECTED, ERROR
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(120); // 120 sec timer
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

        if (data.type === "ORDER_POPUP") {
          console.log("🔔 ORDER_POPUP received! Setting order state...");
          setOrder(data);
          setCountdown(20); // reset timer
          console.log("🔔 Order set, countdown reset to 20s");
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
      setOrder(null);
    };
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setOrder(null);
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
   * ORDER ACTIONS
   * --------------------------*/
  const acceptOrder = async () => {
    try {
      setLoading(true);

      const res = await orderService.acceptOrder(order.orderId);
      // Use orderId from response, not from popup
      const assignedOrderId = res.data.orderId;
      console.log("✅ Order Accepted:", assignedOrderId);
      setOrder(null);
      navigate("OrderDetailsScreen", {
        orderId: assignedOrderId,
        status: ORDER_STATUS.PICKUP_ASSIGNED,
      });
    } catch (err) {
      console.log("❌ Accept failed", err);
      // 🔄 RECOVERY: If 409, check if it was actually assigned to us
      if (err.response?.status === 409) {
        try {
          console.log("🔄 Attempting to verify order status...");
          const details = await orderService.getOrderDetails(order.orderId);

          if (details) {
            console.log("✅ Recovered 409: Order is valid. Proceeding.");
            setOrder(null);
            navigate("OrderDetailsScreen", {
              orderId: order.orderId,
              status: ORDER_STATUS.PICKUP_ASSIGNED,
            });
            return;
          }
        } catch (recErr) {
          console.log("❌ Recovery failed", recErr);
        }
      }

      // If genuine 409 (someone else took it or expired), close popup
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const rejectOrder = async () => {
    try {
      if (order) {
        await orderService.rejectOrder(order.orderId);
        console.log("❌ Order Rejected:", order.orderId);
      }
      setOrder(null);
    } catch (err) {
      console.log("❌ Reject failed", err);
    }
  };

  /** ---------------------------
   * COUNTDOWN TIMER
   * --------------------------*/
  useEffect(() => {
    if (!order || loading) return;

    if (countdown === 0) {
      // auto-reject after timer ends
      rejectOrder();
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, order, loading]);

  // Computed values
  const isSocketConnected = status === "CONNECTED";
  const isOnline = actuallyOnline; // Use actuallyOnline state instead of socket status
  const isLoading = isGoingOnline || isGoingOffline;

  return (
    <RiderContext.Provider value={{
      order,
      goOnline,
      goOffline,
      acceptOrder,
      rejectOrder,
      isOnline,
      status,
      riderStatus,
      isGoingOnline,
      isGoingOffline,
      isLoading
    }}>
      {children}

      {/* 🔥 GLOBAL ORDER POPUP */}
      <Modal transparent visible={!!order} animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>🚚 New Order</Text>
            {order && (
              <>
                <Text>Order ID: {order.orderId}</Text>
                <Text>Shop: {order.vendorShopName}</Text>
                <Text>Distance: {order.distanceKm}</Text>
                <Text>Estimated Time:{order.etaMinutes}</Text>
                <Text>Earning: ₹{order.estimatedEarning}</Text>
                <Text style={{ marginTop: 8, fontWeight: "600" }}>Time Left: {countdown}s</Text>
              </>
            )}


            {loading ? (
              <ActivityIndicator style={{ marginTop: 20 }} />
            ) : (
              <View style={styles.actions}>
                <TouchableOpacity style={[styles.btn, styles.accept]} onPress={acceptOrder}>
                  <Text style={styles.btnText}>ACCEPT</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.btn, styles.reject]} onPress={() => rejectOrder()}>
                  <Text style={styles.btnText}>REJECT</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </RiderContext.Provider>
  );
};

export const useRider = () => useContext(RiderContext);

/** ---------------------------
 * STYLES
 * --------------------------*/
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center"
  },
  popup: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20
  },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: "center"
  },
  accept: { backgroundColor: "green", marginRight: 10 },
  reject: { backgroundColor: "red" },
  btnText: { color: "#fff", fontWeight: "bold" }
});
