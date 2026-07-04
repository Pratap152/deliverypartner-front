import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import NetInfo from "@react-native-community/netinfo";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatMoney } from '../../utils/formatMoney';
import { EarningsNewAPI } from '../../services/earnings/earningsHistoryService';
import { EarningsCache } from "../../utils/earningsCache";
import { Analytics } from "../../utils/analytics";
import SelectModal from "../../components/dashboard/earnings/SelectModal";
import DeviceInfo from "react-native-device-info";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

const isTablet = DeviceInfo.isTablet();



export default function EarningsHistoryScreen({ navigation, route }) {
  const mode = route?.params?.mode || "TODAY";

  // STATE 
  const [view, setView] = useState("ROOT");

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  const [weekData, setWeekData] = useState(null);
  const [dayData, setDayData] = useState(null);
  const [orderData, setOrderData] = useState(null);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [ledgerItems, setLedgerItems] = useState([]);

  // Modals
  const [yearModal, setYearModal] = useState(false);
  const [weekModal, setWeekModal] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);

  const cameFromToday = mode === "TODAY";

  const currentWeekNumber = useMemo(() => getBackendWeekNumber(new Date()), []);

  // CONSTANTS
  const years = useMemo(() => {
    const now = new Date().getFullYear();
    return [now, now - 1, now - 2];
  }, []);

  const weeks = useMemo(() => {
  const allWeeks = getWeeksOfYear_BackendCompatible(selectedYear);
  const now = new Date();

  if (selectedYear === now.getFullYear()) {
    return allWeeks
      .filter((item) => item.week <= getBackendWeekNumber(now))
      .reverse();
  }

  return allWeeks.reverse();
}, [selectedYear]);

  // NETWORK 
  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });
    return () => unsub();
  }, []);

  // SAFE API WITH CACHE 
  const safeApiCached = useCallback(
    async (key, fn, force = false) => {
      setError(null);

      if (!force) {
        const cached = await EarningsCache.get(key);
        if (cached) return cached;
      }

      if (isOffline) {
        const cached = await EarningsCache.get(key);
        if (cached) return cached;
        setError("No internet connection");
        return null;
      }

      try {
        const res = await fn();
        const data = res?.data;
        if (data) {
          await EarningsCache.set(key, data);
        }
        return data;
      } catch (e) {
        console.error("API ERROR:", e?.response?.status, e?.message);
        if (e?.response?.status === 401) {
          Alert.alert("Session expired", "Please login again.");
        } else {
          setError("Something went wrong. Please try again.");
        }

        const cached = await EarningsCache.get(key);
        if (cached) return cached;
        return null;
      }
    },
    [isOffline]
  );

  // BOOTSTRAP 
  useEffect(() => {
    bootstrap();
  }, []);

  function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return "th";

  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function formatPrettyDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });

  return `${month} ${day}${getOrdinalSuffix(day)}`;
}

  const bootstrap = async () => {
    Analytics.track("earnings_screen_open", { mode });
    setInitialLoading(true)

    if (mode === "TODAY") await loadToday(true);
    else if (mode === "WEEK") await loadCurrentWeek(true);
    else if (mode === "HISTORY") {
      const w = getWeekNumber(new Date());
      setSelectedWeek(w);
      await loadHistoryWeek(w, selectedYear, true);
    }
    setInitialLoading(false);
  };

  // LOADERS 
  const loadToday = async (force = false) => {
    setLoading(true);
    const data = await safeApiCached("today", () => EarningsNewAPI.getToday(), force);
    setLoading(false);

    if (data) {
      setDayData(data);
      setLedgerItems(data.items || []);
      setHasMore(false);
      setView("DAY");
    }
  };

  const loadCurrentWeek = async (force = false) => {
    setLoading(true);
    const data = await safeApiCached("currentWeek", () => EarningsNewAPI.getCurrentWeek(), force);
    setLoading(false);

    if (data) {
      setWeekData(data);
      setView("ROOT");
    }
  };

  const loadHistoryWeek = async (week, year, force = false) => {
    setLoading(true);
    const key = `week_${year}_${week}`;
    const data = await safeApiCached(key, () => EarningsNewAPI.getWeekByNumber(week, year), force);
    setLoading(false);

    if (data) {
      setWeekData(data);
      setView("ROOT");
      prefetchNextWeek(week, year);
    }
  };

  const loadDay = async (date, reset = true, force = false) => {
    const nextPage = reset ? 1 : page;

    if (reset) {
      setSelectedDay(date);
      setPage(1);
      setLedgerItems([]);
      setHasMore(true);
    } else if (!hasMore) {
      return;
    }
    setLoading(true);

    const key = `day_${date}_${nextPage}`;
    const data = await safeApiCached(
      key,
      () => EarningsNewAPI.getDailyByDate(date, nextPage),
      force
    );
    setLoading(false);

    if (data) {
      const items = data.items || [];
      setDayData(data);
      setLedgerItems(prev => (reset ? items : [...prev, ...items]));
      setHasMore(items.length >= 20);
      setPage(nextPage + 1);
      setView("DAY");

      if (reset) {
        setSelectedDay(date);
      }
      prefetchNextDay(date);
    }
  };

  const loadTransactionDetails = async (id) => {
    Analytics.track("earnings_open_transaction", { id });

    setLoading(true);
    const key = `transaction_${id}`;
    const data = await safeApiCached(key, () => EarningsNewAPI.getOrder(id));
    setLoading(false);

    if (data) {
      setOrderData(data);
      setView("ORDER");
    }
  };

  // PREFETCH 
  const prefetchNextWeek = async (week, year) => {
    const nextWeek = week + 1;
    if (nextWeek > 53) return;
    const key = `week_${year}_${nextWeek}`;
    const cached = await EarningsCache.get(key);
    if (cached) return;

    safeApiCached(key, () => EarningsNewAPI.getWeekByNumber(nextWeek, year));
  };

  const prefetchNextDay = async (dateStr) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 1);
    const next = d.toISOString().split("T")[0];

    const key = `day_${next}_1`;
    const cached = await EarningsCache.get(key);
    if (cached) return;

    safeApiCached(key, () => EarningsNewAPI.getDailyByDate(next, 1));
  };

  //REFRESH 
  const onRefresh = async () => {
    Analytics.track("earnings_refresh", { mode, view });
    setRefreshing(true);

    if (mode === "TODAY") await loadToday(true);
    else if (mode === "WEEK") await loadCurrentWeek(true);
    else if (mode === "HISTORY") await loadHistoryWeek(selectedWeek, selectedYear, true);

    setRefreshing(false);
  };

  // BACK 
  const onBack = () => {
    if (view === "ORDER") {
      setView("DAY");
      return;
    }
    if (view === "DAY") {
      if (cameFromToday) {
        navigation.goBack();
        return;
      }
      setView("ROOT");
      return;
    }
    navigation.goBack();
  };

  function getWeeksOfYear_BackendCompatible(year) {
  const weeks = [];

  // Find Jan 1
  const jan1 = new Date(year, 0, 1);

  // Find Monday of the week that contains Jan 1
  const day = jan1.getDay(); // 0=Sun,1=Mon,etc
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const firstWeekStart = new Date(jan1);
  firstWeekStart.setDate(jan1.getDate() + diffToMonday);

  let current = new Date(firstWeekStart);
  let week = 1;

  while (true) {
    const start = new Date(current);
    const end = new Date(current);
    end.setDate(end.getDate() + 6);

    // Stop if this week is completely after the year
    if (start.getFullYear() > year && end.getFullYear() > year) {
      break;
    }

    const today = new Date();
    const isFuture = start > today;

    weeks.push({
        week,
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
        startLabel: start.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        endLabel: end.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        isFuture,
      });
      current.setDate(current.getDate() + 7);
      week++;
    }
    return weeks;
  }

