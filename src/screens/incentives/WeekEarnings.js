import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';

import ProgressBar from '../../components/dashboard/earnings/ProgressBar';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';

import SlabRuleTypeIncentives from '../../components/dashboard/earnings/SlabRuleTypeIncentives';
import FixedTargetRuleTypeIncentives from '../../components/dashboard/earnings/FixedTargetRuleTypeIncentives';
import HybridRuleTypeIncentives from '../../components/dashboard/earnings/HybridRuleTypeIncentives';
import PerOrderRuleTypeIncentives from '../../components/dashboard/earnings/PerOrderRuleTypeIncentives';

import WeeklyMissionProgress from '../../components/dashboard/earnings/WeeklyMissionProgress';

import { SafeAreaView } from 'react-native-safe-area-context';

const WeekEarnings = ({
  route,
  navigation,
}) => {
  const { width } =
    useWindowDimensions();

  const isTablet =
    DeviceInfo.isTablet();

  const styles =
    createStyles(
      isTablet,
      width,
    );

  const params =
    route?.params || {};

  console.log(
    'Week Earnings params:',
    params,
  );

  const program =
    params?.weekly_data?.data?.[0] ||
    params?.weeklyProgram ||
    null;

  const rawProgress =
  params?.weeklyIncentivesProgress ||
  params?.progress ||
  null;

const progress =
  rawProgress?.data?.[0] ||
  rawProgress ||
  null;

  if (
    !program ||
    params?.emptyData ||
    progress?.emptyData
  ) {
    return (
      <View
        style={
          styles.emptyContainer
        }
      >
        <Ionicons
          name="calendar-outline"
          size={
            isTablet ? 70 : 50
          }
          color="#9CA3AF"
        />

        <Text
          style={
            styles.emptyText
          }
        >
          Please come again later
        </Text>
      </View>
    );
  }

  /* =========================================================
     PROGRAM
  ========================================================= */

  const title =
    program?.name ||
    'Weekly Incentive';

  const maxReward =
    Number(
      program?.maxReward ?? 0,
    );

  const ruleType =
    program?.ruleType || '';

  const status =
    program?.status || '';

  const city =
    program?.cityName ||
    program?.city ||
    '--';

  /* =========================================================
     STANDARD RULE TYPES
  ========================================================= */

  const slabs =
    program?.slabs || [];

  const ordersCompleted =
    Number(
      progress?.ordersCompleted ??
        0,
    );

  const minOrders =
    params?.minOrders ??
    program?.target?.orders ??
    program?.conditions
      ?.minOrders ??
    program?.slabs?.[0]
      ?.minOrders ??
    0;

  const minEarnings =
    program?.conditions
      ?.minEarnings ?? 0;

  const rewardEarned =
    progress?.rewardEarned ?? 0;

  const perOrderAmount =
    program?.rewardPerOrder ??
    0;

  const maxOrders =
    program?.maxOrders ?? 0;

  /* =========================================================
     TASK PROGRAM
  ========================================================= */

  const tasks =
    Array.isArray(
      program?.tasks,
    )
      ? program.tasks
      : [];

  const progressTasks =
    Array.isArray(
      progress?.tasks,
    )
      ? progress.tasks
      : [];

  const renderTaskRuleType = (
    task,
    progressTask,
  ) => {
    if (!task) {
      return null;
    }

    const taskProgress =
      progressTask?.progress || {};

    const taskStatus =
      taskProgress?.status ||
      'PENDING';

    const completedOrders =
      Number(
        taskProgress?.completedOrders ??
          0,
      );

    switch (
      task?.taskRuleType
    ) {
      case 'SLAB':
        return (
          <SlabRuleTypeIncentives
            title={title}
            status={taskStatus}
            slabs={
              task?.slabs || []
            }
            ordersCompleted={
              completedOrders
            }
            maxReward={
              task?.slabs?.[
                task.slabs.length -
                  1
              ]?.rewardAmount ?? 0
            }
            styles={styles}
            isTablet={isTablet}
          />
        );

      case 'FIXED_TARGET':
        return (
          <FixedTargetRuleTypeIncentives
            title={title}
            status={taskStatus}
            target={
              task?.target
                ?.orders ?? 0
            }
            ordersCompleted={
              completedOrders
            }
            maxReward={
              task?.reward
                ?.amount ?? 0
            }
            isTablet={isTablet}
            styles={styles}
          />
        );

      case 'HYBRID':
        return (
          <HybridRuleTypeIncentives
            title={title}
            status={taskStatus}
            ordersCompleted={
              completedOrders
            }
            minOrders={
              task?.conditions
                ?.minOrders ?? 0
            }
            rewardEarned={
              taskProgress
                ?.currentEarnings ??
              0
            }
            minEarnings={
              task?.conditions
                ?.minEarnings ?? 0
            }
            maxReward={
              task?.reward
                ?.amount ?? 0
            }
            styles={styles}
            isTablet={isTablet}
          />
        );

      case 'PER_ORDER':
        return (
          <PerOrderRuleTypeIncentives
            title={title}
            status={taskStatus}
            perOrderAmount={
              task?.rewardPerOrder ??
              0
            }
            ordersCompleted={
              completedOrders
            }
            maxOrders={
              task?.maxOrders ?? 0
            }
            maxReward={
              task?.maxEarning ?? 0
            }
            styles={styles}
            isTablet={isTablet}
          />
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={
        false
      }
    >
      {/* HERO */}

      <LinearGradient
        colors={[
          '#192A51',
          '#475B8A',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroHeader}
      >
        <SafeAreaView
          style={styles.headerTop}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
          >
            <Ionicons
              name="arrow-back"
              size={
                isTablet ? 30 : 24
              }
              color="#FFF"
            />
          </TouchableOpacity>

          <Text
            style={styles.heroTitle}
            numberOfLines={1}
          >
            {title}
          </Text>
        </SafeAreaView>

        <View
          style={styles.rewardPill}
        >
          <Ionicons
            name="trophy"
            size={
              isTablet ? 20 : 16
            }
            color="#FFD700"
          />

          <Text
            style={styles.rewardLabel}
          >
            Max Reward:
          </Text>

          <Text
            style={styles.rewardValue}
          >
            ₹{maxReward}
          </Text>
        </View>
      </LinearGradient>

      <View
        style={
          styles.contentContainer
        }
      >
        {/* INFO */}

        <View
          style={
            styles.titleCard
          }
        >
          <Text
            style={
              styles.checkpointTitle
            }
          >
            {title}
          </Text>

          <View
            style={{
              flexDirection:
                'row',
              marginTop: 10,
            }}
          >
            <View
              style={{ flex: 1 }}
            >
              <Text
                style={styles.label}
              >
                City
              </Text>

              <Text
                style={styles.label}
              >
                Type
              </Text>

              <Text
                style={styles.label}
              >
                Status
              </Text>
            </View>

            <View
              style={{ flex: 1 }}
            >
              <Text
                style={styles.value}
              >
                {city}
              </Text>

              <Text
                style={styles.value}
              >
                {ruleType}
              </Text>

              <Text
                style={styles.value}
              >
                {status}
              </Text>
            </View>
          </View>
        </View>

        {/* NORMAL RULE TYPE */}

        {ruleType ===
          'SLAB' && (
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

        {ruleType ===
          'FIXED_TARGET' && (
          <FixedTargetRuleTypeIncentives
            title={title}
            status={status}
            target={minOrders}
            ordersCompleted={
              ordersCompleted
            }
            maxReward={maxReward}
            isTablet={isTablet}
            styles={styles}
          />
        )}

        {ruleType ===
          'HYBRID' && (
          <HybridRuleTypeIncentives
            title={title}
            status={status}
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
            status={status}
            perOrderAmount={
              perOrderAmount
            }
            ordersCompleted={
              ordersCompleted
            }
            maxOrders={
              maxOrders
            }
            maxReward={
              maxReward
            }
            styles={styles}
            isTablet={isTablet}
          />
        )}

        {/* TASK PROGRAM */}

        {ruleType === 'TASK' &&
          tasks.length > 0 && (
            <View
              style={
                styles.progressWrapper
              }
            >
              {tasks.map(task => {
                const progressTask =
                  progressTasks.find(
                    item =>
                      item?.dayNumber ===
                      task?.dayNumber,
                  );

                return (
                  <View
                    key={`day-${task.dayNumber}`}
                  >
                    <View
                      style={
                        styles.taskRuleTypeHeaderRow
                      }
                    >
                      <Text
                        style={
                          styles.taskRuleTypeHeaderDay
                        }
                      >
                        Day{' '}
                        {
                          task.dayNumber
                        }
                      </Text>

                      <Text
                        style={
                          styles.taskRuleTypeHeaderRuleType
                        }
                      >
                        {
                          task.taskRuleType
                        }
                      </Text>
                    </View>

                    {renderTaskRuleType(
                      task,
                      progressTask,
                    )}
                  </View>
                );
              })}
            </View>
          )}
      </View>
    </ScrollView>
  );
};

export default WeekEarnings;

const createStyles = (
  isTablet,
  width,
) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F4F7FB',
    },

    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F4F7FB',
      paddingHorizontal: 20,
    },

    emptyText: {
      marginTop: 14,
      fontSize:
        isTablet ? 22 : 16,
      color: '#6B7280',
      fontWeight: '600',
      textAlign: 'center',
    },

    heroHeader: {
      paddingBottom:
        isTablet ? 45 : 30,
      paddingHorizontal:
        isTablet ? 34 : 20,
      borderBottomLeftRadius:
        isTablet ? 36 : 26,
      borderBottomRightRadius:
        isTablet ? 36 : 26,
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
      lineHeight:
        isTablet ? 48 : 34,
    },

    rewardPill: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf:
        'flex-start',
      backgroundColor:
        'rgba(255,255,255,0.15)',
      paddingHorizontal:
        isTablet ? 22 : 16,
      paddingVertical:
        isTablet ? 12 : 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor:
        'rgba(255,255,255,0.2)',
    },

    rewardLabel: {
      color: '#E5E7EB',
      fontSize:
        isTablet ? 16 : 13,
      marginHorizontal: 6,
      fontWeight: '500',
    },

    rewardValue: {
      color: '#FFD700',
      fontSize:
        isTablet ? 24 : 18,
      fontWeight: '700',
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

    contentContainer: {
      paddingVertical:
        isTablet ? 30 : 20,
      paddingHorizontal: 20,
    },

    progressWrapper: {
      backgroundColor: '#FFFFFF',
      borderColor: '#DEDEE1',
      borderWidth: 1,
      borderRadius:
        isTablet ? 24 : 16,
      padding:
        isTablet ? 28 : 18,
      marginBottom: 20,
    },

    taskRuleTypeHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      marginTop:
        isTablet ? 14 : 10,
      marginBottom:
        isTablet ? 14 : 10,
      paddingHorizontal: 4,
    },

    taskRuleTypeHeaderDay: {
      flex: 1,
      fontSize:
        isTablet ? 18 : 15,
      fontWeight: '700',
      color: '#111827',
    },

    taskRuleTypeHeaderRuleType: {
      fontSize:
        isTablet ? 17 : 14,
      fontWeight: '700',
      color: '#4F39F6',
    },
  });
};