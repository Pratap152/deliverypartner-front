import { getEarningsSummary,getWeeklyBarChart} from './earningsService';
import { getWalletDetails } from './walletService';
import {
  getPeakHourIncentives,
  getDailyIncentives,
  getWeeklyIncentives,
} from './incentiveService';

export const getEarningsDashboardData = async () => {
  const [
    summary,
    weeklyChart,
    wallet,
    peakIncentives,
    dailyIncentives,
    weeklyIncentives,
  ] = await Promise.all([
    getEarningsSummary(),
    getWeeklyBarChart(),
    getWalletDetails(),
    getPeakHourIncentives(),
    getDailyIncentives(),
    getWeeklyIncentives(),
  ]);

  return {
    summary,
    weeklyChart,
    wallet,
    peakIncentives,
    dailyIncentives,
    weeklyIncentives,
  };
};
