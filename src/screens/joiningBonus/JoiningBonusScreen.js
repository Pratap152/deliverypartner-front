
import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import {
  responsiveFontSize as rf,
  responsiveHeight as rh,
  responsiveWidth as rw,
} from 'react-native-responsive-dimensions';
import {
  getTaskDescription,
} from '../../services/JoiningBonusService';

import useJoiningBonus from '../../hooks/useJoiningBonus';

const isTablet = DeviceInfo.isTablet();
const C = {
  bg: '#F3F3F3',
  white: '#FFFFFF',
  text: '#111111',
  subText: '#555555',
  navy: '#1B2A5B',
  green: '#32C766',
  gray: '#BDBDBD',
  purple: '#D8D1F4',
  completedBg: '#C8F1DD',
  progressBg: '#E7DDFC',
  upcomingBg: '#F2F2F2',
};

const HeaderBar = memo(({
  onBack,
  hasJoiningBonus,
}) => (
  <View
    style={[
      s.header,
      !hasJoiningBonus && s.smallHeader,
    ]}>

    <View style={s.headerRow}>

      <TouchableOpacity
        onPress={onBack}
        style={s.backBtn}
        activeOpacity={0.8}>

        <Text style={s.backArrow}>
          ←
        </Text>
      </TouchableOpacity>

      <Text style={s.headerTitle}>
        Joining Bonus
      </Text>
    </View>
  </View>
));

