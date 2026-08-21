import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';

import {
  getPeakHourIncentives,
  getDailyIncentives,
  getWeeklyIncentives,
} from '../../services/earnings/incentiveService';

import useIncentives from '../../hooks/useIncentives';

const isTablet = DeviceInfo.isTablet();

const formatTime = time => {
  if (!time) return '';

  const match = String(time).match(/(\d{1,2}):(\d{2})/);

  if (!match) return time;

  let hour = Number(match[1]);
  const minute = match[2];

  const period = hour >= 12 ? 'PM' : 'AM';

  hour = hour % 12 || 12;

  return `${hour}:${minute} ${period}`;
};

const formatTimeRange = value => {
  if (!value) return '';

  const parts = String(value)
    .split('-')
    .map(item => item.trim());

  if (parts.length === 2) {
    return `${formatTime(parts[0])} - ${formatTime(parts[1])}`;
  }

  return formatTime(value);
};

const getPeakTime = program => {
  if (!program) return '';

  if (program.startTime && program.endTime) {
    return `${formatTime(program.startTime)} - ${formatTime(
      program.endTime,
    )}`;
  }

  if (program.start_time && program.end_time) {
    return `${formatTime(program.start_time)} - ${formatTime(
      program.end_time,
    )}`;
  }

  if (program.time) {
    return formatTimeRange(program.time);
  }

  if (program.startTime && program.endTime) {
    return `${formatTime(program.startTime)} - ${formatTime(
      program.endTime,
    )}`;
  }

  return '';
};

