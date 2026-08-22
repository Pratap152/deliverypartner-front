import { useEffect, useState, useCallback, useRef } from 'react';

import {
  getEarningsSummary,
  getWeeklyBarChart,
} from '../services/earnings/earningsService';

import { getWalletDetails } from '../services/earnings/earningsWalletService';

let dashboardCache = null;
let dashboardLoaded = false;

const initialData = {
  todayEarnings: {},

  earningsSummary: {
    today: {},
    week: {},
    month: {},
  },

  riderType: '',

  weeklyBarChart: [],
  weeklyTotal: 0,
  weeklyOrders: 0,

  weeklySalary: 0,
  weeklyTips: 0,
  weeklyIncentives: 0,

  monthlySalary: 0,
  monthlyTips: 0,
  monthlyIncentives: 0,
  monthlyOrders: 0,
  monthlyTotal: 0,

  wallet: {},
};

const mapDailyEarnings = res => ({
  riderType: res?.riderType ?? '',
  attendanceAmount: Number(res?.attendanceAmount ?? 0),
  baseEarnings: Number(res?.baseEarnings ?? 0),
  total: Number(res?.total ?? 0),
  incentives: Number(res?.incentives ?? 0),
  orders: Number(res?.orders ?? 0),
  tips: Number(res?.tips ?? 0),
  eligible: res?.eligible ?? false,
  monthlyTarget: Number(res?.monthlyTarget ?? 0),
  totalCompletedOrders: Number(res?.completedOrders ?? 0),
  remainingOrders: Number(res?.remainingOrders ?? 0),
  completionPercentage: Number(res?.completionPercentage ?? 0),
});

const mapWeeklySummary = res => ({
  orders: Number(res?.orders ?? 0),
  attendanceAmount: Number(res?.attendanceAmount ?? 0),
  incentives: Number(res?.incentives ?? 0),
  tips: Number(res?.tips ?? 0),
  total: Number(res?.total ?? 0),
});

const mapMonthlySummary = res => ({
  baseEarnings: Number(res?.baseEarnings ?? 0),
  attendanceAmount: Number(res?.attendanceAmount ?? 0),
  orders: Number(res?.orders ?? 0),
  incentives: Number(res?.incentives ?? 0),
  tips: Number(res?.tips ?? 0),
  total: Number(res?.total ?? 0),
  earnings: Number(res?.total ?? 0),
});

const mapWeeklyChart = res => {
  if (!Array.isArray(res?.week)) {
    return {
      chart: [],
      total: 0,
      total_orders: 0,
    };
  }

  const chart = res.week.map((item, index) => ({
    ...item,
    key: `${item?.day ?? 'day'}-${index}`,
    day: item?.day ?? '',
    amount: Number(item?.amount ?? 0),
    orders: Number(item?.orders ?? 0),
    label: item?.day ?? '',
    value: Number(item?.amount ?? 0),
  }));

  return {
    chart,
    total: chart.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    ),
    total_orders: chart.reduce(
      (sum, item) => sum + Number(item.orders || 0),
      0,
    ),
  };
};

const mapWallet = res => ({
  riderType: res?.data?.riderType ?? '',
  totalAmount: Number(res?.data?.totalAmount ?? 0),
  availableBalance: Number(res?.data?.availableBalance ?? 0),
  holdAmount: Number(res?.data?.holdAmount ?? 0),
  withdrawDate: res?.data?.withdrawDate ?? null,
  todayEarning: Number(res?.data?.todayEarning ?? 0),
  incentives: Number(res?.data?.incentives ?? 0),
  tips: Number(res?.data?.tips ?? 0),
});

export default function useEarningsDashboard() {
  const [data, setData] = useState(
    dashboardCache || initialData,
  );

  const [loading, setLoading] = useState(
    !dashboardLoaded,
  );

  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const mounted = useRef(false);

  const fetchDashboard = useCallback(async (force = false) => {
    if (mounted.current && !force) {
      return;
    }

    mounted.current = true;
    setError(null);

    if (!dashboardCache) {
      setLoading(true);
    }

    try {
      const [
        summaryResult,
        weeklyResult,
        walletResult,
      ] = await Promise.allSettled([
        getEarningsSummary(),
        getWeeklyBarChart(),
        getWalletDetails(),
      ]);

      setData(prev => {
        const next = {
          ...prev,
          earningsSummary: {
            ...(prev?.earningsSummary || {}),
          },
        };

        if (summaryResult.status === 'fulfilled') {
          const summary = summaryResult.value;

          const today = mapDailyEarnings({
            riderType: summary?.riderType,

            attendanceAmount:
              summary?.today?.attendanceAmount,

            baseEarnings:
              summary?.today?.baseEarnings,

            total:
              summary?.today?.total,

            incentives:
              summary?.today?.incentives,

            orders:
              summary?.today?.orders,

            tips:
              summary?.today?.tips,

            eligible:
              summary?.target?.eligible,

            monthlyTarget:
              summary?.target?.monthlyTarget,

            completedOrders:
              summary?.target?.completedOrders,

            remainingOrders:
              summary?.target?.remainingOrders,

            completionPercentage:
              summary?.target?.completionPercentage,
          });

          const week = mapWeeklySummary(
            summary?.week,
          );

          const month = mapMonthlySummary(
            summary?.month,
          );

          next.riderType =
            summary?.riderType ??
            next.riderType ??
            '';

          next.todayEarnings = today;

          next.earningsSummary = {
            today,
            week,
            month,
          };

          next.weeklySalary =
            week.attendanceAmount;

          next.weeklyTips =
            week.tips;

          next.weeklyIncentives =
            week.incentives;

          next.weeklyTotal =
            week.total;

          next.weeklyOrders =
            week.orders;

          next.monthlySalary =
            month.attendanceAmount;

          next.monthlyTips =
            month.tips;

          next.monthlyIncentives =
            month.incentives;

          next.monthlyOrders =
            month.orders;

          next.monthlyTotal =
            month.total;
        }

        if (weeklyResult.status === 'fulfilled') {
          const weekly = mapWeeklyChart(
            weeklyResult.value,
          );

          next.weeklyBarChart =
            weekly.chart;
        }

        if (walletResult.status === 'fulfilled') {
          next.wallet = mapWallet(
            walletResult.value,
          );
        }

        dashboardCache = next;

        return next;
      });

      dashboardLoaded = true;
    } catch (err) {
      console.error(
        'Earnings dashboard error:',
        err,
      );

      setError(err);
      dashboardLoaded = true;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();

    return () => {
      mounted.current = false;
    };
  }, [fetchDashboard]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    mounted.current = false;

    try {
      await fetchDashboard(true);
    } finally {
      setRefreshing(false);
    }
  }, [fetchDashboard]);

  return {
    data,
    loading,
    refreshing,
    error,
    onRefresh,
  };
}