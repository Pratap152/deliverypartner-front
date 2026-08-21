import React, {useEffect} from 'react';
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

import {SafeAreaView} from 'react-native-safe-area-context';

import useEarningsDashboard from '../../hooks/useEarningsDashboard';
import useIncentives from '../../hooks/useIncentives';

import WeeklyEarningsChart from '../../components/dashboard/earnings/WeeklyEarningsChart';
import WeeklyEarningsChartZestBot from '../../components/dashboard/earnings/WeeklyEarningsChartZestBot';
import MonthlySummaryCard from '../../components/dashboard/earnings/MonthlySummaryCard';
import IncentivesCards from '../../components/dashboard/earnings/IncentivesCards';
import PremiumPressable from '../../components/common/PremiumPressable';

import {formatMoney} from '../../utils/formatMoney';

const {width} = Dimensions.get('window');
const isTablet = width >= 768;

/* =========================================================
   HELPERS
========================================================= */

const getWeeklyCompletedDays = progress =>
  Number(
    progress?.overallProgress?.completedDays ??
      progress?.completedDays ??
      progress?.daysCompleted ??
      progress?.progress?.completedDays ??
      0,
  );

const getWeeklyTotalDays = progress =>
  Number(
    progress?.overallProgress?.totalDays ??
      progress?.totalDays ??
      progress?.daysRequired ??
      progress?.targetDays ??
      progress?.progress?.totalDays ??
      7,
  );

const getCompletedOrders = progress =>
  Number(
    progress?.ordersCompleted ??
      progress?.completedOrders ??
      progress?.progress?.ordersCompleted ??
      progress?.progress?.completedOrders ??
      0,
  );

const getCompletedDays = progress => {
  if (!progress) return 0;

  const directValue =
    progress?.completedDays ??
    progress?.daysCompleted ??
    progress?.progress?.completedDays ??
    progress?.progress?.daysCompleted;

  if (directValue !== undefined && directValue !== null) {
    return Number(directValue) || 0;
  }

  const days =
    progress?.days ??
    progress?.dailyProgress ??
    progress?.progress?.days ??
    progress?.progress?.dailyProgress ??
    [];

  if (Array.isArray(days)) {
    return days.filter(day => {
      const status = String(
        day?.status ??
          day?.progress?.status ??
          '',
      ).toUpperCase();

      return (
        day?.isCompleted === true ||
        day?.completed === true ||
        status === 'COMPLETED' ||
        status === 'COMPLETE' ||
        status === 'ACHIEVED'
      );
    }).length;
  }

  const tasks =
    progress?.tasks ??
    progress?.progress?.tasks ??
    [];

  if (Array.isArray(tasks)) {
    return tasks.filter(task => {
      const status = String(
        task?.status ??
          task?.progress?.status ??
          '',
      ).toUpperCase();

      return (
        task?.isCompleted === true ||
        task?.completed === true ||
        status === 'COMPLETED' ||
        status === 'COMPLETE' ||
        status === 'ACHIEVED'
      );
    }).length;
  }

  return 0;
};

const getTotalDays = progress =>
  Number(
    progress?.totalDays ??
      progress?.daysRequired ??
      progress?.targetDays ??
      progress?.progress?.totalDays ??
      progress?.progress?.daysRequired ??
      progress?.progress?.targetDays ??
      7,
  );

const formatTime12Hour = time => {
  if (!time) return '';

  const value = String(time).trim();

  const match = value.match(
    /^(\d{1,2}):(\d{2})(?::\d{2})?/,
  );

  if (!match) return value;

  let hour = Number(match[1]);
  const minute = match[2];

  const period = hour >= 12 ? 'PM' : 'AM';

  hour = hour % 12 || 12;

  return `${hour}:${minute} ${period}`;
};

const formatTimeRange = (start, end) => {
  if (!start || !end) return 'Peak Hours';

  return `${formatTime12Hour(start)} - ${formatTime12Hour(end)}`;
};

const getRewardAmount = source => {
  if (!source) return 0;

  const slabs = source?.slabs;

  if (Array.isArray(slabs) && slabs.length) {
    const rewards = slabs
      .map(slab =>
        Number(
          slab?.rewardAmount ??
            slab?.reward?.amount ??
            slab?.amount ??
            0,
        ),
      )
      .filter(Boolean);

    if (rewards.length) {
      return Math.max(...rewards);
    }
  }

  return Number(
    source?.reward?.amount ??
      source?.rewardAmount ??
      source?.amount ??
      0,
  );
};

/* =========================================================
   HEADER
========================================================= */

