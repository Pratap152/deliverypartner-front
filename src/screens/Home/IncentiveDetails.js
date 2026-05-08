import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  getPeakHourIncentives,
  getDailyIncentives,
  getWeeklyIncentives,
} from "../../services/earnings/incentiveService";
import useIncentives from "../../hooks/useIncentives";

export default function IncentiveDetails({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [peakData, setPeakData] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const { weeklyIncentivesProgress, dailyIncentivesProgress, peakIncentivesProgress, load, fetchWeeklyIncentivesProgress, fetchDailyIncentivesProgress, fetchPeakIncentivesProgress } = useIncentives();

  useEffect(() => {
    fetchAllIncentives();
    fetchWeeklyIncentivesProgress();
    fetchDailyIncentivesProgress();
    fetchPeakIncentivesProgress();
  }, []);

  const weeklyCompletedOrders = weeklyIncentivesProgress?.ruleType !== "TASK" ? weeklyIncentivesProgress?.ordersCompleted : 0;
  const dailyCompletedOrders = dailyIncentivesProgress?.ordersCompleted;
  const peakCompletedOrders = 1||peakIncentivesProgress?.slots[0].ordersCompleted;

  const weeklyMinimumOrders = weeklyData?.data[0].ruleType === "HYBRID" ?
          weeklyData?.data[0]?.conditions?.minOrders :
          weeklyData?.data[0]?.ruleType === "FIXED_TARGET" ?
            weeklyData?.data[0]?.target?.orders :
            weeklyData?.data[0]?.ruleType === "SLAB" ?
              weeklyData?.data[0]?.slabs[0]?.minOrders : 0;
  const dailyMinimumOrders = dailyData?.data[0]?.target?.orders || dailyData?.data[0].slabs[0]?.minOrders;

  const weeklyRewardEarned = weeklyIncentivesProgress?.rewardEarned;
  const dailyRewardEarned = dailyIncentivesProgress?.rewardEarned;
  const peakRewardEarned = 40||peakIncentivesProgress?.slots[0]?.reward;

  /* ================= FETCH ALL INCENTIVES ================= */
  const fetchAllIncentives = async () => {
    try {
      setLoading(true);

      // PEAK
      let peakRes = null;
      try {
        peakRes = await getPeakHourIncentives();
        console.log('PEAK Response:', JSON.stringify(peakRes, null, 2));
        if (peakRes?.data) {
          setPeakData(peakRes);
        }
      } catch (e) {
        console.log('PEAK Error:', e.response?.data || e.message);
      }

      // DAILY
      let dailyRes = null;
      try {
        dailyRes = await getDailyIncentives();
        console.log('DAILY Response:', JSON.stringify(dailyRes, null, 2));
        // Daily API returns data directly, not nested in .data
        if (dailyRes?.success) {
          setDailyData(dailyRes);
        } else {
          console.log('DAILY: No success flag');
        }
      } catch (e) {
        console.log('DAILY Error:', e.response?.data || e.message);
      }

      // WEEKLY
      let weeklyRes = null;
      try {
        weeklyRes = await getWeeklyIncentives();
        console.log('WEEKLY Response:', JSON.stringify(weeklyRes, null, 2));
        if (weeklyRes?.data) {
          setWeeklyData(weeklyRes);
        }
      } catch (e) {
        console.log('WEEKLY Error:', e.response?.data || e.message);
      }

    } catch (error) {
      console.log("GENERAL ERROR:", error);
      Alert.alert("Error", "Failed to load incentives");
    } finally {
      setLoading(false);
    }
  };

  if(!peakData?.data[0] || !dailyData?.data[0] || !weeklyData?.data[0]){
    return(
      <View>
        <Text>Please come again later.</Text>
      </View>
    )
  }

  /* ================= NAVIGATION HANDLERS ================= */
  const navigateToPeakHour = () => {
    if (!peakData) {
      Alert.alert("No Data", "Peak hour data is not available");
      return;
    }
    navigation.navigate("PeakHourBonusScreen", {
      peak_data: peakData,
      peakIncentivesProgress
    });
  };

  const navigateToDaily = () => {
    if (!dailyData) {
      Alert.alert("No Data", "Daily incentive data is not available");
      return;
    }
    navigation.navigate("DailyGuarentee", {
      daily_data: dailyData,
      dailyIncentivesProgress
    });
  };

  const navigateToWeekly = () => {
    if (!weeklyData) {
      Alert.alert("No Data", "Weekly incentive data is not available");
      return;
    }
    navigation.navigate("WeekEarnings", {
      weekly_data: weeklyData,
      weeklyIncentivesProgress
    });
  };

  console.log("📊 Current Data State:", {
    peak: peakData ? "✅" : "❌",
    daily: dailyData ? "✅" : "❌",
    weekly: weeklyData ? "✅" : "❌"
  });

  /* ================= RENDER ================= */
  if (loading) {
    return (
      <View style={styles.container}>
        {/* HEADER EVEN DURING LOADING */}
        <LinearGradient
          colors={["#6366F1", "#4F46E5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Incentive Details</Text>
          <View style={{ width: 24 }} />
        </LinearGradient>

        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading incentives...</Text>
        </View>
      </View>
    );
  }

  // Calculate progress for each incentive
  const dailyProgress = dailyData
    ? Math.min(
      (dailyCompletedOrders /
        dailyMinimumOrders) *
      100,
      100
    )
    : 0;

  const peakProgress = peakData?.completedOrders
    ? Math.min(
      (peakData.completedOrders / (peakData.slabs?.[0]?.orders || 1)) * 100,
      100
    )
    : 0;

  const weeklyProgress = weeklyData
    ? Math.min(
      (weeklyCompletedOrders /
        weeklyMinimumOrders) *
      100,
      100
    )
    : 0;

  return (
    <View style={styles.container}>
      {/* PURPLE GRADIENT HEADER */}
      <LinearGradient
        colors={["#6366F1", "#4F46E5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Incentive Details</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* TODAY'S TARGET - DAILY INCENTIVE */}
        {dailyData ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={navigateToDaily}
            style={styles.todayCard}
          >
            <LinearGradient
              colors={["#14B8C4", "#0E929D"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.todayGradient}
            >
              <Text style={styles.todayTitle}>Today's Target</Text>
              <Text style={styles.todayAmount}>
                ₹{dailyRewardEarned}
              </Text>

              {/* Progress Bar */}
              <View style={styles.todayProgressContainer}>
                <View style={styles.todayTrack}>
                  <View
                    style={[styles.todayFill, { width: `${dailyProgress}%` }]}
                  />
                </View>
              </View>

              <Text style={styles.todayText}>
                {dailyCompletedOrders} of{" "}
                {dailyMinimumOrders}{" "}
                orders completed
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={40} color="#CCC" />
            <Text style={styles.emptyCardText}>No daily target available</Text>
          </View>
        )}

        {/* SECTION HEADER */}
        <View style={styles.sectionHeader}>
          <Ionicons name="gift-outline" size={22} color="#6366F1" />
          <Text style={styles.sectionTitle}>Available Incentives</Text>
        </View>

        {/* DAILY INCENTIVE CARD */}
        {dailyData ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={navigateToDaily}
            style={styles.incentiveCard}
          >
            <View style={styles.cardRow}>
              <View style={styles.cardLeft}>
                <View
                  style={[styles.iconCircle, { backgroundColor: "#F5F3FF" }]}
                >
                  <Ionicons name="checkmark-done" size={20} color="#6366F1" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{dailyData.data[0].name}</Text>
                  {/* <Text style={styles.cardSubtitle}>
                    {dailyData.eligible
                      ? "Target achieved"
                      : "Daily target in progress"}
                  </Text> */}
                </View>
              </View>
              <Text style={styles.cardReward}>
                ₹{dailyData.totalRewardAmount || 0}
              </Text>
            </View>

            <View style={styles.progressContainer}>
              <LinearGradient
                colors={["#6366F1", "#4F46E5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${dailyProgress}%` }]}
              />
            </View>

            <Text style={styles.progressText}>
              {Math.round(dailyProgress)}% completed
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.incentiveCardEmpty}>
            <Ionicons name="checkmark-done" size={24} color="#DDD" />
            <Text style={styles.emptyText}>Daily incentive not available</Text>
          </View>
        )}

        {/* PEAK HOUR INCENTIVE CARD */}
        {peakData ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={navigateToPeakHour}
            style={styles.incentiveCard}
          >
            <View style={styles.cardRow}>
              <View style={styles.cardLeft}>
                <View
                  style={[styles.iconCircle, { backgroundColor: "#FFF7ED" }]}
                >
                  <Ionicons name="flash" size={20} color="#FF9500" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>
                    {peakData.data[0].name || ""}
                  </Text>
                  {/* <Text style={styles.cardSubtitle}>
                    Peak Slot: {peakData.slotRule || "N/A"}
                  </Text> */}
                </View>
              </View>
              <Text style={[styles.cardReward, { color: "#FF9500" }]}>
                ₹{peakRewardEarned}
              </Text>
            </View>

            <View style={styles.progressContainer}>
              <LinearGradient
                colors={["#FF9500", "#FF7A00"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${peakProgress}%` }]}
              />
            </View>

            <Text style={styles.progressText}>
              {peakData.completedOrders || 0} /{" "}
              {peakData.slabs?.[0]?.orders || 0} completed
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.incentiveCardEmpty}>
            <Ionicons name="flash" size={24} color="#DDD" />
            <Text style={styles.emptyText}>Peak hour bonus not available</Text>
          </View>
        )}

        {/* WEEKLY BONUS CARD */}
        {weeklyData ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={navigateToWeekly}
            style={styles.incentiveCard}
          >
            <View style={styles.cardRow}>
              <View style={styles.cardLeft}>
                <View
                  style={[styles.iconCircle, { backgroundColor: "#EFF6FF" }]}
                >
                  <Ionicons name="calendar" size={20} color="#3B82F6" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>
                    {weeklyData.data[0].name || ""}
                  </Text>
                  {/* <Text style={styles.cardSubtitle}>
                    {weeklyData.progress?.eligibleDays || 0}/
                    {weeklyData.progress?.totalDaysRequired || 7} days
                    completed
                  </Text> */}
                </View>
              </View>
              <Text style={[styles.cardReward, { color: "#3B82F6" }]}>
                ₹{weeklyRewardEarned}
              </Text>
            </View>

            <View style={styles.progressContainer}>
              <LinearGradient
                colors={["#3B82F6", "#2563EB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${weeklyProgress}%` }]}
              />
            </View>

            <Text style={styles.progressText}>
              {Math.round(weeklyProgress)}% completed
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.incentiveCardEmpty}>
            <Ionicons name="calendar" size={24} color="#DDD" />
            <Text style={styles.emptyText}>Weekly bonus not available</Text>
          </View>
        )}

        {/* All Empty State */}
        {!dailyData && !peakData && !weeklyData && (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="gift-outline" size={60} color="#CCC" />
            <Text style={styles.emptyStateTitle}>
              No Incentives Available
            </Text>
            <Text style={styles.emptyStateText}>
              Check back later for new incentive opportunities
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  /* Header */
  headerGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    paddingTop: hp(3),
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: wp(5.5),
    fontWeight: "700",
    color: "#FFF",
  },

  /* Loading */
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: hp(2),
    fontSize: wp(4),
    color: "#666",
  },

  scrollView: {
    flex: 1,
  },

  /* Today's Target Card */
  todayCard: {
    margin: wp(5),
    marginBottom: hp(2),
    borderRadius: wp(4),
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  todayGradient: {
    padding: wp(5),
  },
  todayTitle: {
    color: "#FFF",
    fontSize: wp(4),
    fontWeight: "600",
  },
  todayAmount: {
    color: "#FFF",
    fontSize: wp(8),
    fontWeight: "700",
    marginVertical: hp(1),
  },
  todayProgressContainer: {
    marginVertical: hp(1.5),
  },
  todayTrack: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 10,
    overflow: "hidden",
  },
  todayFill: {
    height: "100%",
    backgroundColor: "#FFF",
    borderRadius: 10,
  },
  todayText: {
    color: "#E6FFFF",
    fontSize: wp(3.5),
    marginTop: hp(0.5),
  },

  /* Empty Card */
  emptyCard: {
    margin: wp(5),
    marginBottom: hp(2),
    padding: wp(8),
    borderRadius: wp(4),
    backgroundColor: "#FFF",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  emptyCardText: {
    marginTop: hp(1),
    fontSize: wp(3.5),
    color: "#999",
  },

  /* Section Header */
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: wp(5),
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: wp(4.5),
    fontWeight: "700",
    color: "#000",
  },

  /* Incentive Cards */
  incentiveCard: {
    backgroundColor: "#FFF",
    borderRadius: wp(4),
    padding: wp(4),
    marginHorizontal: wp(5),
    marginBottom: hp(2),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: wp(4),
    fontWeight: "600",
    color: "#000",
  },
  cardSubtitle: {
    fontSize: wp(3.2),
    color: "#666",
    marginTop: 2,
  },
  cardReward: {
    fontSize: wp(4.5),
    fontWeight: "700",
    color: "#6366F1",
  },

  /* Progress */
  progressContainer: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: hp(0.8),
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
  },
  progressText: {
    fontSize: wp(3),
    color: "#6B7280",
  },

  /* Empty Card State */
  incentiveCardEmpty: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: wp(4),
    padding: wp(4),
    marginHorizontal: wp(5),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  emptyText: {
    fontSize: wp(3.5),
    color: "#999",
  },

  /* All Empty State */
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(10),
  },
  emptyStateTitle: {
    marginTop: hp(2),
    fontSize: wp(5),
    fontWeight: "600",
    color: "#666",
  },
  emptyStateText: {
    marginTop: hp(1),
    fontSize: wp(3.5),
    color: "#999",
    textAlign: "center",
  },
});
