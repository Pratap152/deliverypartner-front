import React, { useEffect, useState, useMemo } from 'react';
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
import axios from 'axios';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WEBSITE_URL from '../../utils/host';
import { tokenService } from '../../services/TokenService';

const PAGE_SIZE = 10;

const SlotHistory = ({ navigation }) => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [slots, setSlots] = useState([]);
  const [summary, setSummary] = useState({
    totalSlots: 0,
    totalEarnings: 0,
  });
  const [activeFilter, setActiveFilter] = useState('all');

  // 🔥 Pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchSlotHistory('all', 1, true);
  }, []);

  /* ---------------- FETCH API ---------------- */

  const fetchSlotHistory = async (
    filterType,
    pageNo = 1,
    firstLoad = false,
  ) => {
    if (listLoading) return;

    try {
      const token = await tokenService.getAccessToken();
      if (!token) {
        Alert.alert('Session expired', 'Please login again');
        return;
      }

      if (firstLoad) {
        setInitialLoading(true);
      } else {
        setListLoading(true);
      }

      const res = await axios.get(`${WEBSITE_URL}/api/profile/slots/history`, {
        params: {
          filter: filterType === 'all' ? undefined : filterType,
          page: pageNo,
          limit: PAGE_SIZE,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        const newData = res.data.data || [];

        // ⚡ Optimistic UI + Pagination merge
        setSlots(prev => (pageNo === 1 ? newData : [...prev, ...newData]));

        setSummary({
          totalSlots: Number(res.data.totalSlots ?? 0),
          totalEarnings: Number(res.data.totalEarnings ?? 0),
        });

        setHasMore(newData.length === PAGE_SIZE);
        setPage(pageNo);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch slot history');
    } finally {
      setInitialLoading(false);
      setListLoading(false);
    }
  };

  /* ---------------- GROUP DATA ---------------- */

  const groupedSlots = useMemo(() => {
    return slots.reduce((acc, slot) => {
      const dateKey = slot.date;
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(slot);
      return acc;
    }, {});
  }, [slots]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedSlots).sort((a, b) => new Date(b) - new Date(a));
  }, [groupedSlots]);

  const flatData = useMemo(() => {
    return sortedDates.flatMap(date => [
      { type: 'header', date },
      ...groupedSlots[date].map(slot => ({
        type: 'slot',
        ...slot,
      })),
    ]);
  }, [sortedDates, groupedSlots]);

  /* ---------------- HELPERS ---------------- */

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

  /* ---------------- STATUS ---------------- */

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

  const renderSlot = slot => {
    const status = STATUS_CONFIG[slot.slotStatus] || STATUS_CONFIG.ACTIVE;

    return (
      <View style={styles.slotCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.timeText}>
            {slot.startTime} - {slot.endTime}
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
          <Text style={styles.subText}>Orders: {slot.totalOrders}</Text>
          <Text style={styles.earningText}>Earnings: ₹{slot.slotEarnings}</Text>
        </View>
      </View>
    );
  };

  /* ---------------- INITIAL LOADER ---------------- */

  if (initialLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0DBE61" />
      </View>
    );
  }

  const EmptySlots = () => (
    <View style={{ alignItems: 'center', marginTop: rh(8) }}>
      <Text style={styles.emptyText}>No slots available</Text>
    </View>
  );

  /* ---------------- UI ---------------- */

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

      {/* FILTERS + SUMMARY (UNCHANGED UI) */}
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
                setActiveFilter(item.value); // ⚡ Optimistic UI
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
        data={flatData}
        keyExtractor={(item, index) =>
          item.type === 'header' ? `header-${item.date}` : item.slotBookingId
        }
        renderItem={({ item }) =>
          item.type === 'header' ? (
            <View style={styles.dateRow}>
              <Text style={styles.todayText}>{getLeftLabel(item.date)}</Text>
              <Text style={styles.dateHeaderRight}>
                {formatDateMMDDYYYY(item.date)}
              </Text>
            </View>
          ) : (
            renderSlot(item)
          )
        }
        ListEmptyComponent={!initialLoading && <EmptySlots />}
        refreshing={listLoading}
        onRefresh={() => {
          setPage(1);
          setHasMore(true);
          fetchSlotHistory(activeFilter, 1);
        }}
        onEndReached={() => {
          if (hasMore && !listLoading) {
            fetchSlotHistory(activeFilter, page + 1);
          }
        }}
        onEndReachedThreshold={0.3}
        contentContainerStyle={{ padding: rw(4) }}

        // ListFooterComponent={
        //   listLoading && hasMore ? (
        //     <ActivityIndicator
        //       size="small"
        //       color="#12B5CB"
        //       style={{ marginVertical: rh(2) }}
        //     />
        //   ) : null
        // }
      />
    </View>
  );
};

export default SlotHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    height: rh(8),
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rw(4),
    elevation: 2,
  },

  headerTitle: {
    fontSize: rf(2.3),
    fontWeight: '600',
  },

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

  activeFilterTab: {
    backgroundColor: '#12B5CB',
  },

  filterText: {
    fontSize: rf(1.6),
    color: '#444',
    fontWeight: '500',
  },

  activeFilterText: {
    color: '#fff',
    fontWeight: '600',
  },

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

  summaryIcon: {
    color: '#FFFFFF',
  },

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

  dateHeader: {
    marginVertical: rh(1),
    fontSize: rf(1.8),
    fontWeight: '600',
    color: '#555',
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

  timeText: {
    fontSize: rf(1.8),
    fontWeight: '600',
  },

  subText: {
    fontSize: rf(1.6),
    color: '#555',
  },

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

  statusText: {
    fontSize: rf(1.4),
    fontWeight: '600',
    color: '#0DBE61',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: rh(5),
    fontSize: rf(1.8),
    color: '#777',
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
});
