// import React from "react";
// import { View, Text, StyleSheet, ScrollView } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// const incentiveData = {
//   todayTarget: {
//     amount: 200,
//     completedOrders: 12,
//     totalOrders: 15,
//   },
//   incentives: [
//     {
//       id: 1,
//       title: "Complete 15 Orders",
//       reward: 200,
//       completed: 12,
//       total: 15,
//     },
//     {
//       id: 2,
//       title: "5 Peak Hour Deliveries",
//       reward: 150,
//       completed: 3,
//       total: 5,
//     },
//     {
//       id: 3,
//       title: "Weekend Bonus",
//       reward: 300,
//       completed: 8,
//       total: 20,
//     },
//   ],
// };

// export default function IncentiveDetails() {
//   const { todayTarget, incentives } = incentiveData;
//   const todayProgress =
//     (todayTarget.completedOrders / todayTarget.totalOrders) * 100;

//   return (
//     <ScrollView style={styles.container}>
//       {/* Today's Target */}
//       <View style={styles.targetCard}>
//         <Text style={styles.targetTitle}>Today's Target</Text>
//         <Text style={styles.targetAmount}>₹{todayTarget.amount}</Text>

//         <ProgressBar progress={todayProgress} />

//         <Text style={styles.targetText}>
//           {todayTarget.completedOrders} of {todayTarget.totalOrders} orders
//           completed
//         </Text>
//       </View>

//       {/* Available Incentives */}
//       <View style={styles.sectionHeader}>
//           <Ionicons name="gift-outline" size={20} color="#000" />
//           <Text style={styles.sectionTitle}>Available Incentives</Text>
//     </View>
      

//       {incentives.map((item) => {
//         const progress = (item.completed / item.total) * 100;
//         return (
//           <View key={item.id} style={styles.incentiveCard}>
//             <View style={styles.row}>
//               <Text style={styles.incentiveTitle}>{item.title}</Text>
//               <Text style={styles.reward}>₹{item.reward}</Text>
//             </View>

//             <ProgressBar progress={progress} />

//             <Text style={styles.progressText}>
//               {item.completed}/{item.total} completed
//             </Text>
//           </View>
//         );
//       })}
//     </ScrollView>
//   );
// }

// /* Reusable Progress Bar */
// const ProgressBar = ({ progress }) => (
//   <View style={styles.progressContainer}>
//     <View style={[styles.progressFill, { width: `${progress}%` }]} />
//   </View>
// );

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8F8F8",
//     padding: 16,
//   },
//   targetCard: {
//     backgroundColor: "#14B8C4",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 20,
//   },
//   targetTitle: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   targetAmount: {
//     color: "#fff",
//     fontSize: 28,
//     fontWeight: "700",
//     marginVertical: 6,
//   },
//   targetText: {
//     color: "#E6FFFF",
//     marginTop: 8,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//     gap: 6,
//   },

//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     marginBottom: 12,
//   },
//   incentiveCard: {
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     padding: 14,
//     marginBottom: 14,
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   incentiveTitle: {
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   reward: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#14B8C4",
//   },
//   progressContainer: {
//     height: 6,
//     backgroundColor: "#E5E7EB",
//     borderRadius: 10,
//     overflow: "hidden",
//   },
//   progressFill: {
//     height: "100%",
//     backgroundColor: "#14B8C4",
//   },
//   progressText: {
//     fontSize: 12,
//     color: "#6B7280",
//     marginTop: 6,
//   },
// });
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import WEBSITE_URL from "../../utils/host";


export default function IncentiveDetails() {
  const [loading, setLoading] = useState(true);
  const [todayTarget, setTodayTarget] = useState(null);
  const [incentives, setIncentives] = useState([]);

  useEffect(() => {
    fetchIncentives();
  }, []);

  /* ================= FETCH DAILY + WEEKLY ================= */
  const fetchIncentives = async () => {
    try {
      setLoading(true);

      const [weeklyRes, dailyRes] = await Promise.all([
        axios.get(`${WEBSITE_URL}/api/home/incentives/weekly-earning`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyaWRlcklkIjoiNjk1NGFlYzlkMTVkZmM4YTRmMTY4MmI1IiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTc2NzE4NzM1OH0.DEkBrz0Dp3OsDJ-ULm5ChaOalhyj43csH8moG1kBwhs}`,
          },
        }),
        axios.get(`${WEBSITE_URL}/api/home/incentives/daily-earning`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          
          },
        }),
      ]);

      if (weeklyRes.data?.success && dailyRes.data?.success) {
        mapIncentives(weeklyRes.data.data, dailyRes.data.data);
      } else {
        Alert.alert("Error", "Invalid incentive response");
      }
    } catch (error) {
      console.log("INCENTIVE ERROR:", error?.response || error);
      Alert.alert("Error", "Failed to load incentives");
    } finally {
      setLoading(false);
    }
  };

  /* ================= MAP RESPONSE ================= */
  const mapIncentives = (weekly, daily) => {
    setTodayTarget({
      amount: daily.maxRewardPerRider,
      completedOrders: daily.completedOrders,
      totalOrders: daily.requiredOrders,
    });

    setIncentives([
      {
        id: 1,
        title: daily.title,
        reward: daily.maxRewardPerRider,
        completed: daily.completedOrders,
        total: daily.requiredOrders,
      },
      {
        id: 2,
        title: "Peak Hour Deliveries",
        reward: 100,
        completed: 3,
        total: 5,
      },
      {
        id: 3,
        title: weekly.title,
        reward: weekly.maxRewardPerRider,
        completed: weekly.completedOrders,
        total: weekly.requiredOrders ,
      },
      
    ]);
  };

  if (loading || !todayTarget) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#14B8C4" />
      </View>
    );
  }

  const todayProgress = Math.min(
    (todayTarget.completedOrders / todayTarget.totalOrders) * 100,
    100
  );

  return (
    <ScrollView style={styles.container}>
      {/* Today's Target */}
      <View style={styles.targetCard}>
        <Text style={styles.targetTitle}>Today's Earnings</Text>
        <Text style={styles.targetAmount}>₹{todayTarget.amount}</Text>
        <Text>loading</Text>

        <ProgressBar progress={todayProgress} />

        <Text style={styles.targetText}>
          {todayTarget.completedOrders} of {todayTarget.totalOrders} orders
          completed
        </Text>
      </View>

      {/* Incentives */}
      <View style={styles.sectionHeader}>
        <Ionicons name="gift-outline" size={20} />
        <Text style={styles.sectionTitle}>Available Incentives</Text>
      </View>

      {incentives.map((item) => {
        const progress = Math.min(
          (item.completed / item.total) * 100,
          100
        );

        return (
          <View key={item.id} style={styles.incentiveCard}>
            <View style={styles.row}>
              <Text style={styles.incentiveTitle}>{item.title}</Text>
              <Text style={styles.reward}>₹{item.reward}</Text>
            </View>

            <ProgressBar progress={progress} />

            <Text style={styles.progressText}>
              {item.completed}/{item.total} completed
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

/* ================= PROGRESS BAR ================= */
const ProgressBar = ({ progress }) => (
  <View style={styles.progressContainer}>
    <View style={[styles.progressFill, { width: `${progress}%` }]} />
  </View>
);

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  targetCard: {
    backgroundColor: "#0CBACE",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  targetTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  targetAmount: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginVertical: 6,
  },
  targetText: {
    color: "#E6FFFF",
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  incentiveCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  incentiveTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  reward: {
    fontSize: 14,
    fontWeight: "700",
    color: "#14B8C4",
  },
  progressContainer: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#14B8C4",
  },
  progressText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
  },
});
