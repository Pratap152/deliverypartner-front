import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { EarningsAPI } from "../../api/api";
import { SafeAreaView } from "react-native-safe-area-context";  
import { getShortMonthKey , getWeekdayName } from "../../utils/helpers";

export default function EarningsScreen() {
  const [level, setLevel] = useState("MONTH"); // MONTH | WEEK | DAY
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [summary, setSummary] = useState(null);

  const [monthData, setMonthData] = useState(null);
  const [weekData, setWeekData] = useState(null);
  const [dayData, setDayData] = useState(null);

  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  // 🧠 current month short key: jan / feb / mar ...
  const currentMonthKey = getShortMonthKey(new Date());

  useEffect(() => {
    loadSummary();
    loadMonth(currentMonthKey);
  }, []);

  async function onRefresh() {
    setRefreshing(true);
    await loadSummary();
    await loadMonth(currentMonthKey);
    setRefreshing(false);
  }

  async function loadSummary() {
    const res = await EarningsAPI.getSummary();
    setSummary(res);
  }

  async function loadMonth(monthKey) {
    try {
      setLoading(true);
      console.log("LOADING MONTH (SHORT):", monthKey); // jan / feb / mar
      const res = await EarningsAPI.getMonthly(monthKey);
      setMonthData(res);
    } catch (e) {
      console.error("MONTH API FAILED:", e?.response?.status, e?.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadWeek(from, to) {
    try {
      setLoading(true);
      const res = await EarningsAPI.getWeekly(from, to);
      setWeekData(res);
    } finally {
      setLoading(false);
    }
  }

  async function loadDay(date) {
    try {
      setLoading(true);
      const res = await EarningsAPI.getDaily(date);
      setDayData(res);
    } finally {
      setLoading(false);
    }
  }

  function onBack() {
    if (level === "DAY") {
      setLevel("WEEK");
      setDayData(null);
    } else if (level === "WEEK") {
      setLevel("MONTH");
      setWeekData(null);
    }
  }

  function getHeaderTitle() {
    if (level === "MONTH") {
      const label = new Date().toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });
      return label; // Jan 2026
    }
    if (level === "WEEK") return "Weekly Earnings";
    if (level === "DAY") return "Daily Earnings";
  }

  function getCardTotal() {
    if (level === "MONTH") return monthData?.totalEarnings ?? 0;
    if (level === "WEEK") return weekData?.totalEarnings ?? 0;
    if (level === "DAY")
      return dayData?.orders?.reduce((s, o) => s + o.earnings.total, 0) ?? 0;
  }

  /**
   * ---------------- RENDERS ----------------
   */

  function renderMonth() {
    return (
      <FlatList
        data={monthData?.weeks || []}
        keyExtractor={(item, index) => item.from + index}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => {
          const total = item.orders.reduce(
            (s, o) => s + o.earnings.total,
            0
          );
          return (
            <Row
              title={`${item.from} → ${item.to}`}
              right={`₹${total}`}
              onPress={() => {
                setSelectedWeek(item);
                loadWeek(item.from, item.to);
                setLevel("WEEK");
              }}
            />
          );
        }}
      />
    );
  }

  function renderWeek() {
  return (
    <FlatList
      data={weekData?.days || []}
      keyExtractor={(item) => item.date}
      renderItem={({ item }) => {
        const total = item.orders.reduce(
          (s, o) => s + o.earnings.total,
          0
        );
        return (
          <Row
            title={getWeekdayName(item.date)}   // 👈 Monday, Tuesday, etc
            right={`₹${total}`}
            onPress={() => {
              setSelectedDay(item);
              loadDay(item.date); // still send date to API
              setLevel("DAY");
            }}
          />
        );
      }}
    />
  );
}


  function renderDay() {
    return (
      <FlatList
        data={dayData?.orders || []}
        keyExtractor={(item) => item.orderId}
        renderItem={({ item }) => (
          <Row
            title={item.orderId}
            subtitle={new Date(item.completedAt).toLocaleTimeString()}
            right={`₹${item.earnings.total}`}
            onPress={async () => {
              const breakdown = await EarningsAPI.getOrderBreakdown(
                item.orderId
              );
              console.log("ORDER BREAKDOWN:", breakdown);
              alert(JSON.stringify(breakdown.earnings, null, 2));
            }}
          />
        )}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {level !== "MONTH" && (
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Total Earnings</Text>
        <Text style={styles.cardAmount}>₹{getCardTotal()}</Text>
      </View>

      {/* Body */}
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <>
          {level === "MONTH" && renderMonth()}
          {level === "WEEK" && renderWeek()}
          {level === "DAY" && renderDay()}
        </>
      )}
    </SafeAreaView>
  );
}

/**
 * ---------------- ROW ----------------
 */
function Row({ title, subtitle, right, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.row}>
      <View>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle && <Text style={styles.rowSub}>{subtitle}</Text>}
      </View>
      <Text style={styles.rowRight}>{right}</Text>
    </TouchableOpacity>
  );
}

/**
 * ---------------- STYLES ----------------
 */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
  },
  back: { fontSize: 22, marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: "700" },

  card: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#9c50ff",
  },
  cardLabel: { color: "#fdfafa" },
  cardAmount: { fontSize: 28, fontWeight: "800", color: "#fdfffe" },

  row: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowTitle: { fontSize: 15, fontWeight: "600" },
  rowSub: { fontSize: 12, color: "#777", marginTop: 4 },
  rowRight: { fontSize: 15, fontWeight: "700", color: "#0A9F5A" },
});
