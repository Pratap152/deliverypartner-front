import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import apiClient from '../../services/ApiClient';

// STATIC DATA (UNCHANGED)
const WALLET_DATA = {
  availableBalance: 12450,
  pendingCodAmount: 850,
  recentTransactions: [
    {
      id: '1',
      title: 'Weekly Earnings Payout',
      type: 'CREDIT',
      amount: 8450,
      date: '12/15/2024 • 10:30 AM',
    },
    {
      id: '2',
      title: 'Cash Deposit to HQ',
      type: 'DEBIT',
      amount: 2500,
      date: '12/14/2024 • 08:45 PM',
    },
    {
      id: '3',
      title: 'Bonus Payment',
      type: 'CREDIT',
      amount: 500,
      date: '12/13/2024 • 06:20 PM',
    },
    {
      id: '4',
      title: 'Customer Tip',
      type: 'CREDIT',
      amount: 150,
      date: '12/13/2024 • 03:15 PM',
    },
  ],
};

export default function WalletScreen({ navigation }) {
  const [balance, setBalance] = useState(WALLET_DATA.availableBalance);

  //  Only added logic
  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await apiClient.get('/api/profile/wallet');

      console.log('Wallet API Response:', res.data);

      const apiBalance = res.data?.data?.balance;
      if (apiBalance !== undefined) {
        setBalance(Number(apiBalance).toFixed(2));
      }
    } catch (err) {
      console.log('Wallet API Error:', err);
    }
  };

  const renderItem = ({ item }) => {
    const isCredit = item.type === 'CREDIT';

    return (
      <View style={styles.txnRow}>
        <View
          style={[styles.icon, isCredit ? styles.creditIcon : styles.debitIcon]}
        >
          <Ionicons
            name={isCredit ? 'arrow-down' : 'arrow-up'}
            size={18}
            color={isCredit ? '#0AAE4F' : '#E53935'}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.txnTitle}>{item.title}</Text>
          <Text style={styles.txnDate}>{item.date}</Text>
        </View>
        <Text style={[styles.amount, isCredit ? styles.credit : styles.debit]}>
          {isCredit ? '+' : '-'}₹{item.amount}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.header}>Wallet</Text>
        <Ionicons name="chatbubble-ellipses-outline" size={22} />
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <MaterialCommunityIcons name="wallet" size={22} color="#FFF" />
          <Text style={styles.label}>Available Balance</Text>
        </View>

        {/*  ONLY THIS LINE CHANGED */}
        <Text style={styles.balance}>₹{balance}</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="arrow-up-circle-outline" size={18} />
            <Text style={styles.actionText}> Withdraw</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="download-outline" size={18} />
            <Text style={styles.actionText}> Statement</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pendingBox}>
          <Text>Pending Amount</Text>
          <Text style={styles.pendingAmount}>
            ₹{WALLET_DATA.pendingCodAmount}
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <View style={styles.quickItem}>
          <Ionicons name="add-circle" size={26} color="#20C997" />
          <Text style={styles.quickText}>Add Money</Text>
        </View>
        <View style={styles.quickItem}>
          <AntDesign name="bank" size={26} color="#4C6EF5" />
          <Text style={styles.quickText}>Bank Link</Text>
        </View>
        <View style={styles.quickItem}>
          <Ionicons name="trending-up" size={26} color="#845EF7" />
          <Text style={styles.quickText}>Insights</Text>
        </View>
      </View>

      {/* Transactions */}
      <Text style={styles.section}>Recent Transactions</Text>
      <FlatList
        data={WALLET_DATA.recentTransactions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA', padding: 16 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  header: { fontSize: 20, fontWeight: '600' },

  balanceCard: {
    backgroundColor: '#12B5C9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  balanceHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { color: '#EFFFFF', fontSize: 12 },
  balance: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '700',
    marginVertical: 8,
  },

  actionRow: { flexDirection: 'row', marginVertical: 12 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
  },
  actionText: { fontWeight: '500' },

  pendingBox: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pendingAmount: { fontWeight: '600' },

  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickItem: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quickText: { marginTop: 6, fontSize: 12 },

  section: { fontSize: 16, fontWeight: '600', marginBottom: 8 },

  txnRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  creditIcon: { backgroundColor: '#E6F9F0' },
  debitIcon: { backgroundColor: '#FDECEC' },

  txnTitle: { fontWeight: '600' },
  txnDate: { fontSize: 12, color: '#777' },

  amount: { fontWeight: '700' },
  credit: { color: '#0AAE4F' },
  debit: { color: '#E53935' },
});
