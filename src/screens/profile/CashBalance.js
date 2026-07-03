import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

import apiClient from '../../services/ApiClient';



const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const CashBalanceScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [cashData, setCashData] = useState(null);

  useEffect(() => {
    getCashBalance();
  }, []);

  const getCashBalance = async () => {
    try {
      const response = await apiClient.get('/api/rider/cashbalance');

      if (response?.data?.success) {
        setCashData(response.data.data);
      }
    } catch (error) {
      console.log('Cash Balance Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderHistoryItem = ({ item }) => {
    const isPending =
      item.status?.toUpperCase() === 'PENDING';

    return (
      <View style={styles.historyCard}>
        <View style={styles.leftSection}>
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: isPending
                  ? '#FFF3E0'
                  : '#E8F8ED',
              },
            ]}>
            <Ionicons
              name={isPending ? 'time-outline' : 'checkmark-circle'}
              size={isTablet ? 28 : 20}
              color={isPending ? '#FF8C00' : '#2E8B57'}/>
          </View>
        </View>

        <View style={styles.middleSection}>
          <Text style={styles.orderId}>
            {item.orderId}
          </Text>

          <Text style={styles.customerName}>
            {item.customerName}
          </Text>

          <Text style={styles.dateText}>
            {item.depositedAt
              ? new Date(item.depositedAt).toLocaleString()
              : item.collectedAt
                ? new Date(item.collectedAt).toLocaleString()
                : '-'}
          </Text>
        </View>

        <View style={styles.rightSection}>
          <Text
            style={[
              styles.amount,
              {
                color: isPending
                  ? '#FF8C00'
                  : '#2E8B57',
              },
            ]}>
            ₹{item.totalAmount}
          </Text>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isPending
                  ? '#FFF3E0'
                  : '#E8F8ED',
              },
            ]}>
            <Text
              style={[
                styles.statusText,
                {
                  color: isPending
                    ? '#FF8C00'
                    : '#2E8B57',
                },
              ]}>
              {isPending
                ? 'Pending'
                : 'Deposited'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const cashSummary = cashData?.cashSummary;
  const pendingSummary = cashData?.pendingOrdersSummary;

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={rf(2.6)}
            color="#101828"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Cash Balance
        </Text>

        <TouchableOpacity
          style={styles.rightIconWrapper}
          onPress={() => navigation.navigate('HelpCenterList')}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={isTablet ? 34 : 24}
            color="#294484"
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={cashData?.cashOrderHistory || []}
        keyExtractor={(item, index) =>
          item.orderId + index
        }
        ListHeaderComponent={
          <>
            {/* Top Card */}

            <View style={styles.topCard}>
              <Text style={styles.cardLabel}>
                Cash Collected
              </Text>

              <Text style={styles.cashAmount}>
                ₹
                {cashSummary?.totalCashCollected?.toLocaleString()}
              </Text>

              <View style={styles.limitContainer}>
                <Text style={styles.limitText}>
                  Cash Limit
                </Text>

                <Text style={styles.limitAmount}>
                  ₹
                  {cashSummary?.maxAllowed?.toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Summary Cards */}

            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Ionicons
                  name="trending-down-outline"
                  size={isTablet ? 32 : 22}
                  color="#3B82F6"
                />

                <Text style={styles.summaryValue}>
                  ₹{cashData?.latestDeposit}
                </Text>

                <Text style={styles.summaryLabel}>
                  Last Deposit
                </Text>
              </View>

              <View style={styles.summaryCard}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={isTablet ? 32 : 22}
                  color='#2E8B57'
                />

                <Text style={styles.summaryValue}>
                  {
                    pendingSummary?.pendingOrdersCount
                  }
                </Text>

                <Text style={styles.summaryLabel}>
                  Pending Orders
                </Text>
              </View>

              <View style={styles.summaryCard}>
                <Ionicons
                  name="wallet-outline"
                  size={isTablet ? 32 : 22}
                  color="#FF8C00"
                />

                <Text style={styles.summaryValue}>
                  ₹
                  {pendingSummary?.pendingAmount?.toLocaleString()}
                </Text>

                <Text style={styles.summaryLabel}>
                  Pending Amount
                </Text>
              </View>
            </View>

            <Text style={styles.historyTitle}>
              Cash Order History
            </Text>
          </>
        }
        renderItem={renderHistoryItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default CashBalanceScreen;

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

  topCard: {
    backgroundColor: '#123A96',
    margin: rw(4),
    borderRadius: 12,
    padding: rw(4),
  },

  cardLabel: {
    color: '#FFFFFF',
    fontSize: rf(1.8),
    fontWeight: '500',
  },

  cashAmount: {
    color: '#FFFFFF',
    fontSize: rf(3.6),
    fontWeight: '700',
    marginTop: rh(0.7),
  },

  limitContainer: {
    marginTop: rh(2),
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: rw(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  limitText: {
    fontSize: rf(1.8),
    color: '#333',
  },

  limitAmount: {
    fontSize: rf(2),
    fontWeight: '700',
    color: '#333',
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: rw(4),
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    width: '31%',
    borderRadius: 12,
    paddingVertical: rh(2),
    paddingHorizontal: rw(2),
    elevation: 2,
  },

  summaryValue: {
    fontSize: rf(2.5),
    fontWeight: '700',
    marginTop: rh(1),
    color: '#101828',
  },

  summaryLabel: {
    fontSize: rf(1.5),
    color: '#667085',
    marginTop: rh(0.5),
  },

  historyTitle: {
    fontSize: rf(2.3),
    fontWeight: '700',
    color: '#101828',
    margin: rw(4),
  },

  historyCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: rw(4),
    marginBottom: rh(1),
    borderRadius: 10,
    padding: rw(3),
  },

  leftSection: {
    marginRight: rw(3),
    justifyContent: 'center',
  },

  iconCircle: {
  height: isTablet ? 50 : 34,
  width: isTablet ? 50 : 34,
  borderRadius: isTablet ? 25 : 17,
  justifyContent: 'center',
  alignItems: 'center',
},

  middleSection: {
    flex: 1,
  },

  orderId: {
    fontWeight: '700',
    fontSize: rf(1.95),
    color: '#101828',
  },

  customerName: {
    color: '#667085',
    marginTop: 3,
    fontSize: rf(1.6),
  },

  dateText: {
    color: '#999',
    fontSize: rf(1.2),
    marginTop: 3,
  },

  rightSection: {
    alignItems: 'flex-end',
  },

  amount: {
    fontWeight: '700',
    fontSize: rf(2),
  },

  statusBadge: {
    marginTop: rh(0.7),
    paddingHorizontal: rw(2),
    paddingVertical: rh(0.3),
    borderRadius: 10,
  },

  statusText: {
    fontSize: rf(1.35),
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rw(4),
    paddingVertical: rh(2.2),
    backgroundColor: '#FFFFFF',
    elevation: 3,
  },

  headerTitle: {
    fontSize: rf(2.3),
    fontWeight: '700',
    color: '#101828',
  },

  robotIcon: {
    width: rw(7.5),
    height: rw(7.5),
    resizeMode: 'contain',
  },
});