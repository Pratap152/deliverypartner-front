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

const DailyGuarentee = ({ route, navigation }) => {
  // Safe extraction with default values
  const params = route.params || {};

  // Slot Rules Defaults
  const minPeakSlots = params.slotRules?.minPeakSlots || 2;
  const minNormalSlots = params.slotRules?.minNormalSlots || 3;

  // Order Rules Defaults (Drilling down safely)
  // Peak Slab: Try to get first slab's minOrders, else default to 5
  const peakMinOrders = params.slabs?.peak?.[0]?.minOrders || 5;
  const peakMaxOrders = params.slabs?.peak?.[0]?.maxOrders || 8;

  // Normal Slab: Try to get first slab's minOrders, else default to 8
  const normalMinOrders = params.slabs?.normal?.[0]?.minOrders || 8;
  const normalMaxOrders = params.slabs?.normal?.[0]?.maxOrders || 12;

  // Progress Data
  const completedOrders = params.completedOrders || 0;
  // We can sum the targets for a rough "Total Goal" visual, or just use a fixed max if mapped
  const totalTarget = peakMinOrders + normalMinOrders;
  const progressPercent = Math.min((completedOrders / totalTarget) * 100, 100);

  const status = params.status || "ACTIVE";
  const rewardAmount = params.rewardAmount || params.value || 0;

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
          <View style={[styles.statusBadge, status !== "ACTIVE" && styles.inactiveBadge]}>
            <Text style={[styles.statusText, status !== "ACTIVE" && styles.inactiveText]}>
              {status}
            </Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>{params.title || "Daily Target Bonus"}</Text>
        <Text style={styles.heroSubtitle}>
          {params.description || "Complete targets to earn extra rewards"}
        </Text>

        <View style={styles.rewardPill}>
          <Text style={styles.rewardLabel}>Potential Earnings</Text>
          <Text style={styles.rewardValue}>₹{rewardAmount}</Text>
        </View>
      </LinearGradient>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Your Daily Mission</Text>

        {/* --- ZONE 1: PEAK PERFORMANCE (Warm Schema) --- */}
        <View style={[styles.ruleCard, styles.peakCard]}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconBox, styles.peakIconBox]}>
              <Ionicons name="flash" size={20} color="#FF6A00" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Peak Zone Targets</Text>
              <Text style={styles.cardSubtitle}>High demand hours</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Rule Rows */}
          <View style={styles.ruleRow}>
            <Ionicons name="calendar-outline" size={18} color="#555" style={styles.ruleIcon} />
            <Text style={styles.ruleText}>
              Book & Complete <Text style={styles.boldPeak}>{minPeakSlots} Peak Slots</Text>
            </Text>
          </View>
          <View style={styles.ruleRow}>
            <Ionicons name="cube-outline" size={18} color="#555" style={styles.ruleIcon} />
            <Text style={styles.ruleText}>
              Deliver <Text style={styles.boldPeak}>{peakMinOrders}+ Orders</Text> in peak hours
            </Text>
          </View>
        </View>

        {/* --- ZONE 2: NORMAL PERFORMANCE (Cool Schema) --- */}
        <View style={[styles.ruleCard, styles.normalCard]}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconBox, styles.normalIconBox]}>
              <Ionicons name="bicycle" size={20} color="#00A63E" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Standard Zone Targets</Text>
              <Text style={styles.cardSubtitle}>Regular hours</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Rule Rows */}
          <View style={styles.ruleRow}>
            <Ionicons name="calendar-outline" size={18} color="#555" style={styles.ruleIcon} />
            <Text style={styles.ruleText}>
              Book & Complete <Text style={styles.boldNormal}>{minNormalSlots} Normal Slots</Text>
            </Text>
          </View>
          <View style={styles.ruleRow}>
            <Ionicons name="cube-outline" size={18} color="#555" style={styles.ruleIcon} />
            <Text style={styles.ruleText}>
              Deliver <Text style={styles.boldNormal}>{normalMinOrders}+ Orders</Text> in normal hours
            </Text>
          </View>
        </View>

        {/* --- PROGRESS SECTION --- */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Overall Progress</Text>
            <Text style={styles.progressValue}>{completedOrders} / {totalTarget}</Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.bar, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressHint}>
            Complete all targets to unlock the bonus!
          </Text>
        </View>

      </View>
    </ScrollView>
  );
};

export default DailyGuarentee;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB", // Light gray-blue bg
  },
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
    color: "#AAFFAA", // Light green text for active
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  rewardLabel: {
    color: '#E0E0E0',
    fontSize: 13,
    marginRight: 8,
  },
  rewardValue: {
    color: '#FFD700', // Gold
    fontSize: 18,
    fontWeight: '700',
  },

  contentContainer: {
    padding: wp("5%"),
  },
  sectionTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "700",
    color: "#333",
    marginBottom: hp("2%"),
    marginLeft: 4,
  },

  /* Card Styles */
  ruleCard: {
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
  },
  peakCard: {
    borderLeftColor: "#FF6A00", // Orange Accent
  },
  normalCard: {
    borderLeftColor: "#00A63E", // Green Accent
  },

  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  peakIconBox: {
    backgroundColor: "#FFF0E0",
  },
  normalIconBox: {
    backgroundColor: "#E0F5E9",
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
    flexDirection: 'row',
    alignItems: 'center',
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
  boldPeak: {
    fontWeight: "700",
    color: "#E65100",
  },
  boldNormal: {
    fontWeight: "700",
    color: "#15803D",
  },

  /* Progress Styles */
  progressContainer: {
    marginTop: hp("1%"),
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F39F6',
  },
  track: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  bar: {
    height: '100%',
    backgroundColor: '#4F39F6',
    borderRadius: 5,
  },
  progressHint: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
  }
});