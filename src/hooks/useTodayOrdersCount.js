import { useEffect, useState, useCallback } from 'react';
import apiClient from '../services/ApiClient';

let initialCount = 0;

const useTodayOrdersCount = () => {
  const [count, setCount] = useState(initialCount);

  const fetchCount = useCallback(async () => {
    try {
      const res = await apiClient.get(
        '/api/rider/profile/orders/history',
        {
          params: {
            filter: 'daily',
            page: 1,
            limit: 1,
          },
        }
      );

      if (res?.data?.success) {
        initialCount = Number(
          res.data.completedOrders || 0
        );

        setCount(initialCount);
      }
    } catch (e) {
      console.log(
        'Failed to fetch today orders count:',
        e?.message
      );
    }
  }, []);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return {
    count,
    onRefresh: fetchCount,
  };
};

export default useTodayOrdersCount;