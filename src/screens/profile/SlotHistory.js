import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import apiClient from '../../services/ApiClient';

const PAGE_SIZE = 10;
const CACHE_KEY = 'SLOT_HISTORY_CACHE';

/* ================= MEMORY CACHE ================= */
let memoryCache = null;

const SlotHistory = ({ navigation }) => {
  const [slots, setSlots] = useState([]);
  const [summary, setSummary] = useState({
    totalSlots: 0,
    totalEarnings: 0,
  });
  const [activeFilter, setActiveFilter] = useState('all');

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [initialRendered, setInitialRendered] = useState(false);

  /* ================= LOAD CACHE FIRST ================= */

  useEffect(() => {
    const loadCache = async () => {
      try {
        // 1️⃣ memory cache (fastest)
        if (memoryCache) {
          setSlots(memoryCache.slots);
          setSummary(memoryCache.summary);
          setInitialRendered(true);
          return;
        }

        // 2️⃣ AsyncStorage cache
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          memoryCache = parsed;
          setSlots(parsed.slots || []);
          setSummary(parsed.summary || { totalSlots: 0, totalEarnings: 0 });
        }
      } catch (e) {
        // ignore cache errors safely
      } finally {
        setInitialRendered(true);
      }
    };

    loadCache();
  }, []);

  /* ================= FETCH API ================= */

  const fetchSlotHistory = useCallback(
    async (filterType, pageNo = 1) => {
      // ❗ allow filter reset even if loading
      if (listLoading && pageNo !== 1) return;

      try {
        setListLoading(true);

        const res = await apiClient.get('/api/profile/slots/history', {
          params: {
            filter: filterType === 'all' ? undefined : filterType,
            page: pageNo,
            limit: PAGE_SIZE,
          },
        });

        if (res.data?.success) {
          const newData = res.data.data || [];

          // ✅ FIX: derive from previous state
          setSlots(prevSlots =>
            pageNo === 1 ? newData : [...prevSlots, ...newData],
          );

          const updatedSummary = {
            totalSlots: Number(res.data.totalSlots ?? 0),
            totalEarnings: Number(res.data.totalEarnings ?? 0),
          };

          setSummary(updatedSummary);
          setHasMore(newData.length === PAGE_SIZE);
          setPage(pageNo);

          // ✅ cache update (safe)
          const cachePayload = {
            slots: pageNo === 1 ? newData : [...slots, ...newData],
            summary: updatedSummary,
          };

          memoryCache = cachePayload;
          AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));
        }
      } catch (e) {
        console.log('Slot history error:', e?.response?.data || e.message);
        Alert.alert('Error', 'Unable to fetch the data');
      } finally {
        setListLoading(false);
      }
    },
    [listLoading],
  );
  /* ================= INITIAL FETCH ================= */

  useEffect(() => {
    fetchSlotHistory(activeFilter, 1);
  }, []);

  /* ================= GROUP DATA (UNCHANGED LOGIC) ================= */

  const groupedSlots = useMemo(() => {
    return slots.reduce((acc, slot) => {
      if (!acc[slot.date]) acc[slot.date] = [];
      acc[slot.date].push(slot);
      return acc;
    }, {});
  }, [slots]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedSlots).sort((a, b) => new Date(b) - new Date(a));
  }, [groupedSlots]);

  const flatData = useMemo(() => {
    if (!sortedDates.length) return [];

    return sortedDates.flatMap(date => [
      { type: 'header', id: `h-${date}`, date },
      ...groupedSlots[date].map(slot => ({
        ...slot,
        id: slot.slotBookingId,
        type: 'slot',
      })),
    ]);
  }, [sortedDates, groupedSlots]);

  /* ================= SKELETON DATA ================= */

  const skeletonData = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        id: `skeleton-${i}`,
        type: 'skeleton',
      })),
    [],
  );

  /* ================= HELPERS (UNCHANGED) ================= */

  const formatDateMMDDYYYY = date => {
    const d = new Date(date);
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(
      d.getDate(),
    ).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const isToday = date => {
    const t = new Date();
    const d = new Date(date);
    return (
      t.getDate() === d.getDate() &&
      t.getMonth() === d.getMonth() &&
      t.getFullYear() === d.getFullYear()
    );
  };

  const isYesterday = date => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const d = new Date(date);
    return (
      y.getDate() === d.getDate() &&
      y.getMonth() === d.getMonth() &&
      y.getFullYear() === d.getFullYear()
    );
  };

  const getLeftLabel = date => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
    });
  };

  /* ================= STATUS CONFIG ================= */

  const STATUS_CONFIG = {
    COMPLETED: {
      label: 'Completed',
      bgColor: '#DCFCE7',
      textColor: '#008236',
      icon: 'checkmark-circle',
    },
    ACTIVE: {
      label: 'Active',
      bgColor: '#DBEAFE',
      textColor: '#1447E6',
      icon: 'time-outline',
    },
    CANCELLED: {
      label: 'Cancelled',
      bgColor: '#FFE2E2',
      textColor: '#C10007',
      icon: 'close-circle',
    },
    MISSED: {
      label: 'Missed',
      bgColor: '#FFEDD4',
      textColor: '#CA3500',
      icon: 'alert-circle',
    },
  };

  /* ================= RENDER ITEM ================= */

  const renderItem = ({ item }) => {
    if (item.type === 'skeleton') {
      return <View style={styles.slotCard} />;
    }

    if (item.type === 'header') {
      return (
        <View style={styles.dateRow}>
          <Text style={styles.todayText}>{getLeftLabel(item.date)}</Text>
          <Text style={styles.dateHeaderRight}>
            {formatDateMMDDYYYY(item.date)}
          </Text>
        </View>
      );
    }

    const status = STATUS_CONFIG[item.slotStatus] || STATUS_CONFIG.ACTIVE;

    return (
      <View style={styles.slotCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.timeText}>
            {item.startTime} - {item.endTime}
          </Text>

          <View
            style={[styles.statusBadge, { backgroundColor: status.bgColor }]}
          >
            <Ionicons
              name={status.icon}
              size={rf(1.6)}
              color={status.textColor}
              style={{ marginRight: rw(1) }}
            />
            <Text style={[styles.statusText, { color: status.textColor }]}>
              {status.label}
            </Text>
          </View>
        </View>

        <View style={[styles.rowBetween, { marginTop: rh(0.6) }]}>
          <Text style={styles.subText}>Orders: {item.totalOrders}</Text>
          <Text style={styles.earningText}>Earnings: ₹{item.slotEarnings}</Text>
        </View>
      </View>
    );
  };

  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={rf(2.6)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Slot History</Text>
        <TouchableOpacity>
          <Image
            source={require('../../assets/profile/HelpcenterIcon.png')}
            style={styles.robotIcon}
          />
        </TouchableOpacity>
      </View>

      {/* BANNER (FILTERS + SUMMARY) */}
      <View style={{ padding: rw(4) }}>
        <View style={styles.filterRow}>
          {[
            { label: 'All', value: 'all' },
            { label: 'Today', value: 'daily' },
            { label: 'Week', value: 'weekly' },
            { label: 'Month', value: 'monthly' },
          ].map(item => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.filterTab,
                activeFilter === item.value && styles.activeFilterTab,
              ]}
              onPress={() => {
                setActiveFilter(item.value);
                setPage(1);
                setHasMore(true);
                fetchSlotHistory(item.value, 1);
              }}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === item.value && styles.activeFilterText,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryBox, styles.green]}>
            <Image
              source={require('../../assets/profile/SSlots.png')}
              style={styles.summaryIcon}
            />
            <Text style={styles.summaryValue}>{summary.totalSlots}</Text>
            <Text style={styles.summaryLabel}>Slots Completed</Text>
          </View>

          <View style={[styles.summaryBox, styles.orange]}>
            <Image
              source={require('../../assets/profile/SEarnings.png')}
              style={styles.summaryIcon}
            />
            <Text style={styles.summaryValue}>₹{summary.totalEarnings}</Text>
            <Text style={styles.summaryLabel}>Total Earnings</Text>
          </View>
        </View>
      </View>

      {/* LIST */}
      <FlatList
        data={
          !initialRendered
            ? skeletonData
            : flatData.length
            ? flatData
            : skeletonData
        }
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: rw(4) }}
        onEndReached={() => {
          if (hasMore && !listLoading) {
            fetchSlotHistory(activeFilter, page + 1);
          }
        }}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          listLoading && (
            <ActivityIndicator size="small" style={{ marginVertical: rh(2) }} />
          )
        }
      />
    </View>
  );
};

