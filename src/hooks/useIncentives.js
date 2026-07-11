// hooks/useRider.js
import { useState } from 'react';
import { getWeeklyIncentivesProgress, getDailyIncentivesProgress, getPeakIncentivesProgress, getRiderIncentivesTarget } from '../services/earnings/incentiveService';

const useIncentives = () => {
  const [weeklyIncentivesProgress, setWeeklyIncentivesProgress] = useState(null);
  const [dailyIncentivesProgress, setDailyIncentivesProgress] = useState(null);
  const [peakIncentivesProgress, setPeakIncentivesProgress] = useState(null);
  const [riderIncentivesTarget, setRiderIncentivesTarget] = useState(null);
  const [load, setLoad] = useState(false);

  const fetchWeeklyIncentivesProgress = async () => {
    try {
      setLoad(true);
      const res = await getWeeklyIncentivesProgress();
      if (res.data[0]) {
        setWeeklyIncentivesProgress(res.data[0]);
      }
      else {
        setWeeklyIncentivesProgress({ emptyData: true })
      }
    } catch (error) {
      console.log("Weekly Incentive Error: ", error);
    } finally {
      setLoad(false);
    }
  };

  const fetchDailyIncentivesProgress = async () => {
    try {
      setLoad(true);
      const res = await getDailyIncentivesProgress();
      if (res) {
        setDailyIncentivesProgress(res);
      } else {
        setDailyIncentivesProgress({ emptyData: true })
      }
    } catch (error) {
      console.log("Daily Incentive Error: ", error);
    } finally {
      setLoad(false);
    }
  };

  const fetchPeakIncentivesProgress = async () => {
    try {
      setLoad(true);
      const res = await getPeakIncentivesProgress();
      if (res.data[0]) {
        setPeakIncentivesProgress(res.data[0]);
      } else {
        setPeakIncentivesProgress({ emptyData: true })
      }
    } catch (error) {
      console.log("Peak Incentive Error: ", error);
    } finally {
      setLoad(false);
    }
  };

  const fetchRiderIncentivesTarget = async () => {
    try {
      setLoad(true);
      const res = await getRiderIncentivesTarget();
      if (res.data) {
        setRiderIncentivesTarget(res.data);
      } else {
        setRiderIncentivesTarget({ emptyData: true })
      }
    } catch (error) {
      console.log("Incentive Target Error: ", error);
    } finally {
      setLoad(false);
    }
  };

  return {
    weeklyIncentivesProgress,
    dailyIncentivesProgress,
    peakIncentivesProgress,
    riderIncentivesTarget,
    load,
    fetchWeeklyIncentivesProgress,
    fetchDailyIncentivesProgress,
    fetchPeakIncentivesProgress,
    fetchRiderIncentivesTarget,
  };
};

export default useIncentives;