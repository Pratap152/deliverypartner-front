import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import NetInfo from "@react-native-community/netinfo";

import { EarningsNewAPI } from "../services/earnings/earningsHistoryService";
import { EarningsCache } from "../utils/earningsCache";
import { Analytics } from "../utils/analytics";

const ZESTBOT = "ZESTBOT_EMPLOYEE";

export default function useEarningsHistory({
  navigation,
  mode,
  riderType,
}) {
  const [view, setView] = useState("ROOT");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [offline, setOffline] = useState(false);

  const [weekData, setWeekData] = useState(null);
  const [dayData, setDayData] = useState(null);
  const [orderData, setOrderData] = useState(null);

  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );

  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [ledgerItems, setLedgerItems] = useState([]);

  const [weeklyDailyData, setWeeklyDailyData] = useState({});

  const [currentRiderType, setCurrentRiderType] = useState(
    riderType || null
  );

  const [salaryData, setSalaryData] = useState(null);

  const loadSalary = (salary) => {
    if (!salary) return;

    setSalaryData(salary);
    setView("SALARY");
  };

  const isZestbot = currentRiderType === ZESTBOT;

  const currentWeek = useMemo(
    () => getBackendWeekNumber(new Date()),
    []
  );

  const years = useMemo(() => {
    const year = new Date().getFullYear();

    return [year, year - 1, year - 2];
  }, []);

  const weeks = useMemo(() => {
    const all = getWeeksOfYear(selectedYear);
    const now = new Date();

    return selectedYear === now.getFullYear()
      ? all
          .filter(
            (w) =>
              w.week <= getBackendWeekNumber(now)
          )
          .reverse()
      : all.reverse();
  }, [selectedYear]);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      setOffline(!state.isConnected);
    });

    return unsub;
  }, []);

  const api = useCallback(
    async (key, request, force = false) => {
      setError(null);

      if (!force) {
        const cached = await EarningsCache.get(key);

        if (cached) {
          return cached;
        }
      }

      if (offline) {
        const cached = await EarningsCache.get(key);

        if (cached) {
          return cached;
        }

        setError("No internet connection");
        return null;
      }

      try {
        const res = await request();
        const data = res?.data;

        if (data) {
          await EarningsCache.set(key, data);
        }

        return data;
      } catch (e) {
        console.error(
          "EARNINGS API:",
          e?.response?.status,
          e?.response?.data || e?.message
        );

        if (e?.response?.status === 401) {
          Alert.alert(
            "Session expired",
            "Please login again."
          );
        } else {
          setError(
            "Something went wrong. Please try again."
          );
        }

        return EarningsCache.get(key);
      }
    },
    [offline]
  );

  useEffect(() => {
    bootstrap();
  }, []);

  const bootstrap = async () => {
    Analytics.track("earnings_screen_open", { mode });

    setInitialLoading(true);

    if (mode === "TODAY") {
      await loadToday(true);
    } else if (mode === "WEEK") {
      await loadCurrentWeek(true);
    } else {
      const week = getBackendWeekNumber(new Date());

      setSelectedWeek(week);

      await loadHistoryWeek(
        week,
        selectedYear,
        true
      );
    }

    setInitialLoading(false);
  };

  const setRiderType = (data) => {
    if (data?.riderType) {
      setCurrentRiderType(data.riderType);
    }
  };

  /* =========================================================
     TODAY
  ========================================================= */

  const loadToday = async (force = false) => {
    setLoading(true);

    const data = await api(
      "today",
      EarningsNewAPI.getToday,
      force
    );

    if (data) {
      setRiderType(data);
      setDayData(data);

      setLedgerItems(data.items || []);

      setPage(1);
      setHasMore(false);
      setView("DAY");
    }

    setLoading(false);
  };

  /* =========================================================
     CURRENT WEEK
  ========================================================= */

  const loadCurrentWeek = async (force = false) => {
    setLoading(true);

    const thisWeek =
      getBackendWeekNumber(new Date());

    setSelectedWeek(thisWeek);

    const data = await api(
      "currentWeek",
      EarningsNewAPI.getCurrentWeek,
      force
    );

    if (data) {
      setRiderType(data);
      setWeekData(data);
      setView("ROOT");

      const apiWeek =
        data?.week ??
        data?.weekNumber ??
        thisWeek;

      setSelectedWeek(apiWeek);

      /*
       * IMPORTANT:
       * Load daily data for BOTH:
       * - Individual
       * - ZestBot
       *
       * The weekly API day amount may not contain
       * Joining Bonus. Daily API totalEarnings does.
       */
      await loadWeekDays(data, force);
    }

    setLoading(false);
  };

  /* =========================================================
     HISTORY WEEK
  ========================================================= */

  const loadHistoryWeek = async (
    week,
    year,
    force = false
  ) => {
    if (!week) return;

    setLoading(true);

    const data = await api(
      `week_${year}_${week}`,
      () =>
        EarningsNewAPI.getWeekByNumber(
          week,
          year
        ),
      force
    );

    if (data) {
      setRiderType(data);
      setWeekData(data);
      setSelectedWeek(week);
      setView("ROOT");

      /*
       * IMPORTANT:
       * Load daily data for BOTH rider types.
       */
      await loadWeekDays(data, force);
    }

    setLoading(false);
  };

  /* =========================================================
     LOAD DAILY DATA FOR WEEK
  ========================================================= */

  const loadWeekDays = async (
    week,
    force = false
  ) => {
    const days = week?.days || [];

    const results = await Promise.all(
      days.map(async (day) => {
        if (!day?.date) {
          return null;
        }

        const data = await api(
          `day_${day.date}_1`,
          () =>
            EarningsNewAPI.getDailyByDate(
              day.date,
              1
            ),
          force
        );

        return data
          ? {
              date: day.date,
              data,
            }
          : null;
      })
    );

    const map = {};

    results.forEach((item) => {
      if (item) {
        map[item.date] = item.data;
      }
    });

    setWeeklyDailyData(map);
  };

  /* =========================================================
     LOAD DAY
  ========================================================= */

  const loadDay = async (
    date,
    reset = true,
    force = false
  ) => {
    if (!date) return;

    const requestedPage = reset ? 1 : page;

    if (
      !reset &&
      (!hasMore || loading)
    ) {
      return;
    }

    if (reset) {
      setSelectedDay(date);
      setPage(1);
      setLedgerItems([]);
      setHasMore(true);
      setView("DAY");
    }

    setLoading(true);

    const data = await api(
      `day_${date}_${requestedPage}`,
      () =>
        EarningsNewAPI.getDailyByDate(
          date,
          requestedPage
        ),
      force
    );

    if (data) {
      setRiderType(data);

      const items = data.items || [];

      setDayData(data);

      setLedgerItems((old) =>
        reset
          ? items
          : [...old, ...items]
      );

      setHasMore(items.length >= 20);

      setPage(requestedPage + 1);
    }

    setLoading(false);
  };

  /* =========================================================
     ORDER DETAILS
  ========================================================= */

  const loadTransaction = async (orderId) => {
    if (!orderId) return;

    Analytics.track(
      "earnings_open_transaction",
      { id: orderId }
    );

    setView("ORDER");
    setLoading(true);

    const data = await api(
      `transaction_${orderId}`,
      () =>
        EarningsNewAPI.getOrder(orderId)
    );

    if (data) {
      setRiderType(data);
      setOrderData(data);
    }

    setLoading(false);
  };

  /* =========================================================
     JOINING BONUS
  ========================================================= */

  const getJoiningBonus = (data) => {
    if (!data) return 0;

    const items = Array.isArray(data?.items)
      ? data.items
      : [];

    return items.reduce((sum, item) => {
      const type = String(
        item?.type || ""
      ).toUpperCase();

      const name = String(
        item?.name ||
          item?.title ||
          item?.description ||
          ""
      ).toUpperCase();

      const isJoiningBonus =
        type === "JOINING_BONUS" ||
        (
          type === "INCENTIVE" &&
          name.includes("JOINING BONUS")
        ) ||
        name.includes("JOINING BONUS");

      if (!isJoiningBonus) {
        return sum;
      }

      return (
        sum +
        Number(
          item?.amount ??
            item?.incentive ??
            item?.value ??
            0
        )
      );
    }, 0);
  };

  /* =========================================================
     ZESTBOT DAILY FALLBACK
  ========================================================= */

  const getZestbotAmount = (data) => {
    if (!data) return 0;

    /*
     * Daily API totalEarnings is the preferred value.
     * It already includes Joining Bonus.
     */
    if (
      data?.totalEarnings !== undefined &&
      data?.totalEarnings !== null
    ) {
      return Number(data.totalEarnings || 0);
    }

    const items = Array.isArray(data?.items)
      ? data.items
      : [];

    const joiningBonus =
      getJoiningBonus(data);

    return items.reduce(
      (sum, item) => {
        if (item?.type === "SALARY") {
          return (
            sum +
            Number(item?.amount || 0)
          );
        }

        if (item?.type === "DELIVERY") {
          return (
            sum +
            Number(item?.incentive || 0) +
            Number(item?.tips || 0)
          );
        }

        return sum;
      },
      joiningBonus
    );
  };

  /* =========================================================
     WEEKLY DAY AMOUNT
  ========================================================= */

  const getWeeklyDayAmount = (
    daily,
    weeklyDay
  ) => {
    /*
     * Best source:
     * Daily API totalEarnings.
     *
     * This includes:
     * - Base earnings
     * - Delivery incentives
     * - Tips
     * - Joining Bonus
     */
    if (
      daily?.totalEarnings !== undefined &&
      daily?.totalEarnings !== null
    ) {
      return Number(
        daily.totalEarnings || 0
      );
    }

    /*
     * ZestBot fallback.
     */
    if (isZestbot) {
      return getZestbotAmount(daily);
    }

    /*
     * Individual fallback.
     *
     * weekData.days.amount may not contain
     * Joining Bonus, so add it only when
     * daily data is available.
     */
    return (
      Number(weeklyDay?.amount || 0) +
      getJoiningBonus(daily)
    );
  };

  /* =========================================================
     ZESTBOT BREAKDOWN
  ========================================================= */

  const getZestbotBreakdown = (data) => {
    if (!data) {
      return {
        attendance: 0,
        incentives: 0,
        tips: 0,
        total: 0,
      };
    }

    const items = Array.isArray(data?.items)
      ? data.items
      : [];

    let attendance = 0;
    let incentives = 0;
    let tips = 0;

    items.forEach((item) => {
      if (item?.type === "SALARY") {
        attendance += Number(
          item?.amount || 0
        );
      }

      if (item?.type === "DELIVERY") {
        incentives += Number(
          item?.incentive || 0
        );

        tips += Number(
          item?.tips || 0
        );
      }

      const type = String(
        item?.type || ""
      ).toUpperCase();

      const name = String(
        item?.name ||
          item?.title ||
          item?.description ||
          ""
      ).toUpperCase();

      if (
        type === "JOINING_BONUS" ||
        name.includes("JOINING BONUS")
      ) {
        incentives += Number(
          item?.amount ??
            item?.incentive ??
            item?.value ??
            0
        );
      }
    });

    return {
      attendance,
      incentives,
      tips,
      total:
        attendance +
        incentives +
        tips,
    };
  };

  /* =========================================================
     WEEKLY TOTAL
  ========================================================= */

  const getWeeklyTotal = () => {
    const dailyValues =
      Object.values(
        weeklyDailyData || {}
      );

    /*
     * Daily API data is now loaded for both
     * Individual and ZestBot.
     *
     * Therefore use daily totalEarnings.
     * This prevents the Joining Bonus from
     * being missed or added twice.
     */
    if (dailyValues.length > 0) {
      return dailyValues.reduce(
        (sum, day) => {
          if (
            day?.totalEarnings !==
              undefined &&
            day?.totalEarnings !== null
          ) {
            return (
              sum +
              Number(
                day.totalEarnings || 0
              )
            );
          }

          return (
            sum +
            getWeeklyDayAmount(
              day,
              null
            )
          );
        },
        0
      );
    }

    /*
     * Fallback when daily API data is unavailable.
     *
     * The weekly API total should be used as-is
     * because it may already contain Joining Bonus.
     */
    return Number(
      weekData?.total || 0
    );
  };

  /* =========================================================
     REFRESH
  ========================================================= */

  const refresh = async () => {
    setRefreshing(true);

    try {
      if (
        view === "DAY" &&
        selectedDay
      ) {
        await loadDay(
          selectedDay,
          true,
          true
        );
      } else if (
        view === "ORDER" &&
        orderData?.orderId
      ) {
        const data = await api(
          `transaction_${orderData.orderId}`,
          () =>
            EarningsNewAPI.getOrder(
              orderData.orderId
            ),
          true
        );

        if (data) {
          setOrderData(data);
        }
      } else if (mode === "TODAY") {
        await loadToday(true);
      } else if (mode === "WEEK") {
        await loadCurrentWeek(true);
      } else if (selectedWeek) {
        await loadHistoryWeek(
          selectedWeek,
          selectedYear,
          true
        );
      }
    } finally {
      setRefreshing(false);
    }
  };

  /* =========================================================
     BACK
  ========================================================= */

  const back = () => {
    if (view === "ORDER") {
      setView("DAY");
      return;
    }

    if (view === "SALARY") {
      setView("DAY");
      return;
    }

    if (view === "DAY") {
      if (mode === "TODAY") {
        navigation.goBack();
      } else {
        setView("ROOT");
      }
      return;
    }

    navigation.goBack();
  };

  return {
    view,
    setView,

    loading,
    initialLoading,
    refreshing,
    error,
    offline,

    weekData,
    dayData,
    orderData,

    selectedYear,
    setSelectedYear,

    selectedWeek,
    setSelectedWeek,

    selectedDay,

    ledgerItems,
    weeklyDailyData,

    currentRiderType,
    isZestbot,

    currentWeek,
    years,
    weeks,

    loadToday,
    loadCurrentWeek,
    loadHistoryWeek,
    loadDay,
    loadTransaction,

    getJoiningBonus,
    getZestbotAmount,
    getZestbotBreakdown,
    getWeeklyDayAmount,
    getWeeklyTotal,

    refresh,
    back,
    bootstrap,

    salaryData,
    loadSalary,
  };
};

