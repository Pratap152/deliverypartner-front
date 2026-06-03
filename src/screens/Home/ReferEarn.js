// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   FlatList,
//   Alert,
//   Share,
//   ActivityIndicator,
//   RefreshControl,
// } from "react-native";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import DeviceInfo from "react-native-device-info";
// import {
//   responsiveFontSize as rf,
//   responsiveHeight as rh,
//   responsiveWidth as rw,
// } from "react-native-responsive-dimensions";

// const isTablet = DeviceInfo.isTablet();
// import Ionicons from "react-native-vector-icons/Ionicons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import Clipboard from "@react-native-clipboard/clipboard";

// import ReferralBanner from "../Home/ReferralBanner";
// import apiClient from "../../services/ApiClient";

// export default function ReferEarn({ navigation }) {
//   const [data, setData] = useState(null);
//   const [tab, setTab] = useState("ALL");
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     fetchReferrals();
//   }, []);

//   const fetchReferrals = async () => {
//     try {
//       setLoading(true);

//       const res = await apiClient.get("/api/refer/rider/all/referrals");

//       if (res?.data?.success) {
//        const apiData = res.data?.data || res.data;
//   setData(apiData);
//       }
//     } catch (error) {
//       console.log(
//         "Referral API error:",
//         error?.response?.data || error.message
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await fetchReferrals();
//     setRefreshing(false);
//   }, []);

//   // 🔹 Loader
//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#1E3A8A" />
//       </View>
//     );
//   }

//  if (!data || Object.keys(data).length === 0) {
//   return (
//     <View style={styles.emptyContainer}>
//       <Ionicons name="people-outline" size={70} color="#CBD5E1" />

//       <Text style={styles.emptyTitle}>
//         No Referral Data
//       </Text>

//       <Text style={styles.emptySubtitle}>
//         Start inviting friends and earn rewards.
//       </Text>

//       <TouchableOpacity
//         style={styles.emptyButton}
//         onPress={() => navigation.navigate("ReferFrd")}
//       >
//         <Text style={styles.emptyButtonText}>
//           Refer Now
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

//   const referralCode = data?.referrer?.partnerId || "";
//   const ruleType = data?.program?.ruleType || "";

//   const copyToClipboard = () => {
//     Clipboard.setString(referralCode);
//     Alert.alert("Copied!", "Referral code copied");
//   };

//   const shareReferralCode = async () => {
//   try {
//     const res = await apiClient.post("/api/refer/share", {
//       partnerId: referralCode,
//     });

//     if (res?.data?.success) {
//       const shareData = res.data.data;

//       // use backend message
//       await Share.share({
//         message: shareData.shareMessage,
//         url: shareData.shareLink, // iOS uses this
//       });
//     } else {
//       throw new Error("Invalid response");
//     }

//   } catch (err) {
//     console.log("Share error:", err?.response?.data || err.message);

//     // fallback
//     await Share.share({
//       message: `Join using my referral code: ${referralCode}`,
//     });
//   }
// };
//   // 🔹 Filter logic
//   const riders = data?.referredRiders || [];

// const filteredData = riders.filter((item) => {
//   if (tab === "PENDING") return item.targetStatus !== "TARGET_REACHED";
//   if (tab === "COMPLETED") return item.targetStatus === "TARGET_REACHED";
//   return true;
// });


// const getProgramContent = () => {
//   switch (ruleType) {
//     case "FIXED_TARGET":
//       return {
//         title: "Fixed Target Referral",
//         task: `Complete ${riders?.[0]?.targetOrders || 0} deliveries`,
//         reward: "Earn reward after target completion",
//       };

//     case "SLAB":
//       return {
//         title: "Slab Based Referral",
//         task: `Complete ${riders?.[0]?.targetOrders || 0} delivery`,
//         reward: "Earn slab-wise rewards",
//       };

//     case "PER_ORDER":
//       return {
//         title: "Per Order Referral",
//         task: "Earn for every completed order",
//         reward: "Per order reward applied",
//       };

//     case "HYBRID":
//       return {
//         title: "Hybrid Referral",
//         task: `Complete ${riders?.[0]?.targetOrders || 0} deliveries + per order earnings`,
//         reward: "Hybrid rewards enabled",
//       };

