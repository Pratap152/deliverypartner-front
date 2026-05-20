import React, { useEffect, useRef, memo } from 'react';
import {
  View, 
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import useJoiningBonus from '../../hooks/useJoiningBonus';
import { Dimensions } from 'react-native';
import { getTaskDescription } from '../../services/JoiningBonusService';
const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const C = {
  bg: '#F6F8FC',
  surface: '#FFFFFF',
  surface2: '#F8FAFD',
  card: '#FFFFFF',
  cardAlt: '#F3F6FB',
  border: '#D9E1EC',
  borderSoft: 'rgba(15, 23, 42, 0.08)',
  text: '#172033',
  textSecondary: '#506079',
  textMuted: '#7B8798',
  orange: '#F97316',
  amber: '#F59E0B',
  green: '#16A34A',
  greenSoft: 'rgba(22,163,74,0.10)',
  greenBorder: 'rgba(22,163,74,0.20)',
  purple: '#9333EA',
  purpleSoft: 'rgba(147,51,234,0.10)',
  purpleBorder: 'rgba(147,51,234,0.20)',
  blue: '#2563EB',
  blueSoft: 'rgba(37,99,235,0.10)',
  blueBorder: 'rgba(37,99,235,0.20)',
  orangeSoft: 'rgba(249,115,22,0.10)',
  orangeBorder: 'rgba(249,115,22,0.20)',
  divider: '#E6ECF3',
  shadow: '#0F172A',
};

const TASK_CONFIG = {
  ORDERS: { emoji: '🛵', label: 'Deliveries', accent: C.orange, bg: C.orangeSoft, border: C.orangeBorder },
  ACCEPTANCE_RATE: { emoji: '🎯', label: 'Acceptance Rate', accent: C.green, bg: C.greenSoft, border: C.greenBorder },
  PEAK_SLOTS: { emoji: '⚡', label: 'Peak Slots', accent: C.purple, bg: C.purpleSoft, border: C.purpleBorder },
  EARNINGS: { emoji: '💰', label: 'Earnings', accent: C.blue, bg: C.blueSoft, border: C.blueBorder },
};

const TOP_INSET = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

const HeaderBar = memo(({ onBack }) => (
  <View style={s.header}>
    <TouchableOpacity onPress={onBack} style={s.backBtn} activeOpacity={0.85} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      <Text style={s.backArrow}>←</Text>
    </TouchableOpacity>
    <Text style={s.headerTitle} numberOfLines={1}>Joining Bonus</Text>
    <View style={s.headerRightSpacer} />
  </View>
));

const HeroCard = memo(({ program, totalReward, validityDays, hasJoined, compact, progress }) => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.04, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={[s.heroCard, compact && s.heroCardCompact]}>
      <View style={s.heroGlowOne} />
      <View style={s.heroGlowTwo} />
      <Animated.Text style={[s.heroEmoji, { transform: [{ scale: pulse }] }]}>🎉</Animated.Text>
      <Text style={s.heroEyebrow} numberOfLines={1}>
  {program?.programName || 'Joining Bonus'}
</Text>
      <Text style={[s.heroAmount, compact && s.heroAmountCompact]} numberOfLines={1}>
        ₹{Number(totalReward || 0).toLocaleString('en-IN')}
      </Text>
      <Text style={s.heroSub}>Total reward you can earn from this program</Text>
      <View style={s.heroMetaWrap}>
        <View style={s.heroMetaPill}><Text style={s.heroMetaText}>⏳ {validityDays || 0} days</Text></View>
        <View style={s.heroMetaPill}><Text style={s.heroMetaText}>📅 {validityDays || 7}-day program</Text></View>
        <View style={[s.heroMetaPill, s.heroMetaPillJoined]}>
  <Text style={[s.heroMetaText, s.heroMetaTextJoined]}>
    {progress?.targetStatus === 'TARGET_REACHED'
      ? '✓ Completed'
      : 'In Progress'}
  </Text>
</View>
      </View>
    </View>
  );
});

