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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import WeeklyEarningsChart from '../../components/dashboard/earnings/WeeklyEarningsChart';


import useEarningsDashboard from '../../hooks/useEarningsDashboard';
import IncentiveCard from '../../components/dashboard/earnings/IncentiveCard';
import MonthlySummaryCard from '../../components/dashboard/earnings/MonthlySummaryCard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PremiumPressable from '../../components/common/PremiumPressable';
import {formatMoney} from '../../utils/formatMoney';




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
    todayEarnings={},
    earningsSummary = {},
    weeklyBarChart = [],
    weeklyTotal = 0,
    wallet = {},
    incentives = [],
  } = data;

  const month = earningsSummary.month || {};
  
  const CARD_WIDTH = wp(95);
  const CARD_PADDING = wp(4);




  /* HEADER IS A STABLE ELEMENT — NOT A FUNCTION */
  const HEADER = (
    <View style={{ backgroundColor: '#F4F6F8' }}>
      {/* TOP GRADIENT */}
      <LinearGradient
       colors={['#065F46', '#10B981', '#34D399']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}>
          <View style={styles.topBar}>
            <TouchableOpacity
                            onPress={() => navigation.goBack()}>
                            <Ionicons name='chevron-back-outline' size={24} color="#FFF" />
                          </TouchableOpacity>
            <Text style={styles.title}>Earnings</Text>

            <View style={styles.topBarIcons}>
              
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() =>
                  navigation.navigate('EarningsHistoryScreen', { mode: 'HISTORY' })}>
                <MaterialIcons name="history" size={22} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconBtn}
                                onPress={()=>navigation.navigate('HelpCenterList')}>
                <Image
                  source={require('../../assets/chat.png')}
                  style={styles.chatIcon}
                />
              </TouchableOpacity>

            </View>
          </View>
              
          <TouchableOpacity
            style={styles.dailyCard}
            onPress={() => navigation.navigate('EarningsHistoryScreen', { mode: 'TODAY' })}
            activeOpacity={0.7}>
          <View style={styles.dailyTopRow}>
            <View>
              <Text style={styles.dailyLabel}>Today's Earnings</Text>
              <Text style={styles.dailyTotal}>
                ₹{formatMoney(todayEarnings.totalEarnings ?? 0)}
              </Text>
            </View>

            <View style={styles.dailyIconWrap}>
              <Ionicons name="cash-outline" size={24} color="#10B981" />
            </View>
          </View>

          {/* Divider */}
          <View style={styles.dailyDivider} />

          {/* Stats Row */}
          <View style={styles.dailyStatsRow}>

            <View style={styles.dailyStatItem}>
              <Text style={styles.statValue}>
                ₹{formatMoney(todayEarnings.totalEarnings ?? 0)}
              </Text>
              <Text style={styles.statLabel}>Base Earnings</Text>
            </View>

            <View style={styles.dailyStatItem}>
              <Text style={styles.statValue}>
                {todayEarnings.orders ?? 0}
              </Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>

            <View style={styles.dailyStatItem}>
              <Text style={styles.statValue}>₹{formatMoney(todayEarnings.tips ?? 0)}</Text>
              <Text style={styles.statLabel}>Tips</Text>
            </View>

            <View style={styles.dailyStatItem}>
              <Text style={styles.statValue}>₹{formatMoney(todayEarnings.incentives ?? 0)}</Text>
              <Text style={styles.statLabel}>Incentives</Text>
            </View>

          </View>
        </TouchableOpacity>

      </LinearGradient>

      {/* WEEKLY CARD */}
      <View style={[styles.card,{width:CARD_WIDTH, padding: CARD_PADDING}]}>
        <PremiumPressable onPress={()=>navigation.navigate('EarningsHistoryScreen',{mode:'WEEK'})} >
        <View style={styles.cardHeader}>
          
          <Text style={styles.cardTitle}>This Week</Text>
          <Text style={styles.cardValue}>₹{formatMoney(weeklyTotal)}</Text>
        </View>
        
        <WeeklyEarningsChart
          data={weeklyBarChart}
          width={CARD_WIDTH - CARD_PADDING * 2}
          height={hp(30)}  
        />   
    </PremiumPressable>
 
 
      </View>

      {/* WALLET */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Wallet')}
      >
        <LinearGradient
          colors={['#4338CA', '#6366F1', '#818CF8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.walletCard}
        >

          {/* Top Row */}
          <View style={styles.walletTop}>
            <View>
              <Text style={styles.walletLabel}>Wallet Balance</Text>
              <Text style={styles.walletBalance}>
                ₹{formatMoney(wallet.balance ?? 0)}
              </Text>
            </View>

            <View style={styles.walletIconWrap}>
              <Ionicons name="wallet" size={26} color="#6366F1" />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.walletActions}>
            <TouchableOpacity style={styles.walletBtn}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Wallet')}>
              <Ionicons name="arrow-up-circle-outline" size={18} color="#6366F1" />
              <Text style={styles.walletBtnText}>Withdraw</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.walletBtnOutline}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Wallet')}>
              <Ionicons name="time-outline" size={18} color="#fff" />
              <Text style={styles.walletBtnTextOutline}>History</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.walletDivider} />

          {/* Stats Row */}
          <View style={styles.walletStats}>
            <View>
              <Text style={styles.walletStatLabel}>Total Earned</Text>
              <Text style={styles.walletStatValue}>
                ₹{formatMoney(wallet.totalEarned ?? 0)}
              </Text>
            </View>

            <View>
              <Text style={styles.walletStatLabel}>Total Withdrawn</Text>
              <Text style={styles.walletStatValue}>
                ₹{formatMoney(wallet.totalWithdrawn ?? 0)}
              </Text>
            </View>
          </View>

        </LinearGradient>
      </TouchableOpacity>



      <Text style={styles.incentiveTitle}>Extra Earnings Offers</Text>
    </View>
  );

  /*  FOOTER IS ALSO A STABLE ELEMENT */
  const FOOTER = (
    <TouchableOpacity style={{ marginBottom: hp(4) }} >
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
      renderItem={({ item }) => 
          <PremiumPressable onPress={() => handleItemPress(item)}>
            <IncentiveCard item={item} />
          </PremiumPressable>
        }
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
    paddingRight:wp(35)
  },
  chat_icon: {
    width: wp(6),
    height: wp(5),
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: hp(3),
    paddingHorizontal: wp(3)
  },
  topBarIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: hp(1),
    paddingHorizontal:wp(2),
    borderRadius: wp(3),
    marginLeft: wp(3),
  },
  chatIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: '#FFFFFF',
  },

  dailyCard: {
    width: wp(92),
    alignSelf: 'center',
    marginTop: hp(1),
    marginBottom:hp(2),
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: wp(4),
    padding: wp(5),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },

dailyTopRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

dailyLabel: {
  color: 'rgba(255,255,255,0.85)',
  fontSize: wp(4),
},

dailyTotal: {
  color: '#FFFFFF',
  fontSize: wp(5),
  fontWeight: '700',
  marginTop: hp(0.5),
},

dailyIconWrap: {
  backgroundColor: 'rgba(255,255,255,0.15)',
  padding: wp(3),
  borderRadius: wp(3),
},

dailyDivider: {
  height: 1,
  backgroundColor: 'rgba(255,255,255,0.2)',
  marginVertical: hp(2),
},

dailyStatsRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},

dailyStatItem: {
  alignItems: 'center',
},

statValue: {
  color: '#FFFFFF',
  fontSize: wp(4.2),
  fontWeight: '600',
},

statLabel: {
  color: 'rgba(255,255,255,0.7)',
  fontSize: wp(3.3),
  marginTop: 2,
},

  card: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderRadius: wp(5),
    marginTop: hp(2),
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(3)
  },
  cardTitle: {
    fontSize: wp(5),
    fontWeight: '500',
  },
  cardValue: {
    fontSize: wp(5),
    fontWeight: '600',
  },
  walletCard: {
    width: wp(95),
    alignSelf: 'center',
    marginTop: hp(3),
    borderRadius: wp(5),
    padding: wp(4),

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 8,
},

walletTop: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

walletLabel: {
  color: '#FFFFFF',
  fontSize: wp(5),

},

walletBalance: {
  color: '#FFFFFF',
  fontSize: wp(5),
  fontWeight: '700',
  marginTop: hp(0.5),
},

walletIconWrap: {
  backgroundColor: 'rgba(255,255,255,0.18)',
  padding: wp(3),
  borderRadius: wp(3),
},

walletActions: {
  flexDirection: 'row',
  marginTop: hp(2),
  justifyContent: 'space-between',
},

walletBtn: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  paddingHorizontal: wp(4),
  paddingVertical: hp(1),
  borderRadius: wp(3),
},

walletBtnText: {
  marginLeft: wp(2),
  fontWeight: '600',
  color: '#6366F1',
},

walletBtnOutline: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.5)',
  paddingHorizontal: wp(4),
  paddingVertical: hp(1),
  borderRadius: wp(3),
},

walletBtnTextOutline: {
  marginLeft: wp(2),
  color: '#fff',
  fontWeight: '600',
},

walletDivider: {
  height: 1,
  backgroundColor: 'rgba(255,255,255,0.25)',
  marginVertical: hp(2),
},

walletStats: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},

walletStatLabel: {
  color: '#FFFFFF',
  fontSize: wp(4),
},

walletStatValue: {
  color: '#FFFFFF',
  fontSize: wp(4.8),
  fontWeight: '700',
  marginTop: hp(0.3),
},


  incentiveTitle: {
    fontSize: wp(5),
    fontWeight: '600',
    marginLeft: wp(5),
    marginTop: hp(4),
    marginBottom: hp(1)
  },
});