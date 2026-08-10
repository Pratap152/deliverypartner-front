import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

import { getCashBalance } from '../../services/profile/profileApiService';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const CashBalanceScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [cashData, setCashData] = useState(null);

  // -----------------------------------------
  // Fetch Cash Balance
  // -----------------------------------------
  useEffect(() => {
    fetchCashBalance();
  }, []);

  const fetchCashBalance = async () => {
    try {
      setLoading(true);

      const response = await getCashBalance();

      console.log('CASH BALANCE RESPONSE:', response?.data);

      if (response?.data?.success) {
        setCashData(response.data.data);
      } else {
        console.log(
          'Cash Balance API failed:',
          response?.data?.message,
        );
      }
    } catch (error) {
      console.log('Cash Balance Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Render History Item
  // -----------------------------------------
  const renderHistoryItem = ({ item }) => {
    const status = item?.status?.toUpperCase();

    const isPending = status === 'PENDING';

    const displayAmount = isPending
      ? item?.pendingAmount
      : item?.depositedAmount;

    const displayDate = item?.depositedAt
      ? new Date(item.depositedAt).toLocaleString()
      : item?.collectedAt
        ? new Date(item.collectedAt).toLocaleString()
        : '-';

    return (
      <View style={styles.historyCard}>

        {/* Left Icon */}
        <View style={styles.leftSection}>
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: isPending
                  ? '#FFF3E0'
                  : '#E8F8ED',
              },
            ]}
          >
            <Ionicons
              name={
                isPending
                  ? 'time-outline'
                  : 'checkmark-circle'
              }
              size={isTablet ? 28 : 20}
              color={
                isPending
                  ? '#FF8C00'
                  : '#2E8B57'
              }
            />
          </View>
        </View>

        {/* Middle Section */}
        <View style={styles.middleSection}>

          <Text style={styles.orderId}>
            {item?.orderId || '-'}
          </Text>

          <Text style={styles.customerName}>
            {item?.customerName || '-'}
          </Text>

          <Text style={styles.dateText}>
            {displayDate}
          </Text>

        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>

          <Text
            style={[
              styles.amount,
              {
                color: isPending
                  ? '#FF8C00'
                  : '#2E8B57',
              },
            ]}
          >
            ₹{displayAmount?.toLocaleString() || '0'}
          </Text>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isPending
                  ? '#FFF3E0'
                  : '#E8F8ED',
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: isPending
                    ? '#FF8C00'
                    : '#2E8B57',
                },
              ]}
            >
              {isPending
                ? 'Pending'
                : 'Deposited'}
            </Text>
          </View>

        </View>
      </View>
    );
  };

  // -----------------------------------------
  // Loading
  // -----------------------------------------
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color="#192A51"
        />
      </View>
    );
  }

  // -----------------------------------------
  // API Data Mapping
  // -----------------------------------------
  const cashSummary = cashData?.cashSummary;
  const pendingSummary = cashData?.pendingOrdersSummary;
  const history = cashData?.cashOrderHistory || [];
  const rules = cashData?.rules;

  // -----------------------------------------
  // Main UI
  // -----------------------------------------
  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >

      {/* Header */}
      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
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
          onPress={() =>
            navigation.navigate('HelpCenterList')
          }
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={isTablet ? 34 : 24}
            color="#294484"
          />
        </TouchableOpacity>

      </View>

      <FlatList
        data={history}
        keyExtractor={(item, index) =>
          `${item?.orderId || 'order'}-${index}`
        }
        showsVerticalScrollIndicator={false}

        ListHeaderComponent={
          <>

            {/* =========================================
                CASH SUMMARY CARD
            ========================================= */}
            <View style={styles.topCard}>

              <Text style={styles.cardLabel}>
                Cash Collected
              </Text>

              <Text style={styles.cashAmount}>
                ₹
                {cashSummary?.totalCashCollected?.toLocaleString() || '0'}
              </Text>

              <View style={styles.limitContainer}>

                {/* Cash Limit */}
                <View>
                  <Text style={styles.limitText}>
                    Cash Limit
                  </Text>

                  <Text style={styles.limitAmount}>
                    ₹
                    {cashSummary?.maxAllowed?.toLocaleString() || '0'}
                  </Text>
                </View>

                {/* To Deposit */}
                <View>
                  <Text style={styles.limitText}>
                    To Deposit
                  </Text>

                  <Text style={styles.limitAmount}>
                    ₹
                    {cashSummary?.toDeposit?.toLocaleString() || '0'}
                  </Text>
                </View>

              </View>
            </View>

            {/* =========================================
                SUMMARY CARDS
            ========================================= */}
            <View style={styles.summaryRow}>

              {/* Last Deposit */}
              <View style={styles.summaryCard}>

                <Ionicons
                  name="trending-down-outline"
                  size={isTablet ? 32 : 22}
                  color="#3B82F6"
                />

                <Text style={styles.summaryValue}>
                  ₹
                  {cashData?.latestDeposit?.toLocaleString() || '0'}
                </Text>

                <Text style={styles.summaryLabel}>
                  Last Deposit
                </Text>

              </View>

              {/* Pending Orders */}
              <View style={styles.summaryCard}>

                <Ionicons
                  name="receipt-outline"
                  size={isTablet ? 32 : 22}
                  color="#2E8B57"
                />

                <Text style={styles.summaryValue}>
                  {pendingSummary?.pendingOrdersCount || 0}
                </Text>

                <Text style={styles.summaryLabel}>
                  Pending Orders
                </Text>

              </View>

              {/* Pending Amount */}
              <View style={styles.summaryCard}>

                <Ionicons
                  name="wallet-outline"
                  size={isTablet ? 32 : 22}
                  color="#FF8C00"
                />

                <Text style={styles.summaryValue}>
                  ₹
                  {pendingSummary?.pendingAmount?.toLocaleString() || '0'}
                </Text>

                <Text style={styles.summaryLabel}>
                  Pending Amount
                </Text>

              </View>

            </View>

            {/* =========================================
                BACKEND RULE
            ========================================= */}
            {rules?.warningMessage && (
              <View style={styles.infoCard}>

                <Ionicons
                  name="information-circle-outline"
                  size={22}
                  color="#2563EB"
                />

                <Text style={styles.infoText}>
                  {rules.warningMessage}
                </Text>

              </View>
            )}

            {/* =========================================
                CASH ORDER HISTORY
            ========================================= */}
            <Text style={styles.historyTitle}>
              Cash Order History
            </Text>

          </>
        }

        renderItem={renderHistoryItem}

        ListEmptyComponent={
          <View style={styles.emptyHistoryContainer}>
            <Ionicons
              name="receipt-outline"
              size={isTablet ? 40 : 32}
              color="#98A2B3"
            />

            <Text style={styles.emptyHistoryTitle}>
              No cash orders yet
            </Text>
          </View>
        }
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

  // =========================================
  // HEADER
  // =========================================

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

  rightIconWrapper: {
    width: rw(8),
    alignItems: 'flex-end',
  },

  // =========================================
  // TOP CASH CARD
  // =========================================

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
    color: '#333333',
  },

  limitAmount: {
    fontSize: rf(2),
    fontWeight: '700',
    color: '#333333',
    marginTop: rh(0.4),
  },

  // =========================================
  // SUMMARY
  // =========================================

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

  // =========================================
  // INFO / RULE
  // =========================================

  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: rw(4),
    marginTop: rh(2),
    padding: rw(3),
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
  },

  infoText: {
    flex: 1,
    marginLeft: rw(2),
    fontSize: rf(1.45),
    color: '#1E40AF',
    lineHeight: rf(2),
  },

  // =========================================
  // HISTORY
  // =========================================

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
    color: '#999999',
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
  emptyHistoryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: rh(5),
    marginHorizontal: rw(4),
  },

  emptyHistoryTitle: {
    marginTop: rh(1),
    fontSize: rf(1.8),
    fontWeight: '600',
    color: '#667085',
  },
});