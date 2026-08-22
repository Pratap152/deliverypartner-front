import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import SlabRuleTypeIncentives from '../../components/dashboard/earnings/SlabRuleTypeIncentives';
import FixedTargetRuleTypeIncentives from '../../components/dashboard/earnings/FixedTargetRuleTypeIncentives';
import HybridRuleTypeIncentives from '../../components/dashboard/earnings/HybridRuleTypeIncentives';

import {SafeAreaView} from 'react-native-safe-area-context';

/* =========================================================
   HELPERS
========================================================= */

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
  if (!start || !end) {
    return 'No peak slots';
  }

  return `${formatTime12Hour(start)} - ${formatTime12Hour(
    end,
  )}`;
};

const getRewardAmount = source => {
  if (!source) return 0;

  const directReward = Number(
    source?.reward?.amount ??
      source?.rewardAmount ??
      source?.amount ??
      0,
  );

  if (directReward > 0) {
    return directReward;
  }

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
      .filter(value => value > 0);

    if (rewards.length) {
      return Math.max(...rewards);
    }
  }

  return 0;
};

/* =========================================================
   SCREEN
========================================================= */

const PeakHourBonusScreen = ({
  route,
  navigation,
}) => {
  const {width} = useWindowDimensions();

  const isTablet = DeviceInfo.isTablet();

  const styles = createStyles(
    isTablet,
    width,
  );

  const params = route?.params || {};

  console.log(
    'Peak Hour Bonus params:',
    params,
  );

  /* =========================================================
     PROGRAM DATA
  ========================================================= */

  const program =
    params?.peak_data?.data?.[0] ||
    params?.peakProgram ||
    null;

  const progress =
    params?.peakIncentivesProgress ||
    params?.progress ||
    {};

  if (!program || params?.emptyData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Please come again later
        </Text>
      </View>
    );
  }

  /* =========================================================
     PROGRAM
  ========================================================= */

  const ruleType =
    program?.ruleType || '';

  const title =
    program?.name || 'Peak Bonus';

  const city =
    program?.cityName ||
    program?.city ||
    '--';

  const status =
    program?.isUpcoming
      ? 'NOT STARTED'
      : program?.isActive
        ? 'RUNNING'
        : 'INACTIVE';

  /* =========================================================
     PEAK SLOT
  ========================================================= */

  const slot =
    program?.slots?.[0] || null;

  const peakSlotStart =
    slot?.startTime;

  const peakSlotEnd =
    slot?.endTime;

  const peakSlotTime =
    formatTimeRange(
      peakSlotStart,
      peakSlotEnd,
    );

  /* =========================================================
     COMPLETED ORDERS
  ========================================================= */

  const ordersCompleted = Number(
    params?.completedOrders ??
      progress?.ordersCompleted ??
      progress?.completedOrders ??
      progress?.progress?.ordersCompleted ??
      progress?.progress?.completedOrders ??
      0,
  );

  /* =========================================================
     TARGET ORDERS
  ========================================================= */

  let targetOrders = 0;

  if (ruleType === 'HYBRID') {
    targetOrders = Number(
      slot?.conditions?.minOrders ??
        params?.minOrders ??
        0,
    );
  } else if (ruleType === 'FIXED_TARGET') {
    targetOrders = Number(
      slot?.target?.orders ??
        params?.minOrders ??
        0,
    );
  } else if (ruleType === 'SLAB') {
    targetOrders = Number(
      slot?.slabs?.[0]?.minOrders ??
        params?.minOrders ??
        0,
    );
  }

  /* =========================================================
     PROGRESS
  ========================================================= */

  const orderProgress =
    targetOrders > 0
      ? Math.min(
          (ordersCompleted /
            targetOrders) *
            100,
          100,
        )
      : 0;

  /* =========================================================
     HYBRID
  ========================================================= */

  const conditions =
    slot?.conditions || {};

  const minOrders =
    Number(
      conditions?.minOrders ??
        params?.minOrders ??
        0,
    );

  const minEarnings =
    Number(
      conditions?.minEarnings ?? 0,
    );

  /* =========================================================
     REWARD
  ========================================================= */

  const configuredReward =
    getRewardAmount(slot) ||
    getRewardAmount(program);

  const earnedReward =
    Number(
      progress?.rewardAmount ??
        progress?.rewardEarned ??
        progress?.progress?.rewardAmount ??
        progress?.progress?.rewardEarned ??
        0,
    );

  const rewardAmount =
    configuredReward ||
    earnedReward ||
    Number(params?.amount ?? 0);

  /* =========================================================
     SLABS
  ========================================================= */

  const slabs =
    slot?.slabs || [];

  const slabMaxReward =
    slabs.length > 0
      ? Math.max(
          ...slabs.map(slab =>
            Number(
              slab?.rewardAmount ??
                slab?.reward?.amount ??
                slab?.amount ??
                0,
            ),
          ),
        )
      : 0;

  const maxReward =
    slabMaxReward ||
    rewardAmount ||
    earnedReward ||
    0;

  const isCompleted =
    targetOrders > 0 &&
    ordersCompleted >= targetOrders;

  console.log(
    'Peak Calculated Values:',
    {
      ruleType,
      peakSlotStart,
      peakSlotEnd,
      peakSlotTime,
      ordersCompleted,
      targetOrders,
      orderProgress,
      configuredReward,
      earnedReward,
      rewardAmount,
      maxReward,
      isCompleted,
    },
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}>

      {/* =====================================================
          HERO
      ===================================================== */}

      <LinearGradient
        colors={[
          '#192A51',
          '#475B8A',
        ]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.heroHeader}>

        <SafeAreaView
          edges={['top']}
          style={styles.headerTop}>

          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }>
            <Ionicons
              name="arrow-back"
              size={
                isTablet ? 34 : 24
              }
              color="#FFF"
            />
          </TouchableOpacity>

          <Text
            style={styles.heroTitle}
            numberOfLines={1}>
            {title}
          </Text>
        </SafeAreaView>

        <View style={styles.rewardPill}>
          <Ionicons
            name="flash"
            size={
              isTablet ? 22 : 16
            }
            color="#FFD700"
          />

          <Text style={styles.rewardLabel}>
            Peak Hours:
          </Text>

          <Text style={styles.rewardValue}>
            {peakSlotTime}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.contentContainer}>

        {/* ===================================================
            INFO CARD
        =================================================== */}

        <View style={styles.titleCard}>
          <Text
            style={
              styles.checkpointTitle
            }>
            {title}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
            }}>

            <View style={{flex: 1}}>
              <Text style={styles.label}>
                City
              </Text>

              <Text style={styles.label}>
                Type
              </Text>

              <Text style={styles.label}>
                Status
              </Text>

              <Text style={styles.label}>
                Completed
              </Text>

              <Text style={styles.label}>
                Target
              </Text>

              <Text style={styles.label}>
                Reward
              </Text>
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.value}>
                {city}
              </Text>

              <Text style={styles.value}>
                {ruleType}
              </Text>

              <Text style={styles.value}>
                {status}
              </Text>

              <Text style={styles.value}>
                {ordersCompleted}
              </Text>

              <Text style={styles.value}>
                {targetOrders}
              </Text>

              <Text style={styles.value}>
                ₹{rewardAmount}
              </Text>
            </View>
          </View>
        </View>

        {/* ===================================================
            PROGRESS
        =================================================== */}

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>
              Order Progress
            </Text>

            <Text
              style={
                styles.progressPercentage
              }>
              {Math.round(
                orderProgress,
              )}
              %
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${orderProgress}%`,
                },
              ]}
            />
          </View>

          <Text
            style={
              styles.progressDescription
            }>
            {ordersCompleted} of {targetOrders}{' '}
            orders completed
          </Text>

          {isCompleted && (
            <Text
              style={
                styles.completedText
              }>
              Target achieved! ₹
              {rewardAmount}
            </Text>
          )}
        </View>

        {/* ===================================================
            SLAB
        =================================================== */}

        {ruleType === 'SLAB' && (
          <SlabRuleTypeIncentives
            title={title}
            status={status}
            slabs={slabs}
            ordersCompleted={
              ordersCompleted
            }
            maxReward={maxReward}
            styles={styles}
            isTablet={isTablet}
          />
        )}

        {/* ===================================================
            FIXED TARGET
        =================================================== */}

        {ruleType ===
          'FIXED_TARGET' && (
          <FixedTargetRuleTypeIncentives
            title={title}
            status={status}
            target={targetOrders}
            ordersCompleted={
              ordersCompleted
            }
            maxReward={maxReward}
            styles={styles}
            isTablet={isTablet}
          />
        )}

        {/* ===================================================
            HYBRID
        =================================================== */}

        {ruleType === 'HYBRID' && (
          <HybridRuleTypeIncentives
            title={title}
            status={status}
            ordersCompleted={
              ordersCompleted
            }
            minOrders={minOrders}
            rewardEarned={
              earnedReward
            }
            minEarnings={
              minEarnings
            }
            maxReward={maxReward}
            styles={styles}
            isTablet={isTablet}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default PeakHourBonusScreen;

/* =========================================================
   STYLES
========================================================= */

const createStyles = (
  isTablet,
  width,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F4F7FB',
    },

    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    emptyText: {
      fontSize:
        isTablet ? 24 : 16,
      fontWeight: '600',
      color: '#6B7280',
    },

    heroHeader: {
      paddingBottom:
        isTablet ? 55 : 40,
      paddingHorizontal:
        isTablet ? 35 : 20,
      borderBottomLeftRadius:
        isTablet ? 36 : 24,
      borderBottomRightRadius:
        isTablet ? 36 : 24,
    },

    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom:
        isTablet ? 30 : 18,
    },

    heroTitle: {
      flex: 1,
      fontSize:
        isTablet ? 34 : 24,
      fontWeight: '700',
      color: '#FFF',
      marginLeft: 15,
    },

    rewardPill: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor:
        'rgba(255,255,255,0.15)',
      paddingHorizontal:
        isTablet ? 20 : 14,
      paddingVertical:
        isTablet ? 12 : 8,
      borderRadius:
        isTablet ? 20 : 16,
      flexWrap: 'wrap',
    },

    rewardLabel: {
      color: '#E0E0E0',
      fontSize:
        isTablet ? 18 : 13,
      marginHorizontal: 6,
    },

    rewardValue: {
      color: '#FFD700',
      fontSize:
        isTablet ? 22 : 16,
      fontWeight: '700',
      flexShrink: 1,
    },

    titleCard: {
      marginVertical: 20,
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderWidth: 1,
      borderColor: '#DEDEE1',
      borderRadius: 8,
      backgroundColor: '#FFF',
    },

    checkpointTitle: {
      fontSize:
        isTablet ? 24 : 18,
      fontWeight: '700',
      color: '#1F2937',
    },

    label: {
      fontSize:
        isTablet ? 17 : 14,
      fontWeight: '500',
      color: '#6B7280',
      paddingTop: 8,
    },

    value: {
      fontSize:
        isTablet ? 17 : 14,
      fontWeight: '700',
      color: '#111827',
      paddingTop: 8,
    },

    progressCard: {
      backgroundColor: '#FFF',
      borderRadius: 12,
      padding: 18,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },

    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },

    progressTitle: {
      fontSize:
        isTablet ? 20 : 16,
      fontWeight: '700',
      color: '#1F2937',
    },

    progressPercentage: {
      fontSize:
        isTablet ? 20 : 16,
      fontWeight: '700',
      color: '#F97316',
    },

    progressTrack: {
      height: 10,
      backgroundColor: '#E5E7EB',
      borderRadius: 10,
      overflow: 'hidden',
    },

    progressFill: {
      height: '100%',
      backgroundColor: '#F97316',
      borderRadius: 10,
    },

    progressDescription: {
      marginTop: 10,
      fontSize:
        isTablet ? 17 : 14,
      color: '#6B7280',
    },

    completedText: {
      marginTop: 8,
      fontSize:
        isTablet ? 17 : 14,
      fontWeight: '700',
      color: '#16A34A',
    },

    contentContainer: {
      paddingVertical:
        isTablet ? 30 : 20,
      paddingHorizontal: 20,
    },
  });