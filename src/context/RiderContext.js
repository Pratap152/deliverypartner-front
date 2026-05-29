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

const RiderContext = createContext();

export const RiderProvider = ({ children }) => {
  /** ---------------------------
   * REFS
   * --------------------------*/

  const socketRef = useRef(null);

  const popupShownRef = useRef(false);

  const reconnectTimeoutRef = useRef(null);

  const heartbeatIntervalRef = useRef(null);

  const onlineRef = useRef(false);

  const reconnectingRef = useRef(false);

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

  const [isActive, setIsActive] = useState(false);

  const [totalOnlineMinutes, setTotalOnlineMinutes] = useState(0);

  const [refreshing, setRefreshing] = useState(false);

  const isLoading = isGoingOnline || isGoingOffline;

  /** ---------------------------
   * LOAD TOKEN
   * --------------------------*/

  useEffect(() => {
    const loadToken = async () => {
      try {
        const { accessToken } = await tokenService.get();

        console.log("TOKEN LOADED");

        setAccessToken(accessToken);
      } catch (e) {
        console.log("TOKEN ERROR:", e);
      }
    };

    loadToken();
  }, []);

  /** ---------------------------
   * ONLINE REF SYNC
   * --------------------------*/

  useEffect(() => {
    onlineRef.current = actuallyOnline;

    console.log(
      "ONLINE REF UPDATED:",
      onlineRef.current
    );
  }, [actuallyOnline]);

  /** ---------------------------
   * SHIFT POPUP
   * --------------------------*/

  useEffect(() => {
    if (isOnline && !popupShownRef.current) {
      popupShownRef.current = true;

      console.log("SHIFT STARTED");
    }

    if (!isOnline) {
      popupShownRef.current = false;
    }
  }, [isOnline]);

  /** ---------------------------
   * HEARTBEAT
   * --------------------------*/

  const startHeartbeat = () => {
    stopHeartbeat();

    heartbeatIntervalRef.current = setInterval(() => {
      try {
        if (
          socketRef.current &&
          socketRef.current.readyState === WebSocket.OPEN
        ) {
          console.log("PING SENT");

          socketRef.current.send(
            JSON.stringify({
              type: "PING",
            })
          );
        }
      } catch (e) {
        console.log("HEARTBEAT ERROR:", e);
      }
    }, 30000);
  };

  const stopHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);

      heartbeatIntervalRef.current = null;
    }
  };

  /** ---------------------------
   * SOCKET CONNECT
   * --------------------------*/

  const connectSocket = () => {
    try {
      console.log("CONNECT SOCKET CALLED");

      /**
       * AVOID MULTIPLE RECONNECTS
       */
      if (reconnectingRef.current) {
        console.log("ALREADY RECONNECTING");

        return;
      }

      reconnectingRef.current = true;

      /**
       * CLEAR OLD TIMER
       */
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);

        reconnectTimeoutRef.current = null;
      }

      /**
       * VALIDATION
       */
      if (!accessToken) {
        console.log("TOKEN MISSING");

        reconnectingRef.current = false;

        return;
      }

      if (!onlineRef.current) {
        console.log("RIDER OFFLINE");

        reconnectingRef.current = false;

        return;
      }

      /**
       * CHECK OLD SOCKET
       */
      if (socketRef.current) {
        console.log(
          "OLD SOCKET STATE:",
          socketRef.current.readyState
        );

        /**
         * OPEN = 1
         * CONNECTING = 0
         * CLOSING = 2
         * CLOSED = 3
         */

        if (
          socketRef.current.readyState ===
            WebSocket.OPEN ||
          socketRef.current.readyState ===
            WebSocket.CONNECTING
        ) {
          console.log(
            "SOCKET ALREADY CONNECTED"
          );

          reconnectingRef.current = false;

          return;
        }

        /**
         * FORCE CLEANUP
         */
        try {
          socketRef.current.close();
        } catch (e) {}

        socketRef.current = null;
      }

      console.log("CREATING NEW SOCKET");

      setStatus("CONNECTING");

      const ws = new WebSocket(
        `${WEBSOCKET_URL}/ws?type=RIDER_NOTIFICATION&token=${accessToken}`
      );

      socketRef.current = ws;

      /** ---------------------------
       * ON OPEN
       * --------------------------*/

      ws.onopen = () => {
        console.log("WS CONNECTED");

        reconnectingRef.current = false;

        setStatus("CONNECTED");

        startHeartbeat();

        console.log(
          "READY STATE:",
          ws.readyState
        );
      };

      /** ---------------------------
       * ON MESSAGE
       * --------------------------*/

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);

          console.log(
            "WS MESSAGE RECEIVED:",
            data
          );

          /**
           * ORDER POPUP
           */
          if (data.type === "ORDER_POPUP") {
            console.log(
              "NEW ORDER POPUP:",
              data.orderId
            );

            addOrderToQueue(data);
          }

          /**
           * ORDER CANCELLED
           */
          if (data.type === "ORDER_CANCELLED") {
            console.log(
              "ORDER CANCELLED:",
              data.orderId
            );

            removeOrderFromQueue(data.orderId);

            Alert.alert(
              "Order Cancelled",
              "Order cancelled"
            );

            navigate("MainTabs");
          }

          /**
           * ORDER COMPLETED
           */
          if (
            data.type === "ORDER_COMPLETED" ||
            data.type === "DELIVERED"
          ) {
            console.log(
              "ORDER COMPLETED EVENT RECEIVED"
            );

            setOrderQueue([]);

            setExpandedOrderId(null);

            navigate("MainTabs");

            /**
             * WAIT SMALL DELAY
             * THEN REFRESH STATUS
             */
            setTimeout(async () => {
              console.log(
                "REFRESHING RIDER STATUS..."
              );

              await fetchRiderStatus();
            }, 1500);
          }

          /**
           * PONG
           */
          if (data.type === "PONG") {
            console.log("PONG RECEIVED");
          }
        } catch (e) {
          console.log("MESSAGE PARSE ERROR:", e);
        }
      };

      /** ---------------------------
       * ON ERROR
       * --------------------------*/

      ws.onerror = (error) => {
        console.log("WS ERROR:", error);

        console.log(
          "READY STATE ERROR:",
          ws.readyState
        );
      };

      /** ---------------------------
       * ON CLOSE
       * --------------------------*/

      ws.onclose = async (event) => {
        console.log("WS CLOSED");

        console.log(
          "CLOSE CODE:",
          event.code
        );

        console.log(
          "CLOSE REASON:",
          event.reason
        );

        console.log(
          "WAS CLEAN:",
          event.wasClean
        );

        console.log(
          "READY STATE CLOSE:",
          ws.readyState
        );

        reconnectingRef.current = false;

        stopHeartbeat();

        socketRef.current = null;

        setStatus("DISCONNECTED");

        /**
         * CHECK ACTUAL RIDER STATUS
         */
        await fetchRiderStatus();

        /**
         * IF MANUAL OFFLINE
         */
        if (!onlineRef.current) {
          console.log(
            "RIDER MANUALLY OFFLINE"
          );

          setOrderQueue([]);

          return;
        }

        /**
         * AUTO RECONNECT
         */
        console.log(
          "RECONNECTING IN 2 SEC..."
        );

        reconnectTimeoutRef.current = setTimeout(
          () => {
            if (onlineRef.current) {
              console.log(
                "AUTO RECONNECT STARTED"
              );

              connectSocket();
            }
          },
          2000
        );
      };
    } catch (e) {
      reconnectingRef.current = false;

      console.log("CONNECT SOCKET ERROR:", e);
    }
  };

  /** ---------------------------
   * DISCONNECT SOCKET
   * --------------------------*/

  const disconnectSocket = () => {
    try {
      console.log("DISCONNECT SOCKET");

      stopHeartbeat();

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);

        reconnectTimeoutRef.current = null;
      }

      reconnectingRef.current = false;

      if (socketRef.current) {
        socketRef.current.onopen = null;

        socketRef.current.onmessage = null;

        socketRef.current.onerror = null;

        socketRef.current.onclose = null;

        socketRef.current.close();

        socketRef.current = null;
      }
    } catch (e) {
      console.log("DISCONNECT ERROR:", e);
    }

    setStatus("DISCONNECTED");

    setOrderQueue([]);
  };

  /** ---------------------------
   * APP STATE
   * --------------------------*/

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        console.log(
          "APP STATE:",
          nextAppState
        );

        if (
          nextAppState === "active" &&
          onlineRef.current &&
          accessToken
        ) {
          const isSocketConnected =
            socketRef.current &&
            socketRef.current.readyState ===
              WebSocket.OPEN;

          console.log(
            "IS SOCKET CONNECTED:",
            isSocketConnected
          );

          if (!isSocketConnected) {
            console.log(
              "APP ACTIVE RECONNECT"
            );

            connectSocket();
          }
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [accessToken]);

  /** ---------------------------
   * FETCH RIDER STATUS
   * --------------------------*/

  const fetchRiderStatus = async () => {
    try {
      setRefreshing(true);

      const res =
        await getRiderOnlineStatus();

      console.log(
        "RIDER STATUS RESPONSE:",
        JSON.stringify(res, null, 2)
      );

      if (res?.success) {
        const online =
          res?.data?.isOnline || false;

        console.log(
          "BACKEND ONLINE STATUS:",
          online
        );

        setIsActive(online);

        setActuallyOnline(online);

        onlineRef.current = online;

        setTotalOnlineMinutes(
          res?.data?.totalOnlineMinutesToday ||
            0
        );

        /**
         * RESTORE SOCKET
         */
        if (online) {
          const isSocketConnected =
            socketRef.current &&
            socketRef.current.readyState ===
              WebSocket.OPEN;

          console.log(
            "SOCKET CONNECTED:",
            isSocketConnected
          );

          if (!isSocketConnected) {
            console.log(
              "RESTORING SOCKET..."
            );

            connectSocket();
          }
        }
      }
    } catch (err) {
      console.log(
        "FETCH RIDER STATUS ERROR:",
        err
      );
    } finally {
      setRefreshing(false);
    }
  };

  /** ---------------------------
   * AUTO RESTORE
   * --------------------------*/

  useEffect(() => {
    if (accessToken) {
      console.log(
        "AUTO RESTORE STARTED"
      );

      fetchRiderStatus();
    }
  }, [accessToken]);

  /** ---------------------------
   * GO ONLINE
   * --------------------------*/

  const goOnline = async () => {
    if (
      isGoingOnline ||
      isGoingOffline
    ) {
      return;
    }

    setIsGoingOnline(true);

    try {
      console.log("GO ONLINE API");

      const res =
        await orderService.setRiderOnline();

      console.log(
        "GO ONLINE RESPONSE:",
        res
      );

      if (res?.success) {
        setRiderStatus(
          res.riderStatus || null
        );

        setActuallyOnline(true);

        onlineRef.current = true;

        connectSocket();
      }
    } catch (e) {
      console.log("GO ONLINE ERROR:", e);

      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "";

      if (
        msg
          .toLowerCase()
          .includes("already online")
      ) {
        setActuallyOnline(true);

        onlineRef.current = true;

        connectSocket();
      } else {
        Alert.alert("Error", msg);
      }
    } finally {
      setIsGoingOnline(false);
    }
  };

  /** ---------------------------
   * GO OFFLINE
   * --------------------------*/

  const goOffline = async () => {
    if (
      isGoingOnline ||
      isGoingOffline
    ) {
      return;
    }

    setIsGoingOffline(true);

    try {
      console.log("GO OFFLINE API");

      const res =
        await orderService.setRiderOffline();

      console.log(
        "GO OFFLINE RESPONSE:",
        res
      );

      if (res?.success) {
        setRiderStatus(
          res.riderStatus || null
        );

        setActuallyOnline(false);

        onlineRef.current = false;

        disconnectSocket();
      }
    } catch (e) {
      console.log("GO OFFLINE ERROR:", e);

      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "";

      if (
        msg
          .toLowerCase()
          .includes("already offline")
      ) {
        setActuallyOnline(false);

        onlineRef.current = false;

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
      if (
        prev.some(
          (o) => o.id === newOrder.id
        )
      ) {
        console.log(
          "DUPLICATE ORDER BLOCKED"
        );

        return prev;
      }

      return [newOrder, ...prev].slice(
        0,
        MAX_QUEUE_SIZE
      );
    });

    setExpandedOrderId(newOrder.id);
  };

  const removeOrderFromQueue = (
    orderId
  ) => {
    setOrderQueue((prev) => {
      const updated = prev.filter(
        (o) => o.id !== orderId
      );

      if (
        orderId === expandedOrderId &&
        updated.length > 0
      ) {
        setExpandedOrderId(
          updated[0].id
        );
      }

      return updated;
    });
  };

  const expandOrder = (orderId) => {
    setExpandedOrderId(orderId);
  };

  /** ---------------------------
   * COUNTDOWN
   * --------------------------*/

  useEffect(() => {
    if (orderQueue.length === 0)
      return;

    const interval = setInterval(() => {
      setOrderQueue((prev) =>
        prev
          .map((o) => ({
            ...o,

            countdown:
              o.countdown - 1,
          }))
          .filter(
            (o) => o.countdown > 0
          )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [orderQueue.length]);

  /** ---------------------------
   * ACCEPT ORDER
   * --------------------------*/

  const acceptOrder = async (
    orderId
  ) => {
    if (!orderId) return;

    try {
      setLoading(true);

      console.log(
        "ACCEPT ORDER:",
        orderId
      );

      const res =
        await orderService.acceptOrder(
          orderId
        );

      console.log(
        "ACCEPT RESPONSE:",
        res
      );

      if (!res?.success) {
        throw new Error(
          res?.message ||
            "Accept failed"
        );
      }

      setOrderQueue([]);

      setExpandedOrderId(null);

      navigate(
        "OrderDetailsScreen",
        {
          orderId,

          status:
            ORDER_STATUS.ASSIGNED,
        }
      );
    } catch (err) {
      console.log(
        "ACCEPT ERROR:",
        err?.response?.data ||
          err.message
      );

      removeOrderFromQueue(orderId);

      Alert.alert(
        "Error",
        err?.response?.data
          ?.message ||
          "Failed to accept order"
      );
    } finally {
      setLoading(false);
    }
  };

  /** ---------------------------
   * REJECT ORDER
   * --------------------------*/

  const rejectOrder = async (
    orderId
  ) => {
    try {
      console.log(
        "REJECT ORDER:",
        orderId
      );

      await orderService.rejectOrder(
        orderId
      );
    } catch (e) {
      console.log(
        "REJECT ERROR:",
        e
      );
    } finally {
      removeOrderFromQueue(orderId);
    }
  };

  /** ---------------------------
   * CLEANUP
   * --------------------------*/

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

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
      }}
    >
      {children}

      <OrderQueueModal
        visible={orderQueue.length > 0}
        orderQueue={orderQueue}
        loading={loading}
        onAccept={acceptOrder}
        onClose={() =>
          setOrderQueue([])
        }
      />
    </RiderContext.Provider>
  );
};

export const useRider = () =>
  useContext(RiderContext);