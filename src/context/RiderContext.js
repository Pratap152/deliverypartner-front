
import React, {
 
  createContext,
 
  useContext,
 
  useRef,
 
  useState,
 
  useEffect,
 
} from "react";
 
import { Alert, AppState } from "react-native";
 
import { navigate } from "../navigation/RootNavigation";
 
import { ORDER_STATUS } from "../config/orderStates";
 
import { orderService } from "../services/order/OrderService";
 
import { getRiderOnlineStatus } from "../services/order/OnlineStatusService";
 
import { tokenService } from "../services/TokenService";
 
import OrderQueueModal from "../components/order/OrderQueueModal";
 
import { WEBSOCKET_URL } from "../utils/host";

import { gpsService } from "../services/gps/GpsService";
import {
    playOrderSound,
    stopOrderSound,
} from "../utils/SoundManager";
 
const RiderContext = createContext();
 
export const RiderProvider = ({ children }) => {
 
  const socketRef = useRef(null);
 
  const popupShownRef = useRef(false);

  const heartbeatRef = useRef(null);
 
  /** ---------------------------
 
   * STATE
 
   * --------------------------*/
 
  const [orderQueue, setOrderQueue] = useState([]);
 
  const [expandedOrderId, setExpandedOrderId] = useState(null);
 
  const [status, setStatus] = useState("DISCONNECTED");
 
  const [loading, setLoading] = useState(false);

  const [activeOrder, setActiveOrder] = useState(null);

 
  const [riderStatus, setRiderStatus] = useState(null);
 
  const [isGoingOnline, setIsGoingOnline] = useState(false);
 
  const [isGoingOffline, setIsGoingOffline] = useState(false);
 
  const [actuallyOnline, setActuallyOnline] = useState(false);
 
  const isOnline = actuallyOnline;
 
  const [isActive, setIsActive] = useState(false);
 
  const [totalOnlineMinutes, setTotalOnlineMinutes] = useState(0);
 
  const [refreshing, setRefreshing] = useState(false);
 
  const isLoading = isGoingOnline || isGoingOffline;
 
  /** ---------------------------
 
   * LOAD TOKEN
 
   * --------------------------*/
 
 useEffect(() => {
  const init = async () => {
    const { accessToken } = await tokenService.get();

    if (!accessToken) return;

    try {
      // Restore rider online status
      const riderStatusRes = await getRiderOnlineStatus();

      if (riderStatusRes?.success) {
        setActuallyOnline(riderStatusRes.data.isOnline);
        setIsActive(riderStatusRes.data.isOnline);
        setTotalOnlineMinutes(riderStatusRes.data.totalOnlineMinutesToday);
      }

      // Restore active order
      await checkCurrentOrder();

    } catch (err) {
      console.log("Init error:", err);
    }
  };

  init();
}, []);
 

   // Check active order when token is available 


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



  useEffect(() => {
    const syncTracking = async () => {
      try {
        if (actuallyOnline) {
          await gpsService.startTracking();
        } else {
          await gpsService.stopTracking();
        }
      } catch (e) {
        console.log('[GpsService sync error]', e);
      }
    };

    syncTracking();
  }, [actuallyOnline]);
 

  useEffect(() => {
  if (!actuallyOnline) return;

  const connected =
    socketRef.current &&
    socketRef.current.readyState === WebSocket.OPEN;

  if (!connected) {
    console.log("Connecting WebSocket...");
    connectSocket();
  }
}, [actuallyOnline]);
  /** ---------------------------
 
   * SOCKET
 
   * --------------------------*/
const connectSocket = async () => {

  const { accessToken } = await tokenService.get();

  if (!accessToken) {
    console.log("No access token");
    return;
  }

  // ✅ Prevent multiple socket connections
  if (
    socketRef.current &&
    (socketRef.current.readyState === WebSocket.OPEN ||
      socketRef.current.readyState === WebSocket.CONNECTING)
  ) {
    console.log("🟢 Socket already connected");
    return;
  }
  const ws = new WebSocket(
    `${WEBSOCKET_URL}/ws?type=RIDER_NOTIFICATION&token=${accessToken}`
  );

  socketRef.current = ws;
  setStatus("CONNECTING");

  ws.onopen = () => {
    heartbeatRef.current = setInterval(() => {
  if (
    socketRef.current &&
    socketRef.current.readyState === WebSocket.OPEN
  ) {
    socketRef.current.send(
      JSON.stringify({
        type: "PING",
      })
    );
  }
}, 30000);
    console.log("🟢 WS Connected");
    setStatus("CONNECTED");
  };

  ws.onmessage = (event) => {
    console.log("📩 RAW WS MESSAGE:", event.data);

    try {
      const data = JSON.parse(event.data);

      console.log("📦 Parsed Message:", data);

      switch (data.type) {
        case "ORDER_POPUP":
  console.log("🚴 ORDER_POPUP RECEIVED");
  addOrderToQueue(data);
  break;

        case "ORDER_CANCELLED":
          console.log("❌ ORDER_CANCELLED");
stopOrderSound();
          removeOrderFromQueue(data.orderId);

          Alert.alert(
            "Order Cancelled",
            "Order was cancelled by the system."
          );

          navigate("MainTabs");
          break;

        default:
          console.log("Unknown Message:", data);
      }
    } catch (err) {
      console.log("WS Parse Error:", err);
    }
  };

  ws.onerror = (err) => {
    console.log("❌ WS Error:", err.message || err);
  };

 ws.onclose = (event) => {
  console.log("WS Closed:", event.code, event.reason);

  socketRef.current = null;
  setStatus("DISCONNECTED");

  if (heartbeatRef.current) {
    clearInterval(heartbeatRef.current);
    heartbeatRef.current = null;
}

if (event.code === 4010) {
    console.log("Token expired. Do not reconnect.");
    return;
}

  if (actuallyOnline) {
    setTimeout(connectSocket, 3000);
  }
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
 
   * APP STATE RECONNECT
 
   * --------------------------*/
 
  useEffect(() => {
 
    const subscription = AppState.addEventListener(
 
      "change",
 
      (nextAppState) => { 
 
        console.log("App State:", nextAppState);
 
        if (
    nextAppState === "active" &&
    actuallyOnline
) {

    // Refresh active order
    checkCurrentOrder();

    const isSocketConnected =
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN;

    if (!isSocketConnected) {

        console.log("App active again, reconnecting socket");

        connectSocket();

    }
}
 
      }
 
    );
 
    return () => {
 
      subscription.remove();
 
    };
 
}, [actuallyOnline]);
 


  useEffect(() => {
  return () => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
    }
    disconnectSocket();
  };
}, []);
  /** ---------------------------
 
   * GO ONLINE / OFFLINE
 
   * --------------------------*/
 
  const goOnline = async () => {
 
    if (isGoingOnline || isGoingOffline) return;
 
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
 
  const checkCurrentOrder = async () => {

    try {

        const res =
            await orderService.getCurrentOrderStatus();
             console.log("Current Order API:", res);

        if (!res?.success) {
            setActiveOrder(null);
            return;
        }

        const current =
            res.statusTimeline.find(
                item => item.isCurrent
            );

        if (!current) {
            setActiveOrder(null);
            return;
        }

        if (
            current.status === "DELIVERED" ||
            current.status === "CANCELLED" ||
            current.status === "DELIVERY_FAILED"
        ) {
            setActiveOrder(null);
            return;
        }

        setActiveOrder({
            orderId: res.orderId,
            currentStatus: current.status,
        });
       console.log("Active Order:", {
    orderId: res.orderId,
    currentStatus: current.status,
});
    } catch(e){

    setActiveOrder(null);

}
  
};

  const fetchRiderStatus = async () => {
    try {
      setRefreshing(true);
 
      const res = await getRiderOnlineStatus();
 
      if (res?.success) {
        setIsActive(res.data.isOnline);
        setTotalOnlineMinutes(res.data.totalOnlineMinutesToday);
      }
    } catch (err) {
      console.log('Rider status error:', err);
    } finally {
      setRefreshing(false);
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
 
     setOrderQueue((prev) => {

    const updated = prev
        .map((o) => ({
            ...o,
            countdown: o.countdown - 1,
        }))
        .filter((o) => o.countdown > 0);

    if (updated.length === 0) {
        stopOrderSound();
    }


    return updated;
});
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
await checkCurrentOrder();
 
if (!res?.success) {
  throw new Error(res?.message || "Accept failed");
}
      setOrderQueue([]);
      setExpandedOrderId(null);
      stopOrderSound();
      navigate("OrderDetailsScreen", {
 
        orderId,
 
status: "ASSIGNED",
      });
 
    } catch (err) {
  console.log("ACCEPT ERROR:", err?.response?.data || err.message);
 
  removeOrderFromQueue(orderId);
 
  Alert.alert(
    "Error",
    err?.response?.data?.message || "Failed to accept order"
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

        stopOrderSound();   

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
 
        isActive,
 
        totalOnlineMinutes,
 
        refreshing,
 
        fetchRiderStatus,

        activeOrder,

        checkCurrentOrder,
      }}
>
 
      {children}
 
      <OrderQueueModal
    visible={orderQueue.length > 0}
    orderQueue={orderQueue}
    loading={loading}
    onAccept={acceptOrder}
    onReject={rejectOrder}
    onClose={() => {
    stopOrderSound();
    setOrderQueue([]);
}}
/>
</RiderContext.Provider>
 
  );
 
};
 
export const useRider = () => useContext(RiderContext);
 
 