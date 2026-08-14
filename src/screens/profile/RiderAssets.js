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
import { useSelector } from "react-redux";
import { getRiderAssets } from "../../services/profile/profileApiService";

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const RiderAssets = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [assetsData, setAssetsData] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [emptyMessage, setEmptyMessage] = useState("");


  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await getRiderAssets();
      setAssetsData(res?.data?.data || []);
      setTotalAssets(res?.data?.totalAssets || 0);
      setEmptyMessage(res?.data?.message || "");
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message;

      if (status === 404 && message === "No assets issued to this rider") {
        setAssetsData([]);
        setTotalAssets(0);
        setEmptyMessage(message);
      } else {
        console.log("Assets error", err?.response || err);
        setAssetsData([]);
        setTotalAssets(0);
        setEmptyMessage(message || "");
      }
    } finally {
      setLoading(false);
    }
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
        <ActivityIndicator size="large" color="#192A51" />
      </View>
    );
  }

  const isEmpty = !assetsData || assetsData.length === 0;

  return (
     <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
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
                      color="#192A51"
                    />
                  </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          isEmpty
            ? { flexGrow: 1 }
            : { paddingBottom: rh(4) }
        }
      >
        {isEmpty ? (
          <View style={styles.emptyWrapper}>
            <View style={styles.illustrationBox}>
              <Ionicons name="cube-outline" size={rf(9)} color="#192A51" />
            </View>

            <Text style={styles.emptyTitle}>Kit Requested Successfully</Text>
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
    flex: 1,
    paddingHorizontal: rw(8),
    justifyContent: "center",
    alignItems: "center",
    marginTop: rh(-6),
  },

  illustrationBox: {
    width: rw(32),
    height: rw(32),
    borderRadius: rw(16),
    backgroundColor: "#E8F9FC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: rh(3),
  },

  emptyTitle: {
    fontSize: rf(2.2),
    fontWeight: "700",
    color: "#101828",
    textAlign: "center",
    lineHeight: rh(3.4),
  },

  /* SUMMARY */
  summaryCard: {
    backgroundColor: "#192A51",
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
    backgroundColor: "#192A51",
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