//     case "TASK":
//   return {
//     title: "Task Based Referral",
//     task: "Complete daily tasks to unlock rewards",
//     reward: "Rewards are based on completed task days",
//   };

//     default:
//       return {
//         title: "Refer & Earn",
//         task: "Complete deliveries",
//         reward: "Earn rewards",
//       };
//   }
// };


// const programContent = getProgramContent();

//   // 🔹 Empty UI
//   const renderEmpty = () => (
//   <View style={styles.listEmptyContainer}>
//     <Ionicons
//       name="gift-outline"
//       size={55}
//       color="#CBD5E1"
//     />

//     <Text style={styles.emptyTitle}>
//       {tab === "PENDING"
//         ? "No Pending Referrals"
//         : tab === "COMPLETED"
//         ? "No Completed Referrals"
//         : "No Referrals Yet"}
//     </Text>

//     <Text style={styles.emptySubtitle}>
//       Invite your friends and start earning rewards.
//     </Text>
//   </View>
// );
//   const renderItem = ({ item }) => {
//   const isTaskType = ruleType === "TASK";

//   // OLD TYPES
//   const isCompleted = item.targetStatus === "TARGET_REACHED";
//   const isPerOrder = ruleType === "PER_ORDER";

//   // TASK TYPE VALUES
//   const completedDays = item?.overallProgress?.completedDays || 0;
//   const totalDays = item?.overallProgress?.totalDays || 0;

//   const earnedAmount =
//     item?.overallProgress?.earnedAmount ||
//     item?.rewardEarned ||
//     0;

//   const progressPercentage =
//     item?.overallProgress?.progressPercentage || 0;

//   return (
//     <View style={styles.refItem}>
//       {/* LEFT */}
//       <View style={styles.leftRow}>
//         <View style={styles.avatar}>
//           <Ionicons name="person" size={18} color="#fff" />
//         </View>

//         <View style={{ flex: 1 }}>
//           <Text style={styles.name}>
//             {item.newRiderName || "New Rider"}
//           </Text>

//           <Text style={styles.date}>
//             {item.referredAtIST}
//           </Text>

//           {/* TASK TYPE EXTRA UI */}
//           {isTaskType && (
//             <Text style={styles.taskProgress}>
//               {completedDays}/{totalDays} Days Completed
//             </Text>
//           )}
//         </View>
//       </View>

//       {/* RIGHT */}
//       <View style={{ alignItems: "flex-end" }}>

//         {/* TASK TYPE */}
//         {isTaskType ? (
//           <>
//             <Text style={styles.amount}>
//               ₹{earnedAmount}
//             </Text>

//             <Text style={styles.progressPercent}>
//               {progressPercentage}% Progress
//             </Text>
//           </>
//         ) : isPerOrder ? (
//           <Text style={styles.amount}>
//             ₹{item.rewardEarned}
//           </Text>
//         ) : isCompleted ? (
//           <Text style={styles.amount}>
//             ₹{item.rewardEarned}
//           </Text>
//         ) : (
//           <Text style={styles.progress}>
//             {item.ordersCompleted}/{item.targetOrders}
//           </Text>
//         )}

//         <Text
//           style={[
//             styles.status,
//             {
//               color:
//                 item.targetStatus === "TARGET_REACHED"
//                   ? "#16A34A"
//                   : "#F59E0B",
//             },
//           ]}
//         >
//           {item.targetStatus === "TARGET_REACHED"
//             ? "Completed"
//             : "Pending"}
//         </Text>
//       </View>
//     </View>
//   );
// };

//  return (
//   <View style={{ flex: 1 }}>
//     <View style={styles.fixedTopBanner}>
//       <ReferralBanner />
//     </View>
    
