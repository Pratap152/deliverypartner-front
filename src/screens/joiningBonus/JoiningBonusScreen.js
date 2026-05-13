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
import { getTaskDescription } from '../../services/JoiningBonusService';

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
  screen: { flex: 1, backgroundColor: C.bg },
  headerBg: { position: 'absolute', top: 0, left: 0, right: 0, height: TOP_INSET + 58, backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.borderSoft, zIndex: 10 },
  header: { position: 'absolute', top: TOP_INSET, left: 0, right: 0, height: 58, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.surface, borderWidth: 1, borderColor: C.borderSoft, alignItems: 'center', justifyContent: 'center' },
  backArrow: { color: C.text, fontSize: 20, fontWeight: '700', marginTop: Platform.OS === 'android' ? -1 : 0 , },
  headerTitle: { flex: 1, color: C.text, textAlign: 'center', fontSize: 17, fontWeight: '800', marginHorizontal: 12 },
  headerRightSpacer: { width: 40, height: 40 },
  scrollContent: { paddingTop: TOP_INSET + 74, paddingHorizontal: 16, paddingBottom: 180 },
  scrollContentTablet: { paddingHorizontal: 24, alignSelf: 'center', width: '100%', maxWidth: 920 },
  scrollContentWithJoinBar: { paddingBottom: Platform.OS === 'ios' ? 200 : 180 },
  heroCard: { backgroundColor: C.surface, borderRadius: 26, borderWidth: 1, borderColor: 'rgba(249,115,22,0.18)', paddingHorizontal: 20, paddingVertical: 22, marginBottom: 16, overflow: 'hidden', alignItems: 'center', shadowColor: C.shadow, shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 3 },
  heroCardCompact: { paddingHorizontal: 16, paddingVertical: 18 },
  heroGlowOne: { position: 'absolute', width: 210, height: 210, borderRadius: 105, backgroundColor: 'rgba(249,115,22,0.06)', top: -70, right: -70 },
  heroGlowTwo: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(245,158,11,0.05)', left: -45, bottom: -45 },
  heroEmoji: { fontSize: 44, marginBottom: 8 },
  heroEyebrow: { color: C.textSecondary, fontSize: 12, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase', textAlign: 'center', marginBottom: 6 },
  heroAmount: { color: C.text, fontSize: 42, lineHeight: 50, fontWeight: '900', letterSpacing: -1.2, textAlign: 'center' },
  heroAmountCompact: { fontSize: 34, lineHeight: 40 },
  heroSub: { color: C.textMuted, fontSize: 13, lineHeight: 18, textAlign: 'center', marginTop: 6, marginBottom: 16, paddingHorizontal: 6 },
  heroMetaWrap: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  heroMetaPill: { backgroundColor: C.cardAlt, borderWidth: 1, borderColor: C.borderSoft, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  heroMetaPillJoined: { borderColor: C.greenBorder, backgroundColor: C.greenSoft },
  heroMetaText: { color: C.textSecondary, fontSize: 12, fontWeight: '700' },
  heroMetaTextJoined: { color: C.green },
  infoGrid: { marginBottom: 16, gap: 10 },
  infoGridTablet: { flexDirection: 'row', flexWrap: 'wrap' },
  infoCard: { flex: 1, minWidth: 0, backgroundColor: C.card, borderWidth: 1, borderColor: C.borderSoft, borderRadius: 18, padding: 16, position: 'relative', overflow: 'hidden' },
  infoAccent: { position: 'absolute', top: 0, left: 0, width: 4, bottom: 0 },
  infoTitle: { color: C.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6, paddingLeft: 4 },
  infoValue: { color: C.text, fontSize: 16, fontWeight: '800', marginBottom: 4, paddingLeft: 4 },
  infoHelper: { color: C.textSecondary, fontSize: 12, lineHeight: 17, paddingLeft: 4 },
  sectionCard: { backgroundColor: C.card, borderRadius: 20, borderWidth: 1, borderColor: C.borderSoft, padding: 18, marginBottom: 18 },
  sectionTitle: { color: C.text, fontSize: 18, fontWeight: '800', letterSpacing: -0.3, marginBottom: 4 },
  sectionSubtitle: { color: C.textMuted, fontSize: 13, lineHeight: 19, marginBottom: 16 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start' },
  stepBadge: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  stepBadgeText: { fontSize: 15, fontWeight: '900' },
  stepContent: { flex: 1, paddingTop: 2 },
  stepTitle: { color: C.text, fontSize: 14, fontWeight: '800', marginBottom: 3 },
  stepDesc: { color: C.textSecondary, fontSize: 12, lineHeight: 18 },
  stepLine: { width: 1, height: 12, backgroundColor: C.divider, marginLeft: 16, marginVertical: 6 },
  tasksHeaderWrap: { marginBottom: 10 },
  taskCard: { backgroundColor: C.card, borderRadius: 18, borderWidth: 1, padding: 14, marginBottom: 12 },
  taskCardCompact: { padding: 12 },
  taskTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  dayChip: { backgroundColor: '#F7F9FC', borderWidth: 1, borderColor: C.borderSoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  dayChipText: { color: C.textSecondary, fontSize: 11, fontWeight: '800', letterSpacing: 0.4, textTransform: 'uppercase' },
  rewardPill: { backgroundColor: 'rgba(245,158,11,0.10)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.20)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  rewardPillText: { color: C.amber, fontSize: 13, fontWeight: '900' },
  taskMainRow: { flexDirection: 'row', alignItems: 'center' },
  taskIconWrap: { width: 50, height: 50, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  taskEmoji: { fontSize: 22 },
  taskTextWrap: { flex: 1, minWidth: 0 },
  taskType: { fontSize: 11, fontWeight: '900', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 4 },
  taskDescription: { color: C.text, fontSize: 14, lineHeight: 20, fontWeight: '700' },
  stickyWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.borderSoft, paddingHorizontal: 16, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 28 : 14 },
  stickyHelper: { color: C.textMuted, textAlign: 'center', fontSize: 11, lineHeight: 16, marginBottom: 10 },
  joinBtn: { backgroundColor: C.orange, borderRadius: 16, minHeight: 54, alignItems: 'center', justifyContent: 'center', shadowColor: C.orange, shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  joinBtnDisabled: { backgroundColor: '#A7B1C2', shadowOpacity: 0, elevation: 0 },
  joinBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900', letterSpacing: 0.2 },
  centered: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  loadingText: { marginTop: 14, color: C.textSecondary, fontSize: 14, fontWeight: '600' },
  emptyEmoji: { fontSize: 44, marginBottom: 12 },
  emptyTitle: { color: C.text, fontSize: 20, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  emptySub: { color: C.textSecondary, fontSize: 14, lineHeight: 21, textAlign: 'center', marginBottom: 22 },
  retryBtn: { backgroundColor: C.orange, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 13 },
  retryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  lockedText: {
  marginTop: 6,
  fontSize: 12,
  color: C.textMuted,
  fontWeight: '600',
},

slabContainer: {
  marginTop: 14,
  gap: 8,
},

slabRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: C.surface2,
  borderRadius: 12,
  paddingHorizontal: 12,
  paddingVertical: 10,
  borderWidth: 1,
  borderColor: C.borderSoft,
},

slabOrders: {
  color: C.textSecondary,
  fontSize: 12,
  fontWeight: '700',
},

slabReward: {
  color: C.green,
  fontSize: 13,
  fontWeight: '900',
},

  statusPill: {
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 999,
  marginTop: 8,
  alignSelf: 'flex-start',
},

statusText: {
  fontSize: 11,
  fontWeight: '800',
  color: C.text,
},

  taskProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.divider,
  },
  taskProgressBg: {
    flex: 1,
    height: 6,
    backgroundColor: C.divider,
    borderRadius: 999,
    overflow: 'hidden',
  },
  taskProgressFill: {
    height: '100%',
    borderRadius: 999,
  },
  taskProgressText: {
    fontSize: 11,
    fontWeight: '700',
    minWidth: 80,
    textAlign: 'right',
  },
  weeklyProgressRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  marginBottom: 16,
  },
  weeklyProgressBg: {
    flex: 1,
    height: 8,
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
    minWidth: 48,
    textAlign: 'right',
    color: C.textSecondary,
    fontSize: 12,
    fontWeight: '800',
  },
  weeklyStatsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  weeklyStatCard: {
    flex: 1,
    backgroundColor: C.cardAlt,
    borderWidth: 1,
    borderColor: C.borderSoft,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  weeklyStatValue: {
    color: C.text,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  weeklyStatLabel: {
    color: C.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});

export default JoiningBonusScreen;