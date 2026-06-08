import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import ProgressBar from "../../components/dashboard/earnings/ProgressBar";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import DeviceInfo from "react-native-device-info";

import SlabRuleTypeIncentives from "../../components/dashboard/earnings/SlabRuleTypeIncentives";
import FixedTargetRuleTypeIncentives from "../../components/dashboard/earnings/FixedTargetRuleTypeIncentives";
import HybridRuleTypeIncentives from "../../components/dashboard/earnings/HybridRuleTypeIncentives";
import PerOrderRuleTypeIncentives from "../../components/dashboard/earnings/PerOrderRuleTypeIncentives";

import WeeklyMissionProgress from '../../components/dashboard/earnings/WeeklyMissionProgress';
import { SafeAreaView } from "react-native-safe-area-context";

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
  const maxReward = data?.weekly_data.data[0].maxReward;
  const ruleType = data?.weekly_data.data[0].ruleType;
  const status = data?.weekly_data.data[0].status;
  const city = data?.weekly_data.data[0].cityName;

  //Data for ruleType = "SLAB"
  const slabs = data?.weekly_data.data[0].slabs;
  const ordersCompleted = data?.weeklyIncentivesProgress.ordersCompleted;

  //Data for ruleType = "FIXED_TARGET"
  const minOrders = data?.minOrders;

  //Data for ruleType = "HYBRID"
  const minEarnings = data?.weekly_data.data[0].conditions?.minEarnings;
  const rewardEarned = data?.weeklyIncentivesProgress?.rewardEarned;

  //Data for ruleType = "PER_ORDER"
  const perOrderAmount = data?.weekly_data.data[0]?.rewardPerOrder;
  const maxOrders = data?.weekly_data.data[0]?.maxOrders;

  //Data for ruleType = "TASK"
  const tasks = data?.weekly_data?.data[0]?.tasks;
  const progress = data?.weeklyIncentivesProgress;

  // console.log("FRDSRE: ", tasks);

  const renderTaskRuleType = (task, progressTask, status) => {
    console.log("TASK: ", progressTask);
    switch (task.taskRuleType) {
      case "SLAB":
        return (
          <SlabRuleTypeIncentives
            title={title}
            status={status}
            slabs={task.slabs}
            ordersCompleted={progressTask.progress.completedOrders}
            maxReward={task.slabs[task.slabs.length - 1]?.rewardAmount}
            styles={styles}
            isTablet={isTablet}
          />
        );
      case "FIXED_TARGET":
        return (
          <FixedTargetRuleTypeIncentives
            title={title}
            status={status}
            target={task.target.orders}
            ordersCompleted={progressTask.progress.completedOrders}
            maxReward={task.reward.amount}
            isTablet={isTablet}
            styles={styles}
          />
        );
      case "HYBRID":
        return (
          <HybridRuleTypeIncentives
            title={title}
            status={status}
            ordersCompleted={progressTask.progress.completedOrders}
            minOrders={task.conditions.minOrders}
            rewardEarned={progressTask.progress.currentEarnings}
            minEarnings={task.conditions.minEarnings}
            maxReward={task.reward.amount}
            styles={styles}
            isTablet={isTablet}
          />
        );
      case "PER_ORDER":
        return (
          <PerOrderRuleTypeIncentives
            title={title}
            status={status}
            perOrderAmount={task.rewardPerOrder}
            ordersCompleted={progressTask.progress.completedOrders}
            maxOrders={task.maxOrders}
            maxReward={task.maxEarning}
            styles={styles}
            isTablet={isTablet}
          />
        );
      default:
        return (
          <View></View>
        );
    }
  }

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
          <Ionicons
            name="trophy"
            size={isTablet ? 20 : 16}
            color="#FFD700"
          />
          <Text style={styles.rewardLabel}>Max Reward:</Text>
          <Text style={styles.rewardValue}>₹{maxReward}</Text>
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

        {ruleType === "TASK" &&
          <View style={styles.progressWrapper}>
            {tasks.map((task) => {
              const progressTask =
                progress.tasks.find(
                  item =>
                    item.dayNumber ===
                    task.dayNumber
                );
              const status =
                progressTask?.progress
                  ?.status;
              return (
                <View key={task.dayNumber}>
                  <View style={styles.taskRuleTypeHeaderRow}>
                    <Text style={styles.taskRuleTypeHeaderDay}>Day {task.dayNumber}</Text>
                    <Text style={styles.taskRuleTypeHeaderRuleType}>{task.taskRuleType}</Text>
                    <Text>          </Text>
                  </View>
                  {renderTaskRuleType(task, progressTask, status)}
                </View>
              )
            })
            }
          </View>
        }

      </View>
    </ScrollView>
  );
};

export default WeekEarnings;

const createStyles = (isTablet, width) => {
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
      paddingHorizontal: 20,
    },

    emptyText: {
      marginTop: 14,
      fontSize: isTablet ? 22 : 16,
      color: '#6B7280',
      fontWeight: '600',
      textAlign: 'center',
    },

    heroHeader: {
      paddingBottom: isTablet ? 45 : 30,
      paddingHorizontal: isTablet ? 34 : 20,
      borderBottomLeftRadius: isTablet ? 36 : 26,
      borderBottomRightRadius: isTablet ? 36 : 26,
    },

    headerTop: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      gap:15,
      marginBottom: isTablet ? 28 : 18,
    },

    heroTitle: {
      fontSize: isTablet ? 38 : 24,
      fontWeight: '700',
      color: '#FFF',
      lineHeight: isTablet ? 48 : 34,
    },

    rewardPill: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(255,255,255,0.15)',
      paddingHorizontal: isTablet ? 22 : 16,
      paddingVertical: isTablet ? 12 : 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
    },

    rewardLabel: {
      color: '#E5E7EB',
      fontSize: isTablet ? 16 : 13,
      marginHorizontal: 6,
      fontWeight: '500',
    },

    rewardValue: {
      color: '#FFD700',
      fontSize: isTablet ? 24 : 18,
      fontWeight: '700',
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

    progressWrapper: {
      backgroundColor: '#FFFFFF',
      borderColor: '#DEDEE1',
      borderWidth: 1,
      borderRadius: isTablet ? 24 : 16,
      padding: isTablet ? 28 : 18,
      marginBottom: 20,
    },

    taskRuleTypeHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: isTablet ? 14 : 10,
      marginBottom: isTablet ? 14 : 10,
      paddingHorizontal: 4,
      gap: 10,
    },

    taskRuleTypeHeaderDay: {
      flex: 1,
      fontSize: isTablet ? 18 : 15,
      fontWeight: '700',
      color: '#111827',
    },

    taskRuleTypeHeaderRuleType: {
      fontSize: isTablet ? 17 : 14,
      fontWeight: '700',
      color: '#4F39F6',
    },
  });
};