//     {/* SCROLLABLE CONTENT */}
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={{
//   paddingTop: hp("32%"),
//   paddingBottom: 100,
// }} 
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//       }
//     >

//       {/* Title */}
//       <View style={styles.titleRow}>
//         <View style={styles.line} />
//         <Text style={styles.title}>Refer & Earn</Text>
//         <View style={styles.line} />
//       </View>

//       {/* Cards */}
//       <View style={styles.cardRow}>
//         <View style={[styles.card, styles.greenCard]}>
//           <Ionicons name="people" size={22} color="#166534" />
//           <Text style={styles.cardValue1}>
//             {data.summary.totalRidersOnboarded}
//           </Text>
//           <Text style={styles.cardLabel1}>Joined people</Text>
//         </View>

//         <View style={[styles.card, styles.orangeCard]}>
//           <Ionicons name="wallet" size={22} color="#9A3412" />
//           <Text style={styles.cardValue2}>
//             ₹{data.summary.totalEarnings}
//           </Text>
//           <Text style={styles.cardLabel2}>Total Earnings</Text>
//         </View>
//       </View>

//       {/* Referral Code */}
//       <View style={styles.codeBox}>
//         <Text style={styles.codeText}>{referralCode}</Text>

//         <View style={styles.iconRow}>
//           <TouchableOpacity onPress={copyToClipboard}>
//             <MaterialIcons name="content-copy" size={22} />
//           </TouchableOpacity>

//           <TouchableOpacity onPress={shareReferralCode}>
//             <MaterialIcons name="share" size={22} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* How it works */}
//       <View style={styles.howBox}>
//   <Text style={styles.howTitle}>
//     {programContent.title}
//   </Text>

//   <Text style={styles.howItem}>
//     • Friend signs up using your referral code
//   </Text>

//   <Text style={styles.howItem}>
//     • {programContent.task}
//   </Text>

//   <Text style={styles.howItem}>
//     • {programContent.reward}
//   </Text>
// </View>
//       {/* Tabs */}
//       <Text style={styles.sectionTitle}>My Referrals</Text>

//       <View style={styles.tabs}>
//         {["ALL", "PENDING", "COMPLETED"].map((t) => (
//           <TouchableOpacity
//             key={t}
//             onPress={() => setTab(t)}
//             style={[styles.tab, tab === t && styles.activeTab]}
//           >
//             <Text style={tab === t && { color: "#f3f0f0" }}>{t}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <FlatList
//         data={filteredData}
//         keyExtractor={(item) => item.newRiderId}
//         renderItem={renderItem}
//         ListEmptyComponent={renderEmpty}
//         scrollEnabled={false}
//       />
//     </ScrollView>

//     <View style={styles.fixedButtonContainer}>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => navigation.navigate("ReferFrd")}
//       >
//         <Text style={styles.buttonText}>Refer Now</Text>
//       </TouchableOpacity>
//     </View>

//   </View>
// );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//   },

//   fixedTopBanner: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 10,
//     backgroundColor: "#F8FAFC",
//   },

//   loader: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   titleRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: isTablet ? rh(2) : 15,
//     paddingHorizontal: 16,
//   },

//   line: {
//     flex: 1,
//     height: 1,
//     backgroundColor: "#E2E8F0",
//   },

//   title: {
//     marginHorizontal: 10,
//     fontWeight: "700",

//     fontSize: isTablet ? rf(1.6) : 16,

//     color: "#1E293B",
//   },

//   cardRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     marginTop: 5,
//   },

//   card: {
//     width: "48%",
//     padding: isTablet ? rw(2.5) : 16,

//     borderRadius: 16,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 10,
//     elevation: 4,
//   },

//   greenCard: {
//     backgroundColor: "#DCFCE7",
//   },

//   orangeCard: {
//     backgroundColor: "#FFE4D5",
//   },

//   cardValue1: {
//     color: "#166534",

//     fontSize: isTablet ? rf(1.8) : 20,

//     fontWeight: "700",
//     marginTop: 6,
//   },

//   cardValue2: {
//     color: "#9A3412",

//     fontSize: isTablet ? rf(1.8) : 20,

//     fontWeight: "700",
//     marginTop: 6,
//   },

//   cardLabel1: {
//     color: "#166534",

//     fontSize: isTablet ? rf(1.1) : 12,

//     marginTop: 4,
//   },

//   cardLabel2: {
//     color: "#9A3412",

//     fontSize: isTablet ? rf(1.1) : 12,

//     marginTop: 4,
//   },

//   codeBox: {
//     margin: 16,

//     padding: isTablet ? rw(2) : 14,

//     borderRadius: 14,
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",

//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",

//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     elevation: 2,
//   },

//   codeText: {
//     fontWeight: "700",

//     fontSize: isTablet ? rf(1.5) : 16,

//     letterSpacing: 1,
//     color: "#0F172A",
//   },

//   iconRow: {
//     flexDirection: "row",
//     gap: isTablet ? rw(2) : 16,
//   },

//   howBox: {
//     marginHorizontal: 16,
//     backgroundColor: "#fff",

//     padding: isTablet ? rw(2.2) : 14,

//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//   },

//   howTitle: {
//     fontWeight: "700",

//     marginBottom: 8,

//     fontSize: isTablet ? rf(1.3) : 16,

//     color: "#0F172A",
//   },

//   howItem: {
//     marginVertical: 3,
//     color: "#475569",

//     fontSize: isTablet ? rf(1.15) : 15,
//   },

//   howItem1: {
//     fontSize: isTablet ? rf(1.5) : 18,
//     fontWeight: "800",
//   },

//   sectionTitle: {
//     marginTop: 16,
//     marginHorizontal: 16,

//     fontWeight: "700",

//     fontSize: isTablet ? rf(1.4) : 15,

//     color: "#0F172A",
//   },

//   tabs: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginHorizontal: 16,
//     marginTop: 10,
//   },

//   tab: {
//     flex: 1,
//     marginHorizontal: 4,

//     paddingVertical: isTablet ? rh(1) : 8,

//     backgroundColor: "#E2E8F0",
//     borderRadius: 20,
//     alignItems: "center",
//   },

//   activeTab: {
//     backgroundColor: "#19A7CE",
//   },

//   emptyText: {
//     textAlign: "center",
//     marginTop: 20,

//     fontSize: isTablet ? rf(1.2) : 14,

//     color: "#94A3B8",
//   },

//   refItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",

//     marginHorizontal: 16,
//     marginTop: 10,

//     padding: isTablet ? rw(2.2) : 14,

//     borderRadius: 14,
//     backgroundColor: "#fff",

//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     elevation: 2,
//   },

//   leftRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },

//   avatar: {
//     width: isTablet ? rw(5) : 38,
//     height: isTablet ? rw(5) : 38,

//     borderRadius: 20,
//     backgroundColor: "#74c4da",

//     justifyContent: "center",
//     alignItems: "center",

//     marginRight: 10,
//   },

//   name: {
//     fontWeight: "600",

//     fontSize: isTablet ? rf(1.3) : 15,

//     color: "#0F172A",
//   },

//   date: {
//     fontSize: isTablet ? rf(1.15) : 14,

//     color: "#515863",
//     marginTop: 3,
//   },

//   amount: {
//     fontWeight: "700",

//     fontSize: isTablet ? rf(1.5) : 14,

//     color: "#16A34A",
//   },

//   progress: {
//     fontWeight: "700",

//     fontSize: isTablet ? rf(1.20) : 14,

//     color: "#F59E0B",
//   },

//   status: {
//     fontSize: isTablet ? rf(1.05) : 12,
//     marginTop: 2,
//   },

//   fixedButtonContainer: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,

//     backgroundColor: "#F8FAFC",

//     padding: isTablet ? rw(1.8) : 10,

//     borderTopWidth: 1,
//     borderColor: "#E2E8F0",
//   },

//   button: {
//     backgroundColor: "#19A7CE",

//     padding: isTablet ? rh(1.6) : 16,

//     borderRadius: 30,
//     alignItems: "center",

//     shadowColor: "#1E3A8A",
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 6,
//   },

//   buttonText: {
//     color: "#fff",
//     fontWeight: "700",

//     fontSize: isTablet ? rf(1.3) : 15,
//   },

//   taskProgress: {
//     fontSize: isTablet ? rf(1.07) : 13,
//     color: "#0284C7",
//     marginTop: 4,
//     fontWeight: "600",
//   },

//   progressPercent: {
//     fontSize: isTablet ? rf(1) : 12,
//     color: "#64748B",
//     marginTop: 4,
//   },
//   emptyContainer: {
//   flex: 1,
//   justifyContent: "center",
//   alignItems: "center",
//   backgroundColor: "#F8FAFC",
//   paddingHorizontal: 30,
// },

// emptyTitle: {
//   marginTop: 16,
//   fontSize: isTablet ? rf(1.8) : 20,
//   fontWeight: "700",
//   color: "#0F172A",
//   textAlign: "center",
// },

// emptySubtitle: {
//   marginTop: 8,
//   fontSize: isTablet ? rf(1.2) : 14,
//   color: "#64748B",
//   textAlign: "center",
//   lineHeight: 22,
// },

// emptyButton: {
//   marginTop: 24,
//   backgroundColor: "#19A7CE",
//   paddingVertical: 14,
//   paddingHorizontal: 32,
//   borderRadius: 30,
// },

// emptyButtonText: {
//   color: "#fff",
//   fontWeight: "700",
//   fontSize: isTablet ? rf(1.2) : 15,
// },

// listEmptyContainer: {
//   justifyContent: "center",
//   alignItems: "center",
//   paddingVertical: 40,
// },
// });
















import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  Share,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import DeviceInfo from "react-native-device-info";
import {
  responsiveFontSize as rf,
  responsiveHeight as rh,
  responsiveWidth as rw,
} from "react-native-responsive-dimensions";

const isTablet = DeviceInfo.isTablet();
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Clipboard from "@react-native-clipboard/clipboard";

import ReferralBanner from "../Home/ReferralBanner";
import apiClient from "../../services/ApiClient";

export default function ReferEarn({ navigation }) {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      setLoading(true);

      const res = await apiClient.get("/api/referral/referrer/list");

      if (res?.data?.success) {
       const apiData = res.data?.data || res.data;
  setData(apiData);
      }
    } catch (error) {
      console.log(
        "Referral API error:",
        error?.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchReferrals();
    setRefreshing(false);
  }, []);

  // 🔹 Loader
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

 if (!data || Object.keys(data).length === 0) {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={70} color="#CBD5E1" />

      <Text style={styles.emptyTitle}>
        No Referral Data
      </Text>

      <Text style={styles.emptySubtitle}>
        Start inviting friends and earn rewards.
      </Text>

      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate("ReferFrd")}
      >
        <Text style={styles.emptyButtonText}>
          Refer Now
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const referralCode = data?.partnerId || "";

  const copyToClipboard = () => {
    Clipboard.setString(referralCode);
    Alert.alert("Copied!", "Referral code copied");
  };

  const shareReferralCode = async () => {
  try {
    const res = await apiClient.post("/api/refer/share", {
      partnerId: referralCode,
    });

    if (res?.data?.success) {
      const shareData = res.data.data;

      // use backend message
      await Share.share({
        message: shareData.shareMessage,
        url: shareData.shareLink, // iOS uses this
      });
    } else {
      throw new Error("Invalid response");
    }

  } catch (err) {
    console.log("Share error:", err?.response?.data || err.message);

    // fallback
    await Share.share({
      message: `Join using my referral code: ${referralCode}`,
    });
  }
};
  // 🔹 Filter logic
  const riders = data?.referrals || [];

const filteredData = riders.filter((item) => {
  if (tab === "PENDING") {
    return item.status !== "COMPLETED";
  }

  if (tab === "COMPLETED") {
    return item.status === "COMPLETED";
  }

  return true;
});

  // 🔹 Empty UI
  const renderEmpty = () => (
  <View style={styles.listEmptyContainer}>
    <Ionicons
      name="gift-outline"
      size={55}
      color="#CBD5E1"
    />

    <Text style={styles.emptyTitle}>
      {tab === "PENDING"
        ? "No Pending Referrals"
        : tab === "COMPLETED"
        ? "No Completed Referrals"
        : "No Referrals Yet"}
    </Text>

    <Text style={styles.emptySubtitle}>
      Invite your friends and start earning rewards.
    </Text>
  </View>
);
  const renderItem = ({ item }) => {
  const isCompleted = item.status === "COMPLETED";

  return (
    <View style={styles.refItem}>
      
      {/* LEFT */}
      <View style={styles.leftRow}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={18} color="#fff" />
        </View>

        <View
          style={{
            flex: 1,
            marginRight: 10,
          }}
        >
          <Text style={styles.name}>
            {item?.referee?.name || "New Rider"}
          </Text>

          <Text style={styles.date}>
            Referral ID: {item?.referralId?.slice(0, 8)}
          </Text>
        </View>
      </View>

      {/* RIGHT */}
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.amount}>
          ₹{item.earnedAmount || 0}
        </Text>

        <Text style={styles.progressPercent}>
          {item.progressPercentage || 0}% Progress
        </Text>

        <Text
          style={[
            styles.status,
            {
              color: isCompleted
                ? "#16A34A"
                : "#F59E0B",
            },
          ]}
        >
          {isCompleted ? "Completed" : "In Progress"}
        </Text>
      </View>
    </View>
  );
};

 return (
  <View style={{ flex: 1 }}>
    <View style={styles.fixedTopBanner}>
      <ReferralBanner />
    </View>
    
    {/* SCROLLABLE CONTENT */}
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
  paddingTop: hp("32%"),
  paddingBottom: 100,
}} 
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >

      {/* Title */}
      <View style={styles.titleRow}>
        <View style={styles.line} />
        <Text style={styles.title}>Refer & Earn</Text>
        <View style={styles.line} />
      </View>

      {/* Cards */}
      <View style={styles.cardRow}>
        <View style={[styles.card, styles.greenCard]}>
          <Ionicons name="people" size={22} color="#166534" />
          <Text style={styles.cardValue1}>
            {data.summary.totalReferrals || 0}
          </Text>
          <Text style={styles.cardLabel1}>Joined people</Text>
        </View>

        <View style={[styles.card, styles.orangeCard]}>
          <Ionicons name="wallet" size={22} color="#9A3412" />
          <Text style={styles.cardValue2}>
            ₹{data?.summary?.totalRewards || 0}
          </Text>
          <Text style={styles.cardLabel2}>Total Earnings</Text>
        </View>
      </View>

      {/* Referral Code */}
      <View style={styles.codeBox}>
        <Text style={styles.codeText}>{referralCode}</Text>

        <View style={styles.iconRow}>
          <TouchableOpacity onPress={copyToClipboard}>
            <MaterialIcons name="content-copy" size={22} />
          </TouchableOpacity>

          <TouchableOpacity onPress={shareReferralCode}>
            <MaterialIcons name="share" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      {/* How it works */}
      <View style={styles.howBox}>
  <Text style={styles.howTitle}>
    Refer & Earn
  </Text>

  <Text style={styles.howItem}>
    • Invite your friends using referral code
  </Text>

  <Text style={styles.howItem}>
    • Friends complete delivery tasks
  </Text>

  <Text style={styles.howItem}>
    • Track referral progress and earnings
  </Text>
