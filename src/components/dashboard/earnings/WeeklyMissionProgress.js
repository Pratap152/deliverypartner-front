import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const WeeklyMissionProgressBar = ({
  missionsData,
  progressData,
}) => {
  const { width } = useWindowDimensions();
  const isTablet = DeviceInfo.isTablet();
  const styles = createStyles(isTablet, width);

  const mission = missionsData;
  const progress = progressData;

  if (!mission || !progress) {
    return null;
  }

  const completedDays =
    progress.overallProgress
      ?.completedDays || 0;

  const totalDays =
    progress.overallProgress
      ?.totalDays || 0;

  const progressPercentage =
    totalDays > 0
      ? (completedDays / totalDays) * 100
      : 0;

return (
  <View style={styles.card}>
    {/* Progress Text */}
    <Text style={styles.progressText}>
      {completedDays}/{totalDays}{' '}
      Days Completed
    </Text>

    {/* Progress Bar */}
    <View style={styles.progressBar}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${progressPercentage}%`,
          },
        ]}
      />
    </View>

    {/* Stepper */}
    <View style={styles.stepperContainer}>
      {mission.tasks.map(
        (missionTask, index) => {
          const progressTask =
            progress.tasks.find(
              item =>
                item.dayNumber ===
                missionTask.dayNumber
            );

          const status =
            progressTask?.progress
              ?.status;

          const isCompleted =
            progressTask?.progress
              ?.isCompleted;

          const isRunning =
            status === 'RUNNING';

          const isPending =
            status === "PENDING";

          return (
            <View
              key={
                missionTask.dayNumber
              }
              style={
                styles.stepWrapper
              }
            >
              {/* Circle */}
              <View
                style={[
                  styles.circle,

                  isCompleted &&
                    styles.completedCircle,

                  isRunning &&
                    styles.runningCircle,

                  isPending &&
                    styles.pendingCircle,
                ]}
              >
                <Text
                  style={
                    styles.circleText
                  }
                >
                  {status === "COMPLETED"
                    ? '✓'
                    : status === "PENDING" ? 
                    "X"
                    : missionTask.dayNumber}
                </Text>
              </View>

              {/* Line */}
              {index !==
                mission.tasks.length -
                  1 && (
                <View
                  style={[
                    styles.line,

                    isCompleted &&
                      styles.completedLine,
                  ]}
                />
              )}
            </View>
          );
        }
      )}
    </View>

    {/* Conditions */}
    <View style={styles.conditionsContainer}>
      {mission.tasks.map(
        missionTask => {
          const progressTask =
            progress.tasks.find(
              item =>
                item.dayNumber ===
                missionTask.dayNumber
            );

          if (
            progressTask?.progress
              ?.status !== 'RUNNING'
          ) {
            return null;
          }

          return (
            <View
              key={
                missionTask.dayNumber
              }
            >
              <Text
                style={
                  styles.conditionTitle
                }
              >
                Current Mission
              </Text>

              {/* SLAB */}
              {missionTask.taskRuleType ===
                'SLAB' &&
                missionTask.slabs.map(
                  (slab, index) => (
                    <Text
                      key={index}
                      style={
                        styles.conditionText
                      }
                    >
                      •{' '}
                      {slab.minOrders}
                      -
                      {
                        slab.maxOrders
                      }{' '}
                      Orders → ₹
                      {
                        slab.rewardAmount
                      }
                    </Text>
                  )
                )}

              {/* PER ORDER */}
              {missionTask.taskRuleType ===
                'PER_ORDER' && (
                <>
                  <Text
                    style={
                      styles.conditionText
                    }
                  >
                    • ₹
                    {
                      missionTask.rewardPerOrder
                    }{' '}
                    per order
                  </Text>

                  <Text
                    style={
                      styles.conditionText
                    }
                  >
                    • Max Orders:{' '}
                    {
                      missionTask.maxOrders
                    }
                  </Text>

                  <Text
                    style={
                      styles.conditionText
                    }
                  >
                    • Completed:{' '}
                    {
                      progressTask
                        .progress
                        .completedOrders
                    }
                  </Text>
                </>
              )}

              {/* FIXED TARGET */}
              {missionTask.taskRuleType ===
                'FIXED_TARGET' && (
                <>
                  <Text
                    style={
                      styles.conditionText
                    }
                  >
                    • Target Orders:{' '}
                    {
                      missionTask.target
                        .orders
                    }
                  </Text>

                  <Text
                    style={
                      styles.conditionText
                    }
                  >
                    • Reward: ₹
                    {
                      missionTask.reward
                        .amount
                    }
                  </Text>

                  <Text
                    style={
                      styles.conditionText
                    }
                  >
                    • Completed:{' '}
                    {
                      progressTask
                        .progress
                        .completedOrders
                    }
                  </Text>
                </>
              )}

              {/* HYBRID */}
              {missionTask.taskRuleType ===
                'HYBRID' && (
                <>
                  <Text
                    style={
                      styles.conditionText
                    }
                  >
                    • Orders:{' '}
                    {
                      missionTask
                        .conditions
                        .minOrders
                    }
                  </Text>

                  <Text
                    style={
                      styles.conditionText
                    }
                  >
                    • Acceptance:{' '}
                    {
                      missionTask
                        .conditions
                        .minAcceptanceRate
                    }
                    %
                  </Text>

                  <Text
                    style={
                      styles.conditionText
                    }
                  >
                    • Earnings: ₹
                    {
                      missionTask
                        .conditions
                        .minEarnings
                    }
                  </Text>
                </>
              )}
            </View>
          );
        }
      )}
    </View>
  </View>
);
};

const createStyles = (
  isTablet,
  width,
) => {
  return StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    padding: isTablet ? 28 : 18,
    borderRadius: isTablet ? 28 : 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,

    elevation: 2,
  },
  cardTablet: {
    width: '92%',
    alignSelf: 'center',
  },
  progressText: {
    fontSize: isTablet ? 22 : 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: isTablet ? 18 : 12,
  },
  progressBar: {
    height: isTablet ? 16 : 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 999,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: isTablet ? 40 : 26,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: isTablet ? 42 : 25,
    height: isTablet ?  42 : 25,
    borderRadius: isTablet ?  21 : 15,
    backgroundColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedCircle: {
    backgroundColor: '#22C55E',
  },
  runningCircle: {
    backgroundColor: '#2563EB',
  },
  pendingCircle: {
    backgroundColor: '#EF4444',
  },
  circleText: {
    color: '#FFFFFF',
    fontSize: isTablet ? 18 : 11,
    fontWeight: '700',
  },
  line: {
    width: isTablet ? 42 : 18,
    height: isTablet ? 5 : 3,
    backgroundColor: '#D1D5DB',
    marginHorizontal: isTablet ? 4 : 2,
    borderRadius: 10,
  },
  completedLine: {
    backgroundColor: '#22C55E',
  },
  conditionsContainer: {
    marginTop: isTablet ? 34 : 24,
    backgroundColor: '#F9FAFB',
    borderRadius: isTablet ? 24 : 16,
    padding: isTablet ? 24 : 16,
  },
  conditionTitle: {
    fontSize: isTablet ? 24 : 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: isTablet ? 22 : 14,
  },
  conditionText: {
    fontSize: isTablet ? 20 : 14,
    color: '#374151',
    lineHeight: isTablet ? 30 : 22,
    fontWeight: '500',
    marginBottom: isTablet ? 14 : 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: isTablet ? 18 : 10,
    paddingHorizontal: isTablet ? 20 : 14,
    borderRadius: isTablet ? 18 : 12,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  conditionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  conditionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  conditionLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  conditionValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
});
};


export default WeeklyMissionProgressBar;