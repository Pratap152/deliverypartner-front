import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

import DeviceInfo from "react-native-device-info";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";

/* --- PROGRESSIVE CHECKPOINT BAR COMPONENT --- */
const ProgressiveCheckpointBar = ({ slabs, currentOrders, styles, isTablet }) => {
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
                  size={isTablet ? 18 : 12}
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

const FixedTargetType = ({ target, ordersCompleted, styles, isTablet }) => {
  const progress = Math.min((ordersCompleted / target) * 100, 100);

  return (
    <View style={styles.checkpointContainer}>
      <View style={styles.peakCheckpointHeaderRow}>
        <Text style={styles.peakCheckpointTitle}>Peak Slot Progress</Text>
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
          Minimum orders - {target}
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

const PeakHourBonusScreen = ({ route, navigation }) => {
  const { width } = useWindowDimensions();
  const isTablet = DeviceInfo.isTablet();
  const styles = createStyles(isTablet, width);

  const data = route.params;
  console.log("data from peak hour bonus: ", data);

  if (data.emptyData || data.peakIncentivesProgress?.emptyData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Please come again later
        </Text>
      </View>
    )
  }

  /* ---------------- EXTRACT DATA ---------------- */
  const ruleType = data.peak_data.data[0]?.ruleType;
  const title = data.peak_data.data[0]?.name;
  const slabs = data.peak_data.data[0]?.slots[0]?.slabs;
  const peakSlotStart = data.peak_data.data[0]?.slots[0].startTime;
  const peakSlotEnd = data.peak_data.data[0]?.slots[0].endTime;
  const rewardAmount = data.peak_data.data[0]?.slots[0].reward?.amount;

  // Mock current orders completed - Replace with actual data from your state/API
  const isPeakProgressEmpty = data.peakIncentivesProgress?.emptyData ? true : false;
  const currentOrders = isPeakProgressEmpty === false ? data.peakIncentivesProgress?.ordersCompleted : 0;

  const minOrders = data.minOrders;

  const formatTo12Hour = (time24) => {
    let [hours, minutes] = time24.split(":");
    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const peakSlotTime = `${formatTo12Hour(peakSlotStart)} - ${formatTo12Hour(peakSlotEnd)}`;

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
            size={isTablet ? 34 : 24}
            color="#FFF"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.heroTitle}>{title}</Text>
        <Text style={styles.heroSubtitle}>
          Complete orders during peak hours and unlock rewards
        </Text>

        <View style={styles.rewardPill}>
          <Ionicons
          name="flash"
          size={isTablet ? 22 : 16}
          color="#FFD700"
          />
          <Text style={styles.rewardLabel}>Peak Hours:</Text>
          {
            !peakSlotTime
              ? <Text style={styles.rewardValue}>No peak slots</Text>
              : <Text style={styles.rewardValue}>{peakSlotTime}</Text>
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
              styles={styles}
              isTablet={isTablet}
            />
          </View>}

        {(ruleType === "FIXED_TARGET" || ruleType === "HYBRID") &&
          <View style={styles.progressWrapper}>
            <FixedTargetType
              target={minOrders}
              ordersCompleted={currentOrders}
              styles={styles}
              isTablet={isTablet}
            />
          </View>
        }

        {(ruleType === "FIXED_TARGET" || ruleType === "HYBRID") &&
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Ionicons
              name="cash-outline"
              size={isTablet ? 28 : 20}
              color="#00A63E"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Reward Amount</Text>
              <Text style={styles.cardSubText}>
                {rewardAmount} rupees
              </Text>
            </View>
          </View>
        }

        {(ruleType === "PER_ORDER") &&
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Ionicons name="cash-outline" size={20} color="#00A63E" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Reward Amount</Text>
              <Text style={styles.cardSubText}>
                You will earn an amount of <Text style={{
                  fontSize: 14,
                  fontWeight: "800",
                  color: "#1F2937",
                  marginBottom: 2,
                }}>{rewardAmount} rupees</Text> per each order you deliver
              </Text>
            </View>
          </View>
        }

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

const createStyles = (
  isTablet,
  width
) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#F4F7FB",
    },

    emptyContainer: {
      flex: 1,
      justifyContent:
        "center",
      alignItems: "center",
    },

    emptyText: {
      fontSize: isTablet
        ? 24
        : 16,
      fontWeight: "600",
      color: "#6B7280",
    },

    heroHeader: {
      paddingTop: isTablet
        ? 40
        : 25,
      paddingBottom:
        isTablet
          ? 45
          : 30,
      paddingHorizontal:
        isTablet
          ? 35
          : 20,
      borderBottomLeftRadius:
        isTablet ? 36 : 24,
      borderBottomRightRadius:
        isTablet ? 36 : 24,
    },

    headerTop: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      marginBottom:
        isTablet
          ? 30
          : 18,
    },

    heroTitle: {
      fontSize: isTablet
        ? 34
        : 26,
      fontWeight: "800",
      color: "#FFF",
      marginBottom: 6,
    },

    heroSubtitle: {
      fontSize: isTablet
        ? 20
        : 15,
      color:
        "rgba(255,255,255,0.9)",
      marginBottom:
        isTablet
          ? 28
          : 18,
      lineHeight:
        isTablet
          ? 30
          : 22,
    },

    rewardPill: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      backgroundColor:
        "rgba(255,255,255,0.15)",
      paddingHorizontal:
        isTablet
          ? 20
          : 14,
      paddingVertical:
        isTablet
          ? 12
          : 8,
      borderRadius:
        isTablet
          ? 20
          : 16,
    },

    rewardLabel: {
      color: "#E0E0E0",
      fontSize: isTablet
        ? 18
        : 13,
      marginHorizontal: 6,
    },

    rewardValue: {
      color: "#FFD700",
      fontSize: isTablet
        ? 22
        : 16,
      fontWeight: "700",
    },

    contentContainer: {
      padding: isTablet
        ? 30
        : 18,
    },

    card: {
      backgroundColor:
        "#FFF",
      borderRadius:
        isTablet
          ? 24
          : 16,
      padding: isTablet
        ? 24
        : 16,
      marginBottom:
        isTablet
          ? 24
          : 16,
      flexDirection: "row",
      alignItems: "center",

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },

    iconCircle: {
      width: isTablet
        ? 65
        : 44,

      height: isTablet
        ? 65
        : 44,

      borderRadius: isTablet
        ? 32
        : 22,

      backgroundColor:
        "#E0F2FE",

      justifyContent:
        "center",

      alignItems: "center",

      marginRight:
        isTablet
          ? 18
          : 12,
    },

    icon: {
      fontSize: isTablet
        ? 28
        : 20,
    },

    cardTitle: {
      fontSize: isTablet
        ? 24
        : 16,
      fontWeight: "700",
      color: "#1F2937",
      marginBottom: 4,
    },

    cardSubText: {
      fontSize: isTablet
        ? 18
        : 13,
      color: "#6B7280",
      lineHeight:
        isTablet
          ? 28
          : 18,
    },

    progressWrapper: {
      backgroundColor:
        "#FFF",
      borderRadius:
        isTablet
          ? 24
          : 16,
      padding: isTablet
        ? 28
        : 20,
      marginBottom:
        isTablet
          ? 24
          : 16,

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },

    checkpointContainer: {},

    checkpointTitle: {
      fontSize: isTablet
        ? 24
        : 16,
      fontWeight: "700",
      color: "#333",
      marginBottom:
        isTablet
          ? 32
          : 24,
    },

    checkpointTrackWrapper: {
      height: isTablet
        ? 90
        : 60,
      position: "relative",
      marginBottom:
        isTablet
          ? 45
          : 30,
      marginHorizontal:
        isTablet
          ? 20
          : 10,
    },

    checkpointTrack: {
      position: "absolute",
      left: 0,
      right: 0,
      top: isTablet
        ? 35
        : 22,
      height: isTablet
        ? 10
        : 8,
      backgroundColor:
        "#EEF0F4",
      borderRadius: 10,
    },

    checkpointFill: {
      position: "absolute",
      left: 0,
      top: isTablet
        ? 35
        : 22,
      height: isTablet
        ? 10
        : 8,
      borderRadius: 10,
    },

    checkpoint: {
      position: "absolute",
      top: 0,
      alignItems: "center",
      marginLeft: isTablet
        ? -22
        : -15,
    },

    checkpointIcon: {
      width: isTablet
        ? 46
        : 30,

      height: isTablet
        ? 46
        : 30,

      borderRadius: isTablet
        ? 23
        : 15,

      backgroundColor:
        "#E5E7EB",

      borderWidth: 3,
      borderColor: "#FFF",

      justifyContent:
        "center",

      alignItems: "center",
    },

    checkpointIconCompleted:
      {
        backgroundColor:
          "#00A63E",
      },

    checkpointOrderLabel: {
      position: "absolute",
      top: isTablet
        ? -30
        : -22,
      fontSize: isTablet
        ? 16
        : 11,
      fontWeight: "700",
      color: "#999",
    },

    checkpointOrderLabelActive:
      {
        color: "#4F39F6",
      },

    checkpointRewardLabel: {
      position: "absolute",
      top: isTablet
        ? 54
        : 36,
      fontSize: isTablet
        ? 16
        : 13,
      fontWeight: "700",
      color: "#999",
    },

    checkpointRewardLabelActive:
      {
        color: "#00A63E",
      },

    currentProgressText: {
      fontSize: isTablet
        ? 20
        : 14,
      fontWeight: "600",
      color: "#4F39F6",
      textAlign: "center",
      marginTop: 10,
    },

    peakCheckpointHeaderRow:
      {
        flexDirection: "row",
        justifyContent:
          "space-between",
        alignItems: "center",
        marginBottom:
          isTablet
            ? 30
            : 24,
      },

    peakCheckpointTitle: {
      fontSize: isTablet
        ? 24
        : 16,
      fontWeight: "700",
      color: "#333",
    },

    ordersBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor:
        "#E0E7FF",
      paddingHorizontal:
        isTablet
          ? 16
          : 10,
      paddingVertical:
        isTablet
          ? 8
          : 4,
      borderRadius:
        isTablet
          ? 16
          : 12,
    },

    ordersText: {
      fontSize: isTablet
        ? 16
        : 12,
      fontWeight: "700",
      color: "#4F39F6",
      marginLeft: 4,
    },

    fixedTargetLabel: {
      marginBottom: 8,
      fontSize: isTablet
        ? 18
        : 14,
      fontWeight: "500",
    },

    fixedTargetContainer: {
      height: isTablet
        ? 18
        : 12,
      backgroundColor:
        "#eee",
      borderRadius: 10,
      overflow: "hidden",
    },

    fixedTargetProgress: {
      height: "100%",
      backgroundColor:
        "#4CAF50",
    },

    fixedTargetPercent: {
      marginTop: 6,
      fontSize: isTablet
        ? 16
        : 12,
      color: "#555",
    },

    howItWorksCard: {
      backgroundColor:
        "#FFF",
      borderRadius:
        isTablet
          ? 24
          : 16,
      padding: isTablet
        ? 28
        : 20,
      marginBottom:
        isTablet
          ? 24
          : 16,

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },

    sectionTitle: {
      fontSize: isTablet
        ? 24
        : 16,
      fontWeight: "700",
      color: "#333",
      marginBottom:
        isTablet
          ? 24
          : 16,
    },

    stepRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom:
        isTablet
          ? 18
          : 12,
    },

    stepNumber: {
      width: isTablet
        ? 42
        : 28,

      height: isTablet
        ? 42
        : 28,

      borderRadius: isTablet
        ? 21
        : 14,

      backgroundColor:
        "#E0E7FF",

      justifyContent:
        "center",

      alignItems: "center",

      marginRight:
        isTablet
          ? 18
          : 12,
    },

    stepNumberText: {
      fontSize: isTablet
        ? 18
        : 14,
      fontWeight: "700",
      color: "#4F39F6",
    },

    stepText: {
      flex: 1,
      fontSize: isTablet
        ? 18
        : 14,
      color: "#4B5563",
      lineHeight:
        isTablet
          ? 28
          : 20,
    },
  });
};
