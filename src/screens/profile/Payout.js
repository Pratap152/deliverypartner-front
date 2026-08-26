
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import {
  getBankDetails,
  getWalletData,
  getSettlementBreakdown,
  getTransactions,
} from '../../services/profile/profileApiService';

export default function PayoutScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const styles = createStyles(isTablet);

  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [bank, setBank] = useState(null);
  const [settlement, setSettlement] = useState(null);
  const [settlementList, setSettlementList] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [settlementMessage, setSettlementMessage] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const walletRes = await getWalletData();
      setWallet(walletRes.data.data);
    } catch (error) {
      console.log('Wallet Error', error);
    }

    try {
  const settlementRes = await getSettlementBreakdown();

  const settlementData = settlementRes.data?.data;
  const settlements =
    settlementData?.settlements || [];

  if (
    settlementRes.data?.success &&
    settlements.length > 0
  ) {
    setSettlement(settlementData);
    setSettlementList(settlements);
    setSettlementMessage('');
  } else {
    setSettlement(null);
    setSettlementList([]);

    setSettlementMessage(
      settlementRes.data?.message ||
        'No settlement data available'
    );
  }
} catch (error) {
  console.log(
    'Settlement Error =>',
    error.response?.data
  );

  setSettlement(null);
  setSettlementList([]);

  setSettlementMessage(
    error.response?.data?.message ||
      'Unable to load settlement details'
  );
}

    try {
      const bankRes = await getBankDetails();
      setBank(bankRes.data.data);
    } catch (error) {
      console.log('Bank Error', error);
    }

    try {
      const transactionRes = await getTransactions();

      setTransactions(
        transactionRes.data.data.transactions || []
      );
    } catch (error) {
      console.log('Transaction Error', error);
    }

    setLoading(false);
  };

  const formatCurrency = amount =>
    `₹${Number(amount || 0).toLocaleString('en-IN')}`;

  const formatDate = date => {
    if (!date) return '--';

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    });
  };

  const formatDateTime = date => {
    if (!date) return '--';

    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isZestbot =
    wallet?.riderType === 'ZESTBOT_EMPLOYEE';

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

  const displayedTransactions = showAllTransactions
    ? transactions
    : transactions.slice(0, 3);

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
          Payout
        </Text>

        <TouchableOpacity
          style={styles.rightIconWrapper}
          onPress={() =>
            navigation.navigate('HelpCenterList')
          }
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color="#294484"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* Wallet Card */}
        <View style={styles.walletContainer}>
          <LinearGradient
            colors={[
              '#192A51',
              '#294484',
              '#31529D',
              '#3558AA',
              '#385FB7',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.walletCard}
          >
            <View style={styles.walletTop}>
              <View>
                <View style={styles.walletTitleRow}>
                  <Text style={styles.walletLabel}>
                    Total Balance
                  </Text>
                </View>

                <View style={styles.balanceRow}>
                  <Text style={styles.walletAmount}>
                    {formatCurrency(
                      wallet?.totalAmount
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.walletIconBox}>
                <Ionicons
                  name="wallet"
                  size={34}
                  color="#355CCB"
                />
              </View>
            </View>
          </LinearGradient>

          {/* Info Card */}
          <View style={styles.infoCard}>
            {isZestbot ? (
              <>
                <View style={styles.infoItem}>
                  <View style={styles.greenIcon}>
                    <Ionicons
                      name="card"
                      size={isTablet ? 24 : 18}
                      color="#2E9B51"
                    />
                  </View>

                  <Text style={styles.infoTitle}>
                    Salary
                  </Text>

                  <Text style={styles.infoValue}>
                    {formatCurrency(
                      wallet?.attendanceAmount
                    )}
                  </Text>
                </View>

                <View
                  style={styles.verticalDivider}
                />

                <View style={styles.infoItem}>
                  <View style={styles.yellowIcon}>
                    <Ionicons
                      name="trophy"
                      size={isTablet ? 24 : 18}
                      color="#F6B500"
                    />
                  </View>

                  <Text style={styles.infoTitle}>
                    Incentives
                  </Text>

                  <Text style={styles.infoValue}>
                    {formatCurrency(
                      wallet?.incentives
                    )}
                  </Text>
                </View>

                <View
                  style={styles.verticalDivider}
                />

                <View style={styles.infoItem}>
                  <View style={styles.greenIcon}>
                    <Ionicons
                      name="cash"
                      size={isTablet ? 24 : 18}
                      color="#2E9B51"
                    />
                  </View>

                  <Text style={styles.infoTitle}>
                    Tips
                  </Text>

                  <Text style={styles.infoValue}>
                    {formatCurrency(
                      wallet?.tips
                    )}
                  </Text>
                </View>

                <View
                  style={styles.verticalDivider}
                />

                <View style={styles.infoItem}>
                  <View style={styles.grayIcon}>
                    <Ionicons
                      name="calendar"
                      size={isTablet ? 24 : 18}
                      color="#777"
                    />
                  </View>

                  <Text style={styles.infoTitle}>
                    Withdraw Date
                  </Text>

                  <Text style={styles.infoValue}>
                    {formatDate(
                      wallet?.withdrawDate
                    )}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.infoItem}>
                  <View style={styles.greenIcon}>
                    <Ionicons
                      name="cash"
                      size={isTablet ? 24 : 18}
                      color="#2E9B51"
                    />
                  </View>

                  <Text style={styles.infoTitle}>
                    Available Balance
                  </Text>

                  <Text style={styles.infoValue}>
                    {formatCurrency(
                      wallet?.availableBalance
                    )}
                  </Text>
                </View>

                <View
                  style={styles.verticalDivider}
                />

                <View style={styles.infoItem}>
                  <View style={styles.yellowIcon}>
                    <Ionicons
                      name="lock-closed"
                      size={isTablet ? 24 : 18}
                      color="#F6B500"
                    />
                  </View>

                  <Text style={styles.infoTitle}>
                    Balance on Hold
                  </Text>

                  <Text
                    style={styles.infoholdValue}
                  >
                    {formatCurrency(
                      wallet?.holdAmount
                    )}
                  </Text>
                </View>

                <View
                  style={styles.verticalDivider}
                />

                <View style={styles.infoItem}>
                  <View style={styles.grayIcon}>
                    <Ionicons
                      name="calendar"
                      size={isTablet ? 24 : 18}
                      color="#777"
                    />
                  </View>

                  <Text style={styles.infoTitle}>
                    Withdrawal Date
                  </Text>

                  <Text style={styles.infoValue}>
                    {formatDate(
                      wallet?.withdrawDate
                    )}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Statement */}
          <TouchableOpacity
            style={styles.statementBtn}
          >
            <Ionicons
              name="document-text-outline"
              size={isTablet ? 28 : 22}
              color="#fff"
            />

            <Text style={styles.statementText}>
              Statement
            </Text>
          </TouchableOpacity>
        </View>

        {/* Settlement */}
        <TouchableOpacity
          style={styles.sectionCard}
          onPress={() =>
            setExpanded(!expanded)
          }
        >
          <View style={styles.sectionLeft}>
            <View style={styles.settlementIcon}>
              <Text style={styles.rupeeIcon}>
                ₹
              </Text>
            </View>

            <Text style={styles.sectionTitle}>
              Settlement Breakdown
            </Text>
          </View>

          <Ionicons
            name={
              expanded
                ? 'chevron-up'
                : 'chevron-down'
            }
            size={24}
            color="#111"
          />
        </TouchableOpacity>

        {expanded && (
          <View style={styles.breakdown}>
            {!settlement ? (
              <Text style={styles.emptyText}>
                {settlementMessage ||
                  'No settlement data available'}
              </Text>
            ) : (
              settlementList.map(
                (item, index) => (
                  <View
                    style={
                      styles.settlementListContainer
                    }
                    key={index}
                  >
                    <Row
                      title="Settlement Date"
                      value={formatDate(
                        item.settlementDate
                      )}
                      styles={styles}
                    />

                    {(
                      settlement.riderType ===
                        'ZESTBOT_EMPLOYEE' ||
                      settlement.riderType ===
                        'COMPANY_EMPLOYEE'
                    ) ? (
                      <>
                        <Row
                          title="Salary"
                          value={item.salary}
                          styles={styles}
                        />

                        <Row
                          title="Incentives"
                          value={item.incentives}
                          styles={styles}
                        />

                        <Row
                          title="Tips"
                          value={item.tips}
                          styles={styles}
                        />

                        <Row
                          title="TDS"
                          value={`- ${formatCurrency(
                            item.tds
                          )}`}
                          negative
                          styles={styles}
                        />

                        <View
                          style={styles.netBox}
                        >
                          <Text
                            style={styles.netLabel}
                          >
                            Net Earnings
                          </Text>

                          <Text
                            style={styles.netValue}
                          >
                            {formatCurrency(
                              item.amount
                            )}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <Row
                          title="Gross Earnings"
                          value={
                            item.grossEarnings
                          }
                          styles={styles}
                        />

                        <Row
                          title="Incentives"
                          value={
                            item.incentiveAmount
                          }
                          styles={styles}
                        />

                        <Row
                          title="Tips"
                          value={
                            item.tipsAmount
                          }
                          styles={styles}
                        />

                        <Row
                          title="TDS"
                          value={`- ${formatCurrency(
                            item.tdsAmount
                          )}`}
                          negative
                          styles={styles}
                        />

                        <View
                          style={styles.netBox}
                        >
                          <Text
                            style={styles.netLabel}
                          >
                            Net Earnings
                          </Text>

                          <Text
                            style={styles.netValue}
                          >
                            {formatCurrency(
                              item.netAmount
                            )}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                )
              )
            )}
          </View>
        )}

        {/* Bank */}
        <>
          <Text style={styles.bankHeading}>
            Linked Bank Account
          </Text>

          <View style={styles.bankCard}>
            <Ionicons
              name="wallet"
              size={24}
              color="#1E40AF"
            />

            <View
              style={{
                flex: 1,
                marginLeft: 12,
                flexDirection: 'row',
                justifyContent:
                  'space-between',
                alignItems: 'center',
              }}
            >
              <View>
                <Text style={styles.bankName}>
                  {bank?.bankName ??
                    'No Bank Linked'}
                </Text>

                <Text
                  style={styles.accountNumber}
                >
                  {bank?.accountNumber
                    ? `XXXX-${String(
                        bank.accountNumber
                      ).slice(-4)}`
                    : 'Add your bank account'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('BankAC')
                }
              >
                <Text
                  style={styles.manageText}
                >
                  {bank ? 'Manage' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>

        {/* Transactions */}
        <View style={styles.transactionCard}>
          <Text style={styles.transactionTitle}>
            Recent Transactions
          </Text>

          <View
            style={styles.transactionDivider}
          />

          {transactions.length === 0 ? (
            <Text style={styles.emptyText}>
              No transactions available
            </Text>
          ) : (
            displayedTransactions.map(
              (item, index) => (
                <View key={item.id}>
                  <View
                    style={
                      styles.transactionRow
                    }
                  >
                    <View
                      style={
                        styles.transactionInfo
                      }
                    >
                      <Text
                        style={styles.txnName}
                      >
                        {item.description}
                      </Text>

                      <Text
                        style={styles.txnDate}
                      >
                        {formatDateTime(
                          item.createdAt
                        )}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.amount,
                        {
                          color:
                            item.type ===
                            'CREDIT'
                              ? '#2E9B51'
                              : '#E53935',
                        },
                      ]}
                    >
                      {item.type === 'CREDIT'
                        ? '+'
                        : '-'}

                      {formatCurrency(
                        item.amount
                      )}
                    </Text>
                  </View>

                  {index !==
                    displayedTransactions.length -
                      1 && (
                    <View
                      style={
                        styles.transactionDivider
                      }
                    />
                  )}
                </View>
              )
            )
          )}
        </View>

        {transactions.length > 3 && (
          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={() =>
              setShowAllTransactions(
                !showAllTransactions
              )
            }
          >
            <Text style={styles.viewAllText}>
              {showAllTransactions
                ? 'Show Less'
                : 'View All Transactions'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Row component ───────────────────────────────────────────────────────────

const Row = ({
  title,
  value,
  negative,
  styles,
}) => (
  <View style={styles.row}>
    <Text style={styles.rowTitle}>
      {title}
    </Text>

    <Text
      style={[
        styles.rowValue,
        negative && {
          color: '#E53935',
        },
      ]}
    >
      {typeof value === 'number'
        ? `₹${Number(
            value
          ).toLocaleString('en-IN')}`
        : value}
    </Text>
  </View>
);

// ─── Styles ──────────────────────────────────────────────────────────────────

const createStyles = isTablet =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F6FA',
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
      paddingHorizontal: isTablet
        ? 32
        : rw(4),
      paddingVertical: isTablet
        ? 20
        : rh(2.2),
      marginBottom: isTablet ? 0 : 9,
      backgroundColor: '#FFFFFF',
      elevation: 3,
    },

    headerTitle: {
      fontSize: isTablet
        ? 24
        : rf(2.3),
      fontWeight: '700',
      color: '#101828',
    },

    rightIconWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
    },

    walletContainer: {
      marginHorizontal: isTablet
        ? 28
        : 16,

      marginTop: isTablet ? 24 : 0,

      marginBottom: isTablet
        ? 20
        : 17,

      backgroundColor: '#B6CCFF',

      borderRadius: isTablet
        ? 32
        : 28,

      paddingBottom: isTablet
        ? 14
        : 10,

      elevation: 6,
    },

    walletCard: {
      height: isTablet
        ? 220
        : 170,

      borderRadius: isTablet
        ? 24
        : 18,

      paddingTop: isTablet
        ? 28
        : 18,

      paddingHorizontal: isTablet
        ? 36
        : 24,
    },

    walletTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },

    walletTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    balanceRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },

    walletIconBox: {
      width: isTablet
        ? 56
        : 40,

      height: isTablet
        ? 56
        : 40,

      borderRadius: isTablet
        ? 20
        : 16,

      backgroundColor: '#fff',

      justifyContent: 'center',
      alignItems: 'center',
    },

    greenIcon: {
      width: isTablet
        ? 54
        : 42,

      height: isTablet
        ? 54
        : 42,

      borderRadius: isTablet
        ? 27
        : 21,

      backgroundColor: '#D8F5DE',

      justifyContent: 'center',
      alignItems: 'center',
    },

    yellowIcon: {
      width: isTablet
        ? 54
        : 42,

      height: isTablet
        ? 54
        : 42,

      borderRadius: isTablet
        ? 27
        : 21,

      backgroundColor: '#FFF2C6',

      justifyContent: 'center',
      alignItems: 'center',
    },

    grayIcon: {
      width: isTablet
        ? 54
        : 42,

      height: isTablet
        ? 54
        : 42,

      borderRadius: isTablet
        ? 27
        : 21,

      backgroundColor: '#EFEFEF',

      justifyContent: 'center',
      alignItems: 'center',
    },

    walletLabel: {
      color: '#fff',

      fontSize: isTablet
        ? 22
        : 18,

      fontWeight: '700',
    },

    walletAmount: {
      color: '#fff',

      fontSize: isTablet
        ? 40
        : 26,

      fontWeight: '600',

      marginTop: isTablet
        ? 18
        : 13,
    },

    infoCard: {
      marginHorizontal: isTablet
        ? 28
        : 20,

      marginTop: isTablet
        ? -80
        : -65,

      backgroundColor: '#fff',

      borderRadius: isTablet
        ? 24
        : 22,

      flexDirection: 'row',

      paddingVertical: isTablet
        ? 24
        : 18,

      elevation: 8,
    },

    infoItem: {
      flex: 1,
      alignItems: 'center',
    },

    verticalDivider: {
      width: 1,

      height: isTablet
        ? 70
        : 55,

      backgroundColor: '#E7E7E7',

      alignSelf: 'center',
    },

    infoTitle: {
      fontSize: isTablet
        ? 18
        : 11,

      color: '#555',

      marginTop: isTablet
        ? 10
        : 8,

      textAlign: 'center',
    },

    infoValue: {
      fontSize: isTablet
        ? 20
        : 16,

      fontWeight: '700',

      marginTop: isTablet
        ? 6
        : 4,

      color: '#111',
    },

    infoholdValue: {
      fontSize: isTablet
        ? 20
        : 16,

      fontWeight: '700',

      marginTop: isTablet
        ? 6
        : 4,

      color: '#948989',
    },

    statementBtn: {
      marginTop: isTablet
        ? 14
        : 10,

      marginHorizontal: isTablet
        ? 24
        : 16,

      height: isTablet
        ? 58
        : 45,

      backgroundColor: '#162D68',

      borderRadius: isTablet
        ? 16
        : 13.5,

      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },

    statementText: {
      color: '#fff',
      fontWeight: '600',

      fontSize: isTablet
        ? 22
        : 18,

      marginLeft: isTablet
        ? 12
        : 10,
    },

    sectionCard: {
      backgroundColor: '#fff',

      marginHorizontal: isTablet
        ? 28
        : 16,

      marginBottom: isTablet
        ? 14
        : 12,

      borderRadius: isTablet
        ? 14
        : 12,

      height: isTablet
        ? 64
        : 50,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent: 'space-between',

      paddingHorizontal: isTablet
        ? 20
        : 16,

      borderWidth: 1,
      borderColor: '#ddd7d7',
    },

    sectionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    sectionTitle: {
      fontSize: isTablet
        ? 20
        : 17,

      fontWeight: '600',
      color: '#111',
    },

    settlementIcon: {
      width: isTablet
        ? 38
        : 30,

      height: isTablet
        ? 38
        : 30,

      borderRadius: isTablet
        ? 19
        : 21,

      backgroundColor: '#1E40AF',

      justifyContent: 'center',
      alignItems: 'center',

      marginRight: isTablet
        ? 14
        : 12,
    },

    rupeeIcon: {
      color: '#fff',

      fontSize: isTablet
        ? 28
        : 24,

      fontWeight: '700',
    },

    breakdown: {
      backgroundColor: '#fff',

      marginHorizontal: isTablet
        ? 28
        : 16,

      marginTop: isTablet
        ? -7
        : -5,

      marginBottom: isTablet
        ? 20
        : 16,

      borderRadius: isTablet
        ? 16
        : 14,

      overflow: 'hidden',

      borderWidth: 1,
      borderColor: '#ddd7d7',
    },

    settlementListContainer: {
      marginHorizontal: 10,
      marginVertical: 10,

      paddingVertical: 5,
      paddingHorizontal: 5,

      borderWidth: 1,
      borderRadius: 10,

      borderColor: '#2E9B51',
    },

    row: {
      flexDirection: 'row',

      justifyContent: 'space-between',

      paddingHorizontal: isTablet
        ? 24
        : 16,

      paddingVertical: isTablet
        ? 18
        : 14,
    },

    rowTitle: {
      fontSize: isTablet
        ? 18
        : 14,

      color: '#555',
    },

    rowValue: {
      fontSize: isTablet
        ? 18
        : 14,

      fontWeight: '600',
    },

    netBox: {
      backgroundColor: '#EAF9EE',

      padding: isTablet
        ? 22
        : 16,

      flexDirection: 'row',

      justifyContent: 'space-between',
    },

    netLabel: {
      fontSize: isTablet
        ? 20
        : 16,

      fontWeight: '700',
      color: '#2E9B51',
    },

    netValue: {
      fontSize: isTablet
        ? 26
        : 20,

      fontWeight: '800',
      color: '#2E9B51',
    },

    bankHeading: {
      marginHorizontal: isTablet
        ? 28
        : 16,

      marginBottom: isTablet
        ? 12
        : 10,

      marginTop: isTablet
        ? 4
        : 3,

      fontSize: isTablet
        ? 22
        : 17,

      fontWeight: '700',
    },

    bankCard: {
      backgroundColor: '#ECF0FD',

      marginHorizontal: isTablet
        ? 28
        : 16,

      borderRadius: isTablet
        ? 16
        : 14,

      padding: isTablet
        ? 18
        : 10,

      flexDirection: 'row',

      alignItems: 'center',

      borderWidth: 1,
      borderColor: '#ddd7d7',
    },

    bankName: {
      fontSize: isTablet
        ? 20
        : 16,

      fontWeight: '700',
      color: '#111',
    },

    accountNumber: {
      marginTop: isTablet
        ? 5
        : 4,

      color: '#666',

      fontSize: isTablet
        ? 16
        : 13,
    },

    manageText: {
      color: '#2958FF',
      fontWeight: '600',

      fontSize: isTablet
        ? 18
        : 14,
    },

    // ─── Transactions ───────────────────────────────────────────────────

    transactionCard: {
      backgroundColor: '#fff',

      marginHorizontal: isTablet
        ? 28
        : 16,

      marginTop: isTablet
        ? 20
        : 16,

      borderRadius: isTablet
        ? 18
        : 16,

      padding: isTablet
        ? 24
        : 16,

      borderWidth: 1,
      borderColor: '#ddd7d7',
    },

    transactionTitle: {
      fontSize: isTablet
        ? 24
        : 17,

      fontWeight: '700',

      marginBottom: isTablet
        ? 18
        : 16,
    },

    transactionDivider: {
      height: 1,
      backgroundColor: '#E5E5E5',

      marginBottom: isTablet
        ? 18
        : 16,
    },

    transactionRow: {
      flexDirection: 'row',

      justifyContent: 'space-between',

      alignItems: 'flex-start',

      marginBottom: isTablet
        ? 14
        : 12,
    },

    // Important: allows long transaction descriptions
    // to shrink/wrap without pushing the amount outside.
    transactionInfo: {
      flex: 1,
      minWidth: 0,

      paddingRight: 10,
    },

    txnName: {
      fontSize: isTablet
        ? 20
        : 15,

      fontWeight: '600',
      color: '#111',

      flexShrink: 1,
    },

    txnDate: {
      marginTop: isTablet
        ? 5
        : 4,

      fontSize: isTablet
        ? 16
        : 12,

      color: '#777',
    },

    amount: {
      fontSize: isTablet
        ? 20
        : 16,

      fontWeight: '700',

      textAlign: 'right',

      flexShrink: 0,

      minWidth: isTablet
        ? 90
        : 75,
    },

    viewAllBtn: {
      height: isTablet
        ? 62
        : 52,

      marginHorizontal: isTablet
        ? 28
        : 16,

      marginTop: isTablet
        ? 6
        : 4,

      marginBottom: isTablet
        ? 28
        : 24,

      borderRadius: isTablet
        ? 14
        : 12,

      borderWidth: 1.5,

      borderColor: '#162D68',

      justifyContent: 'center',
      alignItems: 'center',
    },

    viewAllText: {
      color: '#162D68',

      fontWeight: '700',

      fontSize: isTablet
        ? 18
        : 15,
    },

    emptyText: {
      textAlign: 'center',

      paddingVertical: isTablet
        ? 28
        : 20,

      color: '#777',

      fontSize: isTablet
        ? 17
        : 14,
    },
  });