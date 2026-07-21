import { useEffect, useState, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/ApiClient';

const PAGE_SIZE = 10;
const getCacheKey = filter => `ORDER_HISTORY_${filter}`;

const API_FILTER_MAP = {
  all: 'all',
  today: 'daily',
  weekly: 'weekly',
  monthly: 'monthly',
};

let memoryCache = {};

export const useOrderHistory = (filter) => {
  const mountedRef = useRef(true);
  const requestIdRef = useRef(0);
  const abortRef = useRef(null);
  const isFetching = useRef(false);

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
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  /* UNMOUNT CLEANUP */
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  const cancelRequest = () => abortRef.current?.abort();

  /* LOAD CACHE FIRST */
  useEffect(() => {
    const loadCache = async () => {
      if (memoryCache[filter]) {
        setOrders(memoryCache[filter].orders);
        setSummary(memoryCache[filter].summary);
        return;
      }

      try {
        const cached = await AsyncStorage.getItem(getCacheKey(filter));
        if (cached) {
          const parsed = JSON.parse(cached);
          memoryCache[filter] = parsed;
          setOrders(parsed.orders || []);
          setSummary(parsed.summary);
        }
      } catch { }
    };

    loadCache();
  }, [filter]);

  /* FETCH */
  const fetchOrders = useCallback(async (
    pageNo = 1,
    { refresh = false, activeFilter = filter } = {}
  ) => {

    if (isFetching.current) return;
    if (!hasMore && pageNo !== 1) return;

    cancelRequest();

    const controller = new AbortController();
    abortRef.current = controller;
    isFetching.current = true;

    const reqId = ++requestIdRef.current;

    try {
      if (refresh) setRefreshing(true);
      else if (pageNo === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await apiClient.get('/api/rider/profile/orders/history', {
        signal: controller.signal,
        params: {
          filter: API_FILTER_MAP[activeFilter],
          page: pageNo,
          limit: PAGE_SIZE,
        },
      });

      if (!mountedRef.current) return;
      if (reqId !== requestIdRef.current) return;
      if (!res?.data?.success) return;

      const list = res.data.data || [];

      const mapped = list.map((item, i) => ({
        id: `${item.orderId}-${pageNo}-${i}`,

        orderId: item.orderId,

        // Restaurant Name
        vendorShopName: item.vendorShopName,

        // Customer Name
        userName: item.userName,

        // Delivery Address
        deliveredAddress: item.deliveredAddress,

        // Earnings
        earning: item.pricing?.riderEarning ?? 0,

        // Earned Status
        credited:
          item.pricing?.earningBreakup?.credited ?? false,

        // Customer Tip
        tip:
          item.pricing?.earningBreakup?.tips ?? 0,

        // Distance
        distance: item.distanceTravelled ?? 0,

        // Rating
        rating: item.rating ?? 0,

        // Date
        date: new Date(item.deliveredAt).toLocaleDateString(
          'en-GB'
        ),

        // Time
        time: new Date(item.deliveredAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),

        // Keep full order for detail screen later
        rawData: item,
      }));

      setOrders(prev => {
        const combined =
          pageNo === 1 ? mapped : [...prev, ...mapped];

        const unique = Array.from(
          new Map(combined.map(o => [o.orderId, o])).values()
        );

        const payload = {
          orders: unique,
          summary: {
            totalOrders: res.data.totalOrders,
            totalEarnings: res.data.totalRiderEarnings,
            rating: res.data.avgRating ?? 0,
            km: Math.round(res.data.totalDistance),
          },
        };

        memoryCache[activeFilter] = payload;
        AsyncStorage.setItem(
          getCacheKey(activeFilter),
          JSON.stringify(payload)
        );

        return unique;
      });

      setSummary({
        totalOrders: res.data.totalOrders,
        totalEarnings: res.data.totalRiderEarnings,
        rating: res.data.avgRating ?? 0,
        km: Math.round(res.data.totalDistance),
      });
      setHasMore(mapped.length === PAGE_SIZE);
      setPage(pageNo);

    } catch (e) {
      if (e.name !== 'CanceledError') {
        console.warn('Order fetch failed:', e.message);
      }
    } finally {
      if (!mountedRef.current) return;

      isFetching.current = false;
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }

  }, [filter, hasMore]);

  useEffect(() => {
    cancelRequest();
    setPage(1);
    setHasMore(true);
    fetchOrders(1, { activeFilter: filter });
  }, [filter]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchOrders(page + 1);
    }
  };

  const onRefresh = () => {
    cancelRequest();
    fetchOrders(1, { refresh: true });
  };

  return {
    orders,
    summary,
    loading,
    loadingMore,
    refreshing,
    loadMore,
    onRefresh,
  };
};
