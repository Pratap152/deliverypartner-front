import { getEarningsSummary} from './earningsService';
import { getWalletDetails } from './walletService';
import {
  getPeakHourIncentives,
  getDailyIncentives,
  getWeeklyIncentives,
} from './incentiveService';

export const getEarningsDashboardData = async () => {
  const [
    summary,
    wallet,
    peakIncentives,
    dailyIncentives,
    weeklyIncentives,
  ] = await Promise.all([
    getEarningsSummary(),
    getWalletDetails(),
    getPeakHourIncentives(),
    getDailyIncentives(),
    getWeeklyIncentives(),
  ]);

  return {
    summary,
    wallet,
    peakIncentives,
    dailyIncentives,
    weeklyIncentives,
  };
};
