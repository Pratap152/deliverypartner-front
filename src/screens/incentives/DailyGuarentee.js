import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import {SafeAreaView} from 'react-native-safe-area-context';

import SlabRuleTypeIncentives from '../../components/dashboard/earnings/SlabRuleTypeIncentives';
import FixedTargetRuleTypeIncentives from '../../components/dashboard/earnings/FixedTargetRuleTypeIncentives';
import HybridRuleTypeIncentives from '../../components/dashboard/earnings/HybridRuleTypeIncentives';
import PerOrderRuleTypeIncentives from '../../components/dashboard/earnings/PerOrderRuleTypeIncentives';

const DailyGuarentee = ({route, navigation}) => {
  const {width} = useWindowDimensions();
  const isTablet = DeviceInfo.isTablet();
  const styles = createStyles(isTablet, width);

  const params = route?.params || {};

  const program =
    params?.daily_data?.data?.[0] || null;

  const progress =
    params?.dailyIncentivesProgress || null;

  console.log(
    'DAILY PROGRAM:',
    program,
  );

  console.log(
    'DAILY PROGRESS:',
    progress,
  );

  if (!program) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="calendar-outline"
          size={isTablet ? 70 : 50}
          color="#9CA3AF"
        />

        <Text style={styles.emptyText}>
          Please come again later
        </Text>
      </View>
    );
  }

  const title =
    program.name || 'Daily Incentive';

  const city =
    program.city || '--';

  const status =
    program.status || '';

  const ruleType =
    program.ruleType || '';

  /* =========================================================
     DAILY PROGRESS
  ========================================================= */

  const ordersCompleted = Number(
    progress?.ordersCompleted ??
      progress?.completedOrders ??
      progress?.progress?.ordersCompleted ??
      progress?.progress?.completedOrders ??
      0,
  );

  const rewardEarned = Number(
    progress?.rewardEarned ??
      progress?.progress?.rewardEarned ??
      0,
  );

  /* =========================================================
     TARGET
  ========================================================= */

  const minOrders = Number(
    program?.slabs?.[0]?.minOrders ??
      program?.target?.orders ??
      program?.conditions?.minOrders ??
      0,
  );

  const maxReward = Number(
    program?.maxPayoutPerDay ?? 0,
  );

  const minEarnings = Number(
    program?.conditions?.minEarnings ?? 0,
  );

  const perOrderAmount = Number(
    program?.reward?.perOrderAmount ??
      program?.rewardPerOrder ??
      0,
  );

  const maxOrders = Number(
    program?.reward?.maxOrders ??
      program?.maxOrders ??
      0,
  );

  const slabs = Array.isArray(
    program?.slabs,
  )
    ? program.slabs
    : [];

  console.log(
    'DAILY CALCULATED:',
    {
      ruleType,
      ordersCompleted,
      minOrders,
      rewardEarned,
      maxReward,
      slabReward:
        slabs?.[0]?.rewardAmount ?? 0,
    },
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#192A51', '#475B8A']}
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
              size={isTablet ? 30 : 24}
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
          <Text style={styles.rewardLabel}>
            Max Daily Reward
          </Text>

          <Text style={styles.rewardValue}>
            ₹{maxReward}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.contentContainer}>
        <View style={styles.titleCard}>
          <Text style={styles.checkpointTitle}>
            {title}
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.infoColumn}>
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
                Progress
              </Text>

              <Text style={styles.label}>
                Earned
              </Text>
            </View>

            <View style={styles.infoColumn}>
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
                {ordersCompleted} / {minOrders}
              </Text>

              <Text style={styles.value}>
                ₹{rewardEarned}
              </Text>
            </View>
          </View>
        </View>

        {ruleType === 'SLAB' && (
          <SlabRuleTypeIncentives
            title={title}
            status={
              progress?.status ||
              status
            }
            slabs={slabs}
            ordersCompleted={
              ordersCompleted
            }
            maxReward={maxReward}
            styles={styles}
            isTablet={isTablet}
          />
        )}

        {ruleType ===
          'FIXED_TARGET' && (
          <FixedTargetRuleTypeIncentives
            title={title}
            status={
              progress?.status ||
              status
            }
            target={minOrders}
            ordersCompleted={
              ordersCompleted
            }
            maxReward={maxReward}
            isTablet={isTablet}
            styles={styles}
          />
        )}

        {ruleType === 'HYBRID' && (
          <HybridRuleTypeIncentives
            title={title}
            status={
              progress?.status ||
              status
            }
            ordersCompleted={
              ordersCompleted
            }
            minOrders={minOrders}
            rewardEarned={rewardEarned}
            minEarnings={minEarnings}
            maxReward={maxReward}
            styles={styles}
            isTablet={isTablet}
          />
        )}

        {ruleType ===
          'PER_ORDER' && (
          <PerOrderRuleTypeIncentives
            title={title}
            status={
              progress?.status ||
              status
            }
            perOrderAmount={
              perOrderAmount
            }
            ordersCompleted={
              ordersCompleted
            }
            maxOrders={maxOrders}
            maxReward={maxReward}
            styles={styles}
            isTablet={isTablet}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default DailyGuarentee;

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
      backgroundColor: '#F4F7FB',
    },

    emptyText: {
      marginTop: 14,
      fontSize: isTablet ? 22 : 16,
      color: '#6B7280',
      fontWeight: '600',
    },

    heroHeader: {
      paddingBottom:
        isTablet ? 55 : 40,
      paddingHorizontal:
        isTablet ? 34 : 20,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
    },

    headerTop: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
      marginBottom:
        isTablet ? 28 : 18,
    },

    heroTitle: {
      flex: 1,
      fontSize:
        isTablet ? 38 : 24,
      fontWeight: '700',
      color: '#FFF',
    },

    rewardPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        'rgba(255,255,255,0.15)',
      paddingHorizontal:
        isTablet ? 22 : 16,
      paddingVertical:
        isTablet ? 12 : 8,
      borderRadius: 18,
      borderWidth: 1,
      borderColor:
        'rgba(255,255,255,0.2)',
      alignSelf: 'flex-start',
    },

    rewardLabel: {
      color: '#E0E0E0',
      fontSize:
        isTablet ? 16 : 13,
      marginRight: 8,
    },

    rewardValue: {
      color: '#FFD700',
      fontSize:
        isTablet ? 24 : 18,
      fontWeight: '700',
    },

    contentContainer: {
      paddingVertical:
        isTablet ? 30 : 20,
      paddingHorizontal: 20,
    },

    titleCard: {
      marginBottom: 20,
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

    infoRow: {
      flexDirection: 'row',
      marginTop: 10,
    },

    infoColumn: {
      flex: 1,
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
  });