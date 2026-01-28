import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";


const DailyGuarentee = ({ route, navigation }) => {
  const data = route.params || {};

  /* ---------------- DERIVED DATA ---------------- */
  const completed = data.completedOrders || 0;
  const total = data.totalOrders || data.requiredOrders || 1;
  const progress = Math.min((completed / total) * 100, 100);
  const rewardValue = data.rewardValue || data.value || 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <Text style={styles.title}>
        {data?.title || "Daily Guarentee"}
      </Text>
      <Text style={styles.subTitle}>
        {data?.description || "Earn More During Busy Times"}
      </Text>

      {/* TIME CARD */}
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>⏰</Text>
        </View>

        <View>
          <Text style={styles.cardTitle}>
            {data?.timeWindow || "10:00 PM – 8:00 PM (Today)"}
          </Text>
          <Text style={styles.cardSubText}>
            Active only during busy hours.
          </Text>
        </View>
      </View>

      {/* BONUS CARD */}
      <View style={styles.card}>
        <View style={[styles.iconCircle, { backgroundColor: "#2563EB" }]}>
          <Text style={styles.icon}>🎯</Text>
        </View>

        <View>
          <Text style={styles.cardTitle}>
            Complete {total} orders and earn extra ₹{rewardValue}
          </Text>
          <Text style={styles.cardSubText}>
            Bonus credited instantly after completing your
            target during the active time window.
          </Text>
        </View>
      </View>

      {/* PROGRESS */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Your Progress</Text>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  data?.status === "ACTIVE" ? "#D1FAE5" : "#FEE2E2",
              },
            ]}
          >
            <Text
              style={{
                color:
                  data?.status === "ACTIVE" ? "#065F46" : "#991B1B",
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {data?.status === "ACTIVE" ? "On Track" : "Inactive"}
            </Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progress}%` }]}
          />
        </View>

        <Text style={styles.progressText}>
          {completed} / {total} orders completed
        </Text>
      </View>

      {/* EARNING CTA */}
      <LinearGradient
        colors={["#FFC107", "#FF7A00"]}
        style={styles.earnBtn}
      >
        <Text style={styles.earnText}>
          Earn up to ₹{data?.maxRewardPerRider || 1500} today!
        </Text>
      </LinearGradient>

      {/* ELIGIBLE AREAS */}
      <View style={styles.cardColumn}>
        <Text style={styles.cardTitle}>Eligible Areas</Text>
        <View style={styles.mapPlaceholder} />
        <Text style={styles.cardSubText}>
          {data?.eligibleAreas?.join(", ") ||
            "Koramangala, Indiranagar, Whitefield"}
        </Text>
      </View>

      {/* START BUTTON */}
      <TouchableOpacity
        disabled={data?.status !== "ACTIVE"}
        style={[
          styles.startBtn,
          { opacity: data?.status === "ACTIVE" ? 1 : 0.5 },
        ]}
      >
        <Text style={styles.startText}>Start Earning Bonus →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DailyGuarentee;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9D8FD",
    padding: wp("4%"),
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: wp("6.5%"),
    fontWeight: "800",
    textAlign: "center",
  },

  subTitle: {
    fontSize: wp("3.5%"),
    textAlign: "center",
    color: "#555",
    marginBottom: hp("2.5%"),
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: wp("4.5%"),
    padding: wp("4%"),
    marginBottom: hp("2%"),
    flexDirection: "row",
    alignItems: "center",
  },

  cardColumn: {
    backgroundColor: "#FFF",
    borderRadius: wp("4.5%"),
    padding: wp("4%"),
    marginBottom: hp("2%"),
  },

  iconCircle: {
    width: wp("11%"),
    height: wp("11%"),
    borderRadius: wp("5.5%"),
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp("3%"),
  },

  icon: {
    fontSize: wp("4.5%"),
    color: "#FFF",
  },

  cardTitle: {
    fontSize: wp("4%"),
    fontWeight: "600",
    marginBottom: hp("0.5%"),
  },

  cardSubText: {
    fontSize: wp("3.2%"),
    color: "#6B7280",
  },

  progressCard: {
    backgroundColor: "#FFF",
    borderRadius: wp("4.5%"),
    padding: wp("4%"),
    marginBottom: hp("2%"),
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp("1.5%"),
    alignItems: "center",
  },

  progressTitle: {
    fontSize: wp("4%"),
    fontWeight: "600",
  },

  statusBadge: {
    paddingHorizontal: wp("2.5%"),
    paddingVertical: hp("0.5%"),
    borderRadius: wp("3%"),
  },

  progressBar: {
    height: hp("1%"),
    backgroundColor: "#E5E7EB",
    borderRadius: wp("2%"),
    overflow: "hidden",
    marginBottom: hp("0.5%"),
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#2563EB",
  },

  progressText: {
    fontSize: wp("3%"),
    color: "#6B7280",
  },

  earnBtn: {
    borderRadius: wp("7%"),
    paddingVertical: hp("1.8%"),
    alignItems: "center",
    marginBottom: hp("2%"),
  },

  earnText: {
    color: "#FFF",
    fontSize: wp("4%"),
    fontWeight: "700",
  },

  mapPlaceholder: {
    height: hp("15%"),
    backgroundColor: "#E0F2FE",
    borderRadius: wp("3%"),
    marginVertical: hp("1%"),
  },

  startBtn: {
    backgroundColor: "#FFF",
    paddingVertical: hp("1.8%"),
    borderRadius: wp("8%"),
    alignItems: "center",
    marginBottom: hp("5%"),
  },

  startText: {
    color: "#0EA5E9",
    fontSize: wp("4%"),
    fontWeight: "700",
  },
});