const WeeklyProgressCard = memo(
  ({ summary, totalReward }) => {
    const totalTasks =
      summary?.totalTasks || 0;

    const completedTasks =
      summary?.completedTasks || 0;

    const progressPercent =
      totalTasks > 0
        ? Math.round(
          (completedTasks / totalTasks) * 100
        )
        : 0;

    return (
      <View style={s.progressCard}>
        <View style={s.progressTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.progressTitle}>
              Weekly Progress
            </Text>

            <Text style={s.progressSub}>
              Complete tasks all the week and earn extra rewards !
            </Text>
          </View>

          <Image
            source={require('../../assets/gift.png')}
            style={s.giftImage}
          />
        </View>

        <View style={s.progressMainRow}>
          <View style={s.bigProgressBg}>
            <View
              style={[
                s.bigProgressFill,
                {
                  width: `${progressPercent}%`,
                },
              ]}
            />
          </View>

          <Text style={s.progressPercentTop}>
            {progressPercent}%
          </Text>
        </View>

        <View style={s.progressBottomRow}>
          <View style={s.progressInfoBox}>
            <Text style={s.progressLabel}>
              Tasks Completed
            </Text>

            <Text style={s.progressValue}>
              {completedTasks}/{totalTasks}
            </Text>
          </View>

          <View style={s.verticalDivider} />

          <View style={s.progressInfoBox}>
            <Text style={s.progressLabel}>
              Reward
            </Text>

            <Text style={s.rewardValue}>
              ₹{totalReward}
            </Text>
          </View>
        </View>
      </View>
    );

  }
);
const TaskCard = memo(({ task, progress }) => {

  const status = progress?.status;

  const isCompleted =
    progress?.isCompleted;

  const isRunning =
    status === 'RUNNING';

  const isMissed =
    status === 'MISSED';

  const isLocked =
    status === 'LOCKED';

  const isNotStarted =
    status === 'NOT_STARTED';

  const progressPercent =
    progress?.percentage || 0;



  /* CARD COLORS */

  const cardBg = isCompleted
    ? '#CFF3E4'
    : isRunning
      ? '#E7E1FF'
      : isMissed
        ? '#FFE3E3'
        : '#F4F4F4';

  const leftBg = isCompleted
    ? '#A7E6CC'
    : isRunning
      ? '#D4CBFF'
      : isMissed
        ? '#FFC9C9'
        : '#E3E3E3';

  /* STATUS */

  const statusText = isCompleted
    ? 'Completed'
    : isRunning
      ? 'Running'
      : isMissed
        ? 'Missed'
        : isLocked
          ? 'Locked'
          : 'Upcoming';

  const statusColor = isCompleted
    ? '#2DBE60'
    : isRunning
      ? '#1A275C'
      : isMissed
        ? '#E53935'
        : '#8E8E8E';

  return (
    <View
      style={[
        s.taskCard,
        {
          backgroundColor: cardBg,
        },
      ]}>

      {/* LEFT SECTION */}

      <View
        style={[
          s.daySection,
          {
            backgroundColor: leftBg,
          },
        ]}>

        <Text style={s.dayLabel}>
          DAY
        </Text>

        <Text style={s.dayNumber}>
          {task.dayNumber}
        </Text>

      </View>

      {/* RIGHT SECTION */}

      <View style={s.taskRightSection}>

        {/* LOCKED OVERLAY */}

        {isLocked && (
          <View style={s.upcomingOverlay}>
            <View style={s.upcomingBadge}>

              <Ionicons
                name="lock-closed"
                size={14}
                color="#FFF"
                style={s.lockIcon}
              />

              <Text style={s.upcomingText}>
                Locked
              </Text>

            </View>
          </View>
        )}

        <View
          style={{
            opacity: isLocked ? 0.22 : 1,
          }}>

          {/* TOP */}

          <View style={s.topRow}>

            <View style={{ flex: 1 }}>

              <Text style={s.Task}>
                {getTaskDescription(task)}
              </Text>

            </View>

            <View style={{ marginLeft: 10 }}>

              <View
                style={[
                  s.statusPill,
                  {
                    backgroundColor:
                      statusColor,
                  },
                ]}>

                <Text style={s.statusPillText}>
                  {statusText}
                </Text>

              </View>

              <Text style={s.orderCount}>

                {progress?.current || 0}/

                {progress?.target ||

                  task?.target?.orders ||

                  task?.maxOrders ||

                  task?.slabs?.[
                    task.slabs.length - 1
                  ]?.maxOrders ||

                  0}

              </Text>

            </View>

          </View>

          {/* PROGRESS */}

          <View style={s.progressBottomRow}>

            <View style={s.progressTrack}>

              <View
                style={[
                  s.progressFill,
                  {
                    width: `${progressPercent}%`,
                  },
                ]}
              />

            </View>

            <Text style={s.percentText}>
              {progressPercent}%
            </Text>

          </View>

        </View>
      </View>
    </View>
  );
});