function getBackendWeekNumber(date) {
  const d = new Date(date);

  const year = d.getFullYear();
  const jan1 = new Date(year, 0, 1);

  // Find Monday of week containing Jan 1
  const day = jan1.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const firstWeekStart = new Date(jan1);
  firstWeekStart.setDate(jan1.getDate() + diffToMonday);

  const diffDays = Math.floor(
    (d.setHours(0,0,0,0) - firstWeekStart.setHours(0,0,0,0)) / 86400000
  );

  return Math.floor(diffDays / 7) + 1;
}


  // HEADER
  const headerTitle = useMemo(() => {
    const detail = orderData?.transaction || orderData;

    if (view === "ORDER") {
      if (detail?.type === "INCENTIVE") return "Incentive Details";
      if (detail?.type === "DELIVERY") return "Delivery Details";
      return "Transaction Details";
    }

    if (mode === "TODAY" && view === "DAY") {
      return "Today's Earnings";
    }

    if (view === "DAY") return "Daily Earnings";
    if (mode === "WEEK") return "Weekly Earnings";
    if (mode === "HISTORY") return "Earnings History";

    return "Earnings";
  }, [mode, view, orderData]);


  // UI RENDERERS 
  const renderHistorySelectors = () => (
    <View style={styles.selectorRow}>
      <Dropdown label={`Year: ${selectedYear}`} onPress={() => {
        Analytics.track("earnings_open_year_selector");
        setYearModal(true);
      }} />
      <Dropdown label={`Week: ${selectedWeek}`} onPress={() => {
        Analytics.track("earnings_open_week_selector");
        setWeekModal(true);
      }} />
      <Dropdown Dropdown label={selectedDay ? `Day: ${formatPrettyDate(selectedDay)}` : "Pick Day"} onPress={() => {
        Analytics.track("earnings_open_day_picker");
        setCalendarVisible(true);
      }} />
    </View>
  );

  const renderWeekRoot = () => {
    if (!weekData) return <EmptyState />;
    return (
      <FlatList
        data={weekData.days || []}
        keyExtractor={(item) => item.date}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <>
            {mode === "HISTORY" && renderHistorySelectors()}
            <TotalCard title="Total" amount={formatMoney(weekData.total) || 0} />
          </>
        }
        renderItem={({ item }) => (
          <Row
            title={`${item.day} (${formatPrettyDate(item.date)})`}
            subtitle={`${item.orders || 0} orders`}
            right={`₹${formatMoney(item.amount) || 0}`}
            onPress={() => {
              Analytics.track("earnings_select_day", { date: item.date });
              loadDay(item.date, true, true);
            }}
          />
        )}
      />
    );
  };


  const renderDay = () => (
    <FlatList
      data={ledgerItems}
      extraData={{ dayData, selectedDay, hasMore, page, loading}}
      keyExtractor={(item, idx) => (item.orderId || idx) + "_" + idx}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListHeaderComponent={
        <TotalCard title="Total Earnings" amount={formatMoney(dayData?.totalEarnings) || 0} />
      }
      ListEmptyComponent={<EmptyState />}
      onEndReached={() => loadDay(selectedDay, false)}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading && hasMore ? <ActivityIndicator style={{ margin: 20 }} /> : null
      }
      renderItem={({ item }) => (
        <Row
          title={item.type}
          subtitle={item.time ? new Date(item.time).toLocaleTimeString() : ""}
          right={`₹${formatMoney(item.amount) || 0}`}
          onPress={() => {
            if (item.type === "DELIVERY" && item.orderId) {
              loadTransactionDetails(item.orderId);
              return;
            }

            if (item.type === "INCENTIVE" && item.transactionId) {
              loadTransactionDetails(item.transactionId);
            }
          }}
        />
      )}
    />
  );


  const renderOrder = () => {
    if (!orderData) return <EmptyState />;

    const transaction = orderData.transaction || orderData;
    const isIncentive = transaction?.type === "INCENTIVE";
    const b = orderData.breakup || {};

    if (isIncentive) {
      return (
        <View style={{ padding: 16 }}>
          <TotalCard title="Incentive Amount" amount={formatMoney(transaction.amount) || 0} />
          <View style={styles.box}>
            <View style={{ flexDirection: "column", alignItems: "center", padding: 7 }}>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>Incentive</Text>
              <Text style={{ marginLeft: 8, color: "#777" }}>
                #{transaction.transactionId || ""}
              </Text>
            </View>

            <BreakRow label="Type" value={transaction.type} />
            <BreakRow label="Status" value={transaction.status} />
            <BreakRow label="Description" value={transaction.description} />
            <BreakRow
              label="Credited At"
              value={
                transaction.creditedAt
                  ? new Date(transaction.creditedAt).toLocaleString()
                  : "-"
              }
            />
          </View>
        </View>
      );
    }

    return (
      <View style={{ padding: 16 }}>
        <TotalCard title="Total Earnings" amount={formatMoney(orderData.totalEarnings) || 0} />
        <View style={styles.box}>
          <View style={{ flexDirection: "column", alignItems: "center", padding: 7 }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>{orderData.store || "Store"}</Text>
            <Text style={{ marginLeft: 8, color: "#777" }}>#{orderData.orderId || ""}</Text>
          </View>
          <BreakRow label="Base Fare" value={b.basePay} isAmount />
          <BreakRow label="Distance Fare" value={formatMoney(b.distancePay)} isAmount />
          <BreakRow label="Surge" value={b.surgePay} isAmount />
          <BreakRow label="Tips" value={b.tips} isAmount />
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (initialLoading) return null;

        if (error) return <ErrorBox text={error} onRetry={() => {
          Analytics.track("earnings_retry", { mode, view });
          bootstrap();
        }} />;

        if (view === "ORDER") return renderOrder();
        if (view === "DAY") return renderDay();
        return renderWeekRoot();
      };

  // UI 
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={isTablet ? 30 : 24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        {isOffline && <Text style={{ color: "red", marginLeft: 8 }}>Offline</Text>}
      </View>

      {renderContent()}

      {/* Year Modal */}
      <SelectModal
        visible={yearModal}
        title="Select Year"
        data={years}
        onClose={() => setYearModal(false)}
        onSelect={(y) => {
          Analytics.track("earnings_select_year", { year: y });
          setYearModal(false);
          setSelectedYear(y);
          loadHistoryWeek(selectedWeek, y, true);
        }}
      />

      {/* Week Modal */}
      <SelectModal
        visible={weekModal}
        title="Select Week"
        data={weeks}
        keyExtractor={(item) => String(item.week)}
        labelExtractor={(item) =>
          `Week ${item.week} (${item.startLabel} - ${item.endLabel})`
        }
        selectedValue={selectedWeek}
        isItemHighlighted={(item) => item.week === currentWeekNumber}
        onClose={() => setWeekModal(false)}
        onSelect={(item) => {
          Analytics.track("earnings_select_week", {
            week: item.week,
            year: selectedYear,
          });
          setSelectedWeek(item.week);
          loadHistoryWeek(item.week, selectedYear, true);
        }}
      />

      {/* Calendar */}
      <DateTimePickerModal
        isVisible={calendarVisible}
        mode="date"
        onConfirm={(date) => {
          setCalendarVisible(false);
          const d = date.toISOString().split("T")[0];
          Analytics.track("earnings_select_day", { date: d });
          setSelectedDay(d);
          loadDay(d, true, true);
        }}
        onCancel={() => setCalendarVisible(false)}
      />
    </SafeAreaView>
  );
}

// SMALL UI 
function Dropdown({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.dropdown} onPress={onPress}>
      <Text>{label}</Text>
      <Ionicons name="chevron-down" size={18} />
    </TouchableOpacity>
  );
}

