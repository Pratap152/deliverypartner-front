import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { navigate } from "../navigation/RootNavigation"; // Root navigation
import { ORDER_STATUS } from "../config/orderStates";
import WEBSITE_URL from '../../src/utils/host';
import { OrdersAPI } from "../api/api";
import { orderService } from '../services/order/OrderService';
const RiderContext = createContext();

const WS_URL =
  "wss://delivarypartner.onrender.com/ws?type=RIDER_NOTIFICATION&riderId=696b6787f212b183b5dffe5d";

export const RiderProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("DISCONNECTED");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(20); // 20 sec timer

  /** ---------------------------
   * SOCKET CONNECTION
   * --------------------------*/
  const goOnline = () => {
    if (socketRef.current) return;

    const ws = new WebSocket(WS_URL);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("🟢 Rider ONLINE — socket connected");
      setStatus("CONNECTED");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "ORDER_POPUP") {
        setOrder(data);
        setCountdown(20); // reset timer
      }
    };

    ws.onerror = (e) => {
      console.log("🔴 WS error", e);
      setStatus("ERROR");
    };

    ws.onclose = () => {
      console.log("⚪ Socket closed");
      setStatus("DISCONNECTED");
      socketRef.current = null;
      setOrder(null);
    };
  };

  const goOffline = () => {
    socketRef.current?.close();
    socketRef.current = null;
    setOrder(null);
    setStatus("DISCONNECTED");
  };

  /** ---------------------------
   * ORDER ACTIONS
   * --------------------------*/
  const acceptOrder = async () => {
    try {
      setLoading(true);

      const res = await orderService.acceptOrder(order.orderId); // dynamic riderId removed
      console.log("✅ Order Accepted:", order.orderId);

      setOrder(null);
      navigate("OrderDetailsScreen", {
        orderId: order.orderId,
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

  const rejectOrder = async (reason = "Timeout") => {
    try {
      if (order) {
        await orderService.rejectOrder(order.orderId, reason); // dynamic riderId removed
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

  const isOnline = status === "CONNECTED";

  return (
    <RiderContext.Provider value={{ order, goOnline, goOffline, acceptOrder, rejectOrder, isOnline, status }}>
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

                <TouchableOpacity style={[styles.btn, styles.reject]} onPress={rejectOrder}>
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
