import { useState, useEffect, useRef } from 'react';
import { fetchSlotHistory } from '../services/slots/SlotsHistoryService';

export function useSlotHistory(initialWeek) {
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // guard to avoid duplicate fetches for same week
  const fetchingRef = useRef({}); 

  const currentWeekRef = useRef(initialWeek);
  useEffect(() => { currentWeekRef.current = initialWeek; }, [initialWeek]);

  // fetch single week (idempotent w/ fetchingRef)
  const fetchWeek = async (weekNumber, { isRefresh = false } = {}) => {
    if (!weekNumber) return;
    if (fetchingRef.current[weekNumber]) return; // already fetching

    try {
      fetchingRef.current[weekNumber] = true;
      isRefresh ? setRefreshing(true) : setLoading(true);

      const res = await fetchSlotHistory(weekNumber); // your service
      setCache(prev => ({
        ...prev,
        [weekNumber]: {
          days: res?.data?.days ?? [],
          summary: res?.data?.summary ?? null,
        },
      }));
    } catch (err) {
      console.log('Slot history error:', err?.response?.data ?? err?.message ?? err);
    } finally {
      fetchingRef.current[weekNumber] = false;
      setLoading(false);
      setRefreshing(false);
    }
  };

  // fetch the requested initialWeek whenever it changes
  useEffect(() => {
    if (initialWeek) fetchWeek(initialWeek);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialWeek]);

  const onRefresh = () => fetchWeek(currentWeekRef.current, { isRefresh: true });

  // preload past weeks — fetch them in parallel but skip already cached or fetching
  const preloadPastWeeks = async (count = 6) => {
    const start = currentWeekRef.current - 1;
    if (start <= 0) return;

    const weeksToFetch = [];
    for (let i = 0; i < count; i++) {
      const w = start - i;
      if (w <= 0) break;
      if (!cache[w] && !fetchingRef.current[w]) weeksToFetch.push(w);
    }

    if (weeksToFetch.length === 0) return;

    // start all fetches in parallel (non-blocking) and wait for them to settle
    await Promise.allSettled(weeksToFetch.map(w => fetchWeek(w)));
  };

  // derive available weeks (cached) sorted descending
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
    fetchWeek,         // still useful if you want to fetch a specific week from UI
    preloadPastWeeks,  // call once or on user action
    availableWeeks,
  };
}
