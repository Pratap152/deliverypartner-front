import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import apiClient from '../../services/ApiClient';

export default function WalletScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [bank, setBank] = useState(null);
  const [settlement, setSettlement] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [showAllTransactions, setShowAllTransactions] =
    useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  try {
    const walletRes = await apiClient.get(
      '/api/rider/get/wallet',
    );

    setWallet(walletRes.data.data);
  } catch (error) {
    console.log('Wallet Error', error);
  }

  try {
    const settlementRes = await apiClient.get(
      '/api/settlement-breakdown',
    );

    setSettlement(settlementRes.data.data);
  } catch (error) {
    console.log('Settlement Error', error);
  }

  try {
    const bankRes = await apiClient.get(
      '/api/profile/bank-details',
    );

    setBank(bankRes.data.data);
  } catch (error) {
    console.log('Bank Error', error);
  }

  try {
    const transactionRes = await apiClient.get(
      '/api/wallet/withdrawals',
    );

    setTransactions(
      transactionRes.data.data.transactions || [],
    );
  } catch (error) {
    console.log('Transaction Error', error);
  }

  setLoading(false);
};
  const formatCurrency = amount =>
    `₹${Number(amount || 0).toLocaleString('en-IN')}`;
  const formatDate = date => {
    if (!date) {
      return '--';
    }

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    });
  };
  const formatDateTime = date => {
    if (!date) {
      return '--';
    }

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
        <ActivityIndicator size="large" />
      </View>
    );
  }
  const displayedTransactions =
    showAllTransactions
      ? transactions
      : transactions.slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={rf(2.6)}
            color="#101828"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Wallet
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('HelpCenterList')
          }>
          <Image
            source={require('../../assets/profile/HelpcenterIcon.png')}
            style={styles.robotIcon}
          />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Wallet Card */}
        <View style={styles.walletContainer}>
          <LinearGradient
            colors={['#192A51', "#294484", "#31529D", "#3558AA", '#385FB7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.walletCard}>
            <View style={styles.walletTop}>
              <View>
                <View style={styles.walletTitleRow}>
                  <Text style={styles.walletLabel}>
                    Wallet Balance
                  </Text>
                </View>
                <View style={styles.balanceRow}>
                  <Text style={styles.walletAmount}>
                    {formatCurrency(wallet?.totalAmount)}
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
          <View style={styles.infoCard}>
            {isZestbot ? (
              <>
                <View style={styles.infoItem}>
                  <View style={styles.greenIcon}>
                    <Ionicons
                      name="card"
                      size={18}
                      color="#2E9B51"
                    />
                  </View>
                  <Text style={styles.infoTitle}>
                    Salary
                  </Text>
                  <Text style={styles.infoValue}>
                    {formatCurrency(wallet?.salary)}
                  </Text>
                </View>
                <View style={styles.verticalDivider} />
                <View style={styles.infoItem}>
                  <View style={styles.yellowIcon}>
                    <Ionicons
                      name="trophy"
                      size={18}
                      color="#F6B500"
                    />
                  </View>
                  <Text style={styles.infoTitle}>
                    Incentives
                  </Text>
                  <Text style={styles.infoValue}>
                    {formatCurrency(wallet?.incentives)}
                  </Text>
                </View>
                <View style={styles.verticalDivider} />
                <View style={styles.infoItem}>
                  <View style={styles.greenIcon}>
                    <Ionicons
                      name="cash"
                      size={18}
                      color="#2E9B51"
                    />
                  </View>
                  <Text style={styles.infoTitle}>
                    Tips
                  </Text>
                  <Text style={styles.infoValue}>
                    {formatCurrency(wallet?.tips)}
                  </Text>
                </View>
                <View style={styles.verticalDivider} />
                <View style={styles.infoItem}>
                  <View style={styles.grayIcon}>
                    <Ionicons
                      name="calendar"
                      size={18}
                      color="#777"
                    />
                  </View>
                  <Text style={styles.infoTitle}>
                    Withdraw Date
                  </Text>
                  <Text style={styles.infoValue}>
                    {formatDate(wallet?.withdrawDate)}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.infoItem}>
                  <View style={styles.greenIcon}>
                    <Ionicons
                      name="cash"
                      size={18}
                      color="#2E9B51"
                    />
                  </View>
                  <Text style={styles.infoTitle}>
                    Available Balance
                  </Text>
                  <Text style={styles.infoValue}>
                    {formatCurrency(wallet?.availableBalance)}
                  </Text>
                </View>
                <View style={styles.verticalDivider} />
                <View style={styles.infoItem}>
                  <View style={styles.yellowIcon}>
                    <Ionicons
                      name="lock-closed"
                      size={18}
                      color="#F6B500"
                    />
                  </View>
                  <Text style={styles.infoTitle}>
                    Balance on Hold
                  </Text>
                  <Text style={styles.infoholdValue}>
                    {formatCurrency(wallet?.holdAmount)}
                  </Text>
                </View>
                <View style={styles.verticalDivider} />
                <View style={styles.infoItem}>
                  <View style={styles.grayIcon}>
                    <Ionicons
                      name="calendar"
                      size={18}
                      color="#777"
                    />
                  </View>
                  <Text style={styles.infoTitle}>
                    Withdrawal Date
                  </Text>
                  <Text style={styles.infoValue}>
                    {formatDate(wallet?.withdrawDate)}
                  </Text>
                </View>
              </>
            )}
          </View>
          <TouchableOpacity
            style={styles.statementBtn}>
            <Ionicons
              name="document-text-outline"
              size={22}
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
          onPress={() => setExpanded(!expanded)}>

          <View style={styles.sectionLeft}>
            <View style={styles.settlementIcon}>
              <Text style={styles.rupeeIcon}>₹</Text>
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
                No settlement data available
              </Text>
            ) : (
              <>
                {settlement.riderType ===
                  'ZESTBOT_EMPLOYEE' ? (
                  <>
                    <Row
                      title="Salary"
                      value={settlement.salary}
                    />
                    <Row
                      title="Incentives"
                      value={settlement.incentives}
                    />
                    <Row
                      title="Tips"
                      value={settlement.tips}
                    />
                  </>
                ) : (
                  <>
                    <Row
                      title="Total Withdraw"
                      value={settlement.totalWithdraw}
                    />
                    <Row
                      title="Tips"
                      value={settlement.tips}
                    />
                  </>
                )}
                <Row
                  title="TDS"
                  value={`- ${formatCurrency(
                    settlement.tds,
                  )}`}
                  negative
                />
                <View style={styles.netBox}>
                  <Text style={styles.netLabel}>
                    Net Earnings
                  </Text>
                  <Text style={styles.netValue}>
                    {formatCurrency(
                      settlement.totalAmount -
                      settlement.tds,
                    )}
                  </Text>
                </View>
              </>
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
              color="#1E40AF" />
            <View
              style={{
                flex: 1,
                marginLeft: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={styles.bankName}>
                  {bank?.bankName ?? 'No Bank Linked'}
                </Text>
                <Text style={styles.accountNumber}>
                  {bank?.accountNumber
                    ? `XXXX-${String(bank.accountNumber).slice(-4)}`
                    : 'Add your bank account'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('BankAC')
                }>
                <Text style={styles.manageText}>
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
          <View style={styles.transactionDivider} />
          {transactions.length === 0 ? (
            <Text style={styles.emptyText}>
              No transactions available
            </Text>
          ) : (
            displayedTransactions.map((item, index) => (
              <View key={item.id}>
                <View style={styles.transactionRow}>
                  <View>
                    <Text style={styles.txnName}>
                      {item.description}
                    </Text>
                    <Text style={styles.txnDate}>
                      {formatDateTime(item.createdAt)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.amount,
                      {
                        color:
                          item.type === 'CREDIT'
                            ? '#2E9B51'
                            : '#E53935',
                      },
                    ]}>
                    {item.type === 'CREDIT' ? '+' : '-'}
                    {formatCurrency(item.amount)}
                  </Text>
                </View>
                {index !== displayedTransactions.length - 1 && (
                  <View style={styles.transactionDivider} />
                )}
              </View>
            ))
          )}

        </View>

        {transactions.length > 3 && (
          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={() =>
              setShowAllTransactions(
                !showAllTransactions,
              )
            }>
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
const Row = ({ title, value, negative }) => (
  <View style={styles.row}>
    <Text style={styles.rowTitle}>{title}</Text>

    <Text
      style={[
        styles.rowValue,
        negative && { color: '#E53935' },
      ]}>
      {typeof value === 'number'
        ? `₹${Number(value).toLocaleString('en-IN')}`
        : value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
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
    paddingHorizontal: rw(4),
    marginBottom: 9,
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

  walletCard: {
    height: 170,
    borderRadius: 18,
    paddingTop: 18,
    paddingHorizontal: 24,
  },

  walletTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  walletContainer: {
    marginHorizontal: 16,
    backgroundColor: '#B6CCFF',
    borderRadius: 28,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 6,
    marginBottom: 17,
  },

  walletTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 13,
  },

  walletIconBox: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  greenIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#D8F5DE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  yellowIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF2C6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  grayIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  walletLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  walletAmount: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '600',
  },

  infoCard: {
    marginHorizontal: 20,
    marginTop: -65,
    backgroundColor: '#fff',
    borderRadius: 22,
    flexDirection: 'row',
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 8,
  },

  infoItem: {
    flex: 1,
    alignItems: 'center',
  },

  verticalDivider: {
    width: 1,
    height: 55,
    backgroundColor: '#E7E7E7',
  },

  infoTitle: {
    fontSize: 11,
    color: '#555',
    marginTop: 8,
    textAlign: 'center',
  },

  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
    color: '#111',
  },
  infoholdValue: {
    color: "#948989"
  },
  statementBtn: {
    marginTop: 10,
    marginHorizontal: 16,
    height: 45,
    backgroundColor: '#162D68',
    borderRadius: 13.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statementText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    marginLeft: 10,
  },

  sectionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd7d7',
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111',
  },

  breakdown: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -5,
    marginBottom: 16,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd7d7',
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  settlementIcon: {
    width: 30,
    height: 30,
    borderRadius: 21,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  rupeeIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  rowTitle: {
    fontSize: 14,
    color: '#555',
  },

  rowValue: {
    fontSize: 14,
    fontWeight: '600',
  },

  netBox: {
    backgroundColor: '#EAF9EE',
    padding: 16,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  netLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E9B51',
  },

  netValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2E9B51',
  },

  bankHeading: {
    marginHorizontal: 16,
    marginBottom: 10,
    marginTop: 3,
    fontSize: 17,
    fontWeight: '700',
  },

  bankCard: {
    backgroundColor: '#ECF0FD',
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd7d7',
  },

  bankName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  accountNumber: {
    marginTop: 4,
    color: '#666',
    fontSize: 13,
  },

  manageText: {
    color: '#2958FF',
    fontWeight: '600',
    fontSize: 14,
  },

  transactionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd7d7',
  },

  transactionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 16,
  },

  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  txnName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },

  txnDate: {
    marginTop: 4,
    fontSize: 12,
    color: '#777',
  },

  amount: {
    fontSize: 16,
    fontWeight: '700',
  },

  viewAllBtn: {
    height: 52,
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#162D68',
    justifyContent: 'center',
    alignItems: 'center',
  },

  viewAllText: {
    color: '#162D68',
    fontWeight: '700',
    fontSize: 15,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 20,
    color: '#777',
    fontSize: 14,
  },
});