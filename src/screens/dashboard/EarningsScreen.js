import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BarChart } from 'react-native-gifted-charts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import useEarningsDashboard from '../../hooks/useEarningsDashboard';
import IncentiveCard from '../../components/dashboard/earnings/IncentiveCard';
import MonthlySummaryCard from '../../components/dashboard/earnings/MonthlySummaryCard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function EarningsScreen({ navigation }) {
  const { data, loading, refreshing, onRefresh } =
    useEarningsDashboard();
 
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00A63E" />
      </View>
    );
  }

  const {
    earningsSummary = {},
    weeklyBarChart = {},
    wallet = {},
    incentives = [],
  } = data;


  const today = earningsSummary.today || {};
  const week = earningsSummary.week || {};
  const month = earningsSummary.month || {};
  console.log("today",today);
  console.log("week",week);
  console.log("month",month);

  const barChart = Array.isArray(data.weeklyBarChart)
  ? data.weeklyBarChart
  : [];

  
  const cardWidth = wp(90);
  const cardPadding = wp(4);
  const chartHeight = hp(30);
  const yAxisWidth = wp(15);


  const weeklyEarnings = [
    { label: 'Mon', value: 120 },
    { label: 'Tue', value: 180 },
    { label: 'Wed', value: 90 },
    { label: 'Thu', value: 220 },
    { label: 'Fri', value: 150 },
    { label: 'Sat', value: 290 },
    { label: 'Sun', value: 110 },
  ];



  /* HEADER IS A STABLE ELEMENT — NOT A FUNCTION */
  const HEADER = (
    <View style={{ backgroundColor: '#F4F6F8' }}>
      {/* TOP GRADIENT */}
      <LinearGradient
        colors={['#00A63E', '#009966']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={styles.header}>
        <View style={styles.heading}>
          <Text style={styles.title}>Earnings</Text>
          <View style={{alignItems:"flex-end", flexDirection:"row"}}>
          <TouchableOpacity style={{paddingRight:10}} onPress={()=>navigation.navigate("EarningsHistoryScreen",{mode:'HISTORY'})}>
            <MaterialIcons name="history" size={28} color="rgb(252, 251, 251)"/>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../../assets/chat.png')}
              style={styles.chat_icon}
            />
          </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.daily_summary} onPress={()=>navigation.navigate('EarningsHistoryScreen',{mode:'DAY'})} >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', gap: wp(10) }}>
              <View>
                <Text style={styles.daily_text}>Today's Earnings</Text>
                <Text style={[styles.daily_details,{marginTop:hp(1),fontWeight:500}]}>Base Earnings : ₹{today.baseEarnings}</Text>
                <View style={[styles.daily_details_container, { marginTop: wp(2) }]}>
                  <Text style={styles.daily_details}>Orders</Text>
                  <Text style={styles.daily_details}>Tips </Text>
                  <Text style={styles.daily_details}>Incentives</Text>
                </View>
                <View style={[styles.daily_details_container]}>
                  <Text style={styles.daily_details}>{today.orders}</Text>
                  <Text style={[styles.daily_details, { marginLeft: wp(5) }]}>₹{today.tips}</Text>
                  <Text style={[styles.daily_details, { marginRight:wp(10) }]}>₹{today.incentives}</Text>

                </View>
              </View>
              <View>
                <Text style={{ fontSize: wp(6), color: '#FFFFFF', fontWeight: '600' }}> ₹{today.earnings}</Text>
              </View>
            </View>
          </TouchableOpacity>
      </LinearGradient>

      {/* WEEKLY CARD */}
      <View style={[styles.card, { width: cardWidth, padding: cardPadding, }]}>
        <TouchableOpacity onPress={()=>navigation.navigate('EarningsHistoryScreen',{mode:'WEEK'})} >
        <View style={styles.cardHeader}>
          
          <Text style={styles.cardTitle}>This Week</Text>
          <Text style={styles.cardValue}>₹{week.earnings}</Text>
        </View>
        
 
        <BarChart
          data={barChart}
          width={cardWidth - cardPadding * 2 - yAxisWidth}
          height={chartHeight}
          barWidth={wp(5)}
          spacing={wp(4)}
          roundedTop
          hideRules
          noOfSections={5}
          frontColor="#22C55E"
 
          pointerConfig={{
            pointerStripHeight: hp(20),
            pointerStripColor: '#22C55E',
            pointerStripWidth: 2,
            pointerColor: '#22C55E',
            radius: 6,
 
            activatePointersOnLongPress: false,
            activatePointersOnPress: true,
 
            pointerLabelComponent: items => {
              return (
                <View
                  style={{
                    backgroundColor: '#111',
                    padding: 6,
                    width:wp(10),
                    borderRadius: 6,
                    marginBottom: 6, // pushes tooltip up
                  }}>
                  <Text style={{ color: '#fff', fontSize: wp(3),alignSelf:'center' }}>
                    ₹{items[0].value}
                  </Text>
                </View>
              );
            },
          }}
        />
    </TouchableOpacity>
 
 
      </View>

      {/* WALLET */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Wallet')}>
        <LinearGradient
          colors={['#4F39F6', '#155DFC']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.wallet}
        >
          <View style={styles.walletRow}>
            <Ionicons name="wallet-outline" size={20} color="#fff" />
            <Text style={styles.walletHeading}>Wallet</Text>
            <TouchableOpacity style={styles.withdraw_button} onPress={() => navigation.navigate('Wallet')}>
              <Text style={{ color: '#4F39F6', alignSelf: 'center', fontSize: wp(4) }}>Withdraw</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.walletText}>
            Wallet Balance: ₹{wallet.balance}
          </Text>
          <Text style={styles.walletText}>
            Total Earned : ₹{wallet.totalEarned}
          </Text>
          <Text style={styles.walletText}>
            Total Withdrawn : ₹{wallet.totalWithdrawn}
          </Text>
        </LinearGradient>
      </TouchableOpacity>


      <Text style={styles.incentiveTitle}>Extra Earnings Offers</Text>
    </View>
  );

  /*  FOOTER IS ALSO A STABLE ELEMENT */
  const FOOTER = (
    <TouchableOpacity style={{ marginBottom: hp(4) }} onPress={() => navigation.navigate('EarningsHistoryScreen', { selectedLevel: 'MONTH' })} >
      <MonthlySummaryCard summary={month} />
    </TouchableOpacity>
  );

  const handleItemPress = (item) => {
    if (item.type === 'peak') {
      navigation.navigate('PeakHourBonusScreen', { ...item });
      return;
    }

    if (item.type === 'weekly') {
      navigation.navigate('WeekEarnings', { ...item });
      return;
    }

    if (item.type === 'daily') {
      navigation.navigate('DailyGuarentee', { ...item });
    }
  };





  return (
    <FlatList
      data={incentives}
      keyExtractor={(item, index) => `${item.title}-${index}`}
      renderItem={({ item }) => <TouchableOpacity
        onPress={() => handleItemPress(item)}
      ><IncentiveCard item={item} /></TouchableOpacity>}

      ListHeaderComponent={HEADER}
      ListFooterComponent={FOOTER}
      refreshing={refreshing}
      onRefresh={onRefresh}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={false}

    />
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingVertical: hp(4),
    paddingHorizontal: wp(5)
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: wp(6),
    fontWeight: '500',
  },
  chat_icon: {
    width: wp(8),
    height: wp(6.5),
  },
  daily_summary: {
    marginTop: hp(2),
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: wp(3),
    paddingVertical: hp(1.5),
    width: wp('90'),
    alignSelf: 'center',
  },
  daily_text: { color: '#FFFFFF', fontSize: wp(4.5), fontWeight: '500' },
  daily_details_container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: wp(40) },
  daily_details: { color: '#FFFFFF', fontSize: wp(4) },
  card: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderRadius: wp(4),
    marginTop: hp(2),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(3)
  },
  cardTitle: {
    fontSize: wp(4.5),
    fontWeight: '500',
  },
  cardValue: {
    fontSize: wp(4.5),
    fontWeight: '600',
  },
  wallet: {
    width: wp(90),
    alignSelf: 'center',
    marginTop: hp(4),
    borderRadius: wp(4),
    padding: hp(2),
  },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
    marginBottom: hp(1),
    marginLeft: wp(1),
  },
  walletHeading: {
    color: '#fff',
    fontSize: wp(4.5),
    fontWeight: '600',

  },
  walletText: {
    marginLeft: wp(1),
    color: '#fff',
    fontSize: wp(4),
    paddingBottom: hp(0.5)

  },
  withdraw_button: { backgroundColor: '#FFFFFF', borderRadius: wp(2), width: wp(23), paddingVertical: hp(1), marginLeft: wp(30), },


  incentiveTitle: {
    fontSize: wp(4.5),
    fontWeight: '600',
    marginLeft: wp(5),
    marginTop: hp(4),
    marginBottom: hp(1)
  },
});