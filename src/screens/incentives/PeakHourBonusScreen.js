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

import SlabRuleTypeIncentives from "../../components/dashboard/earnings/SlabRuleTypeIncentives";
import FixedTargetRuleTypeIncentives from "../../components/dashboard/earnings/FixedTargetRuleTypeIncentives";
import HybridRuleTypeIncentives from "../../components/dashboard/earnings/HybridRuleTypeIncentives";

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
  const city = data.peak_data.data[0]?.cityName;
  const status = data.peak_data.data[0]?.isActive ? "RUNNING" : "NOT STARTED";
  const peakSlotStart = data.peak_data.data[0]?.slots[0].startTime;
  const peakSlotEnd = data.peak_data.data[0]?.slots[0].endTime;
  const rewardAmount = data.peak_data.data[0]?.slots[0].reward?.amount;



  //Data for ruleType = "SLAB"
  const slabs = data.peak_data.data[0]?.slots[0]?.slabs;
  const ordersCompleted = data.peakIncentivesProgress?.ordersCompleted;

  //Data for ruleType = "HYBRID"
  const minEarnings = data.peak_data.data[0]?.slots[0]?.conditions?.minEarnings;

  const minOrders = data.minOrders;

  const maxReward = slabs?.[slabs.length - 1].rewardAmount ||
    data.peak_data.data[0]?.slots[0]?.reward?.amount;

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
        colors={["#192A51", "#475B8A"]}
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
        <View style={styles.titleCard}>
          <Text style={styles.checkpointTitle}>{title}</Text>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>City</Text>
              <Text style={styles.label}>Type</Text>
              <Text style={styles.label}>Status</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.value}>{city}</Text>
              <Text style={styles.value}>{ruleType}</Text>
              <Text style={styles.value}>{status}</Text>
            </View>
          </View>
        </View>

        {ruleType === "SLAB" &&
          <SlabRuleTypeIncentives
            title={title}
            status={status}
            slabs={slabs}
            ordersCompleted={ordersCompleted}
            maxReward={maxReward}
          />
        }

        {(ruleType === "FIXED_TARGET") &&
          <FixedTargetRuleTypeIncentives
            title={title}
            status={status}
            target={minOrders}
            ordersCompleted={ordersCompleted}
            maxReward={maxReward}
          />
        }

        {ruleType === "HYBRID" &&
          <HybridRuleTypeIncentives
            title={title}
            status={status}
            ordersCompleted={ordersCompleted}
            minOrders={minOrders}
            rewardEarned={rewardAmount}
            minEarnings={minEarnings}
            maxReward={maxReward}
            styles={styles}
            isTablet={isTablet}
          />
        }

      </View>
    </ScrollView>
  );
};

export default PeakHourBonusScreen;

const createStyles = (isTablet, width) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F4F7FB",
    },

    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    emptyText: {
      fontSize: isTablet ? 24 : 16,
      fontWeight: "600",
      color: "#6B7280",
    },

    heroHeader: {
      paddingTop: isTablet ? 40 : 25,
      paddingBottom: isTablet ? 45 : 30,
      paddingHorizontal: isTablet ? 35 : 20,
      borderBottomLeftRadius: isTablet ? 36 : 24,
      borderBottomRightRadius: isTablet ? 36 : 24,
    },

    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: isTablet ? 30 : 18,
    },

    heroTitle: {
      fontSize: isTablet ? 34 : 26,
      fontWeight: "800",
      color: "#FFF",
      marginBottom: 6,
    },

    rewardPill: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      backgroundColor: "rgba(255,255,255,0.15)",
      paddingHorizontal: isTablet ? 20 : 14,
      paddingVertical: isTablet ? 12 : 8,
      borderRadius: isTablet ? 20 : 16,
      flexWrap: "wrap",
    },

    rewardLabel: {
      color: "#E0E0E0",
      fontSize: isTablet ? 18 : 13,
      marginHorizontal: 6,
    },

    rewardValue: {
      color: "#FFD700",
      fontSize: isTablet ? 22 : 16,
      fontWeight: "700",
      flexShrink: 1,
    },

    titleCard: {
      marginVertical: 20,
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderWidth: 1,
      borderColor: "#DEDEE1",
      borderRadius: 8,
      backgroundColor: "#FFF",
    },

    checkpointTitle: {
      fontSize: isTablet ? 24 : 18,
      fontWeight: '700',
      color: '#1F2937',
    },

    label: {
      fontSize: isTablet ? 17 : 14,
      fontWeight: '500',
      color: '#6B7280',
      paddingTop: 8,
    },

    value: {
      fontSize: isTablet ? 17 : 14,
      fontWeight: '700',
      color: '#111827',
      paddingTop: 8,
    },

    contentContainer: {
      paddingVertical: isTablet ? 30 : 20,
      paddingHorizontal: 20,
    },
  });
};