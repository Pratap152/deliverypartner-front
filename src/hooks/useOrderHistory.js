import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/ApiClient';

const PAGE_SIZE = 10;
const getCacheKey = filter => `ORDER_HISTORY_${filter}`;

/* ================= MEMORY CACHE ================= */
let memoryCache = {};

export const useOrderHistory = filter => {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalEarnings: 0,
    rating: 0,
    km: 0,
  });

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isFetchingRef = useRef(false);

  /* ================= LOAD CACHE ================= */

  useEffect(() => {
    const loadCache = async () => {
      // 1️⃣ MEMORY (instant)
      if (memoryCache[filter]) {
        setOrders(memoryCache[filter].orders);
        setSummary(memoryCache[filter].summary);
        return;
      }

      // 2️⃣ ASYNC STORAGE (fallback)
      try {
        const cached = await AsyncStorage.getItem(getCacheKey(filter));
        if (cached) {
          const parsed = JSON.parse(cached);
          memoryCache[filter] = parsed;
          setOrders(parsed.orders || []);
          setSummary(parsed.summary || summary);
        }
      } catch (e) {}
    };

    loadCache();
  }, [filter]);

  /* ================= FETCH ORDERS ================= */

  const fetchOrders = async (pageNo = 1, isRefresh = false) => {
    if (isFetchingRef.current) return;
    if (!hasMore && pageNo !== 1) return;

    isFetchingRef.current = true;

    try {
      // 🔥 Non-blocking loader if cached data exists
      if (pageNo === 1 && orders.length === 0 && !isRefresh) {
        setLoading(true);
      } else if (pageNo > 1) {
        setLoadingMore(true);
      }

      const res = await apiClient.get('/api/profile/orders/history', {
        params: {
          filter: filter === 'all' ? undefined : filter,
          page: pageNo,
          limit: PAGE_SIZE,
        },
      });

      if (!res.data?.success) return;

      const mappedOrders = res.data.data.map((item, index) => ({
        // ✅ UNIQUE & STABLE KEY (fixes your warning)
        id: `${item.orderId}-${pageNo}-${index}`,
        orderId: item.orderId,
        restaurantName: item.items?.[0]?.itemName ?? 'Order',
        earning: item.pricing.totalAmount,
        distance: item.distanceTravelled,
        rating: item.rating,
        time: new Date(item.deliveredAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        customerName: item.pickupAddress,
        area: item.deliveredAddress,
        tip: item.customerTip,
      }));

      setOrders(prev => {
        const combined =
          pageNo === 1 ? mappedOrders : [...prev, ...mappedOrders];

        // 🔒 DEDUPLICATE BY orderId (backend-safe)
        const uniqueMap = new Map();
        combined.forEach(item => {
          uniqueMap.set(item.orderId, item);
        });

        const uniqueOrders = Array.from(uniqueMap.values());

        const cachePayload = {
          orders: uniqueOrders,
          summary: {
            totalOrders: res.data.totalOrders,
            totalEarnings: res.data.totalEarnings,
            rating: res.data.avgRating,
            km: Math.round(res.data.totalDistance),
          },
        };

        memoryCache[filter] = cachePayload;
        AsyncStorage.setItem(getCacheKey(filter), JSON.stringify(cachePayload));

        return uniqueOrders;
      });

      setSummary({
        totalOrders: res.data.totalOrders,
        totalEarnings: res.data.totalEarnings,
        rating: res.data.avgRating,
        km: Math.round(res.data.totalDistance),
      });

      setHasMore(mappedOrders.length === PAGE_SIZE);
      setPage(pageNo);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  };

  /* ================= FILTER CHANGE ================= */

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchOrders(1);
  }, [filter]);

  /* ================= LOAD MORE ================= */

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchOrders(page + 1);
    }
  };

  return {
    orders,
    summary,
    loading,
    loadingMore,
    loadMore,
  };
};
