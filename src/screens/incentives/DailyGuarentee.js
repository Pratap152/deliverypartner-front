import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaView } from 'react-native-safe-area-context';

import SlabRuleTypeIncentives from '../../components/dashboard/earnings/SlabRuleTypeIncentives';
import FixedTargetRuleTypeIncentives from '../../components/dashboard/earnings/FixedTargetRuleTypeIncentives';
import HybridRuleTypeIncentives from '../../components/dashboard/earnings/HybridRuleTypeIncentives';
import PerOrderRuleTypeIncentives from '../../components/dashboard/earnings/PerOrderRuleTypeIncentives';

import {
  getDailyIncentivesProgress,
} from '../../services/earnings/incentiveService';

const DailyGuarentee = ({ route, navigation }) => {
  const { width } = useWindowDimensions();
  const isTablet = DeviceInfo.isTablet();
  const styles = createStyles(isTablet, width);

  const params = route?.params || {};

  const program =
    params?.daily_data?.data?.[0] || null;

  const isEmpty = !program;

  const [progress, setProgress] = useState(
    params?.dailyIncentivesProgress || null,
  );

  const [loading, setLoading] = useState(false);

  /*
   * Fetch fresh daily progress every time
   * this screen comes into focus.
   */
  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const fetchLatestProgress = async () => {
        try {
          setLoading(true);

          console.log(
            '🔥 DAILY PROGRESS API CALLED',
          );

          const response =
            await getDailyIncentivesProgress();

          console.log(
            '🔥 DAILY PROGRESS RESPONSE:',
            response,
          );

          if (!mounted) {
            return;
          }

          const latestProgress =
            Array.isArray(response?.data)
              ? response.data[0] || null
              : response?.data ||
              response ||
              null;

          setProgress(latestProgress);
        } catch (error) {
          console.log(
            '❌ DAILY PROGRESS API ERROR:',
            error?.response?.data ||
            error?.message ||
            error,
          );
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

      fetchLatestProgress();

      return () => {
        mounted = false;
      };
    }, []),
  );

  console.log(
    'DAILY PROGRAM:',
    program,
  );

  console.log(
    'DAILY PROGRESS:',
    progress,
  );


  const title =
    program?.name || 'Daily Incentive';

  const city =
    program?.city ||
    program?.cityName ||
    '--';

  const status =
    program?.status || '';

  const ruleType =
    program?.ruleType || '';

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

  const slabMinOrders = Number(
    program?.slabs?.[0]?.minOrders ?? 0,
  );

  const slabMaxOrders = Number(
    program?.slabs?.[0]?.maxOrders ?? 0,
  );

  const baseTargetOrders = Number(
    program?.target?.orders ??
    program?.conditions?.minOrders ??
    0,
  );

  const minOrders =
    ruleType === 'SLAB'
      ? slabMinOrders
      : baseTargetOrders;

  const maxOrders =
    ruleType === 'SLAB'
      ? slabMaxOrders
      : Number(
        program?.reward?.maxOrders ??
        program?.maxOrders ??
        0,
      );

  const targetOrders =
    ruleType === 'SLAB' &&
      maxOrders > minOrders &&
      ordersCompleted >= minOrders
      ? maxOrders
      : minOrders;

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
  const slabs = Array.isArray(
    program?.slabs,
  )
    ? program.slabs
    : [];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}>

      {/* =====================================================
        HEADER - ALWAYS VISIBLE
    ===================================================== */}

      <LinearGradient
        colors={['#192A51', '#475B8A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroHeader}>

        <SafeAreaView
          edges={['top']}
          style={styles.headerTop}>

          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
            hitSlop={{
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            }}>
            <Ionicons
              name="arrow-back"
              size={isTablet ? 30 : 24}
              color="#FFF"
            />
          </TouchableOpacity>

          <Text
            style={styles.heroTitle}
            numberOfLines={1}>
            {isEmpty
              ? 'Daily Incentives'
              : title}
          </Text>

        </SafeAreaView>

        {/* Only show reward when data exists */}
        {!isEmpty && (
          <View style={styles.rewardPill}>

            <Text style={styles.rewardLabel}>
              Max Daily Reward
            </Text>

            <Text style={styles.rewardValue}>
              ₹{maxReward}
            </Text>

          </View>
        )}

      </LinearGradient>

      {/* =====================================================
        EMPTY STATE
    ===================================================== */}

      {isEmpty ? (

        <View style={styles.emptyContainer}>

          <View style={styles.emptyIconContainer}>
            <Ionicons
              name="calendar-outline"
              size={isTablet ? 60 : 45}
              color="#12B76A"
            />
          </View>

          <Text style={styles.emptyTitle}>
            Daily Incentives Not Available
          </Text>

          <Text style={styles.emptySubtitle}>
            Complete more orders to unlock exciting
            incentives.
          </Text>

        </View>

      ) : (

        /* =====================================================
           NORMAL DAILY INCENTIVE CONTENT
        ===================================================== */

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
                  {progress?.status || status}
                </Text>

                <Text style={styles.value}>
                  {ordersCompleted} / {targetOrders}
                </Text>

                <Text style={styles.value}>
                  ₹{rewardEarned}
                </Text>

              </View>

            </View>

            {loading && (
              <View style={styles.refreshRow}>

                <ActivityIndicator
                  size="small"
                  color="#4F46E5"
                />

                <Text style={styles.refreshText}>
                  Updating progress...
                </Text>

              </View>
            )}

          </View>

          {/* SLAB */}

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

          {/* FIXED TARGET */}

          {ruleType === 'FIXED_TARGET' && (
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

          {/* HYBRID */}

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
              rewardEarned={
                rewardEarned
              }
              minEarnings={
                minEarnings
              }
              maxReward={maxReward}
              styles={styles}
              isTablet={isTablet}
            />
          )}

          {/* PER ORDER */}

          {ruleType === 'PER_ORDER' && (
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
      )}

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
      minHeight: 350,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 30,
      paddingVertical: 60,
      backgroundColor: '#F4F7FB',
    },

    emptyIconContainer: {
      width: isTablet ? 100 : 80,
      height: isTablet ? 100 : 80,
      borderRadius: isTablet ? 50 : 40,
      backgroundColor: '#ECFDF3',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },

    emptyTitle: {
      fontSize: isTablet ? 24 : 18,
      fontWeight: '700',
      color: '#111827',
      textAlign: 'center',
      marginBottom: 8,
    },

    emptySubtitle: {
      fontSize: isTablet ? 18 : 14,
      color: '#6B7280',
      textAlign: 'center',
      lineHeight: isTablet ? 26 : 20,
      paddingHorizontal: 20,
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

    refreshRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 14,
    },

    refreshText: {
      marginLeft: 8,
      fontSize: isTablet ? 15 : 12,
      color: '#6B7280',
      fontWeight: '500',
    },
  });