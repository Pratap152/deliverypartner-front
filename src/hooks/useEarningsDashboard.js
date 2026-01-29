import { useEffect, useState, useCallback } from 'react';
import { getEarningsSummary,getWeeklyBarChart} from '../services/earnings/earningsService';
import { getWalletDetails } from '../services/earnings/walletService';
import {
  getPeakHourIncentives,
  getWeeklyIncentives,
  getDailyIncentives,
} from '../services/earnings/incentiveService';
import PeakHourBonusScreen from '../screens/incentives/PeakHourBonusScreen';
import WeekEarnings from '../screens/incentives/WeekEarnings';
import DailyGuarentee from '../screens/incentives/DailyGuarentee';
import { Link, useNavigation } from '@react-navigation/native';
import { BarChart } from 'react-native-gifted-charts';

export default function useEarningsDashboard() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
      earningsSummary: {},
      wallet: {},
      incentives: [],
    });
    console.log('SCREEN DATA ', JSON.stringify(data, null, 2));


  const fetchDashboard = async () => {
  try {
    const summaryRes = await getEarningsSummary();
    console.log('SUMMARY OK');

    const weeklyChart = await getWeeklyBarChart();
    console.log('WEEK BAR CHART OK');

    let walletRes = null;
    try {
      walletRes = await getWalletDetails();
      console.log('WALLET OK');
    } catch (e) {
      console.log(' WALLET FAILED', e.response?.data);
    }

    let peakRes = null;
    try {
      peakRes = await getPeakHourIncentives();
      console.log('PEAK OK');
    } catch (e) {
      console.log(' PEAK FAILED', e.response?.data);
    }

    let dailyRes = null;
    try {
      dailyRes = await getDailyIncentives();
      console.log('DAILY OK');
    } catch (e) {
      console.log(' DAILY FAILED', e.response?.data);
    }

    let weeklyRes = null;
    try {
      weeklyRes = await getWeeklyIncentives();
      console.log('WEEKLY INCENTIVE OK');
    } catch (e) {
      console.log(' WEEKLY INCENTIVE FAILED', e.response?.data);
    }

    setData({
      earningsSummary: mapEarningsSummary(summaryRes),
      weeklyBarChart: mapWeeklyChart(weeklyChart),
      wallet: walletRes ? mapWallet(walletRes) : {},
      incentives: mapIncentives(peakRes, weeklyRes, dailyRes),
    });

  } catch (err) {
    console.log(' SUMMARY FAILED');
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};


  const mapEarningsSummary = res => ({
    today: {
      orders: res.today?.orders ?? 0,
      baseEarnings: res.today?. baseEarnings ?? 0,
      incentives:res.today?.incentives ??0,
      tips:res.today?.tips ?? 0,
      earnings: res.today?.total ?? 0,
    },
    week: {
      earnings: res.week?.total ?? 0,
    },
    month: {
      baseEarnings: res.today?. baseEarnings ?? 0,
      incentives:res.today?.incentives ??0,
      tips:res.today?.tips ?? 0,
      earnings: res.month?.total ?? 0,
    },
  });

const mapWeeklyChart = (res) => {
  if (!Array.isArray(res?.week)) return [];

  return res.week.map(item => ({
    label: item.day,          // "Mon"
    value: item.amount,       // earnings for bar height
    orders: item.orders,      // extra info (tooltip use)
  }));
};


const mapWallet = res => ({
  balance: res.data?.balance ?? 0,
  totalEarned: res.data?.totalEarned ?? 0,
  totalWithdrawn: res.data?.totalWithdrawn ?? 0,
});

const mapIncentives = (
  peakRes,
  weeklyRes,
  dailyRes
) => {
  const incentives = [];

  if (peakRes?.data) {
    incentives.push({
      id: 'peak-slot',
      type: 'peak',
      title: peakRes.data.title,
      subtitle: `Peak Slot: ${peakRes.data.slotRule}`,
      slabs: peakRes.data.slabs ?? [],
      accentColor: '#FFF7ED',
      peak_data: peakRes.data,
    });
  }

  // Weekly Incentive
  if (weeklyRes?.data) {
    incentives.push({
      id: 'weekly-incentive',
      type: 'weekly',
      title: weeklyRes.data.title,
      subtitle: `${weeklyRes.data.progress.eligibleDays}/${weeklyRes.data.progress.totalDaysRequired} days completed`,
      value: `Earn ₹${weeklyRes.data.maxRewardPerWeek}`,
      completedOrders: weeklyRes.data.progress.eligibleDays,
      requiredOrders: weeklyRes.data.progress.totalDaysRequired,
      accentColor: '#EFF6FF',
      weekly_data: weeklyRes.data
    });
  }

  // DAILY INCENTIVE
if (dailyRes?.success) {
  incentives.push({
    id: 'daily-incentive',
    type: 'daily',
    title: dailyRes.title,
    subtitle: dailyRes.eligible
      ? 'Target achieved'
      : 'Daily target in progress',
    value: dailyRes.eligible
      ? `₹${dailyRes.totalRewardAmount}`
      : 'In Progress',
    peakCompleted: dailyRes.peakCompleted ?? 0,
    peakRequired: dailyRes.slotRules?.minPeakSlots ?? 0,
    normalCompleted: dailyRes.normalCompleted ?? 0,
    normalRequired: dailyRes.slotRules?.minNormalSlots ?? 0,
    accentColor: '#F5F3FF',
    daily_data: dailyRes.data
  });
}


  return incentives;
};

  useEffect(() => {
    fetchDashboard();
  }, []);

  const onRefresh = useCallback(() => {
    fetchDashboard(true);
  }, []);

  return {
    data,
    loading,
    refreshing,
    error,
    onRefresh,
  };
}