const JoiningBonusScreen = ({
  navigation,
}) => {
  const {
    loading,
    error,
    program,
    progress,
    sortedTasks,
    load,
  } = useJoiningBonus();

  const totalReward =
    program?.maxReward || 0;

  const weeklySummary = {
    totalTasks:
      progress?.overallProgress
        ?.totalDays || 0,

    completedTasks:
      progress?.overallProgress
        ?.completedDays || 0,
  };

  if (loading) {
    return (
      <View style={s.centered}>
        <ActivityIndicator
          size="large"
          color={C.navy}
        />

        <Text style={s.loadingText}>
          Loading Joining Bonus...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={s.centered}>
        <Text style={s.errorText}>
          {error}
        </Text>

        <TouchableOpacity
          onPress={load}
          style={s.retryBtn}>
          <Text style={s.retryText}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  const hasJoiningBonus =
    sortedTasks && sortedTasks.length > 0;
  return (
    <View style={s.container}>
      <StatusBar
        backgroundColor={C.bg}
        barStyle="dark-content"
      />

      <HeaderBar
        onBack={() => navigation.goBack()}
        hasJoiningBonus={hasJoiningBonus}
      />

      {hasJoiningBonus ? (
        <>
          <View style={s.fixedTopSection}>
            <WeeklyProgressCard
              summary={weeklySummary}
              totalReward={totalReward}
            />
          </View>

          <Text style={s.sectionTitle}>
            Tasks Unlocked
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={s.taskScrollContent}>

            {sortedTasks.map((task, index) => (
              <TaskCard
                key={`${task.dayNumber}-${index}`}
                task={task}
                progress={task.progressData}
              />
            ))}
          </ScrollView>
        </>
      ) : (
        <View style={s.emptyContainer}>

          <Text style={s.emptyTitle}>
            No Joining Bonus Available
          </Text>

          <Text style={s.emptySubTitle}>
            There are currently no active joining
            bonus programs available for you.
          </Text>

        </View>
      )}
    </View>
  );
};
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3',
  },

  /* HEADER */

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,

    height: isTablet ? 320 : 240,

    backgroundColor: '#1F2F67',

    borderBottomLeftRadius: isTablet ? 45 : 30,
    borderBottomRightRadius: isTablet ? 45 : 30,

    paddingHorizontal: isTablet ? 40 : 22,

    zIndex: 1,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: isTablet ? 28 : 10,
  },

  backBtn: {
    width: isTablet ? 50 : 34,
    height: isTablet ? 50 : 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isTablet ? 24 : 16,
  },

  backArrow: {
    color: '#FFFFFF',
    fontSize: isTablet ? 44 : 30,
    fontWeight: '300',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: isTablet ? 34 : 22,
    fontWeight: '600',
  },

  fixedTopSection: {
    paddingTop: isTablet ? 170 : 118,
    paddingHorizontal: isTablet ? 35 : 18,
    zIndex: 2,
    pointerEvents: 'box-none',
  },

  taskScrollContent: {
    paddingHorizontal: isTablet ? 35 : 18,
    paddingBottom: isTablet ? 70 : 40,
    paddingTop: isTablet ? 28 : 20,
  },

  /* WEEKLY CARD */

  progressCard: {
    backgroundColor: '#FFFFFF',

    borderRadius: isTablet ? 24 : 10,

    paddingHorizontal: isTablet ? 35 : 22,
    paddingTop: isTablet ? 25 : 10,
    paddingBottom: isTablet ? 25 : 10,

    marginHorizontal: 2,

    marginTop: isTablet ? -85 : -50,

    zIndex: 100,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 8,
  },

  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  progressTitle: {
    fontSize: isTablet ? 32 : 18,
    fontWeight: '900',
    color: '#111',
  },

  progressSub: {
    marginTop: isTablet ? 18 : 10,
    fontSize: isTablet ? 22 : 15,
    color: '#111',
    lineHeight: isTablet ? 34 : 24,
    width: '85%',
  },

  giftImage: {
    width: isTablet ? 110 : 70,
    height: isTablet ? 110 : 70,
    resizeMode: 'contain',
  },

  progressMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: isTablet ? 35 : 24,
  },

  bigProgressBg: {
    flex: 1,
    height: isTablet ? 14 : 8,
    backgroundColor: '#D8D8D8',
    borderRadius: 20,
    overflow: 'hidden',
  },

  bigProgressFill: {
    height: '100%',
    backgroundColor: '#1B2A5B',
    borderRadius: 20,
  },

  progressPercentTop: {
    marginLeft: isTablet ? 20 : 14,
    fontSize: isTablet ? 28 : 18,
    fontWeight: '900',
    color: '#111',
  },

  progressInfoBox: {
    flex: 1,
  },

  progressLabel: {
    fontSize: isTablet ? 22 : 14,
    color: '#444',
    fontWeight: '600',
    marginBottom: isTablet ? 18 : 14,
  },

  progressValue: {
    fontSize: isTablet ? 38 : 25,
    fontWeight: '900',
    color: '#111',
  },

  rewardValue: {
    fontSize: isTablet ? 38 : 25,
    fontWeight: '900',
    color: '#1B2A5B',
  },

  verticalDivider: {
    width: 1,
    height: isTablet ? 100 : 74,
    backgroundColor: '#DDDDDD',
    marginHorizontal: isTablet ? 28 : 16,
  },

  /* SECTION TITLE */

  sectionTitle: {
    fontSize: isTablet ? 24 : 15,
    fontWeight: '700',
    color: '#111',
    padding: isTablet ? 24 : 13,
  },

  /* TASK CARD */

  taskCard: {
    flexDirection: 'row',
    borderRadius: isTablet ? 24 : 14,
    overflow: 'hidden',
    marginBottom: isTablet ? 28 : 18,
    minHeight: isTablet ? 190 : '5%',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 4,
  },

  daySection: {
    width: isTablet ? 110 : 62,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dayLabel: {
    fontSize: isTablet ? 18 : 12,
    color: '#111',
    fontWeight: '500',
  },

  dayNumber: {
    fontSize: isTablet ? 52 : 30,
    fontWeight: '900',
    color: '#111',
    marginVertical: 2,
  },

  taskRightSection: {
    flex: 1,
    paddingHorizontal: isTablet ? 28 : 16,
    paddingVertical: isTablet ? 24 : 14,
    justifyContent: 'space-between',
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  Task: {
    fontSize: isTablet ? 20 : 13,
    color: '#111',
    marginBottom: isTablet ? 16 : 10,
    fontWeight: '700',
    width: isTablet ? '82%' : 'auto',
  },

  statusPill: {
    paddingHorizontal: isTablet ? 12 : 5,
    paddingVertical: isTablet ? 10 : 6,
    borderRadius: isTablet ? 12 : 8,
    alignItems: 'center',
  },

  statusPillText: {
    color: '#FFF',
    fontSize: isTablet ? 16 : 11,
    fontWeight: '700',
  },

  orderCount: {
    marginTop: isTablet ? 18 : 12,
    textAlign: 'right',
    fontSize: isTablet ? 24 : 15,
    fontWeight: '600',
    color: '#111',
  },

  progressBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: isTablet ? 24 : 16,
  },

  progressTrack: {
    flex: 1,
    height: isTablet ? 12 : 8,
    backgroundColor: '#D6D6D6',
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: isTablet ? 18 : 12,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#1D2B64',
    borderRadius: 20,
  },

  percentText: {
    fontSize: isTablet ? 24 : 16,
    fontWeight: '900',
    color: '#111',
  },

  /* UPCOMING */

  upcomingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    zIndex: 10,

    justifyContent: 'center',
    alignItems: 'center',
  },

  upcomingBadge: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#1B2A5B',

    paddingHorizontal: isTablet ? 28 : 18,
    paddingVertical: isTablet ? 14 : 8,

    borderRadius: isTablet ? 14 : 8,
  },

  lockIcon: {
    marginRight: 6,
  },

  upcomingText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: isTablet ? 22 : 15,
  },

  /* STATES */

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
  },

  loadingText: {
    marginTop: 12,
    color: '#111',
    fontSize: isTablet ? 22 : 14,
  },

  errorText: {
    color: 'red',
    marginBottom: 20,
    fontSize: isTablet ? 20 : 14,
  },

  retryBtn: {
    backgroundColor: '#1B2A5B',
    paddingHorizontal: isTablet ? 32 : 20,
    paddingVertical: isTablet ? 18 : 12,
    borderRadius: isTablet ? 14 : 8,
  },

  retryText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: isTablet ? 20 : 14,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 80 : 30,
  },

  emptyTitle: {
    fontSize: isTablet ? 34 : 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 10,
    textAlign: 'center',
  },

  emptySubTitle: {
    fontSize: isTablet ? 22 : 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: isTablet ? 34 : 24,
  },

  smallHeader: {
    height: isTablet ? 100 : 60,
    borderBottomLeftRadius: isTablet ? 30 : 20,
    borderBottomRightRadius: isTablet ? 30 : 20,
  },
});
export default JoiningBonusScreen;