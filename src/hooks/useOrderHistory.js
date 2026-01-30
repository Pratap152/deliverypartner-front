import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/ApiClient';

const PAGE_SIZE = 10;

/* 🔑 UI → BACKEND FILTER MAP (CRITICAL) */
const ORDER_FILTER_MAP = {
  all: undefined,
  today: 'daily',
  weekly: 'weekly',
  monthly: 'monthly',
};

/* ================= MEMORY CACHE ================= */
let memoryCache = {};

const getCacheKey = filter =>
  `ORDER_HISTORY_${ORDER_FILTER_MAP[filter] ?? 'all'}`;

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
      const key = getCacheKey(filter);

      if (memoryCache[key]) {
        setOrders(memoryCache[key].orders);
        setSummary(memoryCache[key].summary);
        return;
      }

      try {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
          const parsed = JSON.parse(cached);
          memoryCache[key] = parsed;
          setOrders(parsed.orders || []);
          setSummary(parsed.summary || summary);
        }
      } catch {}
    };

    loadCache();
  }, [filter]);

  /* ================= FETCH ORDERS ================= */

  const fetchOrders = async (pageNo = 1) => {
    if (isFetchingRef.current) return;
    if (!hasMore && pageNo !== 1) return;

    isFetchingRef.current = true;

    try {
      if (pageNo === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const apiFilter = ORDER_FILTER_MAP[filter];

      const res = await apiClient.get('/api/profile/orders/history', {
        params: {
          filter: apiFilter,
          page: pageNo,
          limit: PAGE_SIZE,
        },
      });

      if (!res.data?.success) return;

      const mappedOrders = res.data.data.map((item, index) => ({
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

      setOrders(prev =>
        pageNo === 1 ? mappedOrders : [...prev, ...mappedOrders],
      );

      setSummary({
        totalOrders: res.data.totalOrders,
        totalEarnings: res.data.totalEarnings,
        rating: res.data.avgRating,
        km: Math.round(res.data.totalDistance),
      });

      setHasMore(mappedOrders.length === PAGE_SIZE);
      setPage(pageNo);

      const cachePayload = {
        orders: pageNo === 1 ? mappedOrders : [...orders, ...mappedOrders],
        summary: {
          totalOrders: res.data.totalOrders,
          totalEarnings: res.data.totalEarnings,
          rating: res.data.avgRating,
          km: Math.round(res.data.totalDistance),
        },
      };

      const cacheKey = getCacheKey(filter);
      memoryCache[cacheKey] = cachePayload;
      AsyncStorage.setItem(cacheKey, JSON.stringify(cachePayload));
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
