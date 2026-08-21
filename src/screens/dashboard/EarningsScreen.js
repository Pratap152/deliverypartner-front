import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { SafeAreaView } from 'react-native-safe-area-context';

import useEarningsDashboard from '../../hooks/useEarningsDashboard';

import WeeklyEarningsChart from '../../components/dashboard/earnings/WeeklyEarningsChart';
import WeeklyEarningsChartZestBot from '../../components/dashboard/earnings/WeeklyEarningsChartZestBot';
import IncentivesCards from '../../components/dashboard/earnings/IncentivesCards';
import MonthlySummaryCard from '../../components/dashboard/earnings/MonthlySummaryCard';
import PremiumPressable from '../../components/common/PremiumPressable';

import { formatMoney } from '../../utils/formatMoney';
import useIncentives from '../../hooks/useIncentives';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

/* =========================================================
   HEADER
========================================================= */

const Header = ({ earnings, riderType, navigation }) => {
  const isIndividual = riderType === 'INDIVIDUAL_EMPLOYEE';
  const isZestBot = riderType === 'ZESTBOT_EMPLOYEE';

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
        end={{ x: 1, y: 0 }}
      >
        <SafeAreaView style={styles.topBar}>
          <Text style={styles.title}>Earnings</Text>

          <View style={styles.topBarIcons}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() =>
                navigation.navigate('EarningsHistoryScreen', {
                  mode: 'HISTORY',
                })
              }
            >
              <MaterialIcons
                name="history"
                size={isTablet ? 30 : 24}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('HelpCenterList')}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={isTablet ? 28 : 22}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* =========================
            INDIVIDUAL - TODAY
        ========================= */}
        {isIndividual && (
          <TouchableOpacity
            style={styles.dailyCard}
            onPress={() =>
              navigation.navigate('EarningsHistoryScreen', {
                mode: 'TODAY',
              })
            }
            activeOpacity={0.7}
          >
            <View style={styles.dailyTopRow}>
              <View>
                <Text style={styles.dailyLabel}>
                  Today's Earnings
                </Text>

                <Text style={styles.dailyTotal}>
                  ₹{formatMoney(earnings?.total ?? 0)}
                </Text>
              </View>

              <View style={styles.dailyIconWrap}>
                <Ionicons
                  name="cash-outline"
                  size={isTablet ? 32 : 24}
                  color="#10B981"
                />
              </View>
            </View>

            <View style={styles.dailyDivider} />

            <View style={styles.dailyStatsRow}>
              <View style={styles.dailyStatItem}>
                <Text style={styles.statValue}>
                  ₹{formatMoney(earnings?.baseEarnings ?? 0)}
                </Text>
                <Text style={styles.statLabel}>
                  Base Earnings
                </Text>
              </View>

              <View style={styles.dailyStatItem}>
                <Text style={styles.statValue}>
                  ₹{formatMoney(earnings?.incentives ?? 0)}
                </Text>
                <Text style={styles.statLabel}>
                  Incentives
                </Text>
              </View>

              <View style={styles.dailyStatItem}>
                <Text style={styles.statValue}>
                  ₹{formatMoney(earnings?.tips ?? 0)}
                </Text>
                <Text style={styles.statLabel}>
                  Tips
                </Text>
              </View>

              <View style={styles.dailyStatItem}>
                <Text style={styles.statValue}>
                  {earnings?.orders ?? 0}
                </Text>
                <Text style={styles.statLabel}>
                  Orders
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* =========================
            ZESTBOT - MONTHLY
        ========================= */}
        {isZestBot && (
          <View style={styles.dailyCard}>
            <View style={styles.dailyTopRow}>
              <View>
                <Text style={styles.dailyLabel}>
                  Total Month Earnings
                </Text>

                <Text style={styles.dailyTotal}>
                  ₹{formatMoney(earnings?.total ?? 0)}
                </Text>
              </View>

              <View style={styles.dailyIconWrap}>
                <Ionicons
                  name="cash-outline"
                  size={isTablet ? 32 : 24}
                  color="#10B981"
                />
              </View>
            </View>

            <View style={styles.dailyDivider} />

            <View style={styles.dailyStatsRow}>
              <View style={styles.dailyStatItem}>
                <Text style={styles.statValue}>
                  ₹{formatMoney(earnings?.attendanceAmount ?? 0)}
                </Text>
                <Text style={styles.statLabel}>
                  Month Salary
                </Text>
              </View>

              <View style={styles.dailyStatItem}>
                <Text style={styles.statValue}>
                  ₹{formatMoney(earnings?.incentives ?? 0)}
                </Text>
                <Text style={styles.statLabel}>
                  Incentives
                </Text>
              </View>

              <View style={styles.dailyStatItem}>
                <Text style={styles.statValue}>
                  ₹{formatMoney(earnings?.tips ?? 0)}
                </Text>
                <Text style={styles.statLabel}>
                  Tips
                </Text>
              </View>
              
              <View style={styles.dailyStatItem}>
                <Text style={styles.statValue}>
                  {earnings?.orders ?? 0}
                </Text>
                <Text style={styles.statLabel}>
                  Orders
                </Text>
              </View>
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

/* =========================================================
   GRAPH + WALLET
========================================================= */

const Graph = ({
  todayEarnings,
  navigation,
  CARD_WIDTH,
  CARD_PADDING,
  riderType,
  isEligibleForIncentives,
  weeklyTotal,
  weeklyBarChart,
  wallet,
  weeklyOrders,
  earningsDataLoading,
}) => {
  const formatOrderLabel = count => {
    return `${count} ${count === 1 ? 'order' : 'orders'}`;
  };

  return (
    <View style={{ backgroundColor: '#F4F6F8' }}>

      {/* =========================
          WEEKLY CARD
      ========================= */}
      <View
        style={[
          styles.card,
          {
            width: CARD_WIDTH,
            padding: CARD_PADDING,
          },
        ]}
      >
        <PremiumPressable
          onPress={() =>
            navigation.navigate('EarningsHistoryScreen', {
              mode: 'WEEK',
            })
          }
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              Week Earnings
            </Text>

            <Text style={styles.cardValue}>
              {riderType === 'ZESTBOT_EMPLOYEE'
                ? (
                  isEligibleForIncentives
                    ? `₹${formatMoney(weeklyTotal ?? 0)}`
                    : `${formatOrderLabel(weeklyOrders ?? 0)}`
                )
                : `₹${formatMoney(weeklyTotal ?? 0)}`
              }
            </Text>
          </View>

          {/* INDIVIDUAL */}
          {riderType === 'INDIVIDUAL_EMPLOYEE' && (
            <WeeklyEarningsChart
              data={weeklyBarChart}
              width={CARD_WIDTH - CARD_PADDING * 2}
              height={isTablet ? hp(38) : hp(30)}
              earningsDataLoading={earningsDataLoading}
            />
          )}

          {/* ZESTBOT / COMPANY */}
          {(riderType === 'ZESTBOT_EMPLOYEE' ||
            riderType === 'COMPANY_EMPLOYEE') && (
            <WeeklyEarningsChartZestBot
              data={weeklyBarChart}
              width={CARD_WIDTH - CARD_PADDING * 2}
              height={isTablet ? hp(30) : hp(24)}
              monthlyTarget={todayEarnings?.monthlyTarget}
              completedOrders={todayEarnings?.totalCompletedOrders}
              weeklyTotal={weeklyTotal}
              eligible={todayEarnings?.eligible}
              earningsDataLoading={earningsDataLoading}
            />
          )}
        </PremiumPressable>
      </View>

      {/* =========================
          WALLET
      ========================= */}
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
          <View style={styles.walletTop}>
            <View>
              <Text style={styles.walletLabel}>
                Wallet Balance
              </Text>

              <Text style={styles.walletBalance}>
                ₹{formatMoney(wallet.balance ?? 0)}
              </Text>
            </View>

            <View style={styles.walletIconWrap}>
              <Ionicons
                name="wallet"
                size={isTablet ? 32 : 26}
                color="#6366F1"
              />
            </View>
          </View>

          <View style={styles.walletActions}>
            <TouchableOpacity
              style={styles.walletBtn}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Wallet')}
            >
              <Ionicons
                name="arrow-up-circle-outline"
                size={isTablet ? 24 : 18}
                color="#6366F1"
              />

              <Text style={styles.walletBtnText}>
                Withdraw
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.walletBtnOutline}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Wallet')}
            >
              <Ionicons
                name="time-outline"
                size={isTablet ? 24 : 18}
                color="#FFFFFF"
              />

              <Text style={styles.walletBtnTextOutline}>
                History
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.walletDivider} />

          <View style={styles.walletStats}>
            <View>
              <Text style={styles.walletStatLabel}>
                Total Earned
              </Text>

              <Text style={styles.walletStatValue}>
                ₹{formatMoney(wallet.totalEarned ?? 0)}
              </Text>
            </View>

            <View>
              <Text style={styles.walletStatLabel}>
                Total Withdrawn
              </Text>

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

/* =========================================================
   FOOTER
========================================================= */

const Footer = ({ summary, riderType }) => {
  return (
    <View style={{ marginBottom: hp(4) }}>
      <MonthlySummaryCard
        summary={summary}
        riderType={riderType}
      />
    </View>
  );
};

/* =========================================================
   MAIN SCREEN
========================================================= */

export default function EarningsScreen({ navigation }) {
  const {
    data,
    loading,
    refreshing,
    onRefresh,
  } = useEarningsDashboard();

  const {
    weeklyIncentivesProgress,
    dailyIncentivesProgress,
    peakIncentivesProgress,
    load,
    fetchWeeklyIncentivesProgress,
    fetchDailyIncentivesProgress,
    fetchPeakIncentivesProgress,
    riderIncentivesTarget,
    fetchRiderIncentivesTarget,
  } = useIncentives();

  useEffect(() => {
    fetchWeeklyIncentivesProgress();
    fetchDailyIncentivesProgress();
    fetchPeakIncentivesProgress();
    fetchRiderIncentivesTarget();
  }, []);

  const {
    todayEarnings = {},
    earningsSummary = {},
    weeklyBarChart = [],
    riderType = '',
    weeklyTotal = 0,
    weeklyOrders = 0,
    wallet = {},
    incentives = [],
  } = data;



 const todayEarningsData = {
    ...(earningsSummary?.today ?? todayEarnings ?? {}),
    attendanceAmount:
      earningsSummary?.today?.attendanceAmount ??
      todayEarnings?.attendanceAmount ??
      0,
  };

  const monthlyEarningsData =
    earningsSummary?.month ?? {};

  const isEligibleForIncentives =
    todayEarnings?.eligible ?? false;

  const CARD_WIDTH = isTablet ? wp(97) : wp(95);
  const CARD_PADDING = wp(4);

  /* =========================
     INCENTIVE PROGRESS
  ========================= */

  const weeklyCompletedOrders =
    weeklyIncentivesProgress?.ruleType !== 'TASK'
      ? weeklyIncentivesProgress?.ordersCompleted ?? 0
      : 0;

  const dailyCompletedOrders =
    dailyIncentivesProgress?.ruleType !== 'TASK'
      ? dailyIncentivesProgress?.ordersCompleted ?? 0
      : 0;

  const peakCompletedOrders =
    peakIncentivesProgress?.ordersCompleted ?? 0;

  const completedDays =
    weeklyIncentivesProgress?.overallProgress?.completedDays ?? 0;

  const totalDays =
    weeklyIncentivesProgress?.overallProgress?.totalDays ?? 0;

  const weeklyProgressPercentage =
    totalDays > 0
      ? (completedDays / totalDays) * 100
      : 0;

  /* =========================
     INCENTIVE NAVIGATION
  ========================= */

  const handleItemPress = item => {
    if (item?.type === 'peak') {
      navigation.navigate('PeakHourBonusScreen', {
        ...item,
        peakIncentivesProgress,
      });
      return;
    }

    if (item?.type === 'weekly') {
      navigation.navigate('WeekEarnings', {
        ...item,
        weeklyIncentivesProgress,
      });
      return;
    }

    if (item?.type === 'daily') {
      navigation.navigate('DailyGuarentee', {
        ...item,
        dailyIncentivesProgress,
      });
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (load || loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color="#1F3365"
        />
      </View>
    );
  }

  /* =========================
     UI
  ========================= */

  return (
    <ScrollView
        style={styles.screenContainer}
        contentContainerStyle={styles.scrollContent}
        overScrollMode="never"
        bounces={false}
        alwaysBounceVertical={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1F3365']}
            tintColor="#1F3365"
          />
        }
      >

      {/* =================================================
          HEADER
      ================================================= */}

      {/* INDIVIDUAL → TODAY */}
      {riderType === 'INDIVIDUAL_EMPLOYEE' && (
        <Header
          earnings={todayEarningsData}
          riderType={riderType}
          navigation={navigation}
        />
      )}

      {/* ZESTBOT → MONTH */}
      {riderType === 'ZESTBOT_EMPLOYEE' && (
        <Header
          earnings={monthlyEarningsData}
          riderType={riderType}
          navigation={navigation}
        />
      )}

      {/* =================================================
          GRAPH + WALLET
      ================================================= */}

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
        earningsDataLoading={loading}
      />

      {/* =================================================
          INDIVIDUAL INCENTIVES
      ================================================= */}

      {riderType === 'INDIVIDUAL_EMPLOYEE' && (
        <View>
          <Text style={styles.incentiveTitle}>
            Extra Earnings Offers
          </Text>

          <View style={styles.incentivesCards}>
            <IncentivesCards
              item={incentives[0]}
              onPress={handleItemPress}
              weeklyCompletedOrders={weeklyCompletedOrders}
              dailyCompletedOrders={dailyCompletedOrders}
              peakCompletedOrders={peakCompletedOrders}
              weeklyProgressPercentage={weeklyProgressPercentage}
            />

            <IncentivesCards
              item={incentives[1]}
              onPress={handleItemPress}
              weeklyCompletedOrders={weeklyCompletedOrders}
              dailyCompletedOrders={dailyCompletedOrders}
              peakCompletedOrders={peakCompletedOrders}
              weeklyProgressPercentage={weeklyProgressPercentage}
            />

            <IncentivesCards
              item={incentives[2]}
              onPress={handleItemPress}
              weeklyCompletedOrders={weeklyCompletedOrders}
              dailyCompletedOrders={dailyCompletedOrders}
              peakCompletedOrders={peakCompletedOrders}
              weeklyProgressPercentage={weeklyProgressPercentage}
            />
          </View>
        </View>
      )}

      {/* =================================================
          ZESTBOT / COMPANY SLABS
      ================================================= */}

      {riderType !== 'INDIVIDUAL_EMPLOYEE' && (
        <View>
          <Text style={styles.incentiveTitle}>
            Extra Earnings Offers
          </Text>

          <View style={styles.slabsContainer}>
            {riderIncentivesTarget?.slabs?.map(
              (item, index) => {
                const colors = [
                  '#E8F5E9',
                  '#E3F2FD',
                  '#FFF3E0',
                  '#F3E5F5',
                ];

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.slabCard,
                      {
                        backgroundColor:
                          colors[index % colors.length],
                      },
                    ]}
                  >
                    <View>
                      <Text style={styles.ordersLabel}>
                        Monthly Orders
                      </Text>

                      <Text style={styles.ordersText}>
                        {item.toOrders
                          ? `${item.fromOrders} - ${item.toOrders}`
                          : `${item.fromOrders}+`}
                      </Text>
                    </View>

                    <View style={styles.rewardContainer}>
                      <Text style={styles.rewardLabel}>
                        Reward
                      </Text>

                      <Text style={styles.rewardText}>
                        ₹{item.amountPerOrder}
                      </Text>

                      <Text style={styles.perOrder}>
                        per order
                      </Text>
                    </View>
                  </View>
                );
              }
            )}
          </View>
        </View>
      )}

      {/* =================================================
          FOOTER / SUMMARY
      ================================================= */}

      {/* INDIVIDUAL → MONTHLY SUMMARY */}
      {riderType === 'INDIVIDUAL_EMPLOYEE' && (
        <Footer
          summary={monthlyEarningsData}
          riderType={riderType}
        />
      )}

      {/* ZESTBOT → TODAY SUMMARY */}
      {riderType === 'ZESTBOT_EMPLOYEE' && (
        <Footer
          summary={todayEarningsData}
          riderType={riderType}
        />
      )}

    </ScrollView>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    color: '#FFFFFF',
    fontSize: isTablet ? 34 : wp(6),
    fontWeight: '700',
    flex: 1,
    marginLeft: wp(2),
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
    flex: 1,
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
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    borderRadius: wp(5),
    marginTop: hp(2),
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(3),
  },

  cardTitle: {
    fontSize: wp(5),
    fontWeight: '500',
  },

  cardValue: {
    fontSize: wp(5),
    fontWeight: '600',
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
    paddingHorizontal: wp(4),
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
    paddingHorizontal: wp(4),
    paddingVertical: isTablet ? hp(1.5) : hp(1),
    borderRadius: isTablet ? wp(2) : wp(3),
  },

  walletBtnTextOutline: {
    marginLeft: wp(2),
    color: '#FFFFFF',
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
    marginBottom: hp(1),
  },

  incentivesCards: {
    paddingVertical: 20,
  },

  screenContainer: {
  flex: 1,
  backgroundColor: '#F4F6F8',
},

scrollContent: {
  flexGrow: 1,
  backgroundColor: '#F4F6F8',
},
});