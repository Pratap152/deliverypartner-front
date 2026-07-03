import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import SlotHistory from '../../screens/profile/SlotHistory';
import OrderHistory from '../../screens/profile/OrderHistory';
import useEarningsDashboard from '../../hooks/useEarningsDashboard';
import { formatMoney } from '../../utils/formatMoney';
import EarningsHistoryScreen from '../../screens/earnings/EarningsHistoryScreen';
import Tips from '../../screens/Home/Tips';
import useTodayOrdersCount from '../../hooks/useTodayOrdersCount';
import apiClient from '../../services/ApiClient';

const StatItem = ({ icon, value, label, bgColor, screen }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (!screen) return;

    if (typeof screen === 'object') {
      navigation.navigate(screen.parent, {
        screen: screen.child,
      });
    } else {
      navigation.navigate(screen);
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={{ alignItems: 'center' }}
        onPress={handlePress}
        disabled={!screen}
      >
        <View style={[styles.iconWrapper, { backgroundColor: bgColor }]}>
          <Ionicons name={icon} size={wp('5%')} color="#fff" />
        </View>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};


const StatsCard = ({ isActive, totalOnlineMinutes }) => {
  const { data } = useEarningsDashboard();
  const { todayEarnings = {} } = data;
  const [minutes, setMinutes] = useState(0);
  const todayOrdersCount = useTodayOrdersCount();

  // Increment only if online
  useEffect(() => {
    setMinutes(totalOnlineMinutes)
    if (!isActive) return;

    const interval = setInterval(() => {
      setMinutes(prev => prev + 1);
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalMinutes) => {
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hrs}h ${mins < 10 ? '0' : ''}${mins}m`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
  <StatItem
    icon="trending-up"
    value={`₹${formatMoney(todayEarnings.totalEarnings ?? 0)}`}
    label="Earnings"
    bgColor="#2ECC71"
    screen={EarningsHistoryScreen}
  />

  <StatItem
  icon="cash-outline"
  value={`₹${formatMoney(todayEarnings.tips ?? 0)}`}
  label="Tips"
  bgColor="#8E7CF3"
  screen={Tips}
/>

  <StatItem
    icon="cart-outline"
    value={todayOrdersCount}
    label="Orders"
    bgColor="#FF6FAE"
    screen={OrderHistory}
  />
</View>
    </View>
  );
};

export default React.memo(StatsCard);
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp('2%'),
    marginTop: wp('4%'),
  },
  title: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: '#111',
    marginBottom: wp('4%'),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  card: {
    width: wp('27%'),
    backgroundColor: '#FFFFFF',
    borderRadius: wp('4%'),
    paddingVertical: wp('4%'),
    margin:wp('1%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  iconWrapper: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: wp('3%'),
  },
  value: {
    fontSize: wp('4.3%'),
    fontWeight: '700',
    color: '#111',
  },
  label: {
    fontSize: wp('3.2%'),
    color: '#8E8E93',
    marginTop: wp('1%'),
  },
});
