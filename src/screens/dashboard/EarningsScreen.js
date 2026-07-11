import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { BlurView } from '@react-native-community/blur';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import useEarningsDashboard from '../../hooks/useEarningsDashboard';
import WeeklyEarningsChart from '../../components/dashboard/earnings/WeeklyEarningsChart';
import WeeklyEarningsChartZestBot from '../../components/dashboard/earnings/WeeklyEarningsChartZestBot';
import IncentiveCard from '../../components/dashboard/earnings/IncentiveCard';
import MonthlySummaryCard from '../../components/dashboard/earnings/MonthlySummaryCard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PremiumPressable from '../../components/common/PremiumPressable';
import { formatMoney } from '../../utils/formatMoney';
import { dashboardCache } from '../../hooks/useEarningsDashboard';
import useIncentives from '../../hooks/useIncentives';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { getEarningsSummary } from '../../services/earnings/earningsService';


const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const Header = ({ todayEarnings, riderType, navigation }) => {
  return (
    <View>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <LinearGradient
        colors={['#065F46', '#10B981', '#34D399']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}>
        <SafeAreaView style={styles.topBar}>
          <Text style={styles.title}>Earnings</Text>

          <View style={styles.topBarIcons}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() =>
                navigation.navigate('EarningsHistoryScreen', { mode: 'HISTORY' })}>
              <MaterialIcons
                name="history"
                size={isTablet ? 30 : 22}
                color="#FFFFFF"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('HelpCenterList')}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color="#ffff"
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <TouchableOpacity
          style={styles.dailyCard}
          onPress={() => navigation.navigate('EarningsHistoryScreen', { mode: 'TODAY' })}
          activeOpacity={0.7}>
          <View style={styles.dailyTopRow}>
            <View>
              <Text style={styles.dailyLabel}>{riderType === 'INDIVIDUAL_EMPLOYEE' ? "Today's Earnings" : "Monthly Earnings"}</Text>
              <Text style={styles.dailyTotal}>
                ₹{formatMoney(todayEarnings?.total ?? 0)}
              </Text>
            </View>

            <View style={styles.dailyIconWrap}>
              <Ionicons name="cash-outline" size={isTablet ? 32 : 24} color="#10B981" />
            </View>
          </View>

          <View style={styles.dailyDivider} />

          <View style={styles.dailyStatsRow}>
            <View style={styles.dailyStatItem}>
              <Text style={styles.statValue}>
                ₹{formatMoney(todayEarnings?.baseEarnings ?? 0)}
              </Text>
              <Text style={styles.statLabel}>Base Earnings</Text>
            </View>

            <View style={styles.dailyStatItem}>
              <Text style={styles.statValue}>₹{formatMoney(todayEarnings?.incentives ?? 0)}</Text>
              <Text style={styles.statLabel}>Incentives</Text>
            </View>

            <View style={styles.dailyStatItem}>
              <Text style={styles.statValue}>
                {todayEarnings?.orders ?? 0}
              </Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>

            <View style={styles.dailyStatItem}>
              <Text style={styles.statValue}>₹{formatMoney(todayEarnings?.tips ?? 0)}</Text>
              <Text style={styles.statLabel}>Tips</Text>
            </View>

          </View>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  )
}

