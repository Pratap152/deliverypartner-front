import React, { useCallback, useEffect, useState } from "react";
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
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import DeviceInfo from "react-native-device-info";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  responsiveFontSize as rf,
  responsiveHeight as rh,
  responsiveWidth as rw,
} from "react-native-responsive-dimensions";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Clipboard from "@react-native-clipboard/clipboard";

import ReferralBanner from "../Home/ReferralBanner";
import {
  getReferralsList,
  shareRefer,
} from "../../services/referralService";

const isTablet = DeviceInfo.isTablet();
const TABS = ["ALL", "PENDING", "COMPLETED"];

export default function ReferEarn({ navigation }) {
  const insets = useSafeAreaInsets();

  const [data, setData] = useState(null);
  const [tab, setTab] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReferrals = async () => {
    try {
      setLoading(true);

      const res = await getReferralsList();

      if (res?.data?.success) {
        setData(res.data?.data || res.data);
      }
    } catch (error) {
      console.log(
        "Referral API error:",
        error?.response?.data || error?.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchReferrals();
    setRefreshing(false);
  }, []);

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

        <Text style={styles.emptyTitle}>No Referral Data</Text>

        <Text style={styles.emptySubtitle}>
          Start inviting friends and earn rewards.
        </Text>

        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => navigation.navigate("ReferFrd")}
        >
          <Text style={styles.emptyButtonText}>Refer Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const referralCode = data?.partnerId || "";
  const riders = data?.referrals || [];

  const filteredData = riders.filter(({ status }) => {
    if (tab === "COMPLETED") return status === "COMPLETED";
    if (tab === "PENDING") return status !== "COMPLETED";
    return true;
  });

  const copyToClipboard = () => {
    Clipboard.setString(referralCode);
    Alert.alert("Copied!", "Referral code copied");
  };

  const shareReferralCode = async () => {
    try {
      const res = await shareRefer({ partnerId: referralCode });

      if (!res?.data?.success) {
        throw new Error("Invalid response");
      }

      const shareData = res.data.data;

      await Share.share({
        message: shareData.shareMessage,
        url: shareData.shareLink,
      });
    } catch (error) {
      console.log(
        "Share error:",
        error?.response?.data || error?.message
      );

      await Share.share({
        message: `Join using my referral code: ${referralCode}`,
      });
    }
  };

  const renderEmpty = () => (
    <View style={styles.listEmptyContainer}>
      <Ionicons name="gift-outline" size={55} color="#CBD5E1" />

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
    const completed = item?.status === "COMPLETED";

    return (
      <View style={styles.refItem}>
        <View style={styles.leftRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={18} color="#fff" />
          </View>

          <View style={styles.refInfo}>
            <Text style={styles.name}>
              {item?.referee?.name || "New Rider"}
            </Text>

            <Text style={styles.date}>
              Referral ID: {item?.referralId?.slice(0, 8) || "N/A"}
            </Text>
          </View>
        </View>

        <View style={styles.refRight}>
          <Text style={styles.amount}>
            ₹{item?.earnedAmount || 0}
          </Text>

          <Text style={styles.progressPercent}>
            {item?.progressPercentage || 0}% Progress
          </Text>

          <Text
            style={[
              styles.status,
              {
                color: completed ? "#16A34A" : "#F59E0B",
              },
            ]}
          >
            {completed ? "Completed" : "In Progress"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right", "bottom"]}
    >
      {/* TOP BANNER */}
      <View
        style={[
          styles.topBanner,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color="#0F172A"
            />
          </TouchableOpacity>
        </View>

        <ReferralBanner />
      </View>

      {/* CONTENT */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingTop: hp("26%") + insets.top,
          paddingBottom: 100,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {/* TITLE */}
        <View style={styles.titleRow}>
          <View style={styles.line} />
          <Text style={styles.title}>Refer & Earn</Text>
          <View style={styles.line} />
        </View>

        {/* SUMMARY CARDS */}
        <View style={styles.cardRow}>
          <View style={[styles.card, styles.greenCard]}>
            <Ionicons
              name="people"
              size={22}
              color="#166534"
            />

            <Text style={[styles.cardValue, styles.greenText]}>
              {data?.summary?.totalReferrals || 0}
            </Text>

            <Text style={[styles.cardLabel, styles.greenText]}>
              Joined people
            </Text>
          </View>

          <View style={[styles.card, styles.orangeCard]}>
            <Ionicons
              name="wallet"
              size={22}
              color="#9A3412"
            />

            <Text style={[styles.cardValue, styles.orangeText]}>
              ₹{data?.summary?.totalRewards || 0}
            </Text>

            <Text style={[styles.cardLabel, styles.orangeText]}>
              Total Earnings
            </Text>
          </View>
        </View>

        {/* REFERRAL CODE */}
        <View style={styles.codeBox}>
          <Text style={styles.codeText}>{referralCode}</Text>

          <View style={styles.iconRow}>
            <TouchableOpacity onPress={copyToClipboard}>
              <MaterialIcons
                name="content-copy"
                size={22}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={shareReferralCode}>
              <MaterialIcons name="share" size={22} />
            </TouchableOpacity>
          </View>
        </View>

        {/* HOW IT WORKS */}
        <View style={styles.howBox}>
          <Text style={styles.howTitle}>Refer & Earn</Text>

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

        {/* REFERRALS */}
        <Text style={styles.sectionTitle}>My Referrals</Text>

        <View style={styles.tabs}>
          {TABS.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setTab(item)}
              style={[
                styles.tab,
                tab === item && styles.activeTab,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === item && styles.activeTabText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredData}
          keyExtractor={(item, index) =>
            `${item?.referralId || "referral"}-${index}`
          }
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          scrollEnabled={false}
        />
      </ScrollView>

      {/* FIXED BUTTON */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ReferFrd")}
        >
          <Text style={styles.buttonText}>Refer Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  topBanner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "#F8FAFC",
  },

  backButtonContainer: {
    position: "absolute",
    top: isTablet ? rh(1.2) : 20,
    left: 20,
    zIndex: 20,
  },

  backButton: {
    width: 25,
    height: 25,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: isTablet ? rh(2) : 3,
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

  cardValue: {
    fontSize: isTablet ? rf(1.8) : 20,
    fontWeight: "700",
    marginTop: 6,
  },

  cardLabel: {
    fontSize: isTablet ? rf(1.1) : 12,
    marginTop: 4,
  },

  greenText: {
    color: "#166534",
  },

  orangeText: {
    color: "#9A3412",
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

  tabText: {
    color: "#0F172A",
  },

  activeTabText: {
    color: "#fff",
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
    backgroundColor: "#74C4DA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  refInfo: {
    flex: 1,
    marginRight: 10,
  },

  refRight: {
    alignItems: "flex-end",
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

  progressPercent: {
    fontSize: isTablet ? rf(1) : 12,
    color: "#0284C7",
    marginTop: 4,
    fontWeight: "600",
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