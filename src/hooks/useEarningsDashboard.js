import { useEffect, useState, useCallback } from 'react';
import { getDailyEarnings, getEarningsSummary,getWeeklyBarChart} from '../services/earnings/earningsService';
import { getWalletDetails } from '../services/earnings/walletService';
import {
  getPeakHourIncentives,
  getWeeklyIncentives,
  getDailyIncentives,
} from '../services/earnings/incentiveService';


export default function useEarningsDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
      todayEarnings:{},
      earningsSummary: {},
      weeklyBarChart:[],
      weeklyTotal : 0,
      weeklyOrders:0,
      wallet: {},
      incentives: [],
    });
    // console.log('SCREEN DATA ', JSON.stringify(data, null, 2));


  const fetchDashboard = async () => {
  try {
    const dailyEarnings = await getDailyEarnings();
    // console.log('DAILY EARNINGS OK')

    const summaryRes = await getEarningsSummary();
    // console.log('SUMMARY OK');

    const weeklyChart = await getWeeklyBarChart();
    // console.log('WEEK BAR CHART OK');

    let walletRes = null;
    try {
      walletRes = await getWalletDetails();
      // console.log('WALLET OK');
    } catch (e) {
      console.log(' WALLET FAILED', e.response?.data);
    }

    let peakRes = null;
    try {
      peakRes = await getPeakHourIncentives();
      // console.log('PEAK OK');
    } catch (e) {
      console.log(' PEAK FAILED', e.response?.data);
    }

    let dailyRes = null;
    try {
      dailyRes = await getDailyIncentives();
      // console.log('DAILY OK');
    } catch (e) {
      console.log(' DAILY FAILED', e.response?.data);
    }

    let weeklyRes = null;
    try {
      weeklyRes = await getWeeklyIncentives();
      // console.log('WEEKLY INCENTIVE OK');
    } catch (e) {
      console.log(' WEEKLY INCENTIVE FAILED', e.response?.data);
    }
    const weeklyMapped = mapWeeklyChart(weeklyChart);
    setData({
      todayEarnings : mapDailyEarnings(dailyEarnings),
      earningsSummary: mapEarningsSummary(summaryRes),
      weeklyBarChart: weeklyMapped.chart,
      weeklyTotal: weeklyMapped?.total ?? 0,
      weeklyOrders: weeklyMapped?.total_orders ?? 0,
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

  const mapDailyEarnings = (res) => {
  const items = res?.items ?? [];

  return {
    date: res?.date ?? '',
    totalEarnings: res?.totalEarnings ?? 0,
    orders: items.length,   
    items,                
  };
};


  const mapEarningsSummary = res => ({
  month: {
    baseEarnings: res.month?.baseEarnings ?? 0, 
    incentives: res.month?.incentives ?? 0,     
    tips: res.month?.tips ?? 0,               
    earnings: res.month?.total ?? 0,
  },
});


const mapWeeklyChart = (res) => {
  if (!Array.isArray(res?.week)) {
    return {
      chart: [],
      total: 0,
      total_orders:0
    };
  }

  const chart = res.week.map(item => ({
    label: item.day,
    value: item.amount,
    orders: item.orders,
  }));

  const total = chart.reduce((sum, d) => sum + (d.value || 0), 0);
  const total_orders = chart.reduce((sum_ord, d)=> sum_ord + (d.orders || 0),0);

  return {
    chart,
    total,
    total_orders
  };
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
      peak_data: peakRes
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
      weekly_data: weeklyRes
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
    daily_data: dailyRes
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