const Graph = (
  {
    todayEarnings,
    navigation,
    CARD_WIDTH,
    CARD_PADDING,
    riderType,
    isEligibleForIncentives,
    weeklyTotal,
    weeklyBarChart,
    wallet,
    weeklyOrders
  }) => {

  const formatOrderLabel = count => {
    return `${count} ${count === 1 ? 'order' : 'orders'}`;
  };

  return (
    <View style={{ backgroundColor: '#F4F6F8' }}>
      {/* WEEKLY CARD */}
      <View style={[styles.card, { width: CARD_WIDTH, padding: CARD_PADDING }]}>
        <PremiumPressable onPress={() => navigation.navigate('EarningsHistoryScreen', { mode: 'WEEK' })}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>This Week</Text>
            <Text style={styles.cardValue}>
              {riderType === 'ZESTBOT_EMPLOYEE'
                ? (isEligibleForIncentives
                  ? `₹${formatMoney(weeklyTotal ?? 0)}`
                  : `${formatOrderLabel(weeklyOrders ?? 0)}`)
                : `₹${formatMoney(weeklyTotal ?? 0)}`
              }
            </Text>
          </View>

          {/* INDIVIDUAL, COMPANY — earnings bar chart only */}
          {(riderType === 'INDIVIDUAL_EMPLOYEE' || riderType === 'COMPANY_EMPLOYEE') && (
            <WeeklyEarningsChart
              data={weeklyBarChart}
              width={CARD_WIDTH - CARD_PADDING * 2}
              height={isTablet ? hp(38) : hp(30)}
            />
          )}

          {/* ZESTBOT — only after target met */}
          {riderType === 'ZESTBOT_EMPLOYEE' && (
            <WeeklyEarningsChartZestBot
              data={weeklyBarChart}
              width={CARD_WIDTH - CARD_PADDING * 2}
              height={isTablet ? hp(30) : hp(24)}
              monthlyTarget={todayEarnings?.monthlyTarget}
              completedOrders={todayEarnings?.totalCompletedOrders}
              weeklyTotal={weeklyTotal}
              eligible={todayEarnings?.eligible}
            />
          )}

        </PremiumPressable>
      </View>

      {/* WALLET */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Wallet')}>
        <LinearGradient
          colors={['#4338CA', '#6366F1', '#818CF8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.walletCard}>
          <View style={styles.walletTop}>
            <View>
              <Text style={styles.walletLabel}>Wallet Balance</Text>
              <Text style={styles.walletBalance}>
                ₹{formatMoney(wallet.balance ?? 0)}
              </Text>
            </View>
            <View style={styles.walletIconWrap}>
              <Ionicons name="wallet" size={isTablet ? 32 : 26} color="#6366F1" />
            </View>
          </View>
          <View style={styles.walletActions}>
            <TouchableOpacity style={styles.walletBtn}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Wallet')}>
              <Ionicons
                name="arrow-up-circle-outline"
                size={isTablet ? 24 : 18}
                color="#6366F1"
              />
              <Text style={styles.walletBtnText}>Withdraw</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletBtnOutline}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Wallet')}>
              <Ionicons
                name="time-outline"
                size={isTablet ? 24 : 18}
                color="#fff"
              />
              <Text style={styles.walletBtnTextOutline}>History</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.walletDivider} />
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
    </View>
  );
};

const Footer = ({ month, riderType }) => {
  return (
    <TouchableOpacity style={{ marginBottom: hp(4) }} >
      <MonthlySummaryCard summary={month} riderType={riderType} />
    </TouchableOpacity>
  );
};

export default function EarningsScreen({ navigation }) {
  // const riderTypeFromRedux = useSelector((state) => state.profile.data?.riderType?.trim());
  const { data, loading, refreshing, onRefresh } = useEarningsDashboard();
  const { weeklyIncentivesProgress, dailyIncentivesProgress, peakIncentivesProgress, load, fetchWeeklyIncentivesProgress, fetchDailyIncentivesProgress, fetchPeakIncentivesProgress } = useIncentives();
  const { riderIncentivesTarget, fetchRiderIncentivesTarget } = useIncentives();
  const [earningsDataLoading, setEarningsDataLoading] = useState(false);
  const [earningsData, setEarningsData] = useState(null);
  const [todayEarningsData, setTodayEarningsData] = useState(null);
  const [monthlyEarningsData, setMonthlyEarningsData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setEarningsDataLoading(true);
        const summaryData = await getEarningsSummary();
        setEarningsData(summaryData);
        setMonthlyEarningsData(summaryData?.month);
        setTodayEarningsData(summaryData?.today);
        console.log('Fetched earnings summary:', summaryData);
      } catch (error) {
        console.error('Error fetching earnings summary:', error);
      } finally {
        setEarningsDataLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchWeeklyIncentivesProgress();
    fetchDailyIncentivesProgress();
    fetchPeakIncentivesProgress();
    fetchRiderIncentivesTarget();
  }, []);

  const weeklyCompletedOrders = weeklyIncentivesProgress?.ruleType !== "TASK" ? weeklyIncentivesProgress?.ordersCompleted : 0;
  const dailyCompletedOrders = dailyIncentivesProgress?.ruleType !== "TASK" ? dailyIncentivesProgress?.ordersCompleted : 0;
  const peakCompletedOrders = peakIncentivesProgress?.ordersCompleted;

  const completedDays =
    weeklyIncentivesProgress?.overallProgress
      ?.completedDays || 0;

  const totalDays =
    weeklyIncentivesProgress?.overallProgress
      ?.totalDays || 0;

  const weeklyProgressPercentage =
    totalDays > 0
      ? (completedDays / totalDays) * 100
      : 0;

  const {
    todayEarnings = {},
    earningsSummary = {},
    weeklyBarChart = [],
    riderType = "",
    weeklyTotal = 0,
    weeklyOrders = 0,
    wallet = {},
    incentives = [],
  } = data;

  // console.log("todayEarnings: ", todayEarnings);

  const isEligibleForIncentives = todayEarnings?.eligible;

  const CARD_WIDTH = isTablet ? wp(97) : wp(95);
  const CARD_PADDING = wp(4);

  const IncentivesCards = ({ item }) => {
    return (
      <View>
        {!item?.emptyData ?
          <PremiumPressable onPress={() => handleItemPress(item)}>
            <IncentiveCard
              item={item}
              weeklyCompletedOrders={weeklyCompletedOrders}
              dailyCompletedOrders={dailyCompletedOrders}
              peakCompletedOrders={peakCompletedOrders}
              weeklyProgressPercentage={weeklyProgressPercentage}
            />
          </PremiumPressable>
          :
          <View style={styles.emptyCard}>

            {item?.type === "daily" &&
              <Text style={styles.emptyTitle}>
                Daily Incentives Not Available
              </Text>}
            {item?.type === "peak" &&
              <Text style={styles.emptyTitle}>
                Peak Incentives Not Available
              </Text>}
            {item?.type === "weekly" &&
              <Text style={styles.emptyTitle}>
                Weekly Incentives Not Available
              </Text>}

            <Text style={styles.emptySubtitle}>
              Complete more orders to unlock exciting incentives.
            </Text>
          </View>
        }
      </View>
    );
  }

  // NAVIGATIONS TO INCENTIVE PAGES
  const handleItemPress = (item) => {
    if (item?.type === 'peak') {
      navigation.navigate('PeakHourBonusScreen', { ...item, peakIncentivesProgress });
      return;
    }
    if (item?.type === 'weekly') {
      navigation.navigate('WeekEarnings', { ...item, weeklyIncentivesProgress });
      return;
    }
    if (item?.type === 'daily') {
      navigation.navigate('DailyGuarentee', { ...item, dailyIncentivesProgress });
      return;
    }
  };

  if (load || loading || earningsDataLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    )
  }

  // UI
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#2196F3']} // Android
          tintColor="#2196F3"  // iOS
        />
      }
      style={{ flex: 1 }}>


      {riderType === "INDIVIDUAL_EMPLOYEE" &&
        <Header
          todayEarnings={todayEarnings}
          riderType={riderType}
          navigation={navigation}
        />}

      {riderType !== "INDIVIDUAL_EMPLOYEE" &&
        <Header
          todayEarnings={monthlyEarningsData}
          riderType={riderType}
          navigation={navigation}
        />}

      <Graph
        todayEarnings={todayEarnings}
        navigation={navigation}
        CARD_WIDTH={CARD_WIDTH}
        CARD_PADDING={CARD_PADDING}
        riderType={riderType}
        isEligibleForIncentives={isEligibleForIncentives}
        weeklyTotal={weeklyTotal}
        weeklyBarChart={weeklyBarChart}
        wallet={wallet}
        weeklyOrders={weeklyOrders}
      />

      {riderType === "INDIVIDUAL_EMPLOYEE" &&
        <View>
          <Text style={styles.incentiveTitle}>Extra Earnings Offers</Text>
          <View style={styles.incentivesCards}>
            <IncentivesCards item={incentives[0]} />
            <IncentivesCards item={incentives[1]} />
            <IncentivesCards item={incentives[2]} />
          </View>
        </View>
      }

      {riderType !== "INDIVIDUAL_EMPLOYEE" &&
        <View>
          <Text style={styles.incentiveTitle}>Extra Earnings Offers</Text>
          <View style={styles.slabsContainer}>
            {riderIncentivesTarget?.slabs?.map((item, index) => {
              const colors = [
                '#E8F5E9', // Light Green
                '#E3F2FD', // Light Blue
                '#FFF3E0', // Light Orange
                '#F3E5F5', // Light Purple
              ];

              return (
                <View
                  key={item.id}
                  style={[
                    styles.slabCard,
                    { backgroundColor: colors[index % colors.length] },
                  ]}>
                  <View>
                    <Text style={styles.ordersLabel}>Monthly Orders</Text>
                    <Text style={styles.ordersText}>
                      {item.toOrders
                        ? `${item.fromOrders} - ${item.toOrders}`
                        : `${item.fromOrders}+`}
                    </Text>
                  </View>

                  <View style={styles.rewardContainer}>
                    <Text style={styles.rewardLabel}>Reward</Text>
                    <Text style={styles.rewardText}>
                      ₹{item.amountPerOrder}
                    </Text>
                    <Text style={styles.perOrder}>per order</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>}

      {riderType === "INDIVIDUAL_EMPLOYEE" && <Footer month={monthlyEarningsData} riderType={riderType} />}

      {riderType !== "INDIVIDUAL_EMPLOYEE" && <Footer month={todayEarningsData} riderType={riderType} />}

    </ScrollView>

  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: isTablet ? 34 : wp(6),
    fontWeight: '700',
    flex: 1,
    marginLeft: wp(2),
  },
  chat_icon: {
    width: wp(6),
    height: wp(5),
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isTablet ? wp(4) : wp(3),
  },
  topBarIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: isTablet ? hp(1.2) : hp(1),
    paddingHorizontal: isTablet ? wp(1.5) : wp(2),
    borderRadius: isTablet ? wp(2) : wp(3),
    marginLeft: wp(2),
  },
  chatIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: '#FFFFFF',
  },

  dailyCard: {
    width: isTablet ? wp(96) : wp(92),
    alignSelf: 'center',
    marginTop: hp(1),
    marginBottom: hp(2),
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: wp(4),
    padding: isTablet ? wp(3) : wp(5),
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

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(2),
    paddingVertical: 32,
    paddingHorizontal: wp(4),
    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#E5E7EB',

    marginHorizontal: 16,
    marginBottom: wp(3),

    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  slabsContainer: {
    marginTop: 12,
    marginHorizontal: 15,
  },

  slabCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 12,
    elevation: 2,
  },

  ordersLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },

  ordersText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },

  rewardContainer: {
    alignItems: 'center',
  },

  rewardLabel: {
    fontSize: 16,
    color: '#6B7280',
  },

  rewardText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16A34A',
  },

  perOrder: {
    fontSize: 16,
    color: '#374151',
    marginTop: 2,
  },
  emptyIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },

  walletCard: {
    width: isTablet ? wp(97) : wp(95),
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
    paddingHorizontal: isTablet ? wp(4) : wp(4),
    paddingVertical: isTablet ? hp(1.5) : hp(1),
    borderRadius: isTablet ? wp(2) : wp(3),
  },
  walletBtnText: {
    marginLeft: wp(2),
    fontWeight: '600',
    color: '#6366F1',
    fontSize: isTablet ? 18 : 14,
  },
  walletBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: isTablet ? wp(4) : wp(4),
    paddingVertical: isTablet ? hp(1.5) : hp(1),
    borderRadius: isTablet ? wp(2) : wp(3),
  },
  walletBtnTextOutline: {
    marginLeft: wp(2),
    color: '#fff',
    fontWeight: '600',
    fontSize: isTablet ? 18 : 14,
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
  overlayLoader: {
    position: 'absolute',
    top: hp(4),
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  incentivesCards: {
    paddingVertical: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockImage: {
    height: 100,
    width: 100,
  },
  lockContent: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  lockText: {
    backgroundColor: '#192A51',
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 10,
  }
});