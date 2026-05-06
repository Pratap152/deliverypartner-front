// hooks/useRider.js
import { useState } from 'react';
import { getWeeklyIncentivesProgress, getDailyIncentivesProgress, getPeakIncentivesProgress } from '../services/earnings/incentiveService';

const useIncentives = () => {
  const [weeklyIncentivesProgress, setWeeklyIncentivesProgress] = useState(null);
  const [dailyIncentivesProgress, setDailyIncentivesProgress] = useState(null);
  const [peakIncentivesProgress, setPeakIncentivesProgress] = useState(null);
  const [load, setLoad] = useState(false);

  const fetchWeeklyIncentivesProgress = async () => {
    try {
      setLoad(true);
      const res = await getWeeklyIncentivesProgress();
      setWeeklyIncentivesProgress(res.data[0]);
    } finally {
      setLoad(false);
    }
  };

  const fetchDailyIncentivesProgress = async () => {
    try {
      setLoad(true);
      const res = await getDailyIncentivesProgress();
      setDailyIncentivesProgress(res);
    } finally {
      setLoad(false);
    }
  };

  const fetchPeakIncentivesProgress = async () => {
    try {
      setLoad(true);
      const res = await getPeakIncentivesProgress();
      setPeakIncentivesProgress(res);
    } finally {
      setLoad(false);
    }
  };

  return {
    weeklyIncentivesProgress,
    dailyIncentivesProgress,
    peakIncentivesProgress,
    load,
    fetchWeeklyIncentivesProgress,
    fetchDailyIncentivesProgress,
    fetchPeakIncentivesProgress,
  };
};

export default useIncentives;