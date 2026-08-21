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

  /* =========================================================
     CURRENT WEEK
  ========================================================= */

  const currentWeek = useMemo(
    () => getBackendWeekNumber(new Date()),
    []
  );

  /* =========================================================
     YEARS
  ========================================================= */

  const years = useMemo(() => {
    const year = new Date().getFullYear();

    return [
      year,
      year - 1,
      year - 2,
    ];
  }, []);

  /* =========================================================
     WEEKS
  ========================================================= */

  const weeks = useMemo(() => {
    const all = getWeeksOfYear(selectedYear);
    const now = new Date();

    return selectedYear === now.getFullYear()
      ? all
          .filter(
            (w) =>
              w.week <=
              getBackendWeekNumber(now)
          )
          .reverse()
      : all.reverse();
  }, [selectedYear]);

  /* =========================================================
     NETWORK
  ========================================================= */

  useEffect(() => {
    const unsub =
      NetInfo.addEventListener((state) => {
        setOffline(!state.isConnected);
      });

    return unsub;
  }, []);

  /* =========================================================
     API WRAPPER
  ========================================================= */

  const api = useCallback(
    async (
      key,
      request,
      force = false
    ) => {
      setError(null);

      if (!force) {
        const cached =
          await EarningsCache.get(key);

        if (cached) {
          return cached;
        }
      }

      if (offline) {
        const cached =
          await EarningsCache.get(key);

        if (cached) {
          return cached;
        }

        setError(
          "No internet connection"
        );

        return null;
      }

      try {
        const res = await request();

        const data = res?.data;

        if (data) {
          await EarningsCache.set(
            key,
            data
          );
        }

        return data;
      } catch (e) {
        console.error(
          "EARNINGS API:",
          e?.response?.status,
          e?.response?.data ||
            e?.message
        );

        if (
          e?.response?.status === 401
        ) {
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

  /* =========================================================
     BOOTSTRAP
  ========================================================= */

  useEffect(() => {
    bootstrap();
  }, []);

  const bootstrap = async () => {
    Analytics.track(
      "earnings_screen_open",
      { mode }
    );

    setInitialLoading(true);

    if (mode === "TODAY") {
      await loadToday(true);
    } else if (mode === "WEEK") {
      await loadCurrentWeek(true);
    } else {
      const week =
        getBackendWeekNumber(
          new Date()
        );

      setSelectedWeek(week);

      await loadHistoryWeek(
        week,
        selectedYear,
        true
      );
    }

    setInitialLoading(false);
  };

  /* =========================================================
     RIDER TYPE
  ========================================================= */

  const setRiderType = (data) => {
    if (data?.riderType) {
      setCurrentRiderType(
        data.riderType
      );
    }
  };

  /* =========================================================
     TODAY
  ========================================================= */

  const loadToday = async (
    force = false
  ) => {
    setLoading(true);

    const data = await api(
      "today",
      EarningsNewAPI.getToday,
      force
    );

    if (data) {
      setRiderType(data);

      setDayData(data);

      setLedgerItems(
        data.items || []
      );

      setPage(1);
      setHasMore(false);

      setView("DAY");
    }

    setLoading(false);
  };

  /* =========================================================
     CURRENT WEEK
  ========================================================= */

  const loadCurrentWeek = async (
    force = false
  ) => {
    setLoading(true);

    /*
     * FIX:
     * Set the current week immediately.
     *
     * This fixes:
     * Week: -
     */
    const thisWeek =
      getBackendWeekNumber(
        new Date()
      );

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

      /*
       * Some APIs may return a week number.
       * Use it if available.
       */
      const apiWeek =
        data?.week ??
        data?.weekNumber ??
        thisWeek;

      setSelectedWeek(apiWeek);

      if (
        data.riderType === ZESTBOT
      ) {
        await loadWeekDays(data, force);
      }
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

      if (
        data.riderType === ZESTBOT
      ) {
        await loadWeekDays(
          data,
          force
        );
      }
    }

    setLoading(false);
  };

  /* =========================================================
     LOAD DAILY DATA FOR WEEK
     
     VERY IMPORTANT:
     Force fresh daily API data when loading
     a weekly screen so the values match the
     Daily Earnings screen.
  ========================================================= */

  const loadWeekDays = async (
    week,
    force = false
  ) => {
    const days =
      week?.days || [];

    const results =
      await Promise.all(
        days.map(async (day) => {
          if (!day?.date) {
            return null;
          }

          const data =
            await api(
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
        map[item.date] =
          item.data;
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

    const requestedPage =
      reset ? 1 : page;

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

      const items =
        data.items || [];

      setDayData(data);

      setLedgerItems((old) =>
        reset
          ? items
          : [
              ...old,
              ...items,
            ]
      );

      setHasMore(
        items.length >= 20
      );

      setPage(
        requestedPage + 1
      );
    }

    setLoading(false);
  };

  /* =========================================================
     ORDER DETAILS
  ========================================================= */

  const loadTransaction =
    async (orderId) => {
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
          EarningsNewAPI.getOrder(
            orderId
          )
      );

      if (data) {
        setRiderType(data);

        setOrderData(data);
      }

      setLoading(false);
    };

  /* =========================================================
     ZESTBOT DAILY AMOUNT
     
     IMPORTANT:
     
     DO NOT use:
       data.incentives
     
     because that value can be an aggregated
     incentive amount such as ₹1500.
     
     Instead use the exact same items that
     Daily Earnings uses.
     
     Daily:
       Salary amount
       +
       Delivery incentive
       +
       Delivery tips
  ========================================================= */

  const getZestbotAmount = (
    data
  ) => {
    if (!data) {
      return 0;
    }

    const items =
      Array.isArray(data?.items)
        ? data.items
        : [];

    return items.reduce(
      (sum, item) => {
        if (
          item?.type ===
          "SALARY"
        ) {
          return (
            sum +
            Number(
              item?.amount || 0
            )
          );
        }

        if (
          item?.type ===
          "DELIVERY"
        ) {
          return (
            sum +
            Number(
              item?.incentive || 0
            ) +
            Number(
              item?.tips || 0
            )
          );
        }

        /*
         * Do not add:
         * ATTENDANCE
         * INCENTIVE
         *
         * because those can be
         * aggregate/summary records.
         */
        return sum;
      },
      0
    );
  };

  /* =========================================================
     ZESTBOT BREAKDOWN
  ========================================================= */

  const getZestbotBreakdown = (
    data
  ) => {
    if (!data) {
      return {
        attendance: 0,
        incentives: 0,
        tips: 0,
        total: 0,
      };
    }

    const items =
      Array.isArray(data?.items)
        ? data.items
        : [];

    let attendance = 0;
    let incentives = 0;
    let tips = 0;

    items.forEach((item) => {
      if (
        item?.type ===
        "SALARY"
      ) {
        attendance += Number(
          item?.amount || 0
        );
      }

      if (
        item?.type ===
        "DELIVERY"
      ) {
        incentives += Number(
          item?.incentive || 0
        );

        tips += Number(
          item?.tips || 0
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
     
     Sum the exact daily values shown
     on the Weekly screen.
  ========================================================= */

  const getWeeklyTotal = () => {
    if (!isZestbot) {
      return Number(
        weekData?.total || 0
      );
    }

    return Object.values(
      weeklyDailyData
    ).reduce(
      (sum, day) =>
        sum +
        getZestbotAmount(day),
      0
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
        const data =
          await api(
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
      } else if (
        mode === "TODAY"
      ) {
        await loadToday(true);
      } else if (
        mode === "WEEK"
      ) {
        await loadCurrentWeek(
          true
        );
      } else if (
        selectedWeek
      ) {
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

  /* =========================================================
     RETURN
  ========================================================= */

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

    getZestbotAmount,
    getZestbotBreakdown,
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

function getBackendWeekNumber(
  date
) {
  const d = new Date(date);

  const jan1 =
    new Date(
      d.getFullYear(),
      0,
      1
    );

  const day =
    jan1.getDay();

  const diff =
    day === 0
      ? -6
      : 1 - day;

  const firstMonday =
    new Date(jan1);

  firstMonday.setDate(
    jan1.getDate() + diff
  );

  return (
    Math.floor(
      (
        new Date(
          d.setHours(
            0,
            0,
            0,
            0
          )
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

function getWeeksOfYear(
  year
) {
  const result = [];

  const jan1 =
    new Date(
      year,
      0,
      1
    );

  const day =
    jan1.getDay();

  const diff =
    day === 0
      ? -6
      : 1 - day;

  const start =
    new Date(jan1);

  start.setDate(
    jan1.getDate() + diff
  );

  let current =
    new Date(start);

  let week = 1;

  while (week <= 53) {
    const end =
      new Date(current);

    end.setDate(
      end.getDate() + 6
    );

    if (
      current.getFullYear() >
        year &&
      end.getFullYear() >
        year
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