function TotalCard({ title, amount}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{title}</Text>
      <Text style={styles.cardAmount}>₹{amount}</Text>
    </View>
  );
}

function Row({ title, subtitle, right, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.row}>
      <View>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
      </View>
      <Text style={styles.rowRight}>{right}</Text>
    </TouchableOpacity>
  );
}

function BreakRow({ label, value, isAmount = false }) {
  return (
    <View style={styles.breakRow}>
      <Text>{label}</Text>
      <Text style={{ color: "#0A9F5A", fontWeight: "700" }}>
        {isAmount ? `₹${value || 0}` : value || "-"}
      </Text>
    </View>
  );
}



function EmptyState() {
  return (
    <View style={{ padding: 40, alignItems: "center" }}>
      <Text style={{ color: "#777" }}>No data available</Text>
    </View>
  );
}

function ErrorBox({ text, onRetry }) {
  return (
    <View style={styles.errorBox}>
      <Text style={styles.errorText}>{text}</Text>
      <TouchableOpacity onPress={onRetry}>
        <Text style={{ color: "#007AFF", marginTop: 8 }}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

// UTILS 
function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: isTablet ? responsiveWidth(2.5) : 12,
    backgroundColor: "#FFF",
  },

  backBtn: {
    padding: isTablet ? responsiveWidth(1) : 8,
  },

  headerTitle: {
    fontSize: isTablet
      ? responsiveFontSize(1.9)
      : 24,

    fontWeight: "700",
    marginLeft: 8,
  },

  card: {
    margin: 16,
    padding: isTablet ? responsiveWidth(2.5) : 20,
    borderRadius: 12,
    backgroundColor: "#9c50ff",
  },

  cardLabel: {
    color: "#fff",

    fontSize: isTablet
      ? responsiveFontSize(1.2)
      : responsiveFontSize(1.5),
  },

  cardAmount: {
    fontSize: isTablet
      ? responsiveFontSize(2.2)
      : 28,

    fontWeight: "800",
    color: "#fff",
  },

  row: {
    padding: isTablet ? responsiveWidth(2.2) : 16,

    borderWidth: 2,
    marginHorizontal: 16,
    marginBottom: 8,

    flexDirection: "row",
    justifyContent: "space-between",

    borderRadius: 10,
    borderColor: "#e5b6fd",
  },

  rowTitle: {
    fontSize: isTablet
      ? responsiveFontSize(1.25)
      : 15,

    fontWeight: "600",
  },

  rowSub: {
    fontSize: isTablet
      ? responsiveFontSize(1)
      : 12,

    color: "#777",
    marginTop: 4,
  },

  rowRight: {
    fontSize: isTablet
      ? responsiveFontSize(1.25)
      : 15,

    fontWeight: "700",
    color: "#24c77b",
  },

  breakRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: isTablet ? responsiveWidth(2.2) : 16,
  },

  box: {
    backgroundColor: "#fff",
    borderColor: "#e5b6fd",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 16,
    overflow: "hidden",
  },

  selectorRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: isTablet ? responsiveWidth(1.5) : 8,
  },

  dropdown: {
    flexDirection: "row",
    alignItems: "center",

    paddingVertical: isTablet
      ? responsiveHeight(0.9)
      : 8,

    paddingHorizontal: isTablet
      ? responsiveWidth(1.5)
      : 8,

    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ddd",
  },

  errorBox: {
    margin: 16,
    padding: 16,
    backgroundColor: "#FFECEC",
    borderRadius: 10,
    alignItems: "center",
  },

  errorText: {
    color: "#C00",

    fontSize: isTablet
      ? responsiveFontSize(1.1)
      : 14,
  },
});