const HowItWorks = memo(() => {
  const steps = [
  {
    id: '1',
    title: 'Refer a rider',
    desc: 'Invite riders using your referral code.',
    color: C.orange,
    bg: C.orangeSoft,
  },
  {
    id: '2',
    title: 'Complete daily targets',
    desc: 'The referred rider must complete daily order targets.',
    color: C.amber,
    bg: 'rgba(245,158,11,0.10)',
  },
  {
    id: '3',
    title: 'Earn referral rewards',
    desc: 'Rewards are unlocked as the rider finishes tasks.',
    color: C.green,
    bg: C.greenSoft,
  },
];

  return (
    <View style={s.sectionCard}>
      <Text style={s.sectionTitle}>How it works</Text>
      <Text style={s.sectionSubtitle}>The rider only needs to join once and follow the task plan shown below.</Text>
      {steps.map((step, index) => (
        <View key={step.id}>
          <View style={s.stepRow}>
            <View style={[s.stepBadge, { backgroundColor: step.bg }]}>
              <Text style={[s.stepBadgeText, { color: step.color }]}>{step.id}</Text>
            </View>
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>{step.title}</Text>
              <Text style={s.stepDesc}>{step.desc}</Text>
            </View>
          </View>
          {index < steps.length - 1 && <View style={s.stepLine} />}
        </View>
      ))}
    </View>
  );
});

const TaskCard = memo(({ task, index, compact, progress }) => {
  const cfg = TASK_CONFIG.ORDERS;

  const translateY = useRef(new Animated.Value(18)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 320,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, translateY]);

  return (
    <Animated.View
      style={[
        s.taskCard,
        compact && s.taskCardCompact,
        {
          opacity,
          transform: [{ translateY }],
          borderColor: cfg.border,
        },
      ]}>
      
      <View style={s.taskTopRow}>
        <View style={s.dayChip}>
          <Text style={s.dayChipText}>
            Day {task.dayNumber}
          </Text>
        </View>

        <View style={s.rewardPill}>
          <Text style={s.rewardPillText}>
            Up to ₹{task.rewardAmount}
          </Text>
        </View>

        <View
          style={[
            s.statusPill,
            {
              backgroundColor: progress?.isCompleted
                ? C.greenSoft
                : progress?.status === 'LOCKED'
                ? C.purpleSoft
                : C.orangeSoft,
            },
          ]}>
          <Text style={s.statusText}>
            {progress?.isCompleted
              ? 'COMPLETED'
              : progress?.status}
          </Text>
        </View>
      </View>

      <View style={s.taskMainRow}>
        <View
          style={[
            s.taskIconWrap,
            {
              backgroundColor: cfg.bg,
              borderColor: cfg.border,
            },
          ]}>
          <Text style={s.taskEmoji}>
            {cfg.emoji}
          </Text>
        </View>

        <View style={s.taskTextWrap}>
          <Text
            style={[
              s.taskType,
              { color: cfg.accent },
            ]}
            numberOfLines={1}>
            {cfg.label}
          </Text>

          <Text style={s.taskDescription}>
            Complete slab targets and earn rewards
          </Text>

          {progress?.status === 'LOCKED' && (
            <Text style={s.lockedText}>
              Complete previous day target to unlock
            </Text>
          )}
        </View>
      </View>

      {/* SLABS */}

      <View style={s.slabContainer}>
        {task.slabs?.map((slab, slabIndex) => (
          <View key={slabIndex} style={s.slabRow}>
            <Text style={s.slabOrders}>
              {slab.maxOrders
                ? `${slab.minOrders}-${slab.maxOrders} Orders`
                : `${slab.minOrders}+ Orders`}
            </Text>

            <Text style={s.slabReward}>
              ₹{slab.rewardAmount}
            </Text>
          </View>
        ))}
      </View>

      {!!progress && (
        <View style={s.taskProgressRow}>
          <View style={s.taskProgressBg}>
            <View
              style={[
                s.taskProgressFill,
                {
                  width: `${progress.percentage || 0}%`,
                  backgroundColor: progress?.isCompleted
                    ? C.green
                    : cfg.accent,
                },
              ]}
            />
          </View>

          <Text
            style={[
              s.taskProgressText,
              {
                color: progress?.isCompleted
                  ? C.green
                  : cfg.accent,
              },
            ]}>
            {progress?.isCompleted
              ? 'Completed'
              : progress?.label}
          </Text>
        </View>
      )}
    </Animated.View>
  );
});

