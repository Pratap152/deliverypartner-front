import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import DeviceInfo from "react-native-device-info";

import WeeklyMissionProgress from '../../components/dashboard/earnings/WeeklyMissionProgress';

const WeeklyCheckpointBar = ({ slabs, ordersCompleted }) => {
  const minOrders = slabs[slabs.length - 1]?.minOrders;
  const progressPercent = Math.min((ordersCompleted / minOrders) * 100, 100);

  return (
    <View style={styles.checkpointContainer}>
      <View style={styles.checkpointHeaderRow}>
        <Text style={styles.checkpointTitle}>Weekly Progress</Text>
        <View style={styles.ordersBadge}>
          <Ionicons
          name="cube"
          size={isTablet ? 18: 14}
          color="#4F39F6"
          />
          <Text style={styles.ordersText}>{ordersCompleted} orders</Text>
        </View>
      </View>

      {/* Checkpoint Track */}
      <View style={styles.checkpointTrackWrapper}>
        {/* Background Track */}
        <View style={styles.checkpointTrack} />

        {/* Progress Fill */}
        <LinearGradient
          colors={["#4F39F6", "#3B28C7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.checkpointFill, { width: `${progressPercent}%` }]}
        />

        {/* Day Checkpoint Markers */}
        {slabs.map((slab, index) => {
          const position = (slab.minOrders / minOrders) * 100;
          const isCompleted = ordersCompleted >= slab.minOrders;

          return (
            <View
              key={index}
              style={[styles.checkpoint, { left: `${position}%` }]}
            >
              {/* Checkpoint Icon */}
              <View
                style={[
                  styles.checkpointIcon,
                  isCompleted && styles.checkpointIconCompleted,
                ]}
              >
                <Ionicons
                  name={isCompleted ? "checkmark" : "lock-closed"}
                  size={isTablet ? 16 : 12}
                  color={isCompleted ? "#FFF" : "#999"}
                />
              </View>

              {/* Day Label Above */}
              <Text
                style={[
                  styles.checkpointDayLabel,
                  isCompleted && styles.checkpointDayLabelActive,
                ]}
              >
                {slab.minOrders}
              </Text>

              {/* Reward Label Below */}
              <Text
                style={[
                  styles.checkpointRewardLabel,
                  isCompleted && styles.checkpointRewardLabelActive,
                ]}
              >
                ₹{slab.rewardAmount}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const FixedTargetType = ({ target, ordersCompleted }) => {
  const progress = Math.min((ordersCompleted / target) * 100, 100);

  return (
    <View style={styles.checkpointContainer}>
      <View style={styles.checkpointHeaderRow}>
        <Text style={styles.checkpointTitle}>Weekly Progress</Text>
        <View style={styles.ordersBadge}>
          <Ionicons
          name="cube"
          size={isTablet ? 18 : 14}
          color="#4F39F6"
          />
          <Text style={styles.ordersText}>{ordersCompleted} orders</Text>
        </View>
      </View>
      <View>
        <Text style={styles.fixedTargetLabel}>
          Minimum orders in a week - {target}
        </Text>
        <View style={styles.fixedTargetContainer}>
          <View style={[styles.fixedTargetProgress, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.fixedTargetPercent}>
          {progress.toFixed(0)}%
        </Text>
      </View>
    </View>
  );
};

const WeekEarnings = ({ route, navigation }) => {
  const { width } = useWindowDimensions();
  const isTablet = DeviceInfo.isTablet();
  const styles = createStyles(isTablet, width);

  const params = route.params || {};
  const data = params?.data || params;
  console.log("data from week Earnings", data);

  if (data.emptyData || data.weeklyIncentivesProgress?.emptyData) {
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

  /* ---------------- EXTRACT DATA ---------------- */
  const title = data?.weekly_data.data[0].name;
  const maxRewardPerWeek = data?.weekly_data.data[0].maxReward;
  const ruleType = data?.weekly_data.data[0].ruleType;

  //Data for ruleType = "SLAB"
  const slabs = data?.weekly_data.data[0].slabs;
  const ordersCompleted = data?.weeklyIncentivesProgress.ordersCompleted;

  //Data for ruleType = "FIXED_TARGET"
  const minOrders = data?.minOrders;

  //Data for ruleType = "HYBRID"
  const minEarnings = data?.weekly_data.data[0].conditions?.minEarnings;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* --- HERO HEADER --- */}
      <LinearGradient
        colors={["#4F39F6", "#3B28C7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroHeader}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
            name="arrow-back"
            size={isTablet ? 30 : 24}
            color="#FFF"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.heroTitle}>{title}</Text>

        <View style={styles.rewardPill}>
          <Ionicons
          name="trophy"
          size={isTablet ? 20 : 16}
          color="#FFD700"
          />
          <Text style={styles.rewardLabel}>Max Reward:</Text>
          <Text style={styles.rewardValue}>₹{maxRewardPerWeek}</Text>
        </View>
      </LinearGradient>

      <View style={styles.contentContainer}>
        {/* WEEKLY RULES CARD */}
        <View style={styles.rulesCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconBox}>
              <Ionicons
              name="calendar"
              size={isTablet ? 26 : 20}
              color="#4F39F6"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Weekly Requirements</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Rule Rows */}
          {ruleType === "TASK" && (
            <View style={styles.ruleRow}>
              <Ionicons
              name="cube-outline"
              size={isTablet ? 24 : 18}
              color="#555"
              style={styles.ruleIcon}
              />
              <Text style={styles.ruleText}>
                Complete your tasks to earn rewards
              </Text>
            </View>
          )}
          {minOrders !== 0 && (
            <View style={styles.ruleRow}>
              <Ionicons
              name="cube-outline"
              size={isTablet ? 24 : 18}
              color="#555"
              style={styles.ruleIcon}
              />
              <Text style={styles.ruleText}>
                Deliver <Text style={styles.boldPurple}>{minOrders}+ orders</Text> in a week
              </Text>
            </View>
          )}
          {minEarnings && (
            <View style={styles.ruleRow}>
              <Ionicons
              name="checkmark-circle-outline"
              size={isTablet ? 24 : 18}
              color="#555"
              style={styles.ruleIcon}
              />
              <Text style={styles.ruleText}>
                Should have minimum earnings of <Text style={styles.boldPurple}>{minEarnings}</Text> rupees
              </Text>
            </View>
          )}
        </View>

        {/* 7-DAY WEEKLY CHECKPOINT PROGRESS BAR */}
        {ruleType === "SLAB" &&
          <View style={styles.progressWrapper}>
            <WeeklyCheckpointBar
              slabs={slabs}
              ordersCompleted={ordersCompleted}
            />
          </View>
        }

        {(ruleType === "FIXED_TARGET" || ruleType === "HYBRID") &&
          <View style={styles.progressWrapper}>
            <FixedTargetType
              target={minOrders}
              ordersCompleted={ordersCompleted}
              isTablet={isTablet}
              styles={styles}
            />
          </View>
        }

        {ruleType === "TASK" &&
          <WeeklyMissionProgress
            missionsData={data.weekly_data.data[0]}
            progressData={data.weeklyIncentivesProgress}
          />
        }

        {/* TOTAL ORDERS CARD */}
        {ruleType !== "TASK" &&
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <LinearGradient
                colors={["#4F39F6", "#3B28C7"]}
                style={styles.statIconBox}
              >
                <Ionicons
                name="cube"
                size={isTablet ? 32 : 24}
                color="#FFF"
                />
              </LinearGradient>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.statLabel}>Total Orders This Week</Text>
                <Text style={styles.statValue}>{ordersCompleted} orders</Text>
              </View>
            </View>
          </View>
        }

        {/* PAYOUT INFO */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons
            name="cash-outline"
            size={isTablet ? 28 : 20}
            color="#00A63E"
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.infoTitle}>Payout Details</Text>
              <Text style={styles.infoText}>
                Weekly bonus credited every Monday for the previous week's performance
              </Text>
            </View>
          </View>
        </View>

        {/* HOW IT WORKS */}
        <View style={styles.howItWorksCard}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>
              Work consistently throughout the week
            </Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>
              Complete minimum {minOrders} orders per day
            </Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>
              Unlock weekly bonus up to ₹{maxRewardPerWeek}!
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default WeekEarnings;

const createStyles = (
  isTablet,
  width,
) => {
  const contentWidth = isTablet
    ? width > 1000
      ? '70%'
      : '82%'
    : '100%';

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
    },
    emptyText: {
      marginTop: 14,
      fontSize: isTablet ? 22 : 16,
      color: '#6B7280',
      fontWeight: '600',
    },
    heroHeader: {
      paddingTop: isTablet ? 55 : 35,
      paddingBottom: isTablet ? 45 : 30,
      paddingHorizontal: isTablet ? 34 : 20,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
      alignItems: 'flex-start',
    },
    headerTop: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: isTablet ? 28 : 18,
    },
    heroTitle: {
      fontSize: isTablet ? 38 : 26,
      fontWeight: '800',
      color: '#FFF',
      marginBottom: 10,
      textAlign: isTablet
        ? 'center'
        : 'left',
    },
    rewardPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        'rgba(255,255,255,0.15)',
      paddingHorizontal: isTablet
        ? 22
        : 16,
      paddingVertical: isTablet
        ? 12
        : 8,
      borderRadius: 18,
      borderWidth: 1,
      borderColor:
        'rgba(255,255,255,0.2)',
    },
    rewardLabel: {
      color: '#E0E0E0',
      fontSize: isTablet ? 16 : 13,
      marginLeft: 6,
      marginRight: 6,
    },
    rewardValue: {
      color: '#FFD700',
      fontSize: isTablet ? 24 : 18,
      fontWeight: '700',
    },
    contentContainer: {
      width: contentWidth,
      alignSelf: 'center',
      paddingVertical: isTablet
        ? 28
        : 20,
      paddingHorizontal: isTablet
        ? 0
        : 20,
    },
    rulesCard: {
      backgroundColor: '#FFF',
      borderRadius: isTablet ? 24 : 16,
      padding: isTablet ? 24 : 16,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      borderLeftWidth: 5,
      borderLeftColor: '#4F39F6',
    },
    cardHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
    },
    iconBox: {
      width: isTablet ? 54 : 40,
      height: isTablet ? 54 : 40,
      borderRadius: 999,
      backgroundColor: '#E0E7FF',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 14,
    },
    cardTitle: {
      fontSize: isTablet ? 22 : 16,
      fontWeight: '700',
      color: '#1F2937',
    },
    divider: {
      height: 1,
      backgroundColor: '#EFF0F6',
      marginBottom: 14,
    },
    ruleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    ruleIcon: {
      marginRight: 10,
      opacity: 0.7,
    },
    ruleText: {
      fontSize: isTablet ? 18 : 14,
      color: '#4B5563',
      flex: 1,
      lineHeight: isTablet ? 30 : 20,
    },
    boldPurple: {
      fontWeight: '700',
      color: '#4F39F6',
    },
    progressWrapper: {
      backgroundColor: '#FFF',
      borderRadius: isTablet ? 24 : 16,
      padding: isTablet ? 28 : 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    checkpointContainer: {},
    checkpointHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: isTablet ? 34 : 24,
    },
    checkpointTitle: {
      fontSize: isTablet ? 22 : 16,
      fontWeight: '700',
      color: '#333',
    },
    ordersBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#E0E7FF',
      paddingHorizontal: isTablet
        ? 14
        : 10,
      paddingVertical: isTablet
        ? 8
        : 4,
      borderRadius: 14,
    },
    ordersText: {
      fontSize: isTablet ? 15 : 12,
      fontWeight: '700',
      color: '#4F39F6',
      marginLeft: 4,
    },
    checkpointTrackWrapper: {
      height: isTablet ? 90 : 60,
      position: 'relative',
      marginTop: 20,
      marginBottom: isTablet ? 50 : 30,
      marginHorizontal: 10,
    },
    checkpointTrack: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: isTablet ? 34 : 22,
      height: isTablet ? 12 : 8,
      backgroundColor: '#EEF0F4',
      borderRadius: 6,
    },
    checkpointFill: {
      position: 'absolute',
      left: 0,
      top: isTablet ? 34 : 22,
      height: isTablet ? 12 : 8,
      borderRadius: 6,
    },
    checkpoint: {
      position: 'absolute',
      top: 0,
      alignItems: 'center',
      marginLeft: isTablet ? -22 : -15,
    },
    checkpointIcon: {
      width: isTablet ? 44 : 30,
      height: isTablet ? 44 : 30,
      borderRadius: 999,
      backgroundColor: '#E5E7EB',
      borderWidth: 3,
      borderColor: '#FFF',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 3,
    },
    checkpointIconCompleted: {
      backgroundColor: '#00A63E',
    },
    checkpointDayLabel: {
      position: 'absolute',
      top: isTablet ? -34 : -22,
      fontSize: isTablet ? 14 : 10,
      fontWeight: '700',
      color: '#999',
    },
    checkpointDayLabelActive: {
      color: '#4F39F6',
    },
    checkpointRewardLabel: {
      position: 'absolute',
      top: isTablet ? 54 : 36,
      fontSize: isTablet ? 13 : 10,
      fontWeight: '700',
      color: '#999',
    },
    checkpointRewardLabelActive: {
      color: '#00A63E',
    },
    fixedTargetLabel: {
      marginBottom: 8,
      fontSize: isTablet ? 18 : 14,
      fontWeight: '500',
      color: '#374151',
    },
    fixedTargetContainer: {
      height: isTablet ? 18 : 12,
      backgroundColor: '#eee',
      borderRadius: 999,
      overflow: 'hidden',
    },
    fixedTargetProgress: {
      height: '100%',
      backgroundColor: '#4CAF50',
    },
    fixedTargetPercent: {
      marginTop: 8,
      fontSize: isTablet ? 16 : 12,
      color: '#555',
      fontWeight: '600',
    },
    statsCard: {
      backgroundColor: '#FFF',
      borderRadius: isTablet ? 24 : 16,
      padding: isTablet ? 24 : 16,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    statRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statIconBox: {
      width: isTablet ? 76 : 56,
      height: isTablet ? 76 : 56,
      borderRadius: 999,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statLabel: {
      fontSize: isTablet ? 16 : 13,
      color: '#6B7280',
      marginBottom: 4,
    },
    statValue: {
      fontSize: isTablet ? 30 : 20,
      fontWeight: '800',
      color: '#1F2937',
    },
    infoCard: {
      backgroundColor: '#FFF',
      borderRadius: isTablet ? 24 : 16,
      padding: isTablet ? 24 : 16,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    infoTitle: {
      fontSize: isTablet ? 20 : 15,
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: 4,
    },
    infoText: {
      fontSize: isTablet ? 16 : 13,
      color: '#6B7280',
      lineHeight: isTablet ? 28 : 18,
    },
    howItWorksCard: {
      backgroundColor: '#FFF',
      borderRadius: isTablet ? 24 : 16,
      padding: isTablet ? 28 : 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: isTablet ? 24 : 16,
      fontWeight: '700',
      color: '#333',
      marginBottom: 20,
    },
    stepRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    stepNumber: {
      width: isTablet ? 42 : 28,
      height: isTablet ? 42 : 28,
      borderRadius: 999,
      backgroundColor: '#E0E7FF',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 14,
    },
    stepNumberText: {
      fontSize: isTablet ? 18 : 14,
      fontWeight: '700',
      color: '#4F39F6',
    },
    stepText: {
      fontSize: isTablet ? 18 : 14,
      color: '#4B5563',
      flex: 1,
      lineHeight: isTablet ? 30 : 20,
    },
  });
};