import {useState, useCallback, useRef} from 'react';

import {
  getPeakHourIncentives,
  getDailyIncentives,
  getWeeklyIncentives,
  getWeeklyIncentivesProgress,
  getDailyIncentivesProgress,
  getPeakIncentivesProgress,
  getRiderIncentivesTarget,
} from '../services/earnings/incentiveService';

const getProgressData = res => {
  if (Array.isArray(res?.data)) {
    return res.data[0] ?? null;
  }

  if (res?.data && typeof res.data === 'object') {
    return res.data;
  }

  return res ?? null;
};

const getProgramData = res => {
  if (Array.isArray(res?.data)) {
    return res.data.length ? res : {emptyData: true};
  }

  return res?.data ? res : {emptyData: true};
};

const useIncentives = () => {
  const [peakIncentives, setPeakIncentives] = useState(null);
  const [dailyIncentives, setDailyIncentives] = useState(null);
  const [weeklyIncentives, setWeeklyIncentives] = useState(null);

  const [weeklyIncentivesProgress, setWeeklyIncentivesProgress] =
    useState(null);
  const [dailyIncentivesProgress, setDailyIncentivesProgress] =
    useState(null);
  const [peakIncentivesProgress, setPeakIncentivesProgress] =
    useState(null);

  const [riderIncentivesTarget, setRiderIncentivesTarget] = useState(null);
  const [load, setLoad] = useState(false);

  // Used only for Zestbot target caching
  const loadedRef = useRef(false);

  const fetchPeakIncentives = useCallback(async () => {
    try {
      const res = await getPeakHourIncentives();
      setPeakIncentives(getProgramData(res));
      return res;
    } catch (error) {
      console.log(
        'Peak Incentive Program Error:',
        error?.response?.data || error?.message,
      );
      setPeakIncentives({emptyData: true});
      return null;
    }
  }, []);

  const fetchDailyIncentives = useCallback(async () => {
    try {
      const res = await getDailyIncentives();
      setDailyIncentives(getProgramData(res));
      return res;
    } catch (error) {
      console.log(
        'Daily Incentive Program Error:',
        error?.response?.data || error?.message,
      );
      setDailyIncentives({emptyData: true});
      return null;
    }
  }, []);

  const fetchWeeklyIncentives = useCallback(async () => {
    try {
      const res = await getWeeklyIncentives();
      setWeeklyIncentives(getProgramData(res));
      return res;
    } catch (error) {
      console.log(
        'Weekly Incentive Program Error:',
        error?.response?.data || error?.message,
      );
      setWeeklyIncentives({emptyData: true});
      return null;
    }
  }, []);

  const fetchWeeklyIncentivesProgress = useCallback(async () => {
    try {
      const res = await getWeeklyIncentivesProgress();
      const data = getProgressData(res);

      setWeeklyIncentivesProgress(data || {emptyData: true});
      return res;
    } catch (error) {
      console.log(
        'Weekly Incentive Progress Error:',
        error?.response?.data || error?.message,
      );
      setWeeklyIncentivesProgress({emptyData: true});
      return null;
    }
  }, []);

  const fetchDailyIncentivesProgress = useCallback(async () => {
    try {
      const res = await getDailyIncentivesProgress();
      const data = getProgressData(res);

      console.log(
        'DAILY PROGRESS:',
        JSON.stringify(data, null, 2),
      );

      setDailyIncentivesProgress(data || {emptyData: true});
      return res;
    } catch (error) {
      console.log(
        'Daily Incentive Progress Error:',
        error?.response?.data || error?.message,
      );
      setDailyIncentivesProgress({emptyData: true});
      return null;
    }
  }, []);

  const fetchPeakIncentivesProgress = useCallback(async () => {
    try {
      const res = await getPeakIncentivesProgress();
      const data = getProgressData(res);

      setPeakIncentivesProgress(data || {emptyData: true});
      return res;
    } catch (error) {
      console.log(
        'Peak Incentive Progress Error:',
        error?.response?.data || error?.message,
      );
      setPeakIncentivesProgress({emptyData: true});
      return null;
    }
  }, []);

  const fetchRiderIncentivesTarget = useCallback(async () => {
    try {
      const res = await getRiderIncentivesTarget();

      setRiderIncentivesTarget(
        res?.data ?? res ?? {emptyData: true},
      );

      return res;
    } catch (error) {
      console.log(
        'Incentive Target Error:',
        error?.response?.data || error?.message,
      );
      setRiderIncentivesTarget({emptyData: true});
      return null;
    }
  }, []);

  /*
   * Individual incentives
   *
   * Program APIs + progress APIs are fetched every time.
   * This keeps daily/weekly/peak progress fresh.
   */
  const fetchIndividualIncentives = useCallback(async () => {
    try {
      setLoad(true);

      await Promise.allSettled([
        fetchPeakIncentives(),
        fetchDailyIncentives(),
        fetchWeeklyIncentives(),

        fetchPeakIncentivesProgress(),
        fetchDailyIncentivesProgress(),
        fetchWeeklyIncentivesProgress(),
      ]);
    } finally {
      setLoad(false);
    }
  }, [
    fetchPeakIncentives,
    fetchDailyIncentives,
    fetchWeeklyIncentives,
    fetchPeakIncentivesProgress,
    fetchDailyIncentivesProgress,
    fetchWeeklyIncentivesProgress,
  ]);

  /*
   * Zestbot incentives
   */
  const fetchZestbotIncentives = useCallback(
    async (force = false) => {
      if (loadedRef.current && !force) {
        return;
      }

      try {
        setLoad(true);

        await fetchRiderIncentivesTarget();

        loadedRef.current = true;
      } finally {
        setLoad(false);
      }
    },
    [fetchRiderIncentivesTarget],
  );

  const refreshIncentives = useCallback(async () => {
    loadedRef.current = false;
  }, []);

  return {
    peakIncentives,
    dailyIncentives,
    weeklyIncentives,

    weeklyIncentivesProgress,
    dailyIncentivesProgress,
    peakIncentivesProgress,

    riderIncentivesTarget,

    load,

    fetchPeakIncentives,
    fetchDailyIncentives,
    fetchWeeklyIncentives,

    fetchWeeklyIncentivesProgress,
    fetchDailyIncentivesProgress,
    fetchPeakIncentivesProgress,

    fetchIndividualIncentives,
    fetchZestbotIncentives,

    fetchRiderIncentivesTarget,

    refreshIncentives,
  };
};

export default useIncentives;