const Header = ({earnings, riderType, navigation}) => {
  const isIndividual =
    riderType === 'INDIVIDUAL_EMPLOYEE';

  const isZestBot =
    riderType === 'ZESTBOT_EMPLOYEE';

  return (
    <View>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <LinearGradient
        colors={['#065F46', '#10B981', '#34D399']}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}>
        <SafeAreaView
          edges={['top']}
          style={styles.topBar}>
          <Text style={styles.title}>
            Earnings
          </Text>

          <View style={styles.topBarIcons}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() =>
                navigation.navigate(
                  'EarningsHistoryScreen',
                  {mode: 'WEEK'},
                )
              }>
              <MaterialIcons
                name="history"
                size={isTablet ? 30 : 24}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() =>
                navigation.navigate('HelpCenterList')
              }>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={isTablet ? 28 : 22}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {isIndividual && (
          <TouchableOpacity
            style={styles.dailyCard}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate(
                'EarningsHistoryScreen',
                {mode: 'TODAY'},
              )
            }>
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
                  ₹{formatMoney(
                    earnings?.attendanceAmount ?? 0,
                  )}
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
   GRAPH
========================================================= */

const Graph = ({
  todayEarnings,
  navigation,
  cardWidth,
  cardPadding,
  riderType,
  weeklyTotal,
  weeklyBarChart,
  weeklyOrders,
  earningsDataLoading,
}) => {
  const isZestBot =
    riderType === 'ZESTBOT_EMPLOYEE';

  const isCompany =
    riderType === 'COMPANY_EMPLOYEE';

  const isEligible =
    todayEarnings?.eligible ?? false;

  const formatOrderLabel = count =>
    `${count} ${count === 1 ? 'order' : 'orders'}`;

  return (
    <View style={styles.graphContainer}>
      <View
        style={[
          styles.card,
          {
            width: cardWidth,
            padding: cardPadding,
          },
        ]}>
        <PremiumPressable
          onPress={() =>
            navigation.navigate(
              'EarningsHistoryScreen',
              {mode: 'WEEK'},
            )
          }>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              Week Earnings
            </Text>

            <Text style={styles.cardValue}>
              {isZestBot
                ? isEligible
                  ? `₹${formatMoney(weeklyTotal ?? 0)}`
                  : formatOrderLabel(weeklyOrders ?? 0)
                : `₹${formatMoney(weeklyTotal ?? 0)}`}
            </Text>
          </View>

          {riderType === 'INDIVIDUAL_EMPLOYEE' && (
            <WeeklyEarningsChart
              data={weeklyBarChart}
              width={cardWidth - cardPadding * 2}
              height={isTablet ? hp(38) : hp(30)}
              earningsDataLoading={earningsDataLoading}
            />
          )}

          {(isZestBot || isCompany) && (
            <WeeklyEarningsChartZestBot
              data={weeklyBarChart}
              width={cardWidth - cardPadding * 2}
              height={isTablet ? hp(30) : hp(24)}
              monthlyTarget={
                todayEarnings?.monthlyTarget
              }
              completedOrders={
                todayEarnings?.totalCompletedOrders
              }
              weeklyTotal={weeklyTotal}
              eligible={todayEarnings?.eligible}
              earningsDataLoading={earningsDataLoading}
            />
          )}
        </PremiumPressable>
      </View>
    </View>
  );
};

/* =========================================================
   WALLET
========================================================= */

const WalletCard = ({
  riderType,
  walletData,
  navigation,
}) => {
  const isZestBot =
    riderType === 'ZESTBOT_EMPLOYEE';

  const payoutDate =
    walletData?.withdrawDate
      ? new Date(
          walletData.withdrawDate,
        ).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
        })
      : '--';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate('Payout')}>
      <LinearGradient
        colors={['#4338CA', '#6366F1', '#818CF8']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.walletCard}>
        <View style={styles.walletTop}>
          <View>
            <Text style={styles.walletLabel}>
              {isZestBot
                ? 'Monthly Payout'
                : 'Weekly Payout'}
            </Text>

            <Text style={styles.walletBalance}>
              ₹{formatMoney(
                walletData?.totalAmount ?? 0,
              )}
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

        <View style={styles.walletDivider} />

        <View style={styles.walletStats}>
          {isZestBot ? (
            <>
              <WalletStat
                label="Salary"
                value={walletData?.todayEarning ?? 0}
              />

              <WalletStat
                label="Incentives"
                value={walletData?.incentives ?? 0}
              />

              <WalletStat
                label="Tips"
                value={walletData?.tips ?? 0}
              />
            </>
          ) : (
            <>
              <WalletStat
                label="Available Balance"
                value={walletData?.availableBalance ?? 0}
              />

              <WalletStat
                label="Balance on Hold"
                value={walletData?.holdAmount ?? 0}
              />

              <WalletStat
                label="Payout Date"
                value={payoutDate}
                isDate
              />
            </>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const WalletStat = ({
  label,
  value,
  isDate,
}) => (
  <View style={styles.walletStatItem}>
    <Text style={styles.walletStatLabel}>
      {label}
    </Text>

    <Text style={styles.walletStatValue}>
      {isDate
        ? value
        : `₹${formatMoney(value ?? 0)}`}
    </Text>
  </View>
);

/* =========================================================
   MAIN SCREEN
========================================================= */

export default function EarningsScreen({
  navigation,
}) {
  const {
    data,
    loading,
    refreshing,
    onRefresh,
  } = useEarningsDashboard();

  const {
    peakIncentives,
    dailyIncentives,
    weeklyIncentives,
    weeklyIncentivesProgress,
    dailyIncentivesProgress,
    peakIncentivesProgress,
    riderIncentivesTarget,
    load,
    fetchIndividualIncentives,
    fetchZestbotIncentives,
  } = useIncentives();

  const {
    todayEarnings = {},
    earningsSummary = {},
    weeklyBarChart = [],
    riderType = '',
    weeklyTotal = 0,
    weeklyOrders = 0,
    wallet = {},
  } = data || {};

  /* =========================================================
     LOAD INCENTIVES
  ========================================================= */

  useEffect(() => {
    if (!riderType) return;

    if (riderType === 'INDIVIDUAL_EMPLOYEE') {
      fetchIndividualIncentives();
    }

    if (riderType === 'ZESTBOT_EMPLOYEE') {
      fetchZestbotIncentives();
    }
  }, [
    riderType,
    fetchIndividualIncentives,
    fetchZestbotIncentives,
  ]);

  /* =========================================================
     REFRESH
  ========================================================= */

  const handleRefresh = async () => {
    try {
      await onRefresh();

      if (riderType === 'INDIVIDUAL_EMPLOYEE') {
        await fetchIndividualIncentives();
      }

      if (riderType === 'ZESTBOT_EMPLOYEE') {
        await fetchZestbotIncentives();
      }
    } catch (error) {
      console.log(
        'Earnings Refresh Error:',
        error,
      );
    }
  };

  const todayEarningsData = {
    ...(earningsSummary?.today ??
      todayEarnings ??
      {}),
    attendanceAmount:
      earningsSummary?.today?.attendanceAmount ??
      todayEarnings?.attendanceAmount ??
      0,
  };

  const monthlyEarningsData =
    earningsSummary?.month ?? {};

  const cardWidth =
    isTablet ? wp(97) : wp(95);

  const cardPadding = wp(4);

  /* =========================================================
     WEEKLY PROGRESS
  ========================================================= */

  const weeklyTasks =
    weeklyIncentivesProgress?.tasks ??
    weeklyIncentivesProgress?.progress?.tasks ??
    [];

  const activeWeeklyTask =
    weeklyTasks.find(task => {
      const status = String(
        task?.progress?.status ??
          task?.status ??
          '',
      ).toUpperCase();

      return (
        status === 'RUNNING' ||
        status === 'IN_PROGRESS'
      );
    }) ||
    weeklyTasks.find(task => {
      const status = String(
        task?.progress?.status ??
          task?.status ??
          '',
      ).toUpperCase();

      return status === 'PENDING';
    }) ||
    weeklyTasks[0] ||
    null;

  const weeklyTaskProgress =
    activeWeeklyTask?.progress ??
    activeWeeklyTask ??
    {};

  const weeklyCompletedOrders =
    getCompletedOrders(
      weeklyTaskProgress,
    );

  const weeklyTargetOrders = Number(
    weeklyTaskProgress?.targetOrders ??
      activeWeeklyTask?.targetOrders ??
      activeWeeklyTask?.target?.orders ??
      0,
  );

  const weeklyProgressPercentage =
    weeklyTargetOrders > 0
      ? Math.min(
          (weeklyCompletedOrders /
            weeklyTargetOrders) *
            100,
          100,
        )
      : weeklyTaskProgress?.isCompleted
        ? 100
        : 0;

  /* =========================================================
     WEEKLY DAYS
  ========================================================= */

  const completedDaysFromMain =
    getCompletedDays(
      weeklyIncentivesProgress,
    );

  const completedDaysFromTask =
    getCompletedDays(
      weeklyTaskProgress,
    );


const completedDays = getWeeklyCompletedDays(
  weeklyIncentivesProgress,
);

const totalDays = getWeeklyTotalDays(
  weeklyIncentivesProgress,
);

  /* =========================================================
     PEAK PROGRESS
  ========================================================= */

  const peakCompletedOrders =
    getCompletedOrders(
      peakIncentivesProgress,
    );

  const peakProgram =
    peakIncentives?.data?.[0] ?? {};

  const peakSlot =
    peakProgram?.slots?.[0] ?? {};

  const peakRuleType =
    peakProgram?.ruleType ||
    peakSlot?.ruleType ||
    '';

  const peakTargetOrders =
    peakRuleType === 'HYBRID'
      ? Number(
          peakSlot?.conditions?.minOrders ?? 0,
        )
      : peakRuleType === 'FIXED_TARGET'
        ? Number(
            peakSlot?.target?.orders ?? 0,
          )
        : Number(
            peakSlot?.slabs?.[0]?.minOrders ?? 0,
          );

  const peakRewardAmount =
    getRewardAmount(peakSlot) ||
    getRewardAmount(peakProgram);

  const peakProgressPercentage =
    peakTargetOrders > 0
      ? Math.min(
          (peakCompletedOrders /
            peakTargetOrders) *
            100,
          100,
        )
      : peakIncentivesProgress?.isCompleted
        ? 100
        : 0;

  /* =========================================================
     DAILY PROGRESS
  ========================================================= */

  const dailyCompletedOrders =
    getCompletedOrders(
      dailyIncentivesProgress,
    );

  const dailyProgram =
    dailyIncentives?.data?.[0] ?? {};

  const dailySlabs =
    dailyProgram?.slabs ?? [];

  const dailyRewardAmount =
    getRewardAmount(dailyProgram) ||
    Number(
      dailyProgram?.maxPayoutPerDay ?? 0,
    );

  const dailyMinOrders =
    Number(
      dailySlabs?.[0]?.minOrders ?? 0,
    );

  const dailyMaxOrders =
    Number(
      dailySlabs?.[0]?.maxOrders ?? 0,
    );

  /* =========================================================
     INCENTIVES
  ========================================================= */

  const incentives = [
    {
      id: 'peak-slot',
      type: 'peak',

      title:
        peakProgram?.name ||
        'Peak Incentive',

      subtitle: formatTimeRange(
        peakSlot?.startTime,
        peakSlot?.endTime,
      ),

      amount: peakRewardAmount,

      minOrders: peakTargetOrders,

      peak_data: peakIncentives,

      emptyData:
        !peakIncentives ||
        peakIncentives?.emptyData === true ||
        !peakIncentives?.data?.length,
    },

    {
      id: 'weekly-incentive',
      type: 'weekly',

      title:
        weeklyIncentives?.data?.[0]?.name ||
        'Weekly Incentive',

      subtitle:
        `${completedDays}/${totalDays} days completed`,

      minOrders: Number(
        weeklyIncentives?.data?.[0]
          ?.tasks?.[0]?.target?.orders ??
          weeklyIncentives?.data?.[0]
            ?.tasks?.[0]?.slabs?.[0]
            ?.minOrders ??
          0,
      ),

      weekly_data: weeklyIncentives,

      emptyData:
        !weeklyIncentives ||
        weeklyIncentives?.emptyData === true ||
        !weeklyIncentives?.data?.length,
    },

    {
      id: 'daily-incentive',
      type: 'daily',

      title:
        dailyProgram?.name ||
        'Daily Incentive',

      subtitle:
        dailySlabs.length > 0
          ? `${dailyMinOrders}-${dailyMaxOrders} orders`
          : 'Daily Incentive',

      amount: dailyRewardAmount,

      minOrders: dailyMinOrders,

      dailyCompletedOrders,

      daily_data: dailyIncentives,

      emptyData:
        !dailyIncentives ||
        dailyIncentives?.emptyData === true ||
        !dailyIncentives?.data?.length,
    },
  ];

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const handleItemPress = item => {
    if (!item?.type) return;

    if (item.type === 'peak') {
      navigation.navigate(
        'PeakHourBonusScreen',
        {
          ...item,

          peak_data:
            item?.peak_data ??
            peakIncentives,

          peakIncentivesProgress,

          completedOrders:
            peakCompletedOrders,

          minOrders:
            item?.minOrders ??
            peakTargetOrders,

          amount:
            item?.amount ??
            peakRewardAmount,
        },
      );

      return;
    }

    if (item.type === 'daily') {
      navigation.navigate(
        'DailyGuarentee',
        {
          ...item,

          daily_data:
            item?.daily_data ??
            dailyIncentives,

          dailyIncentivesProgress,

          completedOrders:
            dailyCompletedOrders,

          amount:
            item?.amount ??
            dailyRewardAmount,
        },
      );

      return;
    }

    if (item.type === 'weekly') {
      navigation.navigate(
        'WeekEarnings',
        {
          ...item,

          weekly_data:
            item?.weekly_data ??
            weeklyIncentives,

          weeklyIncentivesProgress,

          completedDays,
          totalDays,
        },
      );
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color="#1F3365"
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={
        styles.scrollContent
      }
      overScrollMode="never"
      bounces={false}
      alwaysBounceVertical={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#1F3365']}
          tintColor="#1F3365"
        />
      }>

      {(riderType === 'INDIVIDUAL_EMPLOYEE' ||
        riderType === 'ZESTBOT_EMPLOYEE') && (
        <Header
          earnings={
            riderType === 'INDIVIDUAL_EMPLOYEE'
              ? todayEarningsData
              : monthlyEarningsData
          }
          riderType={riderType}
          navigation={navigation}
        />
      )}

      <Graph
        todayEarnings={todayEarnings}
        navigation={navigation}
        cardWidth={cardWidth}
        cardPadding={cardPadding}
        riderType={riderType}
        weeklyTotal={weeklyTotal}
        weeklyBarChart={weeklyBarChart}
        weeklyOrders={weeklyOrders}
        earningsDataLoading={loading}
      />

      <WalletCard
        riderType={riderType}
        walletData={wallet}
        navigation={navigation}
      />

      {riderType === 'INDIVIDUAL_EMPLOYEE' && (
        <View>
          <Text style={styles.incentiveTitle}>
            Extra Earnings Offers
          </Text>

          <View style={styles.incentivesCards}>
            {incentives.map(item => (
              <IncentivesCards
                key={item.id}
                item={item}
                onPress={handleItemPress}
                weeklyCompletedOrders={
                  weeklyCompletedOrders
                }
                dailyCompletedOrders={
                  dailyCompletedOrders
                }
                peakCompletedOrders={
                  peakCompletedOrders
                }
                peakProgressPercentage={
                  peakProgressPercentage
                }
                weeklyProgressPercentage={
                  weeklyProgressPercentage
                }
                loading={load}
              />
            ))}
          </View>
        </View>
      )}

      {riderType === 'ZESTBOT_EMPLOYEE' && (
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
                    key={`${item?.id ?? 'slab'}-${index}`}
                    style={[
                      styles.slabCard,
                      {
                        backgroundColor:
                          colors[
                            index %
                              colors.length
                          ],
                      },
                    ]}>
                    <View>
                      <Text style={styles.ordersLabel}>
                        Monthly Orders
                      </Text>

                      <Text style={styles.ordersText}>
                        {item?.toOrders
                          ? `${item?.fromOrders ?? 0} - ${item.toOrders}`
                          : `${item?.fromOrders ?? 0}+`}
                      </Text>
                    </View>

                    <View
                      style={
                        styles.rewardContainer
                      }>
                      <Text style={styles.rewardLabel}>
                        Reward
                      </Text>

                      <Text style={styles.rewardText}>
                        ₹{item?.amountPerOrder ?? 0}
                      </Text>

                      <Text style={styles.perOrder}>
                        per order
                      </Text>
                    </View>
                  </View>
                );
              },
            )}
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <MonthlySummaryCard
          summary={
            riderType === 'INDIVIDUAL_EMPLOYEE'
              ? monthlyEarningsData
              : todayEarningsData
          }
          riderType={riderType}
        />
      </View>
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
    backgroundColor: '#F4F6F8',
  },

  screenContainer: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },

  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#F4F6F8',
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isTablet ? wp(4) : wp(3),
  },

  title: {
    color: '#FFFFFF',
    fontSize: isTablet ? 34 : wp(6),
    fontWeight: '700',
    flex: 1,
    marginLeft: wp(2),
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

  graphContainer: {
    backgroundColor: '#F4F6F8',
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

  walletDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginVertical: hp(2),
  },

  walletStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  walletStatItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: wp(1),
  },

  walletStatLabel: {
    color: '#FFFFFF',
    fontSize: isTablet ? 17 : wp(3.3),
    lineHeight: isTablet ? 22 : wp(4),
    textAlign: 'center',
    minHeight: isTablet ? 44 : wp(8),
  },

  walletStatValue: {
    color: '#FFFFFF',
    fontSize: isTablet ? 20 : wp(4),
    fontWeight: '700',
    marginTop: hp(0.5),
    textAlign: 'center',
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

  footer: {
    marginBottom: hp(4),
  },
});