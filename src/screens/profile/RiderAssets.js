import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
import apiClient from "../../services/ApiClient";
import { useSelector } from "react-redux";


const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const RiderAssets = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [assetsData, setAssetsData] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);

  const currentRiderId = useSelector(state => state.profile?.data?._id ?? null);

  const riderKitData = useSelector(state =>
    currentRiderId ? state.kit?.riders?.[currentRiderId] ?? null : null
  );

  const kitCompleted = riderKitData?.kitCompleted ?? false;
  const currentStep = riderKitData?.currentStep ?? null;
  const apiResponse = riderKitData?.apiResponse ?? null;
  const deliveryMode = riderKitData?.deliveryMode ?? null;
  const addressData = riderKitData?.addressData ?? null;
  const selectedZone = riderKitData?.selectedZone ?? null;

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await apiClient.get("/api/kit/rider/assets");
      setAssetsData(res?.data?.data || []);
      setTotalAssets(res?.data?.totalAssets || 0);
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message;

      if (status === 404 && message === "No assets issued to this rider") {
        setAssetsData([]);
        setTotalAssets(0);
      } else {
        console.log("Assets error", err?.response || err);
        setAssetsData([]);
        setTotalAssets(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKitPressFromProfile = () => {
    const source = "riderAssets";

    if (!riderKitData) {
      navigation.navigate("KitSelectionScreen", { source });
      return;
    }

    if (kitCompleted || currentStep === "SuccessScreen") {
      navigation.navigate("SuccessScreen", {
        apiResponse,
        deliveryMode,
        source,
      });
      return;
    }

    if (currentStep === "PaymentsScreen") {
      navigation.navigate("PaymentsScreen", { source });
      return;
    }

    if (currentStep === "KitPickupSelection") {
      navigation.navigate("KitPickupSelection", {
        apiResponse,
        deliveryMode,
        addressData,
        selectedZone,
        source,
      });
      return;
    }

    navigation.navigate("KitSelectionScreen", { source });
  };

  const handleBackFromRiderAssets = () => {
  if (navigation.canGoBack()) {
    navigation.goBack();
    return;
  }

  navigation.navigate('ProfileScreen');
};

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00B2C9" />
      </View>
    );
  }

  const isEmpty = !assetsData || assetsData.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackFromRiderAssets}>
          <Ionicons name="arrow-back" size={rf(2.6)} color="#101828" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Rider Assets</Text>

        <TouchableOpacity
                    style={styles.rightIconWrapper}
                    onPress={() => navigation.navigate('HelpCenterList')}
                  >
                    <Ionicons
                      name="chatbubble-ellipses-outline"
                      size={isTablet ? 34 : 24}
                      color="#13ACBE"
                    />
                  </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: rh(4) }}
      >
        {isEmpty ? (
          <View style={styles.emptyWrapper}>
            <View style={styles.illustrationBox}>
              <Ionicons name="cube-outline" size={rf(8)} color="#13ACBE" />
            </View>

            <Text style={styles.emptyTitle}>No Rider Assets Found</Text>

            <Text style={styles.emptySubtitle}>
              You haven’t selected a delivery{"\n"}
              kit yet. Choose your preferred{"\n"}
              kit to continue onboarding.
            </Text>

            <View style={styles.infoCard}>
              <Text style={styles.infoHeading}>How asset collection works</Text>

              <View style={styles.infoItem}>
                <Text style={styles.bullet}>•</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoTitle}>Online Delivery</Text>
                  <Text style={styles.infoText}>
                    Your rider kit can be delivered to your registered address.
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.bullet}>•</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoTitle}>Offline Pickup</Text>
                  <Text style={styles.infoText}>
                    You can collect your kit from the assigned delivery hub.
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.bullet}>•</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoTitle}>Verification Required</Text>
                  <Text style={styles.infoText}>
                    Asset approval may take some time after document verification.
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleKitPressFromProfile}
            >
              <Text style={styles.buttonText}>Choose Delivery Kit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Assets Summary</Text>

              <View style={styles.summaryRow}>
                <View style={styles.summaryBox}>
                  <Text style={styles.summaryValue}>{totalAssets}</Text>
                  <Text style={styles.summaryLabel}>Total Assets</Text>
                </View>
              </View>
            </View>

            {assetsData?.map((item, index) => (
              <View key={index} style={styles.assetCard}>
                <View style={styles.assetIcon}>
                  <Ionicons name="cube-outline" size={rf(2.6)} color="#12B76A" />
                </View>

                <View style={styles.assetContent}>
                  <View style={styles.topRow}>
                    <Text style={styles.assetName}>
                      {item.assetType?.replaceAll("_", " ")}
                    </Text>

                    <View style={styles.activeBadge}>
                      <Text style={styles.activeText}>{item.status}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Condition:</Text>
                    <Text style={styles.conditionText}>
                      {item.condition || "Good"}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Quantity:</Text>
                    <Text style={styles.value}>{item.quantity}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Issued Date:</Text>
                    <Text style={styles.value}>
                      {new Date(item.issuedDate).toLocaleDateString("en-GB")}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Request Replacement</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RiderAssets;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
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
    paddingVertical: rh(2),
    backgroundColor: "#FFFFFF",
    elevation: 2,
  },

  headerTitle: {
    fontSize: rf(2.3),
    fontWeight: "700",
    color: "#101828",
  },

  robotIcon: {
    width: rw(7),
    height: rw(7),
    resizeMode: "contain",
  },

  /* EMPTY UI */
  emptyWrapper: {
    paddingHorizontal: rw(5),
    paddingTop: rh(4),
  },

  illustrationBox: {
    width: rw(28),
    height: rw(28),
    borderRadius: rw(14),
    backgroundColor: "#E8F9FC",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: rh(2),
  },

  emptyTitle: {
    fontSize: rf(2.4),
    fontWeight: "700",
    color: "#101828",
    textAlign: "center",
    marginBottom: rh(1),
  },

  emptySubtitle: {
    fontSize: rf(1.7),
    color: "#667085",
    textAlign: "center",
    lineHeight: rh(3),
    marginBottom: rh(3),
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: rw(4),
    padding: rw(4),
    elevation: 2,
  },

  infoHeading: {
    fontSize: rf(1.9),
    fontWeight: "700",
    color: "#101828",
    marginBottom: rh(2),
  },

  infoItem: {
    flexDirection: "row",
    marginBottom: rh(2),
  },

  bullet: {
    fontSize: rf(2),
    color: "#13ACBE",
    marginRight: rw(2),
    marginTop: rh(-0.2),
  },

  infoTitle: {
    fontSize: rf(1.7),
    fontWeight: "700",
    color: "#101828",
    marginBottom: rh(0.3),
  },

  infoText: {
    fontSize: rf(1.5),
    color: "#667085",
    lineHeight: rh(2.6),
  },

  /* SUMMARY */
  summaryCard: {
    backgroundColor: "#13ACBE",
    marginHorizontal: rw(4),
    marginTop: rh(2),
    borderRadius: rw(4),
    padding: rw(4),
  },

  summaryTitle: {
    color: "#FFFFFF",
    fontSize: rf(1.8),
    fontWeight: "600",
    marginBottom: rh(1.5),
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "center",
  },

  summaryBox: {
    backgroundColor: "#FFFFFF",
    width: "55%",
    borderRadius: rw(3),
    paddingVertical: rh(1.8),
    alignItems: "center",
  },

  summaryValue: {
    fontSize: rf(2.6),
    fontWeight: "700",
    color: "#101828",
  },

  summaryLabel: {
    fontSize: rf(1.5),
    color: "#667085",
    marginTop: rh(0.4),
  },

  /* ASSET CARD */
  assetCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: rw(4),
    marginTop: rh(1.8),
    borderRadius: rw(4),
    padding: rw(4),
    flexDirection: "row",
    elevation: 2,
  },

  assetIcon: {
    width: rw(13),
    height: rw(13),
    borderRadius: rw(3),
    backgroundColor: "#ECFDF3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: rw(3),
  },

  assetContent: {
    flex: 1,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: rh(1),
  },

  assetName: {
    fontSize: rf(1.9),
    fontWeight: "700",
    color: "#101828",
    textTransform: "capitalize",
  },

  activeBadge: {
    backgroundColor: "#ECFDF3",
    paddingHorizontal: rw(2.5),
    paddingVertical: rh(0.5),
    borderRadius: rw(5),
  },

  activeText: {
    color: "#12B76A",
    fontSize: rf(1.3),
    fontWeight: "600",
  },

  detailRow: {
    flexDirection: "row",
    marginTop: rh(0.5),
  },

  label: {
    fontSize: rf(1.6),
    color: "#667085",
    fontWeight: "500",
    marginRight: rw(1),
  },

  value: {
    fontSize: rf(1.6),
    color: "#101828",
    fontWeight: "500",
  },

  conditionText: {
    fontSize: rf(1.6),
    color: "#1570EF",
    fontWeight: "600",
  },

  /* BUTTON */
  button: {
    backgroundColor: "#13ACBE",
    marginHorizontal: rw(6),
    marginTop: rh(3),
    paddingVertical: rh(1.8),
    borderRadius: rw(3),
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: rf(1.8),
    fontWeight: "600",
  },
});