import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
 StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import DeviceInfo from 'react-native-device-info';

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

const isTablet = DeviceInfo.isTablet();

export default function WalletScreen({ navigation }) {
  const [balance, setBalance] = useState(
    WALLET_DATA.availableBalance,
  );

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
          style={[
            styles.icon,
            isCredit ? styles.creditIcon : styles.debitIcon,
          ]}
        >
          <Ionicons
            name={isCredit ? 'arrow-down' : 'arrow-up'}
            size={isTablet ? 24 : 18}
            color={isCredit ? '#0AAE4F' : '#E53935'}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={styles.txnTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>

          <Text style={styles.txnDate}>
            {item.date}
          </Text>
        </View>

        <Text
          style={[
            styles.amount,
            isCredit ? styles.credit : styles.debit,
          ]}
        >
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
          <Ionicons
            name="arrow-back"
            size={isTablet ? 34 : 24}
          />
        </TouchableOpacity>

        <Text style={styles.header}>Wallet</Text>

        <Ionicons
          name="chatbubble-ellipses-outline"
          size={isTablet ? 30 : 22}
        />
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <MaterialCommunityIcons
            name="wallet"
            size={isTablet ? 30 : 22}
            color="#FFF"
          />

          <Text style={styles.label}>
            Available Balance
          </Text>
        </View>

        <Text style={styles.balance}>₹{balance}</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons
              name="arrow-up-circle-outline"
              size={isTablet ? 24 : 18}
            />

            <Text style={styles.actionText}>
              {' '}
              Withdraw
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons
              name="download-outline"
              size={isTablet ? 24 : 18}
            />

            <Text style={styles.actionText}>
              {' '}
              Statement
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pendingBox}>
          <Text style={styles.pendingLabel}>
            Pending Amount
          </Text>

          <Text style={styles.pendingAmount}>
            ₹{WALLET_DATA.pendingCodAmount}
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <View style={styles.quickItem}>
          <Ionicons
            name="add-circle"
            size={isTablet ? 38 : 26}
            color="#20C997"
          />

          <Text style={styles.quickText}>
            Add Money
          </Text>
        </View>

        <View style={styles.quickItem}>
          <AntDesign
            name="bank"
            size={isTablet ? 38 : 26}
            color="#4C6EF5"
          />

          <Text style={styles.quickText}>
            Bank Link
          </Text>
        </View>

        <View style={styles.quickItem}>
          <Ionicons
            name="trending-up"
            size={isTablet ? 38 : 26}
            color="#845EF7"
          />

          <Text style={styles.quickText}>
            Insights
          </Text>
        </View>
      </View>

      {/* Transactions */}
      <Text style={styles.section}>
        Recent Transactions
      </Text>

      <FlatList
        data={WALLET_DATA.recentTransactions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: hp('3%'),
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    padding: isTablet ? wp('3%') : 16,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: isTablet ? hp('2.5%') : 16,
  },

  header: {
    fontSize: isTablet ? wp('4%') : 20,
    fontWeight: '600',
  },

  balanceCard: {
    backgroundColor: '#12B5C9',
    borderRadius: isTablet ? 24 : 16,
    padding: isTablet ? wp('4%') : 16,
    marginBottom: isTablet ? hp('2.5%') : 16,
  },

  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  label: {
    color: '#EFFFFF',
    fontSize: isTablet ? wp('2.2%') : 12,
  },

  balance: {
    color: '#FFF',
    fontSize: isTablet ? wp('5.5%') : 28,
    fontWeight: '700',
    marginVertical: 8,
  },

  actionRow: {
    flexDirection: 'row',
    marginVertical: isTablet ? hp('2%') : 12,
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: isTablet ? hp('1.3%') : 8,
    paddingHorizontal: isTablet ? wp('3%') : 16,
    borderRadius: 20,
    marginRight: 12,
  },

  actionText: {
    fontWeight: '500',
    fontSize: isTablet ? wp('2.2%') : 14,
  },

  pendingBox: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: isTablet ? wp('3%') : 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  pendingLabel: {
    fontSize: isTablet ? wp('2.3%') : 14,
  },

  pendingAmount: {
    fontWeight: '600',
    fontSize: isTablet ? wp('2.5%') : 15,
  },

  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: isTablet ? hp('2.5%') : 16,
  },

  quickItem: {
    backgroundColor: '#FFF',
    paddingVertical: isTablet ? hp('2.5%') : 14,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },

  quickText: {
    marginTop: 6,
    fontSize: isTablet ? wp('2.1%') : 12,
    fontWeight: '500',
  },

  section: {
    fontSize: isTablet ? wp('3%') : 16,
    fontWeight: '600',
    marginBottom: isTablet ? hp('1.5%') : 8,
  },

  txnRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: isTablet ? wp('3%') : 12,
    borderRadius: 12,
    marginBottom: isTablet ? hp('1.2%') : 10,
    alignItems: 'center',
  },

  icon: {
    width: isTablet ? 52 : 36,
    height: isTablet ? 52 : 36,
    borderRadius: isTablet ? 26 : 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  creditIcon: {
    backgroundColor: '#E6F9F0',
  },

  debitIcon: {
    backgroundColor: '#FDECEC',
  },

  txnTitle: {
    fontWeight: '600',
    fontSize: isTablet ? wp('2.5%') : 14,
  },

  txnDate: {
    fontSize: isTablet ? wp('1.9%') : 12,
    color: '#777',
    marginTop: 2,
  },

  amount: {
    fontWeight: '700',
    fontSize: isTablet ? wp('2.5%') : 14,
  },

  credit: {
    color: '#0AAE4F',
  },

  debit: {
    color: '#E53935',
  },
});