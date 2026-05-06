import { useEffect, useState, useCallback, useRef } from 'react';
import {
  getDailyEarnings,
  getEarningsSummary,
  getWeeklyBarChart,
} from '../services/earnings/earningsService';
import { getWalletDetails } from '../services/earnings/walletService';
import {
  getPeakHourIncentives,
  getDailyIncentives,
  getWeeklyIncentives,
} from '../services/earnings/incentiveService';



/* CACHE */
let dashboardCache = null;
let dashboardLoaded = false;

export default function useEarningsDashboard() {
  const [loading, setLoading] = useState(!dashboardLoaded);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(
      dashboardCache ||{
        todayEarnings:{},
        earningsSummary: {},
        weeklyBarChart:[],
        weeklyTotal : 0,
        weeklyOrders:0,
        wallet: {},
        incentives: [],
      });
   

  const mounted = useRef(false);

  const fetchDashboard = async (force = false) => {
      if (mounted.current && !force) return;
      if (!force) {
        mounted.current = true;
      }
      try {

        const daily = await getDailyEarnings();
          setData(prev => ({
            ...prev,
            todayEarnings: mapDailyEarnings(daily),
          }));
          setLoading(false);


          getEarningsSummary()
            .then(summary => {
              setData(prev => {
                const updated = {
                  ...prev,
                  earningsSummary: mapEarningsSummary(summary),
                };
                dashboardCache = updated;
                return updated;
              });
            })
            .catch(()=>{});


          getWeeklyBarChart()
            .then(res => {
              const weekly = mapWeeklyChart(res);
              setData(prev => {
                const updated = {
                  ...prev,
                  weeklyBarChart: weekly.chart,
                  weeklyTotal: weekly.total,
                  weeklyOrders: weekly.total_orders,
                };
                dashboardCache = updated;
                return updated;
              });
            })
            .catch(()=>{});


          getWalletDetails()
            .then(res => {
              setData(prev => {
                const updated = {
                  ...prev,
                  wallet: mapWallet(res),
                };
                dashboardCache = updated;
                return updated;
              });
            })
            .catch(()=>{});


        setTimeout(() => {
            Promise.allSettled([
              getPeakHourIncentives(),
              getDailyIncentives(),
              getWeeklyIncentives(),
            ])
            .then(([peak, daily, weekly]) => {
              setData(prev => {
                const updated = {
                  ...prev,
                  incentives: mapIncentives(
                    peak.status==="fulfilled"?peak.value:null,
                    weekly.status==="fulfilled"?weekly.value:null,
                    daily.status==="fulfilled"?daily.value:null,
                  )
                };
                dashboardCache = updated;
                dashboardLoaded = true;
                return updated;
              });
            });
          }, 1000);
        }
        
        catch {
          setLoading(false);
        }
      };

  // DAILY EARNINGS
  const mapDailyEarnings = (res) => {
  const items = res?.items ?? [];
    return {
      date: res?.date ?? "",
      totalEarnings: res?.totalEarnings ?? 0,
      orders: items.length,
      items,
    };
  };

  // MONTHLY SUMMARY
  const mapEarningsSummary = (res) => {
    return{
      month: {
        baseEarnings: res.month?.baseEarnings ?? 0, 
        incentives: res.month?.incentives ?? 0,     
        tips: res.month?.tips ?? 0,               
        earnings: res.month?.total ?? 0,
        orders: res.month.orders ??0
        }
      };
  };

  // WEEKLY BAR CHART 
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

  // WALLET
  const mapWallet = res => ({
    balance: res.data?.balance ?? 0,
    totalEarned: res.data?.totalEarned ?? 0,
    totalWithdrawn: res.data?.totalWithdrawn ?? 0,
  });

  // INCENTIVES 
  const mapIncentives = (
    peakRes,
    weeklyRes,
    dailyRes
  ) => {
    const incentives = [];

      // PEAK SLOT INCENTIVE
      if (peakRes?.data) {
        incentives.push({
          id: 'peak-slot',
          type: 'peak',
          title: peakRes.data[0]?.name || "FRED",
          // subtitle: peakRes.data[0].description,
          // slabs: peakRes.data[0].slabs ?? [],
          accentColor: '#FFF7ED',
          peak_data: peakRes
        });
      }

      // WEEKLY INCENTIVE
      if (weeklyRes?.data) {
        incentives.push({
          id: 'weekly-incentive',
          type: 'weekly',
          title: weeklyRes.data[0]?.name,
          minOrders: weeklyRes.data[0]?.target?.orders || weeklyRes.data[0]?.slabs[0]?.minOrders,
          accentColor: '#EFF6FF',
          weekly_data: weeklyRes
        });
      }

    // DAILY INCENTIVE
    if (dailyRes?.data) {
      incentives.push({
        id: 'daily-incentive',
        type: 'daily',
        title: dailyRes.data[0]?.name,
        minOrders: dailyRes.data[0]?.target?.orders || dailyRes.data[0]?.slabs[0]?.minOrders,
        accentColor: '#F5F3FF',
        daily_data: dailyRes
      });
    }

    return incentives;
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    mounted.current = false;  
    await fetchDashboard(true);
    setRefreshing(false);
  }, []);

  return {
    data,
    loading,
    refreshing,
    error,
    onRefresh,
  };
}
