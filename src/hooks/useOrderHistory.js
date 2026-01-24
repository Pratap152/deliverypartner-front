import { useEffect, useState } from 'react';
import apiClient from '../services/ApiClient';

export const useOrderHistory = filter => {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalEarnings: 0,
    rating: 0,
    km: 0,
  });

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 10;

  const fetchOrders = async (pageNo = 1) => {
    try {
      pageNo === 1 ? setLoading(true) : setLoadingMore(true);

      const res = await apiClient.get('/api/profile/orders/history', {
        params: {
          filter,
          page: pageNo,
          limit: PAGE_SIZE,
        },
      });

      if (res.data?.success) {
        const mappedOrders = res.data.data.map(item => ({
          id: item.orderId,
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
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchOrders(1);
  }, [filter]);

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
