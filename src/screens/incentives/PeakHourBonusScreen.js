import React, { useState, useEffect } from "react";
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

/* --- PROGRESSIVE CHECKPOINT BAR COMPONENT --- */
const ProgressiveCheckpointBar = ({ slabs, currentOrders }) => {
  // If no slabs, return null
  if (!slabs || slabs.length === 0) return null;

  const minOrders = slabs[slabs.length - 1]?.minOrders;
  const progressPercent = Math.min((currentOrders / minOrders) * 100, 100);

  return (
    <View style={styles.checkpointContainer}>
      <Text style={styles.checkpointTitle}>Your Reward Journey</Text>

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

        {/* Checkpoint Markers */}
        {slabs.map((slab, index) => {
          const position = (slab.minOrders / minOrders) * 100;
          const isCompleted = currentOrders >= slab.minOrders;

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

              {/* Orders Label Above */}
              <Text
                style={[
                  styles.checkpointOrderLabel,
                  isCompleted && styles.checkpointOrderLabelActive,
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

      {/* Current Progress Text */}
      <Text style={styles.currentProgressText}>
        {currentOrders} / {minOrders} orders completed
      </Text>
    </View>
  );
};

const PeakHourBonusScreen = ({ route, navigation }) => {
  const data = route.params;
  console.log("data from peak hour bonus: ", data);

  /* ---------------- EXTRACT DATA ---------------- */
  const ruleType = data.peak_data.data[0]?.slots[0].ruleType;
  const dataSlots = data.peak_data.data;
  const title = data.peak_data.data[0].name;
  const slabs = data.peak_data.data[0].slots[0].slabs;
  const rewardAmount = data.peak_data.data[0]?.slots[0].reward?.amount || 
  data.peak_data.data[0]?.slots[0].slabs[0].rewardAmount;

  // Mock current orders completed - Replace with actual data from your state/API
  const currentOrders = data.peakIncentivesProgress.slots[0].ordersCompleted;

  const formatTo12Hour = (time24) => {
    let [hours, minutes] = time24.split(":");
    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const peakSlots = dataSlots.flatMap(item =>
    item.slots.map(slot =>
      `${formatTo12Hour(slot.startTime)} - ${formatTo12Hour(slot.endTime)}`
    )
  );

  // Convert "10:30 PM" → minutes (0–1439)
  const parseTimeToMinutes = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  // Normalize slot (handle cross-midnight)
  const getSlotRange = (slot) => {
    const [startStr, endStr] = slot.split(" - ");
    const start = parseTimeToMinutes(startStr);
    let end = parseTimeToMinutes(endStr);
    // 👉 Cross-midnight case (end < start)
    if (end < start) {
      end += 1440; // push to next day
    }
    return { start, end };
  };

  // Sort slots by start time
  const sortSlots = (slots) => {
    return [...slots].sort((a, b) => {
      return getSlotRange(a).start - getSlotRange(b).start;
    });
  };

  // Main function
  const getSlotStatus = (slots) => {
    const sortedSlots = sortSlots(slots);
    const now = new Date();
    let currentMinutes = now.getHours() * 60 + now.getMinutes();
    // 👉 Also check "next-day shifted time" for cross-midnight
    let extendedNow = currentMinutes + 1440;
    for (let i = 0; i < sortedSlots.length; i++) {
      const slot = sortedSlots[i];
      const { start, end } = getSlotRange(slot);
      // ✅ Current slot (normal or cross-midnight)
      if (
        (currentMinutes >= start && currentMinutes <= end) ||
        (extendedNow >= start && extendedNow <= end)
      ) {
        return { type: "current", slot };
      }
      // ✅ Next slot (today)
      if (currentMinutes < start) {
        return { type: "next", slot };
      }
    }
    // ✅ Check next-day slots (for late night cases)
    for (let i = 0; i < sortedSlots.length; i++) {
      const slot = sortedSlots[i];
      const { start } = getSlotRange(slot);
      if (extendedNow < start) {
        return { type: "next", slot };
      }
    }

    return { type: "none", message: "No peak slots" };
  };

  const useSlotStatus = (slots) => {
    const [status, setStatus] = useState(getSlotStatus(slots));

    useEffect(() => {
      const interval = setInterval(() => {
        setStatus(getSlotStatus(slots));
      }, 60000); // every 1 min
      return () => clearInterval(interval);
    }, [slots]);
    return status;
  };
  const { type, slot: peakSlot, message } = useSlotStatus(peakSlots);

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
        </View>

        <Text style={styles.heroTitle}>{title}</Text>
        <Text style={styles.heroSubtitle}>
          Complete orders during peak hours and unlock rewards
        </Text>

        <View style={styles.rewardPill}>
          <Ionicons name="flash" size={16} color="#FFD700" />
          <Text style={styles.rewardLabel}>Peak Hours:</Text>
          {
            !type === "none"
              ? <Text style={styles.rewardValue}>No peak slots</Text>
              : <Text style={styles.rewardValue}>
                {peakSlot}
              </Text>
          }
        </View>
      </LinearGradient>

      <View style={styles.contentContainer}>
        {/* TIME CARD - Keeping Exactly As Is */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>⏰</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Active Time Window</Text>
            <Text style={styles.cardSubText}>
              Earn bonuses on peak hours
            </Text>
          </View>
        </View>

        {/* PROGRESSIVE CHECKPOINT BAR */}
        {ruleType === "SLAB" &&
          <View style={styles.progressWrapper}>
          <ProgressiveCheckpointBar
            slabs={slabs}
            currentOrders={currentOrders}
          />
        </View>}

        {/* HOW IT WORKS */}
        <View style={styles.howItWorksCard}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>
              Work during peak hours
            </Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>
              Complete orders to reach reward milestones
            </Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>
              Unlock higher rewards with more orders!
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default PeakHourBonusScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB", // Light gray-blue bg (same as DailyGuarentee)
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

  /* --- TIME CARD (KEEPING EXACTLY AS ORIGINAL) --- */
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: hp("2%"),
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  cardSubText: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },

  /* --- PROGRESSIVE CHECKPOINT BAR STYLES --- */
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
  checkpointTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 24,
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
    marginLeft: -15, // Center the checkpoint
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
  checkpointOrderLabel: {
    position: "absolute",
    top: -22,
    fontSize: 11,
    fontWeight: "700",
    color: "#999",
  },
  checkpointOrderLabelActive: {
    color: "#4F39F6",
    fontSize: 12,
  },
  checkpointRewardLabel: {
    position: "absolute",
    top: 36,
    fontSize: 13,
    fontWeight: "700",
    color: "#999",
  },
  checkpointRewardLabelActive: {
    color: "#00A63E",
    fontSize: 13,
  },
  currentProgressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F39F6",
    textAlign: "center",
    marginTop: 10,
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