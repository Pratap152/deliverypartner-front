import { useEffect, useState } from 'react';
import { getOrderHistory } from '../services/orderHistoryApi';

const PAGE_SIZE = 10;

export const useOrderHistory = filter => {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalEarnings: 0,
    rating: 4.8,
    km: 0,
  });

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    resetAndFetch();
  }, [filter]);

  const resetAndFetch = async () => {
    setPage(1);
    setHasMore(true);
    setOrders([]);
    await fetchOrders(1, true);
  };

  const fetchOrders = async (pageNo, isInitial = false) => {
    try {
      isInitial ? setLoading(true) : setLoadingMore(true);

      const res = await getOrderHistory({
        filter,
        page: pageNo,
        limit: PAGE_SIZE,
      });

      const mappedOrders = res.data.map(item => ({
        id: item._id,
        orderId: item.orderId,
        restaurantName: item.vendorShopName,
        earning: item.riderEarning.amount,
        paymentMode: item.payment.mode,
        status: item.orderStatus,
        date: new Date(item.createdAt).toLocaleDateString(),
      }));

      setOrders(prev =>
        pageNo === 1 ? mappedOrders : [...prev, ...mappedOrders],
      );

      // SUMMARY (calculated once on first page)
      if (pageNo === 1) {
        const totalEarnings = res.data.reduce(
          (sum, item) => sum + item.riderEarning.amount,
          0,
        );

        setSummary({
          totalOrders: res.totalOrders,
          totalEarnings,
          rating: 4.8,
          km: 0,
        });
      }

      if (mappedOrders.length < PAGE_SIZE) {
        setHasMore(false);
      }

      setPage(pageNo + 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchOrders(page);
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
