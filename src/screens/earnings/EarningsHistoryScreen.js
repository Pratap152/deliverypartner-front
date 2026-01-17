import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { EarningsAPI } from '../../api/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getShortMonthKey, getWeekdayName } from '../../utils/helpers';

export default function EarningsHistoryScreen({ navigation }) {
  const [level, setLevel] = useState('MONTH');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [monthData, setMonthData] = useState(null);
  const [weekData, setWeekData] = useState(null);
  const [dayData, setDayData] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  const currentMonthKey = useMemo(() => getShortMonthKey(new Date()), []);

  useEffect(() => {
    loadMonthSafe();
  }, []);

  const safeApi = async fn => {
    try {
      setError(null);
      setLoading(true);
      const res = await fn();
      return res;
    } catch (e) {
      console.error('API ERROR:', e?.response?.status, e?.message);
      setError('Something went wrong. Please try again.');
      if (e?.response?.status === 401) {
        Alert.alert('Session expired', 'Please login again.');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadMonthSafe = useCallback(async () => {
    const res = await safeApi(() => EarningsAPI.getMonthly(currentMonthKey));
    if (res) setMonthData(res);
  }, [currentMonthKey]);

  const loadWeekSafe = useCallback(async (from, to) => {
    const res = await safeApi(() => EarningsAPI.getWeekly(from, to));
    if (res) setWeekData(res);
  }, []);

  const loadDaySafe = useCallback(async date => {
    const res = await safeApi(() => EarningsAPI.getDaily(date));
    if (res) setDayData(res);
  }, []);

  const loadOrderSafe = useCallback(async orderId => {
    const res = await safeApi(() => EarningsAPI.getOrderBreakdown(orderId));
    if (res) {
      setOrderDetails(res);
      setLevel('ORDER');
    }
  }, []);

  const onBack = useCallback(() => {
    if (level === 'ORDER') {
      setLevel('DAY');
      setOrderDetails(null);
    } else if (level === 'DAY') {
      setLevel('WEEK');
      setDayData(null);
    } else if (level === 'WEEK') {
      setLevel('MONTH');
      setWeekData(null);
    } else {
      navigation?.goBack?.();
    }
  }, [level, navigation]);

  const headerTitle = useMemo(() => {
    if (level === 'MONTH') {
      return new Date().toLocaleString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    }
    if (level === 'WEEK') return 'Weekly Earnings';
    if (level === 'DAY') return 'Daily Earnings';
    if (level === 'ORDER') return 'Delivery';
  }, [level]);

  const cardTotal = useMemo(() => {
    if (level === 'MONTH') return monthData?.totalEarnings ?? 0;
    if (level === 'WEEK') return weekData?.totalEarnings ?? 0;
    if (level === 'DAY')
      return (
        dayData?.orders?.reduce((s, o) => s + (o?.earnings?.total || 0), 0) ?? 0
      );
    if (level === 'ORDER') return orderDetails?.earnings?.total ?? 0;
    return 0;
  }, [level, monthData, weekData, dayData, orderDetails]);

  const renderMonth = () => (
    <FlatList
      data={monthData?.weeks || []}
      keyExtractor={(item, index) => item.from + index}
      refreshing={refreshing}
      onRefresh={loadMonthSafe}
      ListEmptyComponent={<EmptyState />}
      renderItem={({ item }) => {
        const total =
          item?.orders?.reduce((s, o) => s + (o?.earnings?.total || 0), 0) ?? 0;
        return (
          <Row
            title={`${item.from} → ${item.to}`}
            right={`₹${total}`}
            onPress={() => {
              loadWeekSafe(item.from, item.to);
              setLevel('WEEK');
            }}
          />
        );
      }}
    />
  );

  const renderWeek = () => (
    <FlatList
      data={weekData?.days || []}
      keyExtractor={item => item.date}
      ListEmptyComponent={<EmptyState />}
      renderItem={({ item }) => {
        const total =
          item?.orders?.reduce((s, o) => s + (o?.earnings?.total || 0), 0) ?? 0;
        return (
          <Row
            title={getWeekdayName(item.date)}
            right={`₹${total}`}
            onPress={() => {
              loadDaySafe(item.date);
              setLevel('DAY');
            }}
          />
        );
      }}
    />
  );

  const renderDay = () => (
    <FlatList
      data={dayData?.orders || []}
      keyExtractor={item => item.orderId}
      ListEmptyComponent={<EmptyState />}
      renderItem={({ item }) => (
        <Row
          title={item.orderId}
          subtitle={new Date(item.completedAt).toLocaleTimeString()}
          right={`₹${item?.earnings?.total || 0}`}
          onPress={() => loadOrderSafe(item.orderId)}
        />
      )}
    />
  );

  const renderOrder = () => {
    const e = orderDetails?.earnings;
    if (!e) return <EmptyState />;

    return (
      <View style={{ padding: 16 }}>
        <View style={[styles.card, { backgroundColor: '#9c50ff' }]}>
          <Text style={{ color: '#E9FFF3' }}>Total Earnings</Text>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#E9FFF3' }}>
            ₹{e.total}
          </Text>
        </View>

        <View
          style={{ marginTop: 16, backgroundColor: '#fff', borderRadius: 8 }}
        >
          <BreakdownRow label="Base Pay" value={e.basePay} />
          <BreakdownRow label="Distance Pay" value={e.distancePay} />
          <BreakdownRow label="Surge Pay" value={e.surgePay} />
          <BreakdownRow label="Tips" value={e.tips} />
          <Divider />
          <BreakdownRow label="Total" value={e.total} bold />
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (level === 'MONTH') return renderMonth();
    if (level === 'WEEK') return renderWeek();
    if (level === 'DAY') return renderDay();
    if (level === 'ORDER') return renderOrder();
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
      </View>

      {level !== 'ORDER' && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Earnings</Text>
          <Text style={styles.cardAmount}>₹{cardTotal}</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        renderContent()
      )}
    </SafeAreaView>
  );
}

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

function BreakdownRow({ label, value, bold }) {
  return (
    <View style={styles.breakRow}>
      <Text style={{ fontWeight: bold ? '700' : '500' }}>{label}</Text>
      <Text style={{ fontWeight: bold ? '800' : '600', color: '#0A9F5A' }}>
        ₹{value ?? 0}
      </Text>
    </View>
  );
}

function Divider() {
  return (
    <View style={{ height: 1, backgroundColor: '#eee', marginVertical: 8 }} />
  );
}

function EmptyState() {
  return (
    <View style={{ padding: 40, alignItems: 'center' }}>
      <Text style={{ color: '#777' }}>No data available</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF',
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', marginLeft: 8 },

  card: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#9c50ff',
  },
  cardLabel: { color: '#fff' },
  cardAmount: { fontSize: 28, fontWeight: '800', color: '#fff' },

  row: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowTitle: { fontSize: 15, fontWeight: '600' },
  rowSub: { fontSize: 12, color: '#777', marginTop: 4 },
  rowRight: { fontSize: 15, fontWeight: '700', color: '#24c77b' },

  breakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },

  errorBox: {
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: '#FFECEC',
    borderRadius: 8,
  },
  errorText: { color: '#C00' },
});
