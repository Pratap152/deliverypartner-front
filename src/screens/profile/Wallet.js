import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions
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

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function WalletScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [bank, setBank] = useState(null);
  const [settlement, setSettlement] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [settlementMessage, setSettlementMessage] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const walletRes = await apiClient.get('/api/rider/get/wallet');
      setWallet(walletRes.data.data);
    } catch (error) {
      console.log('Wallet Error', error);
    }

    try {
      const settlementRes = await apiClient.get('/api/settlement-breakdown');
      if (settlementRes.data.success) {
        setSettlement(settlementRes.data.data);
        setSettlementMessage('');
      } else {
        setSettlement(null);
        setSettlementMessage(settlementRes.data.message);
      }
    } catch (error) {
      console.log('Settlement Error =>', error.response?.data);
      setSettlement(null);
      setSettlementMessage(
        error.response?.data?.message || 'Unable to load settlement details',
      );
    }

    try {
      const bankRes = await apiClient.get('/api/profile/bank-details');
      setBank(bankRes.data.data);
    } catch (error) {
      console.log('Bank Error', error);
    }

    try {
      const transactionRes = await apiClient.get('/api/wallet/withdrawals');
      setTransactions(transactionRes.data.data.transactions || []);
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

  const isZestbot = wallet?.riderType === 'ZESTBOT_EMPLOYEE';

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const displayedTransactions = showAllTransactions
    ? transactions
    : transactions.slice(0, 3);

  // ─── PHONE ────────────────────────────────────────────────────────────────
  if (!isTablet) {
    return (
      <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={rf(2.6)} color="#101828" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wallet</Text>
          <TouchableOpacity
            style={styles.rightIconWrapper}
            onPress={() => navigation.navigate('HelpCenterList')}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#294484" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Wallet Card */}
          <View style={styles.walletContainer}>
            <LinearGradient
              colors={['#192A51', '#294484', '#31529D', '#3558AA', '#385FB7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.walletCard}>
              <View style={styles.walletTop}>
                <View>
                  <View style={styles.walletTitleRow}>
                    <Text style={styles.walletLabel}>Wallet Balance</Text>
                  </View>
                  <View style={styles.balanceRow}>
                    <Text style={styles.walletAmount}>
                      {formatCurrency(wallet?.totalAmount)}
                    </Text>
                  </View>
                </View>
                <View style={styles.walletIconBox}>
                  <Ionicons name="wallet" size={34} color="#355CCB" />
                </View>
              </View>
            </LinearGradient>

            <View style={styles.infoCard}>
              {isZestbot ? (
                <>
                  <View style={styles.infoItem}>
                    <View style={styles.greenIcon}>
                      <Ionicons name="card" size={18} color="#2E9B51" />
                    </View>
                    <Text style={styles.infoTitle}>Salary</Text>
                    <Text style={styles.infoValue}>
                      {formatCurrency(wallet?.salary)}
                    </Text>
                  </View>
                  <View style={styles.verticalDivider} />
                  <View style={styles.infoItem}>
                    <View style={styles.yellowIcon}>
                      <Ionicons name="trophy" size={18} color="#F6B500" />
                    </View>
                    <Text style={styles.infoTitle}>Incentives</Text>
                    <Text style={styles.infoValue}>
                      {formatCurrency(wallet?.incentives)}
                    </Text>
                  </View>
                  <View style={styles.verticalDivider} />
                  <View style={styles.infoItem}>
                    <View style={styles.greenIcon}>
                      <Ionicons name="cash" size={18} color="#2E9B51" />
                    </View>
                    <Text style={styles.infoTitle}>Tips</Text>
                    <Text style={styles.infoValue}>
                      {formatCurrency(wallet?.tips)}
                    </Text>
                  </View>
                  <View style={styles.verticalDivider} />
                  <View style={styles.infoItem}>
                    <View style={styles.grayIcon}>
                      <Ionicons name="calendar" size={18} color="#777" />
                    </View>
                    <Text style={styles.infoTitle}>Withdraw Date</Text>
                    <Text style={styles.infoValue}>
                      {formatDate(wallet?.withdrawDate)}
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.infoItem}>
                    <View style={styles.greenIcon}>
                      <Ionicons name="cash" size={isTablet ? 24 : 18} color="#2E9B51" />
                    </View>
                    <Text style={styles.infoTitle}>Available Balance</Text>
                    <Text style={styles.infoValue}>
                      {formatCurrency(wallet?.availableBalance)}
                    </Text>
                  </View>
                  <View style={styles.verticalDivider} />
                  <View style={styles.infoItem}>
                    <View style={styles.yellowIcon}>
                      <Ionicons name="lock-closed" size={isTablet ? 24 : 18} color="#F6B500" />
                    </View>
                    <Text style={styles.infoTitle}>Balance on Hold</Text>
                    <Text style={styles.infoholdValue}>
                      {formatCurrency(wallet?.holdAmount)}
                    </Text>
                  </View>
                  <View style={styles.verticalDivider} />
                  <View style={styles.infoItem}>
                    <View style={styles.grayIcon}>
                      <Ionicons name="calendar" size={isTablet ? 24 : 18} color="#777" />
                    </View>
                    <Text style={styles.infoTitle}>Withdrawal Date</Text>
                    <Text style={styles.infoValue}>
                      {formatDate(wallet?.withdrawDate)}
                    </Text>
                  </View>
                </>
              )}
            </View>

            <TouchableOpacity style={styles.statementBtn}>
              <Ionicons name="document-text-outline" size={22} color="#fff" />
              <Text style={styles.statementText}>Statement</Text>
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
              <Text style={styles.sectionTitle}>Settlement Breakdown</Text>
            </View>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#111"
            />
          </TouchableOpacity>

          {expanded && (
            <View style={styles.breakdown}>
              {!settlement ? (
                <Text style={styles.emptyText}>
                  {settlementMessage || 'No settlement data available'}
                </Text>
              ) : (
                <>
                  {settlement.riderType === 'ZESTBOT_EMPLOYEE' ? (
                    <>
                      <Row title="Salary" value={settlement.salary} />
                      <Row title="Incentives" value={settlement.incentives} />
                      <Row title="Tips" value={settlement.tips} />
                    </>
                  ) : (
                    <>
                      <Row title="Total Withdraw" value={settlement.totalWithdraw} />
                      <Row title="Tips" value={settlement.tips} />
                    </>
                  )}
                  <Row
                    title="TDS"
                    value={`- ${formatCurrency(settlement.tds)}`}
                    negative
                  />
                  <View style={styles.netBox}>
                    <Text style={styles.netLabel}>Net Earnings</Text>
                    <Text style={styles.netValue}>
                      {formatCurrency(settlement.totalAmount - settlement.tds)}
                    </Text>
                  </View>
                </>
              )}
            </View>
          )}

          {/* Bank */}
          <>
            <Text style={styles.bankHeading}>Linked Bank Account</Text>
            <View style={styles.bankCard}>
              <Ionicons name="wallet" size={24} color="#1E40AF" />
              <View style={{ flex: 1, marginLeft: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
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
                <TouchableOpacity onPress={() => navigation.navigate('BankAC')}>
                  <Text style={styles.manageText}>{bank ? 'Manage' : 'Add'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>

          {/* Transactions */}
          <View style={styles.transactionCard}>
            <Text style={styles.transactionTitle}>Recent Transactions</Text>
            <View style={styles.transactionDivider} />
            {transactions.length === 0 ? (
              <Text style={styles.emptyText}>No transactions available</Text>
            ) : (
              displayedTransactions.map((item, index) => (
                <View key={item.id}>
                  <View style={styles.transactionRow}>
                    <View>
                      <Text style={styles.txnName}>{item.description}</Text>
                      <Text style={styles.txnDate}>
                        {formatDateTime(item.createdAt)}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.amount,
                        { color: item.type === 'CREDIT' ? '#2E9B51' : '#E53935' },
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
              onPress={() => setShowAllTransactions(!showAllTransactions)}>
              <Text style={styles.viewAllText}>
                {showAllTransactions ? 'Show Less' : 'View All Transactions'}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── TABLET ───────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={tabletStyles.container}>
      {/* Header */}
      <View style={tabletStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#101828" />
        </TouchableOpacity>
        <Text style={tabletStyles.headerTitle}>Wallet</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('HelpCenterList')}>
          <Ionicons name="chatbubble-ellipses-outline" size={30} color="#294484" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tabletStyles.scrollContent}>

        {/* Wallet Card */}
        <View style={tabletStyles.walletContainer}>
          <LinearGradient
            colors={['#192A51', '#294484', '#31529D', '#3558AA', '#385FB7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={tabletStyles.walletCard}>
            <View style={tabletStyles.walletTop}>
              <View>
                <Text style={tabletStyles.walletLabel}>Wallet Balance</Text>
                <Text style={tabletStyles.walletAmount}>
                  {formatCurrency(wallet?.totalAmount)}
                </Text>
              </View>
              <View style={tabletStyles.walletIconBox}>
                <Ionicons name="wallet" size={44} color="#355CCB" />
              </View>
            </View>
          </LinearGradient>

          <View style={tabletStyles.infoCard}>
            {isZestbot ? (
              <>
                <View style={tabletStyles.infoItem}>
                  <View style={tabletStyles.greenIcon}>
                    <Ionicons name="card" size={24} color="#2E9B51" />
                  </View>
                  <Text style={tabletStyles.infoTitle}>Salary</Text>
                  <Text style={tabletStyles.infoValue}>
                    {formatCurrency(wallet?.salary)}
                  </Text>
                </View>
                <View style={tabletStyles.verticalDivider} />
                <View style={tabletStyles.infoItem}>
                  <View style={tabletStyles.yellowIcon}>
                    <Ionicons name="trophy" size={24} color="#F6B500" />
                  </View>
                  <Text style={tabletStyles.infoTitle}>Incentives</Text>
                  <Text style={tabletStyles.infoValue}>
                    {formatCurrency(wallet?.incentives)}
                  </Text>
                </View>
                <View style={tabletStyles.verticalDivider} />
                <View style={tabletStyles.infoItem}>
                  <View style={tabletStyles.greenIcon}>
                    <Ionicons name="cash" size={24} color="#2E9B51" />
                  </View>
                  <Text style={tabletStyles.infoTitle}>Tips</Text>
                  <Text style={tabletStyles.infoValue}>
                    {formatCurrency(wallet?.tips)}
                  </Text>
                </View>
                <View style={tabletStyles.verticalDivider} />
                <View style={tabletStyles.infoItem}>
                  <View style={tabletStyles.grayIcon}>
                    <Ionicons name="calendar" size={24} color="#777" />
                  </View>
                  <Text style={tabletStyles.infoTitle}>Withdraw Date</Text>
                  <Text style={tabletStyles.infoValue}>
                    {formatDate(wallet?.withdrawDate)}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View style={tabletStyles.infoItem}>
                  <View style={tabletStyles.greenIcon}>
                    <Ionicons name="cash" size={24} color="#2E9B51" />
                  </View>
                  <Text style={tabletStyles.infoTitle}>Available Balance</Text>
                  <Text style={tabletStyles.infoValue}>
                    {formatCurrency(wallet?.availableBalance)}
                  </Text>
                </View>
                <View style={tabletStyles.verticalDivider} />
                <View style={tabletStyles.infoItem}>
                  <View style={tabletStyles.yellowIcon}>
                    <Ionicons name="lock-closed" size={24} color="#F6B500" />
                  </View>
                  <Text style={tabletStyles.infoTitle}>Balance on Hold</Text>
                  <Text style={tabletStyles.infoholdValue}>
                    {formatCurrency(wallet?.holdAmount)}
                  </Text>
                </View>
                <View style={tabletStyles.verticalDivider} />
                <View style={tabletStyles.infoItem}>
                  <View style={tabletStyles.grayIcon}>
                    <Ionicons name="calendar" size={24} color="#777" />
                  </View>
                  <Text style={tabletStyles.infoTitle}>Withdrawal Date</Text>
                  <Text style={tabletStyles.infoValue}>
                    {formatDate(wallet?.withdrawDate)}
                  </Text>
                </View>
              </>
            )}
          </View>

          <TouchableOpacity style={tabletStyles.statementBtn}>
            <Ionicons name="document-text-outline" size={28} color="#fff" />
            <Text style={tabletStyles.statementText}>Statement</Text>
          </TouchableOpacity>
        </View>

        {/* Settlement */}
        <TouchableOpacity
          style={tabletStyles.sectionCard}
          onPress={() => setExpanded(!expanded)}>
          <View style={tabletStyles.sectionLeft}>
            <View style={tabletStyles.settlementIcon}>
              <Text style={tabletStyles.rupeeIcon}>₹</Text>
            </View>
            <Text style={tabletStyles.sectionTitle}>Settlement Breakdown</Text>
          </View>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={28}
            color="#111"
          />
        </TouchableOpacity>

        {expanded && (
          <View style={tabletStyles.breakdown}>
            {!settlement ? (
              <Text style={tabletStyles.emptyText}>
                {settlementMessage || 'No settlement data available'}
              </Text>
            ) : (
              <>
                {settlement.riderType === 'ZESTBOT_EMPLOYEE' ? (
                  <>
                    <TabletRow title="Salary" value={settlement.salary} />
                    <TabletRow title="Incentives" value={settlement.incentives} />
                    <TabletRow title="Tips" value={settlement.tips} />
                  </>
                ) : (
                  <>
                    <TabletRow title="Total Withdraw" value={settlement.totalWithdraw} />
                    <TabletRow title="Tips" value={settlement.tips} />
                  </>
                )}
                <TabletRow
                  title="TDS"
                  value={`- ${formatCurrency(settlement.tds)}`}
                  negative
                />
                <View style={tabletStyles.netBox}>
                  <Text style={tabletStyles.netLabel}>Net Earnings</Text>
                  <Text style={tabletStyles.netValue}>
                    {formatCurrency(settlement.totalAmount - settlement.tds)}
                  </Text>
                </View>
              </>
            )}
          </View>
        )}

        {/* Bank */}
        <Text style={tabletStyles.bankHeading}>Linked Bank Account</Text>
        <View style={tabletStyles.bankCard}>
          <Ionicons name="wallet" size={32} color="#1E40AF" />
          <View style={{ flex: 1, marginLeft: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={tabletStyles.bankName}>
                {bank?.bankName ?? 'No Bank Linked'}
              </Text>
              <Text style={tabletStyles.accountNumber}>
                {bank?.accountNumber
                  ? `XXXX-${String(bank.accountNumber).slice(-4)}`
                  : 'Add your bank account'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('BankAC')}>
              <Text style={tabletStyles.manageText}>{bank ? 'Manage' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transactions */}
        <View style={tabletStyles.transactionCard}>
          <Text style={tabletStyles.transactionTitle}>Recent Transactions</Text>
          <View style={tabletStyles.transactionDivider} />
          {transactions.length === 0 ? (
            <Text style={tabletStyles.emptyText}>No transactions available</Text>
          ) : (
            displayedTransactions.map((item, index) => (
              <View key={item.id}>
                <View style={tabletStyles.transactionRow}>
                  <View>
                    <Text style={tabletStyles.txnName}>{item.description}</Text>
                    <Text style={tabletStyles.txnDate}>
                      {formatDateTime(item.createdAt)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      tabletStyles.amount,
                      { color: item.type === 'CREDIT' ? '#2E9B51' : '#E53935' },
                    ]}>
                    {item.type === 'CREDIT' ? '+' : '-'}
                    {formatCurrency(item.amount)}
                  </Text>
                </View>
                {index !== displayedTransactions.length - 1 && (
                  <View style={tabletStyles.transactionDivider} />
                )}
              </View>
            ))
          )}
        </View>

        {transactions.length > 3 && (
          <TouchableOpacity
            style={tabletStyles.viewAllBtn}
            onPress={() => setShowAllTransactions(!showAllTransactions)}>
            <Text style={tabletStyles.viewAllText}>
              {showAllTransactions ? 'Show Less' : 'View All Transactions'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Row components ──────────────────────────────────────────────────────────
const Row = ({ title, value, negative }) => (
  <View style={styles.row}>
    <Text style={styles.rowTitle}>{title}</Text>
    <Text style={[styles.rowValue, negative && { color: '#E53935' }]}>
      {typeof value === 'number'
        ? `₹${Number(value).toLocaleString('en-IN')}`
        : value}
    </Text>
  </View>
);

const TabletRow = ({ title, value, negative }) => (
  <View style={tabletStyles.row}>
    <Text style={tabletStyles.rowTitle}>{title}</Text>
    <Text style={[tabletStyles.rowValue, negative && { color: '#E53935' }]}>
      {typeof value === 'number'
        ? `₹${Number(value).toLocaleString('en-IN')}`
        : value}
    </Text>
  </View>
);

// ─── Phone styles (unchanged) ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(4), marginBottom: 9, paddingVertical: rh(2.2), backgroundColor: '#FFFFFF', elevation: 3 },
  headerTitle: { fontSize: rf(2.3), fontWeight: '700', color: '#101828' },

  walletContainer: { marginHorizontal: 16, backgroundColor: '#B6CCFF', borderRadius: 28, paddingBottom: 10, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6, marginBottom: 17 },
  walletCard: { height: 170, borderRadius: 18, paddingTop: 18, paddingHorizontal: 24 },
  walletTop: { flexDirection: 'row', justifyContent: 'space-between' },
  walletTitleRow: { flexDirection: 'row', alignItems: 'center' },
  balanceRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 13 },

  walletIconBox: { width: 40, height: 40, borderRadius: 16, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  greenIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#D8F5DE', justifyContent: 'center', alignItems: 'center' },
  yellowIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFF2C6', justifyContent: 'center', alignItems: 'center' },
  grayIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#EFEFEF', justifyContent: 'center', alignItems: 'center' },

  walletLabel: { color: '#fff', fontSize: 18, fontWeight: '700' },
  walletAmount: { color: '#fff', fontSize: 26, fontWeight: '600' },

  infoCard: { marginHorizontal: 20, marginTop: -65, backgroundColor: '#fff', borderRadius: 22, flexDirection: 'row', paddingVertical: 18, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  infoItem: { flex: 1, alignItems: 'center' },
  verticalDivider: { width: 1, height: 55, backgroundColor: '#E7E7E7' },
  infoTitle: { fontSize: 11, color: '#555', marginTop: 8, textAlign: 'center' },
  infoValue: { fontSize: 16, fontWeight: '700', marginTop: 4, color: '#111' },
  infoholdValue: { color: '#948989' },

  statementBtn: { marginTop: 10, marginHorizontal: 16, height: 45, backgroundColor: '#162D68', borderRadius: 13.5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  statementText: { color: '#fff', fontWeight: '600', fontSize: 18, marginLeft: 10 },

  sectionCard: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 12, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderWidth: 1, borderColor: '#ddd7d7' },
  sectionLeft: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: '#111' },

  breakdown: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: -5, marginBottom: 16, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#ddd7d7' },

  settlementIcon: { width: 30, height: 30, borderRadius: 21, backgroundColor: '#1E40AF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rupeeIcon: { color: '#fff', fontSize: 24, fontWeight: '700' },

  row: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  rowTitle: { fontSize: 14, color: '#555' },
  rowValue: { fontSize: 14, fontWeight: '600' },

  netBox: { backgroundColor: '#EAF9EE', padding: 16, flexDirection: 'row', justifyContent: 'space-between' },
  netLabel: { fontSize: 16, fontWeight: '700', color: '#2E9B51' },
  netValue: { fontSize: 20, fontWeight: '800', color: '#2E9B51' },

  bankHeading: { marginHorizontal: 16, marginBottom: 10, marginTop: 3, fontSize: 17, fontWeight: '700' },
  bankCard: { backgroundColor: '#ECF0FD', marginHorizontal: 16, borderRadius: 14, padding: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd7d7' },
  bankName: { fontSize: 16, fontWeight: '700', color: '#111' },
  accountNumber: { marginTop: 4, color: '#666', fontSize: 13 },
  manageText: { color: '#2958FF', fontWeight: '600', fontSize: 14 },

  transactionCard: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#ddd7d7' },
  transactionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 16 },
  transactionDivider: { height: 1, backgroundColor: '#E5E5E5', marginBottom: 16 },
  transactionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  txnName: { fontSize: 15, fontWeight: '600', color: '#111' },
  txnDate: { marginTop: 4, fontSize: 12, color: '#777' },
  amount: { fontSize: 16, fontWeight: '700' },

  viewAllBtn: { height: 52, marginHorizontal: 16, marginTop: 4, marginBottom: 24, borderRadius: 12, borderWidth: 1.5, borderColor: '#162D68', justifyContent: 'center', alignItems: 'center' },
  viewAllText: { color: '#162D68', fontWeight: '700', fontSize: 15 },

  emptyText: { textAlign: 'center', paddingVertical: 20, color: '#777', fontSize: 14 },
});

// ─── Tablet styles ────────────────────────────────────────────────────────────
const tabletStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 32, paddingVertical: 20, backgroundColor: '#FFFFFF', elevation: 3, marginBottom: 0 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#101828' },

  scrollContent: { paddingBottom: 40 },

  // Wallet card — taller, more padding
  walletContainer: { marginHorizontal: 28, backgroundColor: '#B6CCFF', borderRadius: 32, paddingBottom: 14, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 6, marginTop: 24, marginBottom: 20 },
  walletCard: { height: 220, borderRadius: 24, paddingTop: 28, paddingHorizontal: 36 },
  walletTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  walletLabel: { color: '#fff', fontSize: 22, fontWeight: '700' },
  walletAmount: { color: '#fff', fontSize: 40, fontWeight: '600', marginTop: 18 },
  walletIconBox: { width: 56, height: 56, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },

  // Info strip — larger icons and text
  infoCard: { marginHorizontal: 28, marginTop: -80, backgroundColor: '#fff', borderRadius: 24, flexDirection: 'row', paddingVertical: 24, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 14, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  infoItem: { flex: 1, alignItems: 'center' },
  verticalDivider: { width: 1, height: 70, backgroundColor: '#E7E7E7', alignSelf: 'center' },
  infoTitle: { fontSize: 18, color: '#555', marginTop: 10, textAlign: 'center' },
  infoValue: { fontSize: 20, fontWeight: '700', marginTop: 6, color: '#111' },
  infoholdValue: { fontSize: 20, fontWeight: '700', marginTop: 6, color: '#948989' },

  greenIcon: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#D8F5DE', justifyContent: 'center', alignItems: 'center' },
  yellowIcon: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#FFF2C6', justifyContent: 'center', alignItems: 'center' },
  grayIcon: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#EFEFEF', justifyContent: 'center', alignItems: 'center' },

  statementBtn: { marginTop: 14, marginHorizontal: 24, height: 58, backgroundColor: '#162D68', borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  statementText: { color: '#fff', fontWeight: '600', fontSize: 22, marginLeft: 12 },

  // Settlement
  sectionCard: { backgroundColor: '#fff', marginHorizontal: 28, marginBottom: 14, borderRadius: 14, height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, borderWidth: 1, borderColor: '#ddd7d7' },
  sectionLeft: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#111' },
  settlementIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#1E40AF', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  rupeeIcon: { color: '#fff', fontSize: 28, fontWeight: '700' },

  breakdown: { backgroundColor: '#fff', marginHorizontal: 28, marginTop: -7, marginBottom: 20, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#ddd7d7' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 18 },
  rowTitle: { fontSize: 18, color: '#555' },
  rowValue: { fontSize: 18, fontWeight: '600' },
  netBox: { backgroundColor: '#EAF9EE', padding: 22, flexDirection: 'row', justifyContent: 'space-between' },
  netLabel: { fontSize: 20, fontWeight: '700', color: '#2E9B51' },
  netValue: { fontSize: 26, fontWeight: '800', color: '#2E9B51' },

  emptyText: { textAlign: 'center', paddingVertical: 28, color: '#777', fontSize: 17 },

  // Bank
  bankHeading: { marginHorizontal: 28, marginBottom: 12, marginTop: 4, fontSize: 22, fontWeight: '700' },
  bankCard: { backgroundColor: '#ECF0FD', marginHorizontal: 28, borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd7d7' },
  bankName: { fontSize: 20, fontWeight: '700', color: '#111' },
  accountNumber: { marginTop: 5, color: '#666', fontSize: 16 },
  manageText: { color: '#2958FF', fontWeight: '600', fontSize: 18 },

  // Transactions
  transactionCard: { backgroundColor: '#fff', marginHorizontal: 28, marginTop: 20, borderRadius: 18, padding: 24, borderWidth: 1, borderColor: '#ddd7d7' },
  transactionTitle: { fontSize: 24, fontWeight: '700', marginBottom: 18 },
  transactionDivider: { height: 1, backgroundColor: '#E5E5E5', marginBottom: 18 },
  transactionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  txnName: { fontSize: 20, fontWeight: '600', color: '#111' },
  txnDate: { marginTop: 5, fontSize: 16, color: '#777' },
  amount: { fontSize: 20, fontWeight: '700' },

  viewAllBtn: { height: 62, marginHorizontal: 28, marginTop: 6, marginBottom: 28, borderRadius: 14, borderWidth: 1.5, borderColor: '#162D68', justifyContent: 'center', alignItems: 'center' },
  viewAllText: { color: '#162D68', fontWeight: '700', fontSize: 18 },
});