const WeeklyProgressCard = memo(({ summary}) => {
  const totalTasks = summary?.totalTasks || 0;
  const completedTasks = summary?.completedTasks || 0;
  const progressPercent =
  summary?.totalTasks > 0
    ? Math.round((summary.completedTasks / summary.totalTasks) * 100)
    : 0;
    // totalTasks > 0 ? Math.min(100, Math.round((completedTasks / totalTasks) * 100)) : 0;
  return (
    <View style={s.sectionCard}>
      <Text style={s.sectionTitle}>Weekly progress</Text>
      <Text style={s.sectionSubtitle}>Your overall progress in this joining bonus program.</Text>

      <View style={s.weeklyProgressRow}>
        <View style={s.weeklyProgressBg}>
          <View style={[s.weeklyProgressFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={s.weeklyProgressText}>
          {completedTasks}/{totalTasks} ({progressPercent}%)
        </Text>
      </View>

      <View style={s.weeklyStatsGrid}>
        <View style={s.weeklyStatCard}>
          <Text style={s.weeklyStatValue}>{completedTasks}</Text>
          <Text style={s.weeklyStatLabel}>Completed</Text>
        </View>
        <View style={s.weeklyStatCard}>
          <Text style={s.weeklyStatValue}>{summary?.pendingTasks || 0}</Text>
          <Text style={s.weeklyStatLabel}>Pending</Text>
        </View>
        <View style={s.weeklyStatCard}>
          <Text style={s.weeklyStatValue}>₹{summary?.totalRewardEarned || 0}</Text>
          <Text style={s.weeklyStatLabel}>Earned</Text>
        </View>
      </View>
    </View>
  );
});

const JoiningBonusScreen = ({ navigation }) => {
const {
  loading,
  error,
  program,
  load,
  progress,
  sortedTasks,
} = useJoiningBonus();
  const { width } = useWindowDimensions();
  const compact = width < 360;
  const isTabletLike = width >= 768;
  const scrollY = useRef(new Animated.Value(0)).current;

const totalReward =
  (progress?.overallProgress?.earnedAmount || 0) +
  (progress?.overallProgress?.remainingAmount || 0);  
const validityDays =
  progress?.overallProgress?.totalDays ||
  sortedTasks.length ||
  0;
  const weeklySummary = {
  totalTasks:
    progress?.overallProgress?.totalDays || 0,

  completedTasks:
    progress?.overallProgress?.completedDays || 0,

  pendingTasks:
    (progress?.overallProgress?.totalDays || 0) -
    (progress?.overallProgress?.completedDays || 0),

  totalRewardEarned:
    progress?.overallProgress?.earnedAmount || 0,
};
  

  const headerOpacity = scrollY.interpolate({ inputRange: [0, 70], outputRange: [0, 1], extrapolate: 'clamp' });

  if (loading) {
    return (
      <View style={s.centered}>
        <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
        <ActivityIndicator color={C.orange} size="large" />
        <Text style={s.loadingText}>Loading joining bonus details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={s.centered}>
        <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
        <Text style={s.emptyEmoji}>😔</Text>
        <Text style={s.emptyTitle}>Could not load bonus</Text>
        <Text style={s.emptySub}>{error || 'Something went wrong'}</Text>
        <TouchableOpacity style={s.retryBtn} onPress={load} activeOpacity={0.88}>
          <Text style={s.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!program) {
    return (
      <View style={s.centered}>
        <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
        <Text style={s.emptyEmoji}>🎁</Text>
        <Text style={s.emptyTitle}>No active joining bonus</Text>
        <Text style={s.emptySub}>There is no active joining bonus program available for this rider right now.</Text>
        <TouchableOpacity style={s.retryBtn} onPress={load} activeOpacity={0.88}>
          <Text style={s.retryText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <Animated.View style={[s.headerBg, { opacity: headerOpacity }]} />
      <HeaderBar onBack={() => navigation?.goBack?.()} />

      <Animated.ScrollView
        style={s.flex}
        contentContainerStyle={[
          s.scrollContent,
          isTabletLike && s.scrollContentTablet,
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}>
          
        <HeroCard
          program={program}
          totalReward={totalReward}
          validityDays={validityDays}
          compact={compact}
          progress={progress}
        />
       
        <HowItWorks />

{!!progress?.overallProgress && (
  <WeeklyProgressCard summary={weeklySummary} />
)}
        <View style={s.tasksHeaderWrap}>
          <Text style={s.sectionTitle}>Daily tasks</Text>
          <Text style={s.sectionSubtitle}>
            Review each day requirement and its reward amount before joining.
          </Text>
        </View>

        {sortedTasks.map((task, index) => (
          <TaskCard
            key={task.id || task.taskId || `${task.dayNumber}-${index}`}
            task={task}
            index={index}
            compact={compact}
           progress={task.progressData}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
};

const s = StyleSheet.create({
  flex: { flex: 1 },

  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },

  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,

    height: isTablet ? TOP_INSET + 72 : TOP_INSET + 58,

    backgroundColor: C.bg,
    borderBottomWidth: 1,
    borderBottomColor: C.borderSoft,
    zIndex: 10,
  },

  header: {
    position: 'absolute',
    top: TOP_INSET,
    left: 0,
    right: 0,

    height: isTablet ? 72 : 58,

    paddingHorizontal: isTablet ? 28 : 16,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    zIndex: 20,
  },

  backBtn: {
    width: isTablet ? 52 : 40,
    height: isTablet ? 52 : 40,

    borderRadius: 14,

    backgroundColor: C.surface,

    borderWidth: 1,
    borderColor: C.borderSoft,

    alignItems: 'center',
    justifyContent: 'center',
  },

  backArrow: {
    color: C.text,

    fontSize: isTablet ? 40 : 20,

    fontWeight: '700',

    marginTop: Platform.OS === 'android' ? -1 : 0,
  },

  headerTitle: {
    flex: 1,
    color: C.text,
    textAlign: 'center',

    fontSize: isTablet ? 30 : 17,

    fontWeight: '800',
    marginHorizontal: 12,
  },

  headerRightSpacer: {
    width: isTablet ? 52 : 40,
    height: isTablet ? 52 : 40,
  },

  scrollContent: {
    paddingTop: isTablet ? TOP_INSET + 92 : TOP_INSET + 74,

    paddingHorizontal: isTablet ? 28 : 16,

    paddingBottom: 180,
  },

  scrollContentTablet: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 1000,
  },

  scrollContentWithJoinBar: {
    paddingBottom: Platform.OS === 'ios' ? 200 : 180,
  },

  heroCard: {
    backgroundColor: C.surface,

    borderRadius: isTablet ? 32 : 26,

    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.18)',

    paddingHorizontal: isTablet ? 36 : 20,
    paddingVertical: isTablet ? 38 : 22,

    marginBottom: 20,

    overflow: 'hidden',
    alignItems: 'center',

    shadowColor: C.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },

    elevation: 3,
  },

  heroCardCompact: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },

  heroGlowOne: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(249,115,22,0.06)',
    top: -70,
    right: -70,
  },

  heroGlowTwo: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(245,158,11,0.05)',
    left: -45,
    bottom: -45,
  },

  heroEmoji: {
    fontSize: isTablet ? 64 : 44,
    marginBottom: 8,
  },

  heroEyebrow: {
    color: C.textSecondary,

    fontSize: isTablet ? 24 : 12,

    fontWeight: '800',

    letterSpacing: 0.8,
    textTransform: 'uppercase',

    textAlign: 'center',

    marginBottom: 8,
  },

  heroAmount: {
    color: C.text,

    fontSize: isTablet ? 62 : 42,

    lineHeight: isTablet ? 72 : 50,

    fontWeight: '900',

    letterSpacing: -1.2,

    textAlign: 'center',
  },

  heroAmountCompact: {
    fontSize: 34,
    lineHeight: 40,
  },

  heroSub: {
    color: C.textMuted,

    fontSize: isTablet ? 23 : 13,

    lineHeight: isTablet ? 28 : 18,

    textAlign: 'center',

    marginTop: 8,
    marginBottom: 20,

    paddingHorizontal: 6,
  },

  heroMetaWrap: {
    width: '100%',

    flexDirection: 'row',
    flexWrap: 'wrap',

    justifyContent: 'center',

    gap: 10,
  },

  heroMetaPill: {
    backgroundColor: C.cardAlt,

    borderWidth: 1,
    borderColor: C.borderSoft,

    paddingHorizontal: isTablet ? 18 : 12,
    paddingVertical: isTablet ? 12 : 8,

    borderRadius: 999,
  },

  heroMetaPillJoined: {
    borderColor: C.greenBorder,
    backgroundColor: C.greenSoft,
  },

  heroMetaText: {
    color: C.textSecondary,

    fontSize: isTablet ? 20 : 12,

    fontWeight: '700',
  },

  heroMetaTextJoined: {
    color: C.green,
  },

  sectionCard: {
    backgroundColor: C.card,

    borderRadius: isTablet ? 24 : 20,

    borderWidth: 1,
    borderColor: C.borderSoft,

    padding: isTablet ? 28 : 18,

    marginBottom: 20,
  },

  sectionTitle: {
    color: C.text,

    fontSize: isTablet ? 28 : 18,

    fontWeight: '800',

    letterSpacing: -0.3,

    marginBottom: 8,
  },

  sectionSubtitle: {
    color: C.textMuted,

    fontSize: isTablet ? 22 : 13,

    lineHeight: isTablet ? 28 : 19,

    marginBottom: 18,
  },

  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  stepBadge: {
    width: isTablet ? 50 : 34,
    height: isTablet ? 50 : 34,

    borderRadius: 12,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 14,
  },

  stepBadgeText: {
    fontSize: isTablet ? 20 : 15,
    fontWeight: '900',
  },

  stepContent: {
    flex: 1,
    paddingTop: 2,
  },

  stepTitle: {
    color: C.text,

    fontSize: isTablet ? 23 : 14,

    fontWeight: '800',

    marginBottom: 5,
  },

  stepDesc: {
    color: C.textSecondary,

    fontSize: isTablet ? 20 : 12,

    lineHeight: isTablet ? 26 : 18,
  },

  stepLine: {
    width: 1,
    height: isTablet ? 18 : 12,

    backgroundColor: C.divider,

    marginLeft: 22,
    marginVertical: 6,
  },

  tasksHeaderWrap: {
    marginBottom: 14,
  },

  taskCard: {
    backgroundColor: C.card,

    borderRadius: isTablet ? 24 : 18,

    borderWidth: 1,

    padding: isTablet ? 24 : 14,

    marginBottom: 16,
  },

  taskCardCompact: {
    padding: 12,
  },

  taskTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 16,
  },

  dayChip: {
    backgroundColor: '#F7F9FC',

    borderWidth: 1,
    borderColor: C.borderSoft,

    borderRadius: 999,

    paddingHorizontal: isTablet ? 16 : 10,
    paddingVertical: isTablet ? 10 : 5,
  },

  dayChipText: {
    color: C.textSecondary,

    fontSize: isTablet ? 20 : 11,

    fontWeight: '800',

    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },

  rewardPill: {
    backgroundColor: 'rgba(245,158,11,0.10)',

    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.20)',

    borderRadius: 999,

    paddingHorizontal: isTablet ? 16 : 10,
    paddingVertical: isTablet ? 10 : 5,
  },

  rewardPillText: {
    color: C.amber,

    fontSize: isTablet ? 20 : 13,

    fontWeight: '900',
  },

  taskMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  taskIconWrap: {
    width: isTablet ? 74 : 50,
    height: isTablet ? 74 : 50,

    borderRadius: 18,

    borderWidth: 1,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 18,
  },

  taskEmoji: {
    fontSize: isTablet ? 34 : 22,
  },

  taskTextWrap: {
    flex: 1,
    minWidth: 0,
  },

  taskType: {
    fontSize: isTablet ? 20 : 11,

    fontWeight: '900',

    letterSpacing: 0.6,
    textTransform: 'uppercase',

    marginBottom: 6,
  },

  taskDescription: {
    color: C.text,

    fontSize: isTablet ? 22 : 14,

    lineHeight: isTablet ? 32 : 20,

    fontWeight: '700',
  },

  lockedText: {
    marginTop: 8,

    fontSize: isTablet ? 20 : 12,

    color: C.textMuted,
    fontWeight: '600',
  },

  slabContainer: {
    marginTop: 18,
    gap: 10,
  },

  slabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: C.surface2,

    borderRadius: 14,

    paddingHorizontal: isTablet ? 18 : 12,
    paddingVertical: isTablet ? 16 : 10,

    borderWidth: 1,
    borderColor: C.borderSoft,
  },

  slabOrders: {
    color: C.textSecondary,

    fontSize: isTablet ? 20 : 12,

    fontWeight: '700',
  },

  slabReward: {
    color: C.green,

    fontSize: isTablet ? 20 : 13,

    fontWeight: '900',
  },

  statusPill: {
    paddingHorizontal: isTablet ? 14 : 10,
    paddingVertical: isTablet ? 8 : 4,

    borderRadius: 999,
    marginTop: 8,

    alignSelf: 'flex-start',
  },

  statusText: {
    fontSize: isTablet ? 20 : 11,

    fontWeight: '800',
    color: C.text,
  },

  taskProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 10,

    marginTop: 14,
    paddingTop: 12,

    borderTopWidth: 1,
    borderTopColor: C.divider,
  },

  taskProgressBg: {
    flex: 1,
    height: isTablet ? 8 : 6,

    backgroundColor: C.divider,

    borderRadius: 999,
    overflow: 'hidden',
  },

  taskProgressFill: {
    height: '100%',
    borderRadius: 999,
  },

  taskProgressText: {
    fontSize: isTablet ? 20 : 11,

    fontWeight: '700',

    minWidth: 90,

    textAlign: 'right',
  },

  weeklyProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 12,

    marginBottom: 18,
  },

  weeklyProgressBg: {
    flex: 1,

    height: isTablet ? 10 : 8,

    backgroundColor: C.divider,

    borderRadius: 999,
    overflow: 'hidden',
  },

  weeklyProgressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: C.green,
  },

  weeklyProgressText: {
    minWidth: 80,

    textAlign: 'right',

    color: C.textSecondary,

    fontSize: isTablet ? 20 : 12,

    fontWeight: '800',
  },

  weeklyStatsGrid: {
    flexDirection: 'row',
    gap: 12,
  },

  weeklyStatCard: {
    flex: 1,

    backgroundColor: C.cardAlt,

    borderWidth: 1,
    borderColor: C.borderSoft,

    borderRadius: 16,

    paddingVertical: isTablet ? 22 : 14,
    paddingHorizontal: 10,

    alignItems: 'center',
  },

  weeklyStatValue: {
    color: C.text,

    fontSize: isTablet ? 30 : 18,

    fontWeight: '900',

    marginBottom: 6,
  },

  weeklyStatLabel: {
    color: C.textMuted,

    fontSize: isTablet ? 15 : 11,

    fontWeight: '700',

    textTransform: 'uppercase',
  },

  stickyWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: C.bg,

    borderTopWidth: 1,
    borderTopColor: C.borderSoft,

    paddingHorizontal: 16,
    paddingTop: 12,

    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
  },

  stickyHelper: {
    color: C.textMuted,
    textAlign: 'center',

    fontSize: isTablet ? 14 : 11,

    lineHeight: isTablet ? 22 : 16,

    marginBottom: 10,
  },

  joinBtn: {
    backgroundColor: C.orange,

    borderRadius: 16,

    minHeight: isTablet ? 66 : 54,

    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: C.orange,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    elevation: 4,
  },

  joinBtnDisabled: {
    backgroundColor: '#A7B1C2',
    shadowOpacity: 0,
    elevation: 0,
  },

  joinBtnText: {
    color: '#FFFFFF',

    fontSize: isTablet ? 20 : 16,

    fontWeight: '900',

    letterSpacing: 0.2,
  },

  centered: {
    flex: 1,
    backgroundColor: C.bg,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 28,
  },

  loadingText: {
    marginTop: 14,

    color: C.textSecondary,

    fontSize: isTablet ? 18 : 14,

    fontWeight: '600',
  },

  emptyEmoji: {
    fontSize: isTablet ? 70 : 44,
    marginBottom: 12,
  },

  emptyTitle: {
    color: C.text,

    fontSize: isTablet ? 30 : 20,

    fontWeight: '800',

    marginBottom: 8,
    textAlign: 'center',
  },

  emptySub: {
    color: C.textSecondary,

    fontSize: isTablet ? 18 : 14,

    lineHeight: isTablet ? 30 : 21,

    textAlign: 'center',

    marginBottom: 22,
  },

  retryBtn: {
    backgroundColor: C.orange,

    borderRadius: 14,

    paddingHorizontal: isTablet ? 32 : 24,
    paddingVertical: isTablet ? 18 : 13,
  },

  retryText: {
    color: '#FFFFFF',

    fontSize: isTablet ? 18 : 14,

    fontWeight: '800',
  },
});

export default JoiningBonusScreen;