/* =========================================================
   BACKEND WEEK NUMBER
========================================================= */

function getBackendWeekNumber(date) {
  const d = new Date(date);

  const jan1 = new Date(
    d.getFullYear(),
    0,
    1
  );

  const day = jan1.getDay();

  const diff =
    day === 0 ? -6 : 1 - day;

  const firstMonday = new Date(jan1);

  firstMonday.setDate(
    jan1.getDate() + diff
  );

  return (
    Math.floor(
      (
        new Date(
          d.setHours(0, 0, 0, 0)
        ) -
        new Date(
          firstMonday.setHours(
            0,
            0,
            0,
            0
          )
        )
      ) /
        86400000 /
        7
    ) + 1
  );
}

/* =========================================================
   WEEKS OF YEAR
========================================================= */

function getWeeksOfYear(year) {
  const result = [];

  const jan1 = new Date(
    year,
    0,
    1
  );

  const day = jan1.getDay();

  const diff =
    day === 0 ? -6 : 1 - day;

  const start = new Date(jan1);

  start.setDate(
    jan1.getDate() + diff
  );

  let current = new Date(start);
  let week = 1;

  while (week <= 53) {
    const end = new Date(current);

    end.setDate(
      end.getDate() + 6
    );

    if (
      current.getFullYear() > year &&
      end.getFullYear() > year
    ) {
      break;
    }

    result.push({
      week,

      startLabel:
        current.toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          }
        ),

      endLabel:
        end.toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          }
        ),
    });

    current.setDate(
      current.getDate() + 7
    );

    week++;
  }

  return result;
}