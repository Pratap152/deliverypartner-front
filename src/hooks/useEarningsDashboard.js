import { useEffect, useState, useCallback, useRef } from 'react';

import {
  getEarningsSummary,
  getWeeklyBarChart,
} from '../services/earnings/earningsService';

import { getWalletDetails } from '../services/earnings/walletService';

import {
  getPeakHourIncentives,
  getDailyIncentives,
  getWeeklyIncentives,
} from '../services/earnings/incentiveService';

/* =========================================================
   CACHE
========================================================= */

let dashboardCache = null;
let dashboardLoaded = false;

/* =========================================================
   HOOK
========================================================= */

export default function useEarningsDashboard() {
  const [loading, setLoading] = useState(!dashboardLoaded);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [data, setData] = useState(
    dashboardCache || {
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

      /*
       * These are specifically from
       * earningsSummary.week
       */
      weeklySalary: 0,
      weeklyTips: 0,
      weeklyIncentives: 0,

      /*
       * Monthly values
       */
      monthlySalary: 0,
      monthlyTips: 0,
      monthlyIncentives: 0,
      monthlyOrders: 0,
      monthlyTotal: 0,

      wallet: {},
      incentives: [],
    }
  );

  const mounted = useRef(false);

  /* =========================================================
     TODAY
  ========================================================= */

  const mapDailyEarnings = res => {
    return {
      riderType: res?.riderType ?? '',

      attendanceAmount:
        Number(res?.attendanceAmount ?? 0),

      baseEarnings:
        Number(res?.baseEarnings ?? 0),

      total:
        Number(res?.total ?? 0),

      incentives:
        Number(res?.incentives ?? 0),

      orders:
        Number(res?.orders ?? 0),

      tips:
        Number(res?.tips ?? 0),

      eligible:
        res?.eligible ?? false,

      monthlyTarget:
        Number(res?.monthlyTarget ?? 0),

      totalCompletedOrders:
        Number(res?.completedOrders ?? 0),

      remainingOrders:
        Number(res?.remainingOrders ?? 0),

      completionPercentage:
        Number(res?.completionPercentage ?? 0),
    };
  };

  /* =========================================================
     WEEKLY SUMMARY
     
     IMPORTANT:
     These values come from:
     
     summary.week
     
     They must NOT come from:
     - month
     - weekly chart
     ========================================================= */

  const mapWeeklySummary = res => {
    return {
      orders:
        Number(res?.orders ?? 0),

      attendanceAmount:
        Number(res?.attendanceAmount ?? 0),

      incentives:
        Number(res?.incentives ?? 0),

      tips:
        Number(res?.tips ?? 0),

      total:
        Number(res?.total ?? 0),
    };
  };

  /* =========================================================
     MONTHLY SUMMARY
     
     IMPORTANT:
     These values remain completely separate
     from weekly values.
  ========================================================= */

  const mapMonthlySummary = res => {
  return {
    // INDIVIDUAL_EMPLOYEE
    baseEarnings:
      Number(res?.baseEarnings ?? 0),

    // ZESTBOT_EMPLOYEE
    // Keep this exactly for ZESTBOT salary
    attendanceAmount:
      Number(res?.attendanceAmount ?? 0),

    orders:
      Number(res?.orders ?? 0),

    incentives:
      Number(res?.incentives ?? 0),

    tips:
      Number(res?.tips ?? 0),

    total:
      Number(res?.total ?? 0),

    earnings:
      Number(res?.total ?? 0),
  };
};

  /* =========================================================
     WEEKLY BAR CHART
  ========================================================= */

  const mapWeeklyChart = res => {
    if (!Array.isArray(res?.week)) {
      return {
        chart: [],
        total: 0,
        total_orders: 0,
      };
    }

    const chart = res.week.map(item => ({
      ...item,

      day: item?.day ?? '',

      amount:
        Number(item?.amount ?? 0),

      orders:
        Number(item?.orders ?? 0),

      label:
        item?.day ?? '',

      value:
        Number(item?.amount ?? 0),
    }));

    const total = chart.reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );

    const total_orders = chart.reduce(
      (sum, item) =>
        sum + Number(item.orders || 0),
      0
    );

    return {
      chart,
      total,
      total_orders,
    };
  };

  /* =========================================================
     WALLET
  ========================================================= */

  const mapWallet = res => ({
    balance:
      Number(res?.data?.balance ?? 0),

    totalEarned:
      Number(res?.data?.totalEarned ?? 0),

    totalWithdrawn:
      Number(res?.data?.totalWithdrawn ?? 0),
  });

  /* =========================================================
     INCENTIVES
  ========================================================= */

  const mapIncentives = (
    peakRes,
    weeklyRes,
    dailyRes
  ) => {
    const incentives = [];

    /* =====================================================
       PEAK
    ===================================================== */

    const peakItem =
      peakRes?.data?.[0];

    if (peakItem) {
      incentives.push({
        id: 'peak-slot',
        type: 'peak',

        title:
          peakItem?.name || 'FRED',

        minOrders:
          peakItem?.ruleType === 'HYBRID'
            ? peakItem?.slots?.[0]?.conditions
                ?.minOrders ?? 0

            : peakItem?.ruleType === 'FIXED_TARGET'
              ? peakItem?.slots?.[0]?.target
                  ?.orders ?? 0

              : peakItem?.ruleType === 'SLAB'
                ? peakItem?.slots?.[0]?.slabs?.[0]
                    ?.minOrders ?? 0

                : 0,

        accentColor: '#FFF7ED',

        peak_data: peakRes,
      });
    } else {
      incentives.push({
        id: 'peak-slot',
        type: 'peak',
        emptyData: true,
      });
    }

    /* =====================================================
       WEEKLY INCENTIVE
    ===================================================== */

    const weeklyItem =
      weeklyRes?.data?.[0];

    if (weeklyItem) {
      incentives.push({
        id: 'weekly-incentive',
        type: 'weekly',

        title:
          weeklyItem?.name,

        minOrders:
          weeklyItem?.ruleType === 'HYBRID'
            ? weeklyItem?.conditions
                ?.minOrders ?? 0

            : weeklyItem?.ruleType === 'FIXED_TARGET'
              ? weeklyItem?.target
                  ?.orders ?? 0

              : weeklyItem?.ruleType === 'SLAB'
                ? weeklyItem?.slabs?.[0]
                    ?.minOrders ?? 0

                : 0,

        accentColor: '#EFF6FF',

        weekly_data: weeklyRes,
      });
    } else {
      incentives.push({
        id: 'weekly-incentive',
        type: 'weekly',
        emptyData: true,
      });
    }

    /* =====================================================
       DAILY INCENTIVE
    ===================================================== */

    const dailyItem =
      dailyRes?.data?.[0];

    if (dailyItem) {
      incentives.push({
        id: 'daily-incentive',
        type: 'daily',

        title:
          dailyItem?.name,

        minOrders:
          dailyItem?.ruleType === 'HYBRID'
            ? dailyItem?.conditions
                ?.minOrders ?? 0

            : dailyItem?.ruleType === 'FIXED_TARGET'
              ? dailyItem?.target
                  ?.orders ?? 0

              : dailyItem?.ruleType === 'SLAB'
                ? dailyItem?.slabs?.[0]
                    ?.minOrders ?? 0

                : 0,

        accentColor: '#F5F3FF',

        daily_data: dailyRes,
      });
    } else {
      incentives.push({
        id: 'daily-incentive',
        type: 'daily',
        emptyData: true,
      });
    }

    return incentives;
  };

  /* =========================================================
     FETCH DASHBOARD
  ========================================================= */

  const fetchDashboard = async (force = false) => {
    if (mounted.current && !force) {
      return;
    }

    if (!force) {
      mounted.current = true;
    }

    setError(null);

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

      /*
       * IMPORTANT:
       * Start from current state/cache.
       *
       * This prevents monthly data from disappearing
       * when another API finishes.
       */

      let updatedData = {
        ...(dashboardCache || {}),
      };

      /* =====================================================
         SUMMARY API
      ===================================================== */

      if (summaryResult.status === 'fulfilled') {
        const summary =
          summaryResult.value;

        /* ================= TODAY ================= */

        const today =
          mapDailyEarnings({
            riderType:
              summary?.riderType,

            attendanceAmount:
              summary?.today
                ?.attendanceAmount,

            baseEarnings:
              summary?.today
                ?.baseEarnings,

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
              summary?.target
                ?.completionPercentage,
          });

        /* ================= WEEK ================= */

        const week =
          mapWeeklySummary(
            summary?.week
          );

        /* ================= MONTH ================= */

        const month =
          mapMonthlySummary(
            summary?.month
          );

        /*
         * IMPORTANT:
         *
         * Today, Week and Month are
         * completely separate objects.
         */

        updatedData = {
          ...updatedData,

          riderType:
            summary?.riderType ??
            updatedData.riderType ??
            '',

          todayEarnings:
            today,

          earningsSummary: {
            today,
            week,
            month,
          },

          /* ================= WEEK ================= */

          weeklySalary:
            week.attendanceAmount,

          weeklyTips:
            week.tips,

          weeklyIncentives:
            week.incentives,

          /*
           * Use summary.week for weekly
           * total and orders.
           */

          weeklyTotal:
            week.total,

          weeklyOrders:
            week.orders,

          /* ================= MONTH ================= */

          monthlySalary:
            month.attendanceAmount,

          monthlyTips:
            month.tips,

          monthlyIncentives:
            month.incentives,

          monthlyOrders:
            month.orders,

          monthlyTotal:
            month.total,
        };
      }

      /* =====================================================
         WEEKLY BAR CHART
         
         IMPORTANT:
         This API is ONLY for chart data.
         
         It must NOT replace:
         - weeklyTotal
         - weeklyOrders
         - weeklySalary
         - weeklyTips
         - weeklyIncentives
         ===================================================== */

      if (
        weeklyResult.status ===
        'fulfilled'
      ) {
        const weeklyResponse =
          weeklyResult.value;

        const weekly =
          mapWeeklyChart(
            weeklyResponse
          );

        updatedData = {
          ...updatedData,

          riderType:
            weeklyResponse?.riderType ??
            updatedData.riderType ??
            '',

          weeklyBarChart:
            weekly.chart,

          /*
           * DO NOT set weeklyTotal here.
           *
           * Summary API's week.total
           * is the authoritative weekly
           * earnings value.
           */
        };
      }

      /* =====================================================
         WALLET
      ===================================================== */

      if (
        walletResult.status ===
        'fulfilled'
      ) {
        updatedData = {
          ...updatedData,

          wallet:
            mapWallet(
              walletResult.value
            ),
        };
      }

      /* =====================================================
         SAVE DASHBOARD
      ===================================================== */

      setData(prev => {
        const next = {
          ...prev,
          ...updatedData,

          /*
           * Make absolutely sure nested
           * earningsSummary is preserved.
           */
          earningsSummary: {
            ...(prev?.earningsSummary || {}),
            ...(updatedData?.earningsSummary || {}),
          },
        };

        dashboardCache = next;

        return next;
      });

      setLoading(false);

      /* =====================================================
         INCENTIVES
      ===================================================== */

      setTimeout(() => {
        Promise.allSettled([
          getPeakHourIncentives(),
          getDailyIncentives(),
          getWeeklyIncentives(),
        ])
          .then(
            ([
              peak,
              daily,
              weekly,
            ]) => {
              const mappedIncentives =
                mapIncentives(
                  peak.status ===
                    'fulfilled'
                    ? peak.value
                    : null,

                  weekly.status ===
                    'fulfilled'
                    ? weekly.value
                    : null,

                  daily.status ===
                    'fulfilled'
                    ? daily.value
                    : null
                );

              setData(prev => {
                const updated = {
                  ...prev,

                  /*
                   * Preserve ALL existing
                   * monthly/weekly data.
                   */
                  incentives:
                    mappedIncentives,
                };

                dashboardCache =
                  updated;

                dashboardLoaded =
                  true;

                return updated;
              });
            }
          )
          .catch(() => {
            dashboardLoaded =
              true;
          });
      }, 500);

    } catch (err) {
      console.error(
        'Earnings dashboard error:',
        err
      );

      setError(err);
      setLoading(false);
      dashboardLoaded = true;
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* =========================================================
     REFRESH
  ========================================================= */

  const onRefresh =
    useCallback(async () => {
      setRefreshing(true);

      mounted.current = false;

      await fetchDashboard(true);

      setRefreshing(false);
    }, []);

  /* =========================================================
     RETURN
  ========================================================= */

  return {
    data,
    loading,
    refreshing,
    error,
    onRefresh,
  };
}