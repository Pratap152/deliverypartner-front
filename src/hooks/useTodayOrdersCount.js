import { useEffect, useState } from 'react';
import apiClient from '../services/ApiClient';

const useTodayOrdersCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    const fetchCount = async () => {
      try {
        const res = await apiClient.get(
          '/api/profile/orders/history',
          {
            params: {
              filter: 'daily',
              page: 1,
              limit: 1,
            },
          },
        );

        if (!mounted) return;

        if (res?.data?.success) {
          setCount(res.data.totalOrders || 0);
        }
      } catch (e) {
        console.log('Failed to fetch today orders count');
      }
    };

    fetchCount();

    return () => {
      mounted = false;
    };
  }, []);

  return count;
};

export default useTodayOrdersCount;