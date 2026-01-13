import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import apiClient from "../../services/ApiClient";
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";

const RewardsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [peakHours, setPeakHours] = useState([]);
  const [daily, setDaily] = useState(null);
  const [weekly, setWeekly] = useState(null);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const [peakRes, dailyRes, weeklyRes] = await Promise.all([
        apiClient.get(`/api/home/peakhours-incentives`),
        apiClient.get(`/api/home/incentives/daily-earning`, ),
        apiClient.get(`/api/home/incentives/weekly-earning`,),
      ]);

      setPeakHours(peakRes.data?.incentives || []);
      setDaily(dailyRes.data?.data || null);
      setWeekly(weeklyRes.data?.data || null);
    } catch (e) {
      console.log("Rewards error", e?.response || e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00B2C9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={rf(2.6)} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Rewards</Text>

        <TouchableOpacity
          onPress={() => Alert.alert("Help", "Contact support for assistance")}
        >
          <Image
            source={require("../../assets/profile/HelpcenterIcon.png")}
            style={styles.robotIcon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PEAK HOURS */}
        {peakHours.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Peak Hours Incentives</Text>
            {peakHours.map((item, index) => {
              const progress = 0;
              const percent = (progress / item.condition.minOrders) * 100;

              return (
                <View key={`peak-${index}`} style={styles.card}>
                  <View style={styles.iconBox}>
                    <Ionicons
                      name="flash-outline"
                      size={rf(2.8)}
                      color="#00B2C9"
                    />
                  </View>

                  <View style={styles.content}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.points}>₹{item.rewardValue}</Text>
                    </View>

                   <Text style={styles.description}>{item.description}</Text>
                    <Text style={styles.meta}>
                      ⏰ {item.condition.startTime} – {item.condition.endTime}
                    </Text>
                    <Text style={styles.meta}>
                      Min Orders: {item.condition.minOrders}
                    </Text>
                    <Text style={styles.meta}>
                      Max Reward: ₹{item.maxRewardPerRider}
                    </Text>

                    <Text style={styles.progressText}>
                      Progress {progress}/{item.condition.minOrders}
                    </Text>

                    <View style={styles.progressBar}>
                      <View
                        style={[styles.progressFill, { width: `${percent}%` }]}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </>
        )}

        {/* DAILY INCENTIVE */}
        {daily && (
          <>
            <Text style={styles.sectionTitle}>Daily Incentive</Text>
            <View style={styles.card}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="calendar-outline"
                  size={rf(2.8)}
                  color="#12B76A"
                />
              </View>

              <View style={styles.content}>
                <View style={styles.rowBetween}>
                  <Text style={styles.title}>{daily.title}</Text>
                  <Text style={styles.points}>₹{daily.maxRewardPerRider}</Text>
                </View>

                <Text style={styles.meta}>Date: {daily.date}</Text>

                <Text style={styles.progressText}>
                  Progress {daily.completedOrders}/{daily.requiredOrders}
                </Text>

                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${(daily.completedOrders / daily.requiredOrders) * 100
                          }%`,
                        backgroundColor: "#12B76A",
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          </>
        )}

        {/* WEEKLY INCENTIVE */}
        {weekly && (
          <>
            <Text style={styles.sectionTitle}>Weekly Incentive</Text>
            <View style={styles.card}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="trophy-outline"
                  size={rf(2.8)}
                  color="#F79009"
                />
              </View>

              <View style={styles.content}>
                <View style={styles.rowBetween}>
                  <Text style={styles.title}>{weekly.title}</Text>
                  <Text style={styles.points}>₹{weekly.maxRewardPerRider}</Text>
                </View>

                <Text style={styles.meta}>
                  {weekly.weekStart} – {weekly.weekEnd}
                </Text>

                <Text style={styles.progressText}>
                  Progress {weekly.completedOrders}/{weekly.requiredOrders}
                </Text>

                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${(weekly.completedOrders / weekly.requiredOrders) * 100
                          }%`,
                        backgroundColor: "#F79009",
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          </>
        )}

        <View style={{ height: rh(4) }} />
      </ScrollView>
    </View>
  );
};

export default RewardsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: rw(4),
    paddingVertical: rh(2.2),
    backgroundColor: "#FFFFFF",
    elevation: 3,
  },

  headerTitle: {
    fontSize: rf(2.3),
    fontWeight: "700",
    color: "#101828",
  },

  robotIcon: {
    width: rw(7.5),
    height: rw(7.5),
    resizeMode: "contain",
  },

  sectionTitle: {
    fontSize: rf(2.5),
    fontWeight: "700",
    marginHorizontal: rw(4),
    marginTop: rh(2),
    marginBottom: rh(1),
    color: "#101828",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: rw(4),
    flexDirection: "row",
    padding: rw(5),
    marginHorizontal: rw(4),
    marginBottom: rh(2.2),
    elevation: 2,
    minHeight: rh(12), // slightly increased height
  },

  iconBox: {
    width: rw(14),
    height: rw(14),
    borderRadius: rw(3.5),
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: rw(3.2),
  },

  content: {
    flex: 1,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: rf(2.1),
    fontWeight: "600",
    color: "#101828",
  },

  points: {
    fontSize: rf(2),
    fontWeight: "700",
    color: "#00B2C9",
  },

  description: {
    fontSize: rf(1.8),
    color: "#667085",
    marginTop: rh(0.7),
  },

  meta: {
    fontSize: rf(1.7),
    color: "#475467",
    marginTop: rh(0.5),
  },

  progressText: {
    marginTop: rh(1.2),
    fontSize: rf(1.7),
    fontWeight: "500",
    color: "#344054",
  },

  progressBar: {
    height: rh(1.2),
    backgroundColor: "#E4E7EC",
    borderRadius: rw(2.5),
    marginTop: rh(0.7),
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#00B2C9",
  },
});
