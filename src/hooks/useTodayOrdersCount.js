

import { useEffect, useState } from 'react';
import apiClient from '../services/ApiClient';

let initialCount = 0;

const useTodayOrdersCount = () => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    let mounted = true;

    const fetchCount = async () => {
      try {
        const res = await apiClient.get('/api/rider/profile/orders/history', {
          params: {
            filter: 'daily',
            page: 1,
            limit: 1,
          },
        });

        if (!mounted) return;

        if (res?.data?.success) {
          initialCount = res.data.totalOrders || 0;
          setCount(initialCount);
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