export default SlotHistory;

/* ================= STYLES (UNCHANGED FROM ORIGINAL) ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },

  header: {
    height: rh(8),
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rw(4),
    elevation: 2,
  },

  headerTitle: { fontSize: rf(2.3), fontWeight: '600' },

  robotIcon: {
    width: rw(12),
    height: rw(11),
    resizeMode: 'contain',
  },

  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F3F5',
    borderRadius: 20,
    padding: 4,
    marginBottom: rh(2),
  },

  filterTab: {
    flex: 1,
    paddingVertical: rh(0.8),
    borderRadius: 16,
    alignItems: 'center',
  },

  activeFilterTab: { backgroundColor: '#12B5CB' },

  filterText: {
    fontSize: rf(1.6),
    color: '#444',
    fontWeight: '500',
  },

  activeFilterText: { color: '#fff', fontWeight: '600' },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: rh(2),
  },

  summaryBox: {
    width: '48%',
    borderRadius: 10,
    padding: rw(4),
  },

  green: { backgroundColor: '#00A63E' },
  orange: { backgroundColor: '#F54900' },

  summaryIcon: { resizeMode: 'contain' },

  summaryValue: {
    color: '#FFFFFF',
    fontSize: rf(2.6),
    fontWeight: 'bold',
    marginTop: rh(0.5),
  },

  summaryLabel: {
    color: '#FFFFFF',
    marginTop: rh(0.5),
    fontSize: rf(1.6),
  },

  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: rh(1),
  },

  todayText: {
    fontSize: rf(1.8),
    fontWeight: '600',
    color: '#12B5CB',
  },

  dateHeaderRight: {
    fontSize: rf(1.6),
    color: '#555',
    fontWeight: '500',
  },

  slotCard: {
    backgroundColor: '#fff',
    padding: rw(4),
    borderRadius: 8,
    marginBottom: rh(1),
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  timeText: { fontSize: rf(1.8), fontWeight: '600' },

  subText: { fontSize: rf(1.6), color: '#555' },

  earningText: {
    fontSize: rf(1.6),
    color: '#4A5565',
    fontWeight: '600',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rw(2.5),
    paddingVertical: rh(0.4),
    borderRadius: 14,
  },

  statusText: { fontSize: rf(1.4), fontWeight: '600' },
});
