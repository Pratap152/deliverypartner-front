import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

import { useOrderHistory } from '../../hooks/useOrderHistory';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Week', value: 'weekly' },
  { label: 'Month', value: 'monthly' },
];

const OrderHistory = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('weekly');

  // ⭐ Loader state ONLY for filter change
  const [filterLoading, setFilterLoading] = useState(false);

  const {
    orders,
    summary,
    loading,
    loadingMore,
    refreshing,
    loadMore,
    onRefresh,
  } = useOrderHistory(selectedFilter);

  /* ========= FILTER CHANGE ========= */
  const changeFilter = useCallback((value) => {
    if (value === selectedFilter) return;

    setFilterLoading(true);   // Show loader immediately
    setSelectedFilter(value);
  }, [selectedFilter]);

  /* ========= STOP LOADER WHEN DATA ARRIVES ========= */
  useEffect(() => {
    if (!loading) {
      setFilterLoading(false);
    }
  }, [loading]);

  /* ========= RENDER ITEM ========= */
  const renderOrder = useCallback(({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.rowBetween}>
        <Text style={styles.restaurant}>{item.restaurantName}</Text>
        <Text style={styles.earning}>₹{item.earning}</Text>
      </View>

      <Text style={styles.orderId}>{item.orderId}</Text>

      <Text style={styles.metaText}>
        {item.customerName} → {item.area}
      </Text>

      <View style={styles.rowBetween}>
        <View style={styles.row}>
          <Text style={styles.metaSmall}>{item.distance} km</Text>
          <View style={styles.starRow}>
            <Ionicons name="star" size={14} color="#F5A623" />
            <Text style={styles.metaSmall}>{item.rating}</Text>
          </View>
        </View>

        <Text style={styles.metaSmall}>{item.time}</Text>
      </View>

      {item.tip ? (
        <View style={styles.tipRow}>
          <Text style={styles.tipLabel}>Customer Tip</Text>
          <Text style={styles.tipValue}>+₹{item.tip}</Text>
        </View>
      ) : null}
    </View>
  ), []);

  const handleEndReached = () => {
    if (!loadingMore && !refreshing && orders.length > 0) {
      loadMore();
    }
  };

  /* ========= EMPTY STATE ========= */
  const EmptyComponent = () => (
    <View style={styles.empty}>
      <Text>No Orders Found</Text>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Order History</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* FILTERS */}
      <View style={styles.filterRow}>
        {FILTERS.map(item => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.filterChip,
              selectedFilter === item.value && styles.filterChipActive,
            ]}
            onPress={() => changeFilter(item.value)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === item.value && styles.filterTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* SUMMARY */}
      <View style={styles.summaryGrid}>
        <SummaryCard label="Total Orders" value={summary.totalOrders} bgColor="#DCFCE7" textColor="#166534"/>
        <SummaryCard label="Total Earnings" value={`₹${summary.totalEarnings}`} bgColor="#FFE4D5" textColor="#9A3412"/>
        <SummaryCard label="Average Rating" value={summary.rating} bgColor="#FEF3C7" textColor="#92400E"/>
        <SummaryCard label="KM Traveled" value={summary.km} bgColor="#DBEAFE" textColor="#1E40AF"/>
      </View>

      {/* ⭐ FILTER LOADER */}
   <FlatList
  data={orders}
  keyExtractor={item => item.orderId}
  renderItem={renderOrder}
  refreshing={refreshing}
  onRefresh={onRefresh}
  onEndReached={handleEndReached}
  onEndReachedThreshold={0.4}
  showsVerticalScrollIndicator={false}
  ListEmptyComponent={!loading ? EmptyComponent : null}
  ListFooterComponent={
    loadingMore ? (
      <ActivityIndicator style={{ marginVertical: 20 }} />
    ) : null
  }
/>

{filterLoading && (
  <View
    style={{
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(255,255,255,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
    }}
  >
    <ActivityIndicator size="large" />
  </View>
)}


    </View>
  );
};

/* ========= SUMMARY CARD ========= */

const SummaryCard = ({ label, value, bgColor, textColor }) => (
  <View style={[styles.summaryCard, { backgroundColor: bgColor }]}>
    <Text style={[styles.summaryValue, { color: textColor }]}>{value}</Text>
    <Text style={[styles.summaryLabel, { color: textColor }]}>{label}</Text>
  </View>
);

export default OrderHistory;




/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: rw(4),
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: rh(2),
  },

  headerTitle: {
    fontSize: rf(2.4),
    fontWeight: '600',
  },

  /* FILTERS */
  filterRow: {
    flexDirection: 'row',
    marginBottom: rh(2),
  },

  filterChip: {
    paddingHorizontal: rw(4),
    paddingVertical: rh(0.8),
    borderRadius: 20,
    backgroundColor: '#F1F3F5',
    marginRight: rw(2),
  },

  filterChipActive: {
    backgroundColor: '#19A7CE',
  },

  filterText: {
    fontSize: rf(1.6),
    color: '#555',
  },

  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

  /* SUMMARY */
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: rh(2),
  },

  summaryCard: {
    width: '48%',
    borderRadius: 10,
    padding: rw(4),
    marginBottom: rh(1.5),
  },

  summaryValue: {
    fontSize: rf(2.6),
    fontWeight: 'bold',
  },

  summaryLabel: {
    fontSize: rf(1.6),
    marginTop: rh(0.5),
  },

  /* ORDER CARD */
  orderCard: {
    borderRadius: 12,
    padding: rw(4),
    marginBottom: rh(1.5),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  restaurant: {
    fontSize: rf(2),
    fontWeight: '600',
  },

  earning: {
    fontSize: rf(2),
    fontWeight: '600',
    color: '#1BA672',
  },

  orderId: {
    fontSize: rf(1.4),
    color: '#888',
    marginVertical: rh(0.5),
  },

  metaText: {
    fontSize: rf(1.4),
    color: '#555',
  },

  metaSmall: {
    fontSize: rf(1.3),
    color: '#555',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: rw(2),
  },

  tipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: rh(1),
  },

  tipLabel: {
    fontSize: rf(1.4),
    color: '#777',
  },

  tipValue: {
    fontSize: rf(1.4),
    color: '#1BA672',
    fontWeight: '600',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: rh(5),
    color: '#777',
    fontSize: rf(1.8),
  },
 


});