export default function IncentiveDetails({navigation}) {
  const [loading, setLoading] = useState(true);

  const [peakData, setPeakData] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);

  const {
    dailyIncentivesProgress,
    weeklyIncentivesProgress,
    peakIncentivesProgress,
    fetchWeeklyIncentivesProgress,
    fetchDailyIncentivesProgress,
    fetchPeakIncentivesProgress,
  } = useIncentives();

  /*
   * Refresh every time this screen becomes active.
   * This fixes stale daily/weekly/peak progress.
   */
  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const loadData = async () => {
        if (mounted) {
          setLoading(true);
        }

        const results = await Promise.allSettled([
          getPeakHourIncentives(),
          getDailyIncentives(),
          getWeeklyIncentives(),
          fetchPeakIncentivesProgress(),
          fetchDailyIncentivesProgress(),
          fetchWeeklyIncentivesProgress(),
        ]);

        if (!mounted) return;

        const [peakResult, dailyResult, weeklyResult] =
          results;

        if (
          peakResult.status === 'fulfilled' &&
          peakResult.value?.data?.[0]
        ) {
          setPeakData(peakResult.value);
        } else {
          setPeakData({emptyData: true});
        }

        if (
          dailyResult.status === 'fulfilled' &&
          dailyResult.value?.success &&
          dailyResult.value?.data?.[0]
        ) {
          setDailyData(dailyResult.value);
        } else {
          setDailyData({emptyData: true});
        }

        if (
          weeklyResult.status === 'fulfilled' &&
          weeklyResult.value?.success &&
          weeklyResult.value?.data?.[0]
        ) {
          setWeeklyData(weeklyResult.value);
        } else {
          setWeeklyData({emptyData: true});
        }

        setLoading(false);
      };

      loadData();

      return () => {
        mounted = false;
      };
    }, [
      fetchPeakIncentivesProgress,
      fetchDailyIncentivesProgress,
      fetchWeeklyIncentivesProgress,
    ]),
  );

  const isPeakEmpty = !peakData?.data?.[0];
  const isDailyEmpty = !dailyData?.data?.[0];
  const isWeeklyEmpty = !weeklyData?.data?.[0];

  /* =========================
     DAILY
  ========================= */

  const dailyProgram = dailyData?.data?.[0] || null;
  const dailyRuleType = dailyProgram?.ruleType || '';

  const dailyCompletedOrders = Number(
    dailyIncentivesProgress?.ordersCompleted ??
      dailyIncentivesProgress?.completedOrders ??
      0,
  );

  const dailyRewardEarned = Number(
  dailyProgram?.slabs?.[0]?.rewardAmount ?? 0,
);
  let dailyMinimumOrders = 0;

  if (dailyRuleType === 'SLAB') {
    dailyMinimumOrders = Number(
      dailyProgram?.slabs?.[0]?.minOrders ?? 0,
    );
  } else if (dailyRuleType === 'FIXED_TARGET') {
    dailyMinimumOrders = Number(
      dailyProgram?.target?.orders ?? 0,
    );
  } else if (dailyRuleType === 'HYBRID') {
    dailyMinimumOrders = Number(
      dailyProgram?.conditions?.minOrders ?? 0,
    );
  } else if (dailyRuleType === 'PER_ORDER') {
    dailyMinimumOrders = Number(
      dailyProgram?.reward?.maxOrders ??
        dailyProgram?.maxOrders ??
        0,
    );
  }

  const dailyProgress =
    dailyMinimumOrders > 0
      ? Math.min(
          (dailyCompletedOrders / dailyMinimumOrders) * 100,
          100,
        )
      : 0;

  /* =========================
     WEEKLY
  ========================= */

  const weeklyProgram = weeklyData?.data?.[0] || null;
  const weeklyRuleType = weeklyProgram?.ruleType || '';

  const weeklyProgressData =
    weeklyIncentivesProgress || null;

  const weeklyCompletedDays = Number(
    weeklyProgressData?.overallProgress?.completedDays ??
      0,
  );

  const weeklyTotalDays = Number(
    weeklyProgressData?.overallProgress?.totalDays ??
      0,
  );

  const weeklyRewardEarned = Number(
    weeklyProgressData?.overallProgress?.earnedAmount ??
      0,
  );

  const weeklyRemainingAmount = Number(
    weeklyProgressData?.overallProgress?.remainingAmount ??
      0,
  );

  const weeklyMaxReward = Number(
    weeklyProgram?.maxReward ??
      weeklyProgressData?.maxReward ??
      0,
  );

  const weeklyProgress =
    weeklyRuleType === 'TASK'
      ? weeklyTotalDays > 0
        ? Math.min(
            (weeklyCompletedDays / weeklyTotalDays) * 100,
            100,
          )
        : 0
      : 0;

  /* =========================
     PEAK
  ========================= */

  const peakCompletedOrders = Number(
    peakIncentivesProgress?.ordersCompleted ??
      peakIncentivesProgress?.completedOrders ??
      0,
  );

  let peakMinimumOrders = 0;
  const peakProgram = peakData?.data?.[0];
  const peakSlot = peakProgram?.slots?.[0];

  if (!isPeakEmpty) {

    if (peakProgram?.ruleType === 'HYBRID') {
      peakMinimumOrders = Number(
        peakSlot?.conditions?.minOrders ?? 0,
      );
    } else if (peakProgram?.ruleType === 'FIXED_TARGET') {
      peakMinimumOrders = Number(
        peakSlot?.target?.orders ?? 0,
      );
    } else if (peakProgram?.ruleType === 'SLAB') {
      peakMinimumOrders = Number(
        peakSlot?.slabs?.[0]?.minOrders ?? 0,
      );
    }
  }

  const peakRewardEarned = Number(
    peakSlot?.slabs?.[0]?.rewardAmount ?? 0,
  );

  const peakProgress =
    peakMinimumOrders > 0
      ? Math.min(
          (peakCompletedOrders / peakMinimumOrders) * 100,
          100,
        )
      : 0;

  /* =========================
     NAVIGATION
  ========================= */

  const navigateToPeakHour = () => {
    if (!peakData || isPeakEmpty) return;

    navigation.navigate('PeakHourBonusScreen', {
      peak_data: peakData,
      peakIncentivesProgress,
      minOrders: peakMinimumOrders,
    });
  };

  const navigateToDaily = () => {
    if (!dailyData || isDailyEmpty) return;

    navigation.navigate('DailyGuarentee', {
      daily_data: dailyData,
      dailyIncentivesProgress,
      minOrders: dailyMinimumOrders,
    });
  };

  const navigateToWeekly = () => {
    if (!weeklyData || isWeeklyEmpty) return;

    navigation.navigate('WeekEarnings', {
      weekly_data: weeklyData,
      weeklyIncentivesProgress,
      minOrders: 0,
    });
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#6366F1', '#4F46E5']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.headerGradient}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Ionicons
              name="arrow-back"
              size={isTablet ? 30 : 24}
              color="#FFF"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Incentive Details
          </Text>
        </LinearGradient>

        <View style={styles.loader}>
          <ActivityIndicator
            size="large"
            color="#6366F1"
          />

          <Text style={styles.loadingText}>
            Loading incentives...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}

      <LinearGradient
        colors={['#6366F1', '#4F46E5']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.headerGradient}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={isTablet ? 30 : 24}
            color="#FFF"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Incentive Details
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* AVAILABLE INCENTIVES */}

        <View style={styles.sectionHeader}>
          <Ionicons
            name="gift-outline"
            size={22}
            color="#6366F1"
          />

          <Text style={styles.sectionTitle}>
            Available Incentives
          </Text>
        </View>

        {/* DAILY */}

        {!isDailyEmpty ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={navigateToDaily}
            style={styles.incentiveCard}>

            <View style={styles.cardRow}>
              <View style={styles.cardLeft}>
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: '#F5F3FF',
                    },
                  ]}>
                  <Ionicons
                    name="checkmark-done"
                    size={20}
                    color="#6366F1"
                  />
                </View>

                <Text
                  style={styles.cardTitle}
                  numberOfLines={2}>
                  {dailyProgram?.name ||
                    'Daily Incentive'}
                </Text>
              </View>

              <Text style={styles.cardReward}>
                ₹{dailyRewardEarned}
              </Text>
            </View>

            <View style={styles.progressContainer}>
              <LinearGradient
                colors={['#6366F1', '#4F46E5']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={[
                  styles.progressFill,
                  {
                    width: `${dailyProgress}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.progressText}>
              {dailyCompletedOrders} / {dailyMinimumOrders}{' '}
              orders completed
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.incentiveCardEmpty}>
            <Ionicons
              name="checkmark-done"
              size={24}
              color="#DDD"
            />

            <Text style={styles.emptyText}>
              Daily incentive not available
            </Text>
          </View>
        )}

        {/* PEAK */}

        {!isPeakEmpty ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={navigateToPeakHour}
            style={styles.incentiveCard}>

            <View style={styles.cardRow}>
              <View style={styles.cardLeft}>
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: '#FFF7ED',
                    },
                  ]}>
                  <Ionicons
                    name="flash"
                    size={20}
                    color="#FF9500"
                  />
                </View>

                <View style={styles.titleContainer}>
                  <Text
                    style={styles.cardTitle}
                    numberOfLines={2}>
                    {peakData?.data?.[0]?.name ||
                      'Peak Hour Bonus'}
                  </Text>

                  {!!getPeakTime(
                    peakData?.data?.[0],
                  ) && (
                    <Text style={styles.cardSubtitle}>
                      {getPeakTime(
                        peakData?.data?.[0],
                      )}
                    </Text>
                  )}
                </View>
              </View>

              <Text
                style={[
                  styles.cardReward,
                  {
                    color: '#FF9500',
                  },
                ]}>
                ₹{peakRewardEarned}
              </Text>
            </View>

            <View style={styles.progressContainer}>
              <LinearGradient
                colors={['#FF9500', '#FF7A00']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={[
                  styles.progressFill,
                  {
                    width: `${peakProgress}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.progressText}>
              {peakCompletedOrders} / {peakMinimumOrders}{' '}
              completed
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.incentiveCardEmpty}>
            <Ionicons
              name="flash"
              size={24}
              color="#DDD"
            />

            <Text style={styles.emptyText}>
              Peak hour bonus not available
            </Text>
          </View>
        )}

        {/* WEEKLY */}

        {!isWeeklyEmpty ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={navigateToWeekly}
            style={styles.incentiveCard}>

            <View style={styles.cardRow}>
              <View style={styles.cardLeft}>
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: '#EFF6FF',
                    },
                  ]}>
                  <Ionicons
                    name="calendar"
                    size={20}
                    color="#3B82F6"
                  />
                </View>

                <Text
                  style={styles.cardTitle}
                  numberOfLines={2}>
                  {weeklyProgram?.name ||
                    'Weekly Bonus'}
                </Text>
              </View>

              <Text
                style={[
                  styles.cardReward,
                  {
                    color: '#3B82F6',
                  },
                ]}>
                ₹{weeklyRewardEarned}
              </Text>
            </View>

            {/* TASK = DAYS */}

            {weeklyRuleType === 'TASK' ? (
              <>
                <View style={styles.progressContainer}>
                  <LinearGradient
                    colors={['#3B82F6', '#2563EB']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={[
                      styles.progressFill,
                      {
                        width: `${weeklyProgress}%`,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.progressText}>
                  {weeklyCompletedDays} / {weeklyTotalDays}{' '}
                  days completed
                </Text>

                <Text style={styles.weeklyRewardText}>
                  ₹{weeklyRewardEarned} earned
                  {'  '}•{'  '}
                  ₹{weeklyRemainingAmount} remaining
                </Text>
              </>
            ) : (
              <>
                <View style={styles.progressContainer}>
                  <LinearGradient
                    colors={['#3B82F6', '#2563EB']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={[
                      styles.progressFill,
                      {
                        width: `${weeklyProgress}%`,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.progressText}>
                  {weeklyCompletedDays} / {weeklyTotalDays}{' '}
                  days completed
                </Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.incentiveCardEmpty}>
            <Ionicons
              name="calendar"
              size={24}
              color="#DDD"
            />

            <Text style={styles.emptyText}>
              Weekly bonus not available
            </Text>
          </View>
        )}

        {/* ALL EMPTY */}

        {isDailyEmpty &&
          isPeakEmpty &&
          isWeeklyEmpty && (
            <View style={styles.emptyStateContainer}>
              <Ionicons
                name="gift-outline"
                size={60}
                color="#CCC"
              />

              <Text style={styles.emptyStateTitle}>
                No Incentives Available
              </Text>

              <Text style={styles.emptyStateText}>
                Check back later for new incentive
                opportunities
              </Text>
            </View>
          )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    gap: 10,
  },

  backButton: {
    padding: 8,
  },

  headerTitle: {
    fontSize: wp(6),
    fontWeight: '700',
    color: '#FFF',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: hp(2),
    fontSize: wp(4),
    color: '#666',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: hp(2.5),
    paddingBottom: hp(4),
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: wp(5),
    marginBottom: hp(2),
  },

  sectionTitle: {
    fontSize: wp(4.5),
    fontWeight: '700',
    color: '#000',
  },

  incentiveCard: {
    backgroundColor: '#FFF',
    borderRadius: wp(4),
    padding: wp(4),
    marginHorizontal: wp(5),
    marginBottom: hp(2),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },

  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
    paddingRight: 10,
  },

  titleContainer: {
    flex: 1,
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardTitle: {
    flex: 1,
    fontSize: wp(4),
    fontWeight: '600',
    color: '#000',
  },

  cardSubtitle: {
    fontSize: wp(3.2),
    color: '#6B7280',
    marginTop: 3,
  },

  cardReward: {
    fontSize: wp(4.5),
    fontWeight: '700',
    color: '#6366F1',
  },

  progressContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: hp(0.8),
  },

  progressFill: {
    height: '100%',
    borderRadius: 10,
  },

  progressText: {
    fontSize: wp(3),
    color: '#6B7280',
  },

  weeklyRewardText: {
    fontSize: wp(3),
    color: '#6B7280',
    marginTop: hp(0.7),
  },

  incentiveCardEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: wp(4),
    padding: wp(4),
    marginHorizontal: wp(5),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },

  emptyText: {
    fontSize: wp(3.5),
    color: '#999',
  },

  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(10),
  },

  emptyStateTitle: {
    marginTop: hp(2),
    fontSize: wp(5),
    fontWeight: '600',
    color: '#666',
  },

  emptyStateText: {
    marginTop: hp(1),
    fontSize: wp(3.5),
    color: '#999',
    textAlign: 'center',
  },
});