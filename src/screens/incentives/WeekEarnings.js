import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

/* --- 7-DAY WEEKLY CHECKPOINT BAR COMPONENT --- */
const WeeklyCheckpointBar = ({ eligibleDays = 0, totalDaysRequired = 7, totalOrders = 0 }) => {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const progressPercent = Math.min((eligibleDays / totalDaysRequired) * 100, 100);

  return (
    <View style={styles.checkpointContainer}>
      <View style={styles.checkpointHeaderRow}>
        <Text style={styles.checkpointTitle}>Weekly Progress</Text>
        <View style={styles.ordersBadge}>
          <Ionicons name="cube" size={14} color="#4F39F6" />
          <Text style={styles.ordersText}>{totalOrders} orders</Text>
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
        {daysOfWeek.map((day, index) => {
          const position = ((index + 1) / totalDaysRequired) * 100;
          const isCompleted = index < eligibleDays;
          const dayNumber = index + 1;

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
                  size={12}
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
                {day}
              </Text>

              {/* Day Number Below */}
              <Text
                style={[
                  styles.checkpointNumberLabel,
                  isCompleted && styles.checkpointNumberLabelActive,
                ]}
              >
                D{dayNumber}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Current Progress Text */}
      <Text style={styles.currentProgressText}>
        {eligibleDays} of {totalDaysRequired} days completed
      </Text>
    </View>
  );
};

const WeekEarnings = ({ route, navigation }) => {
  const params = route.params || {};
  const data = params.data || params;

  /* ---------------- EXTRACT DATA ---------------- */
  const title = data.title || "Weekly Target";
  const description = data.description || "Complete daily targets to earn weekly bonus";
  const weeklyRules = data.weeklyRules || {};
  const progress = data.progress || {};
  const maxRewardPerWeek = data.maxRewardPerWeek || 500;

  const totalDaysInWeek = weeklyRules.totalDaysInWeek || 7;
  const minOrdersPerDay = weeklyRules.minOrdersPerDay || 10;
  const allowPartialDays = weeklyRules.allowPartialDays || false;

  const eligibleDays = progress.eligibleDays || 0;
  const totalDaysRequired = progress.totalDaysRequired || 7;
  const totalOrders = progress.totalOrders || 0;
  const isEligible = progress.isEligible || false;

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
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View
            style={[
              styles.statusBadge,
              !isEligible && styles.inactiveBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                !isEligible && styles.inactiveText,
              ]}
            >
              {isEligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
            </Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>{title}</Text>
        <Text style={styles.heroSubtitle}>
          {description}
        </Text>

        <View style={styles.rewardPill}>
          <Ionicons name="trophy" size={16} color="#FFD700" />
          <Text style={styles.rewardLabel}>Max Reward:</Text>
          <Text style={styles.rewardValue}>₹{maxRewardPerWeek}</Text>
        </View>
      </LinearGradient>

      <View style={styles.contentContainer}>
        {/* WEEKLY RULES CARD */}
        <View style={styles.rulesCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconBox}>
              <Ionicons name="calendar" size={20} color="#4F39F6" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Weekly Requirements</Text>
              <Text style={styles.cardSubtitle}>Complete these to earn bonus</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Rule Rows */}
          <View style={styles.ruleRow}>
            <Ionicons name="time-outline" size={18} color="#555" style={styles.ruleIcon} />
            <Text style={styles.ruleText}>
              Work for <Text style={styles.boldPurple}>{totalDaysInWeek} days</Text> in the week
            </Text>
          </View>
          <View style={styles.ruleRow}>
            <Ionicons name="cube-outline" size={18} color="#555" style={styles.ruleIcon} />
            <Text style={styles.ruleText}>
              Deliver <Text style={styles.boldPurple}>{minOrdersPerDay}+ orders</Text> per day
            </Text>
          </View>
          {allowPartialDays && (
            <View style={styles.ruleRow}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#00A63E" style={styles.ruleIcon} />
              <Text style={styles.ruleText}>
                <Text style={{ color: "#00A63E", fontWeight: "700" }}>Partial days allowed</Text> - earn proportional rewards
              </Text>
            </View>
          )}
        </View>

        {/* 7-DAY WEEKLY CHECKPOINT PROGRESS BAR */}
        <View style={styles.progressWrapper}>
          <WeeklyCheckpointBar
            eligibleDays={eligibleDays}
            totalDaysRequired={totalDaysRequired}
            totalOrders={totalOrders}
          />
        </View>

        {/* TOTAL ORDERS CARD */}
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <LinearGradient
              colors={["#4F39F6", "#3B28C7"]}
              style={styles.statIconBox}
            >
              <Ionicons name="cube" size={24} color="#FFF" />
            </LinearGradient>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.statLabel}>Total Orders This Week</Text>
              <Text style={styles.statValue}>{totalOrders} orders</Text>
              <Text style={styles.statHint}>
                Average: {totalOrders > 0 && eligibleDays > 0 ? Math.round(totalOrders / eligibleDays) : 0} orders/day
              </Text>
            </View>
          </View>
        </View>

        {/* PAYOUT INFO */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="cash-outline" size={20} color="#00A63E" />
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
              Complete minimum {minOrdersPerDay} orders per day
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB", // Light gray-blue bg
  },

  /* --- HERO HEADER STYLES --- */
  heroHeader: {
    paddingTop: hp("3%"),
    paddingBottom: hp("4%"),
    paddingHorizontal: wp("5%"),
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  statusBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  inactiveBadge: {
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  statusText: {
    color: "#AAFFAA", // Light green text for eligible
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  inactiveText: {
    color: "#CCC",
  },
  heroTitle: {
    fontSize: wp("6.5%"),
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: wp("3.8%"),
    color: "rgba(255,255,255,0.9)",
    marginBottom: hp("2.5%"),
  },
  rewardPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  rewardLabel: {
    color: "#E0E0E0",
    fontSize: 13,
    marginLeft: 6,
    marginRight: 6,
  },
  rewardValue: {
    color: "#FFD700", // Gold
    fontSize: 16,
    fontWeight: "700",
  },

  contentContainer: {
    padding: wp("5%"),
  },

  /* --- RULES CARD --- */
  rulesCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: hp("2%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#4F39F6",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#EFF0F6",
    marginBottom: 12,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ruleIcon: {
    marginRight: 10,
    opacity: 0.7,
  },
  ruleText: {
    fontSize: 14,
    color: "#4B5563",
    flex: 1,
    lineHeight: 20,
  },
  boldPurple: {
    fontWeight: "700",
    color: "#4F39F6",
  },

  /* --- 7-DAY CHECKPOINT BAR STYLES --- */
  progressWrapper: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: hp("2%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  checkpointContainer: {},
  checkpointHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  checkpointTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  ordersBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ordersText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4F39F6",
    marginLeft: 4,
  },
  checkpointTrackWrapper: {
    height: 60,
    position: "relative",
    marginTop: 20,
    marginBottom: 30,
    marginHorizontal: 10,
  },
  checkpointTrack: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 22,
    height: 8,
    backgroundColor: "#EEF0F4",
    borderRadius: 4,
  },
  checkpointFill: {
    position: "absolute",
    left: 0,
    top: 22,
    height: 8,
    borderRadius: 4,
  },
  checkpoint: {
    position: "absolute",
    top: 0,
    alignItems: "center",
    marginLeft: -15,
  },
  checkpointIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E5E7EB",
    borderWidth: 3,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  checkpointIconCompleted: {
    backgroundColor: "#00A63E",
  },
  checkpointDayLabel: {
    position: "absolute",
    top: -22,
    fontSize: 10,
    fontWeight: "700",
    color: "#999",
  },
  checkpointDayLabelActive: {
    color: "#4F39F6",
    fontSize: 11,
  },
  checkpointNumberLabel: {
    position: "absolute",
    top: 36,
    fontSize: 10,
    fontWeight: "600",
    color: "#999",
  },
  checkpointNumberLabelActive: {
    color: "#00A63E",
    fontSize: 11,
  },
  currentProgressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F39F6",
    textAlign: "center",
    marginTop: 10,
  },

  /* --- STATS CARD --- */
  statsCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: hp("2%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 2,
  },
  statHint: {
    fontSize: 11,
    color: "#9CA3AF",
    fontStyle: "italic",
  },

  /* --- INFO CARD --- */
  infoCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: hp("2%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  infoText: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },

  /* --- HOW IT WORKS CARD --- */
  howItWorksCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: hp("2%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4F39F6",
  },
  stepText: {
    fontSize: 14,
    color: "#4B5563",
    flex: 1,
    lineHeight: 20,
  },
});