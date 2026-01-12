import React, { useState } from 'react';
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

const FILTERS = ['today', 'weekly', 'monthly', 'all'];

const OrderHistory = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('weekly');

  const { orders, summary, loading, loadingMore, loadMore } =
    useOrderHistory(selectedFilter);

  const renderFilter = filter => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterBtn,
        selectedFilter === filter && styles.activeFilter,
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[
          styles.filterText,
          selectedFilter === filter && styles.activeFilterText,
        ]}
      >
        {filter.charAt(0).toUpperCase() + filter.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.restaurant}>{item.restaurantName}</Text>
        <Text style={styles.earning}>₹{item.earning}</Text>
      </View>

      <Text style={styles.orderId}>{item.orderId}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>{item.paymentMode}</Text>
        <Text style={styles.metaText}>{item.date}</Text>
      </View>

      <Text style={styles.status}>{item.status}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
      <View style={styles.filterRow}>{FILTERS.map(renderFilter)}</View>

      {/* SUMMARY */}
      <View style={styles.summaryGrid}>
        <SummaryCard label="Total Orders" value={summary.totalOrders} />
        <SummaryCard
          label="Total Earnings"
          value={`₹${summary.totalEarnings}`}
        />
        <SummaryCard label="Average Rating" value={summary.rating} />
        <SummaryCard label="KM Traveled" value={summary.km} />
      </View>

      {/* LIST */}
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={renderOrder}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={{ marginVertical: 20 }} />
          ) : null
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No orders found</Text>
        }
      />
    </View>
  );
};

const SummaryCard = ({ label, value }) => (
  <View style={styles.summaryCard}>
    <Text style={styles.summaryValue}>{value}</Text>
    <Text style={styles.summaryLabel}>{label}</Text>
  </View>
);

export default OrderHistory;
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

  filterRow: {
    flexDirection: 'row',
    marginBottom: rh(2),
  },

  filterBtn: {
    paddingHorizontal: rw(4),
    paddingVertical: rh(0.8),
    borderRadius: 20,
    backgroundColor: '#F1F1F1',
    marginRight: rw(2),
  },

  activeFilter: {
    backgroundColor: '#19A7CE',
  },

  filterText: {
    fontSize: rf(1.7),
    color: '#555',
  },

  activeFilterText: {
    color: '#fff',
    fontWeight: '600',
  },

  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: rh(2),
  },

  summaryCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: rw(4),
    marginBottom: rh(1.5),
    elevation: 2,
  },

  summaryValue: {
    fontSize: rf(2.3),
    fontWeight: '700',
  },

  summaryLabel: {
    fontSize: rf(1.5),
    color: '#777',
    marginTop: rh(0.5),
  },

  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: rw(4),
    marginBottom: rh(1.5),
    elevation: 2,
  },

  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  metaText: {
    fontSize: rf(1.4),
    color: '#555',
  },

  status: {
    marginTop: rh(0.8),
    fontSize: rf(1.5),
    color: '#1BA672',
    fontWeight: '500',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: rh(5),
    color: '#777',
    fontSize: rf(1.8),
  },
});
