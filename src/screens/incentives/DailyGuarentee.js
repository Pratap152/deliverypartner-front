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
import DeviceInfo from 'react-native-device-info';

import SlabRuleTypeIncentives from "../../components/dashboard/earnings/SlabRuleTypeIncentives";
import FixedTargetRuleTypeIncentives from "../../components/dashboard/earnings/FixedTargetRuleTypeIncentives";
import HybridRuleTypeIncentives from "../../components/dashboard/earnings/HybridRuleTypeIncentives";
import PerOrderRuleTypeIncentives from "../../components/dashboard/earnings/PerOrderRuleTypeIncentives";
import { SafeAreaView } from "react-native-safe-area-context";

const DailyGuarentee = ({ route, navigation }) => {

  const { width } = useWindowDimensions;
  const isTablet = DeviceInfo.isTablet();
  const styles = createStyles(isTablet, width);

  // Safe extraction with default values
  const params = route.params;
  console.log("data in daily guarantee: ", params);

  if (params.emptyData || params.dailyIncentivesProgress.emptyData) {
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

  const title = params.daily_data.data[0].name;
  const city = params.daily_data.data[0].city;
  const status = params.daily_data?.data[0]?.status;
  const ruleType = params.daily_data.data[0].ruleType;

  const ordersCompleted = params.dailyIncentivesProgress.ordersCompleted;
  const minOrders = params.minOrders;
  const maxReward = params?.daily_data?.data[0]?.maxPayoutPerDay;
  const rewardEarned = params?.dailyIncentivesProgress.rewardEarned;

  //Data for ruleType = "HYBRID"
  const minEarnings = params.daily_data.data[0]?.conditions?.minEarnings;

  //Data for ruleType = "PER_ORDER"
  const perOrderAmount = params.daily_data.data[0]?.reward?.perOrderAmount;
  const maxOrders = params.daily_data.data[0]?.reward?.maxOrders;

  //Data for ruleType = "SLAB"
  const slabs = params.daily_data.data[0]?.slabs;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* --- HERO HEADER --- */}
      <LinearGradient
        colors={["#192A51", "#475B8A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroHeader}
      >
        <SafeAreaView style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back"
              size={isTablet ? 30 : 24}
              color="#FFF"
            />
          </TouchableOpacity>

          <Text style={styles.heroTitle}>{title}</Text>
        </SafeAreaView>

        <View style={styles.rewardPill}>
          <Text style={styles.rewardLabel}>Potential Earnings</Text>
          <Text style={styles.rewardValue}>₹ {maxReward}</Text>
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
            styles={styles}
            isTablet={isTablet}
          />
        }

        {(ruleType === "FIXED_TARGET") &&
          <FixedTargetRuleTypeIncentives
            title={title}
            status={status}
            target={minOrders}
            ordersCompleted={ordersCompleted}
            maxReward={maxReward}
            isTablet={isTablet}
            styles={styles}
          />
        }

        {ruleType === "HYBRID" &&
          <HybridRuleTypeIncentives
            title={title}
            status={status}
            ordersCompleted={ordersCompleted}
            minOrders={minOrders}
            rewardEarned={rewardEarned}
            minEarnings={minEarnings}
            maxReward={maxReward}
            styles={styles}
            isTablet={isTablet}
          />
        }

        {ruleType === "PER_ORDER" &&
          <PerOrderRuleTypeIncentives
            title={title}
            status={status}
            perOrderAmount={perOrderAmount}
            ordersCompleted={ordersCompleted}
            maxOrders={maxOrders}
            maxReward={maxReward}
            styles={styles}
            isTablet={isTablet}
          />
        }
      </View>
    </ScrollView>
  );
};

export default DailyGuarentee;

const createStyles = (isTablet, width) => {
  const contentWidth = isTablet
    ? width > 1000
      ? "70%"
      : "82%"
    : "100%";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F4F7FB",
    },

    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F4F7FB",
    },

    emptyText: {
      marginTop: 14,
      fontSize: isTablet ? 22 : 16,
      color: "#6B7280",
      fontWeight: "600",
    },

    heroHeader: {
      paddingBottom: isTablet ? 55 : 40,
      paddingHorizontal: isTablet ? 34 : 20,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
      alignItems: "flex-start",
    },

    headerTop: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      gap:15,
      marginBottom: isTablet ? 28 : 18,
    },

    heroTitle: {
      fontSize: isTablet ? 38 : 24,
      fontWeight: "700",
      color: "#FFF",
      textAlign: isTablet ? "center" : "left",
    },

    rewardPill: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.15)",
      paddingHorizontal: isTablet ? 22 : 16,
      paddingVertical: isTablet ? 12 : 8,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
    },

    rewardLabel: {
      color: "#E0E0E0",
      fontSize: isTablet ? 16 : 13,
      marginRight: 8,
    },

    rewardValue: {
      color: "#FFD700",
      fontSize: isTablet ? 24 : 18,
      fontWeight: "700",
    },

    contentContainer: {
      paddingVertical: isTablet ? 30 : 20,
      paddingHorizontal: 20,
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
  });
};