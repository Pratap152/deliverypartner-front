import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ProgressBar from './ProgressBar';

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

export default function IncentiveCard({
  item,
  weeklyCompletedOrders,
  dailyCompletedOrders,
  peakCompletedOrders,
  peakProgressPercentage,
  weeklyProgressPercentage,
}) {
  const isPeak = item?.type === 'peak';
  const isWeekly = item?.type === 'weekly';
  const isDaily = item?.type === 'daily';

  const metaIcons = {
    peak: {
      label: 'Peak',
      icon: require('../../../assets/peak.png'),
    },
    weekly: {
      label: 'Weekly',
      icon: require('../../../assets/weekly.png'),
    },
    daily: {
      label: 'Daily',
      icon: require('../../../assets/daily.png'),
    },
    surge: {
      label: 'Surge',
      icon: require('../../../assets/surge.png'),
    },
  };

  const meta = metaIcons[item?.type] ?? metaIcons.daily;

  const dailyOrders = Number(dailyCompletedOrders ?? 0);
  const weeklyOrders = Number(weeklyCompletedOrders ?? 0);
  const peakOrders = Number(peakCompletedOrders ?? 0);

  const dailyTarget = Number(item?.minOrders ?? 0);
  const weeklyTarget = Number(item?.minOrders ?? 0);
  const peakTarget = Number(item?.minOrders ?? 0);

  const peakProgress =
    peakTarget > 0
      ? Math.min((peakOrders / peakTarget) * 100, 100)
      : 0;

  const dailyProgress =
    dailyTarget > 0
      ? Math.min((dailyOrders / dailyTarget) * 100, 100)
      : 0;

  const weeklyIsTask =
    item?.weekly_data?.data?.[0]?.ruleType === 'TASK';

  const peakTime =
    item?.startTime && item?.endTime
      ? `${formatTime(item.startTime)} - ${formatTime(item.endTime)}`
      : item?.time
        ? formatTimeRange(item.time)
        : item?.subtitle;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isPeak
            ? '#FFF7ED'
            : isWeekly
              ? '#FAF5FF'
              : '#EFF6FF',

          borderColor: isPeak
            ? '#FFD6A7'
            : isWeekly
              ? '#E9D4FF'
              : '#BEDBFF',
        },
      ]}>

      <View style={styles.topRow}>
        <View style={styles.left}>
          <View style={styles.labelChip}>
            <Text
              style={[
                styles.chipText,
                {
                  color: isPeak
                    ? '#F54900'
                    : isWeekly
                      ? '#9810FA'
                      : '#155DFC',
                },
              ]}>
              {meta.label}
            </Text>
          </View>

          <Text style={styles.title}>
            {item?.title}
          </Text>

          <Text style={styles.subtitle}>
            {isPeak ? peakTime : item?.subtitle}
          </Text>
        </View>

        <View style={styles.right}>
          <Image
            source={meta.icon}
            style={styles.icon}
          />
        </View>
      </View>

      {/* PEAK */}

      {isPeak && !item?.emptyData && (
        <View style={styles.peakProgressContainer}>
          <View style={styles.peakProgressHeader}>
            <Text style={styles.progressText}>
              Orders
            </Text>

            <Text style={styles.progressText}>
              {peakOrders} / {peakTarget}
            </Text>
          </View>

          <View style={styles.peakProgressTrack}>
            <View
              style={[
                styles.peakProgressFill,
                {
                  width: `${peakProgress}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.peakProgressPercentage}>
            {Math.round(peakProgress)}% completed
          </Text>
        </View>
      )}

      {/* DAILY */}

      {isDaily &&
        !item?.emptyData &&
        dailyTarget > 0 &&
        item?.daily_data?.data?.[0]?.ruleType !==
          'PER_ORDER' && (
          <View style={styles.dailyProgressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>
                Orders
              </Text>

              <Text style={styles.progressText}>
                {dailyOrders} / {dailyTarget}
              </Text>
            </View>

            <ProgressBar
              progress={dailyProgress}
              progressColor="#BEDBFF"
            />
          </View>
        )}

      {/* WEEKLY */}

      {isWeekly && !item?.emptyData && (
        <View style={styles.weeklyContainer}>
          {/* TASK weekly incentives use days only */}

          {weeklyIsTask ? (
            <View style={styles.taskProgress}>
              <Text style={styles.progressText}>
                Progress: {Math.round(Number(weeklyProgressPercentage ?? 0))}%
              </Text>

              <ProgressBar
                progress={Math.min(
                  Number(weeklyProgressPercentage ?? 0),
                  100,
                )}
                progressColor="#b470fc"
              />
            </View>
          ) : (
            weeklyTarget > 0 && (
              <>
                <View style={styles.progressRow}>
                  <Text style={styles.progressText}>
                    {weeklyOrders} / {weeklyTarget}
                  </Text>
                </View>

                <ProgressBar
                  progress={Math.min(
                    (weeklyOrders / weeklyTarget) * 100,
                    100,
                  )}
                  progressColor="#E9D4FF"
                />
              </>
            )
          )}
        </View>
      )}

      {/* EMPTY */}

      {item?.emptyData && (
        <Text style={styles.emptyText}>
          Incentives not found, please come back later
        </Text>
      )}

      {/* REWARD */}

      <View style={styles.bottomRow}>
        {item?.type !== 'peak' && (
          <Text style={styles.rewardValue}>
            {item?.value}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: wp(92),
    alignSelf: 'center',
    borderRadius: wp(4),
    padding: wp(4),
    marginBottom: wp(3),
    borderWidth: 1,

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: {
          width: 0,
          height: 8,
        },
      },
      android: {
        elevation: 6,
      },
    }),
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  left: {
    flex: 1,
    paddingRight: wp(2),
  },

  right: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 15,
  },

  labelChip: {
    backgroundColor: '#FFF',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: wp(1.5),
    alignSelf: 'flex-start',
    marginBottom: hp(0.4),
  },

  chipText: {
    fontSize: 14,
    fontWeight: '700',
  },

  title: {
    fontSize: wp(4.2),
    fontWeight: '600',
    color: '#111',
  },

  subtitle: {
    fontSize: wp(3.3),
    color: '#6B7280',
    marginTop: hp(0.3),
  },

  icon: {
    width: wp(8),
    height: wp(8),
    resizeMode: 'contain',
  },

  dailyProgressContainer: {
    marginTop: hp(1),
  },

  weeklyContainer: {
    marginTop: hp(1),
  },

  taskProgress: {
    marginTop: hp(0.5),
  },

  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  progressRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },

  progressText: {
    fontSize: wp(3.5),
    fontWeight: '500',
    color: '#374151',
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: hp(1),
  },

  rewardValue: {
    fontSize: wp(4.2),
    fontWeight: '700',
    color: '#065F46',
  },

  emptyText: {
    marginTop: hp(1.5),
    color: '#6B7280',
    fontSize: wp(3.2),
  },

  peakProgressContainer: {
    marginTop: hp(1.5),
  },

  peakProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(0.7),
  },

  peakProgressTrack: {
    width: '100%',
    height: hp(1.5),
    backgroundColor: '#FED7AA',
    borderRadius: wp(2),
    overflow: 'hidden',
  },

  peakProgressFill: {
    height: '100%',
    backgroundColor: '#F97316',
    borderRadius: wp(2),
  },

  peakProgressPercentage: {
    fontSize: wp(3),
    color: '#9A3412',
    fontWeight: '500',
    marginTop: hp(0.5),
  },
});