</View>
      {/* Tabs */}
      <Text style={styles.sectionTitle}>My Referrals</Text>

      <View style={styles.tabs}>
        {["ALL", "PENDING", "COMPLETED"].map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tab, tab === t && styles.activeTab]}
          >
            <Text style={tab === t && { color: "#f3f0f0" }}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredData}
       keyExtractor={(item) => item.referralId}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        scrollEnabled={false}
      />
    </ScrollView>

    <View style={styles.fixedButtonContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ReferFrd")}
      >
        <Text style={styles.buttonText}>Refer Now</Text>
      </TouchableOpacity>
    </View>

  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  fixedTopBanner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "#F8FAFC",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: isTablet ? rh(2) : 15,
    paddingHorizontal: 16,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },

  title: {
    marginHorizontal: 10,
    fontWeight: "700",

    fontSize: isTablet ? rf(1.6) : 16,

    color: "#1E293B",
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 5,
  },

  card: {
    width: "48%",
    padding: isTablet ? rw(2.5) : 16,

    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  greenCard: {
    backgroundColor: "#DCFCE7",
  },

  orangeCard: {
    backgroundColor: "#FFE4D5",
  },

  cardValue1: {
    color: "#166534",

    fontSize: isTablet ? rf(1.8) : 20,

    fontWeight: "700",
    marginTop: 6,
  },

  cardValue2: {
    color: "#9A3412",

    fontSize: isTablet ? rf(1.8) : 20,

    fontWeight: "700",
    marginTop: 6,
  },

  cardLabel1: {
    color: "#166534",

    fontSize: isTablet ? rf(1.1) : 12,

    marginTop: 4,
  },

  cardLabel2: {
    color: "#9A3412",

    fontSize: isTablet ? rf(1.1) : 12,

    marginTop: 4,
  },

  codeBox: {
    margin: 16,

    padding: isTablet ? rw(2) : 14,

    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  codeText: {
    fontWeight: "700",

    fontSize: isTablet ? rf(1.5) : 16,

    letterSpacing: 1,
    color: "#0F172A",
  },

  iconRow: {
    flexDirection: "row",
    gap: isTablet ? rw(2) : 16,
  },

  howBox: {
    marginHorizontal: 16,
    backgroundColor: "#fff",

    padding: isTablet ? rw(2.2) : 14,

    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  howTitle: {
    fontWeight: "700",

    marginBottom: 8,

    fontSize: isTablet ? rf(1.3) : 16,

    color: "#0F172A",
  },

  howItem: {
    marginVertical: 3,
    color: "#475569",

    fontSize: isTablet ? rf(1.15) : 15,
  },

  howItem1: {
    fontSize: isTablet ? rf(1.5) : 18,
    fontWeight: "800",
  },

  sectionTitle: {
    marginTop: 16,
    marginHorizontal: 16,

    fontWeight: "700",

    fontSize: isTablet ? rf(1.4) : 15,

    color: "#0F172A",
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 10,
  },

  tab: {
    flex: 1,
    marginHorizontal: 4,

    paddingVertical: isTablet ? rh(1) : 8,

    backgroundColor: "#E2E8F0",
    borderRadius: 20,
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#19A7CE",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 20,

    fontSize: isTablet ? rf(1.2) : 14,

    color: "#94A3B8",
  },

  refItem: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginHorizontal: 16,
    marginTop: 10,

    padding: isTablet ? rw(2.2) : 14,

    borderRadius: 14,
    backgroundColor: "#fff",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  avatar: {
    width: isTablet ? rw(5) : 38,
    height: isTablet ? rw(5) : 38,

    borderRadius: 20,
    backgroundColor: "#74c4da",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 10,
  },

  name: {
    fontWeight: "600",

    fontSize: isTablet ? rf(1.3) : 15,

    color: "#0F172A",
  },

  date: {
    fontSize: isTablet ? rf(1.15) : 14,

    color: "#515863",
    marginTop: 3,
  },

  amount: {
    fontWeight: "700",

    fontSize: isTablet ? rf(1.5) : 14,

    color: "#16A34A",
  },

  progress: {
    fontWeight: "700",

    fontSize: isTablet ? rf(1.20) : 14,

    color: "#F59E0B",
  },

  status: {
    fontSize: isTablet ? rf(1.05) : 12,
    marginTop: 2,
  },

  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,

    backgroundColor: "#F8FAFC",

    padding: isTablet ? rw(1.8) : 10,

    borderTopWidth: 1,
    borderColor: "#E2E8F0",
  },

  button: {
    backgroundColor: "#19A7CE",

    padding: isTablet ? rh(1.6) : 16,

    borderRadius: 30,
    alignItems: "center",

    shadowColor: "#1E3A8A",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",

    fontSize: isTablet ? rf(1.3) : 15,
  },

  taskProgress: {
    fontSize: isTablet ? rf(1.07) : 13,
    color: "#0284C7",
    marginTop: 4,
    fontWeight: "600",
  },

  progressPercent: {
  fontSize: isTablet ? rf(1) : 12,
  color: "#0284C7",
  marginTop: 4,
  fontWeight: "600",
},
  emptyContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#F8FAFC",
  paddingHorizontal: 30,
},

emptyTitle: {
  marginTop: 16,
  fontSize: isTablet ? rf(1.8) : 20,
  fontWeight: "700",
  color: "#0F172A",
  textAlign: "center",
},

emptySubtitle: {
  marginTop: 8,
  fontSize: isTablet ? rf(1.2) : 14,
  color: "#64748B",
  textAlign: "center",
  lineHeight: 22,
},

emptyButton: {
  marginTop: 24,
  backgroundColor: "#19A7CE",
  paddingVertical: 14,
  paddingHorizontal: 32,
  borderRadius: 30,
},

emptyButtonText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: isTablet ? rf(1.2) : 15,
},

listEmptyContainer: {
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: 40,
},
});