import { useState, useEffect, useRef } from 'react';
import { fetchSlotHistory } from '../services/slots/SlotsHistoryService';

export function useSlotHistory(initialWeek) {
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const currentWeekRef = useRef(initialWeek);

  // keep ref updated
  useEffect(() => {
    currentWeekRef.current = initialWeek;
  }, [initialWeek]);

 
  // fetch a single week
  const fetchWeek = async (weekNumber, isRefresh = false) => {
    if (!weekNumber) return;

    try {
      isRefresh ? setRefreshing(true) : setLoading(true);

      const res = await fetchSlotHistory(weekNumber);

      setCache(prev => ({
        ...prev,
        [weekNumber]: {
          days: res?.data?.days ?? [],
          summary: res?.data?.summary ?? null,
        },
      }));
    } catch (err) {
      console.log(
        'Slot history error:',
        err?.response?.data,
        err?.message
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  // fetch current week
 
  useEffect(() => {
    fetchWeek(initialWeek);
  }, [initialWeek]);


  // pull-to-refresh

  const onRefresh = () => {
    fetchWeek(currentWeekRef.current, true);
  };

  // preload previous weeks

  const preloadPastWeeks = async (count = 6) => {
    let week = currentWeekRef.current - 1;

    for (let i = 0; i < count; i++) {
      if (week <= 0) break;

      // avoid duplicate calls
      if (!cache[week]) {
        await fetchWeek(week);
      }

      week--;
    }
  };

  
  // derive weeks to show

  const availableWeeks = Object.keys(cache)
    .map(Number)
    .filter(Boolean)
    .sort((a, b) => b - a);

  return {
    days: cache[initialWeek]?.days ?? [],
    summary: cache[initialWeek]?.summary ?? null,
    loading,
    refreshing,
    onRefresh,
    availableWeeks,
    preloadPastWeeks,
  };
}
