import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { Alert } from "react-native";
import { navigate } from "../navigation/RootNavigation";
import { ORDER_STATUS } from "../config/orderStates";
import { orderService } from "../services/order/OrderService";
import { tokenService } from "../services/TokenService";
import OrderQueueModal from "../components/order/OrderQueueModal";
import { WEBSOCKET_URL } from "../utils/host";

const RiderContext = createContext();

export const RiderProvider = ({ children }) => {
  const socketRef = useRef(null);
  const popupShownRef = useRef(false);

  /** ---------------------------
   * STATE
   * --------------------------*/
  const [orderQueue, setOrderQueue] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const [status, setStatus] = useState("DISCONNECTED");
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  const [riderStatus, setRiderStatus] = useState(null);
  const [isGoingOnline, setIsGoingOnline] = useState(false);
  const [isGoingOffline, setIsGoingOffline] = useState(false);
  const [actuallyOnline, setActuallyOnline] = useState(false);

  const isOnline = actuallyOnline;
  const isLoading = isGoingOnline || isGoingOffline;

  /** ---------------------------
   * LOAD TOKEN
   * --------------------------*/
  useEffect(() => {
    const loadToken = async () => {
      const { accessToken } = await tokenService.get();
      setAccessToken(accessToken);
    };
    loadToken();
  }, []);

  /** ---------------------------
   * SHIFT STARTED POPUP
   * --------------------------*/
  useEffect(() => {
    if (isOnline && !popupShownRef.current) {
      popupShownRef.current = true;
      // Alert.alert(
      //   "Shift Started 🚴‍♂️",
      //   "You are now online and ready to receive orders."
      // );
    }

    if (!isOnline) {
      popupShownRef.current = false;
    }
  }, [isOnline]);

  /** ---------------------------
   * SOCKET
   * --------------------------*/
  const connectSocket = () => {
    if (socketRef.current || !accessToken) return;

    setStatus("CONNECTING");

    const ws = new WebSocket(
      `${WEBSOCKET_URL}/ws?type=RIDER_NOTIFICATION&token=${accessToken}`
    );

    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WS connected");
      setStatus("CONNECTED");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "ORDER_POPUP") {
          addOrderToQueue(data);
        }

        if (data.type === "ORDER_CANCELLED") {
          removeOrderFromQueue(data.orderId);
          Alert.alert("Order Cancelled", "Order was cancelled by the system.");
          navigate("MainTabs");
        }
      } catch (e) {
        console.log("WS parse error", e);
      }
    };

    ws.onclose = () => {
      socketRef.current = null;
      setStatus("DISCONNECTED");
      setOrderQueue([]);
    };
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setStatus("DISCONNECTED");
    setOrderQueue([]);
  };

  /** ---------------------------
   * GO ONLINE / OFFLINE
   * --------------------------*/
  const goOnline = async () => {
    if (isGoingOnline || isGoingOffline || status === "CONNECTED") return;

    setIsGoingOnline(true);
    try {
      const res = await orderService.setRiderOnline();
      if (res?.success) {
        setRiderStatus(res.riderStatus || null);
        setActuallyOnline(true);
        connectSocket();
      }
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "";
      if (msg.toLowerCase().includes("already online")) {
        setActuallyOnline(true);
        connectSocket();
      } else {
        Alert.alert("Error", msg);
      }
    } finally {
      setIsGoingOnline(false);
    }
  };

  const goOffline = async () => {
    if (isGoingOnline || isGoingOffline) return;

    setIsGoingOffline(true);
    try {
      const res = await orderService.setRiderOffline();
      if (res?.success) {
        setRiderStatus(res.riderStatus || null);
        setActuallyOnline(false);
        disconnectSocket();
      }
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "";
      if (msg.toLowerCase().includes("already offline")) {
        setActuallyOnline(false);
        disconnectSocket();
      } else {
        Alert.alert("Error", msg);
      }
    } finally {
      setIsGoingOffline(false);
    }
  };

  /** ---------------------------
   * ORDER QUEUE
   * --------------------------*/
  const MAX_QUEUE_SIZE = 5;

  const addOrderToQueue = (orderData) => {
    const newOrder = {
      id: orderData.orderId,
      data: orderData,
      countdown: 20,
      receivedAt: Date.now(),
    };

    setOrderQueue((prev) => {
      if (prev.some((o) => o.id === newOrder.id)) return prev;
      return [newOrder, ...prev].slice(0, MAX_QUEUE_SIZE);
    });

    setExpandedOrderId(newOrder.id);
  };

  const removeOrderFromQueue = (orderId) => {
    setOrderQueue((prev) => {
      const updated = prev.filter((o) => o.id !== orderId);
      if (orderId === expandedOrderId && updated.length > 0) {
        setExpandedOrderId(updated[0].id);
      }
      return updated;
    });
  };

  const expandOrder = (orderId) => setExpandedOrderId(orderId);

  useEffect(() => {
    if (orderQueue.length === 0) return;

    const interval = setInterval(() => {
      setOrderQueue((prev) =>
        prev
          .map((o) => ({ ...o, countdown: o.countdown - 1 }))
          .filter((o) => o.countdown > 0)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [orderQueue.length]);

  /** ---------------------------
   * ORDER ACTIONS
   * --------------------------*/
  const acceptOrder = async (orderId) => {
    if (!orderId) return;

    try {
      setLoading(true);

      const res = await orderService.acceptOrder(orderId);
      const assignedOrderId = res.data.orderId;

      removeOrderFromQueue(orderId);

      navigate("OrderDetailsScreen", {
        orderId: assignedOrderId,
        status: ORDER_STATUS.PICKUP_ASSIGNED,
      });
    } catch (err) {
      removeOrderFromQueue(orderId);
      Alert.alert(
        "Error",
        "Failed to accept order. It may have been assigned to another rider."
      );
    } finally {
      setLoading(false);
    }
  };

  const rejectOrder = async (orderId) => {
    try {
      await orderService.rejectOrder(orderId);
    } catch (e) {
      console.log("Reject failed", e);
    } finally {
      removeOrderFromQueue(orderId);
    }
  };

  /** ---------------------------
   * PROVIDER
   * --------------------------*/
  return (
    <RiderContext.Provider
      value={{
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
        isLoading,
      }}
    >
      {children}

      <OrderQueueModal
        visible={orderQueue.length > 0}
        orderQueue={orderQueue}
        expandedOrderId={expandedOrderId}
        loading={loading}
        onAccept={acceptOrder}
        onReject={rejectOrder}
        onExpand={expandOrder}
        onClose={() => setOrderQueue([])}
      />
    </RiderContext.Provider>
  );
};

export const useRider = () => useContext(RiderContext);
