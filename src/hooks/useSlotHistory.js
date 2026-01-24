import { useState, useEffect } from 'react';
import { fetchSlotHistory} from '../services/slots/SlotsHistoryService';

export const useSlotHistory = (selectedWeek) => {
  const [summary, setSummary] = useState(null);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const res = await fetchSlotHistory(selectedWeek);
      setSummary(res.data.summary);
      setDays(res.data.days);
    } finally {
      if (!isRefresh) setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await load(true);
    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, [selectedWeek]);

  return {
    summary,
    days,
    loading,
    refreshing,
    onRefresh,
  };
};
