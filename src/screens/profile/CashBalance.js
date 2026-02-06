import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
import apiClient from "../../services/ApiClient";

export default function CashBalanceScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCashBalance();
  }, []);

  const fetchCashBalance = async () => {
    try {
      const res = await apiClient.get("/api/rider/cashbalance");
      const apiData = res.data?.data;

      const formattedData = {
        cashSummary: apiData.cashSummary,

        lastDeposit: {
          amount: apiData.latestDeposit || 0,
          date: apiData.latestDeposit
            ? "Last deposit recorded"
            : "No deposits yet",
        },

        pendingOrdersSummary: {
          count:
            apiData.pendingOrdersSummary?.pendingOrdersCount || 0,
          label: "To be deposited",
        },

        cashOrderHistory: apiData.cashOrderHistory || [],
        rules: apiData.rules,
      };

      setData(formattedData);
    } catch (err) {
      console.log("Cash balance error", err?.response || err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#12B76A" />
      </View>
    );
  }

  if (!data) return null;

  const hasOrders = data.cashOrderHistory.length > 0;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={rf(2.6)} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Cash Balance</Text>

        <Image
          source={require("../../assets/profile/HelpcenterIcon.png")}
          style={styles.robotIcon}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* CASH COLLECTED */}
        <View style={styles.greenCard}>
          <View style={styles.row}>
            <View style={styles.greenIconWrap}>
              <Ionicons
                name="wallet-outline"
                size={rf(2.2)}
                color="#12B76A"
              />
            </View>
            <Text style={styles.greenLabel}>Cash Collected</Text>
          </View>

          <Text style={styles.greenAmount}>
            ₹{data.cashSummary.totalCashCollected}
          </Text>

          <View style={styles.depositRow}>
            <Text style={styles.depositText}>Deposit Limit</Text>
            <Text style={styles.depositAmount}>₹2850</Text>
          </View>
        </View>

        {/* INFO CARDS */}
        <View style={styles.infoRow}>
          <InfoCard
            icon="cash-outline"
            value={`₹${data.lastDeposit.amount}`}
            title="Last Deposit"
            subtitle={data.lastDeposit.date}
          />
          <InfoCard
            icon="time-outline"
            value={data.pendingOrdersSummary.count}
            title="Pending Orders"
            subtitle={data.pendingOrdersSummary.label}
          />
        </View>

        {/* ORDER HISTORY */}
        {hasOrders && (
          <Text style={styles.sectionTitle}>
            Cash Order History
          </Text>
        )}

        {hasOrders &&
          data.cashOrderHistory.map((item, index) => {
            const pending = item.status === "PENDING";

            return (
              <View key={index} style={styles.orderCard}>
                <View style={styles.row}>
                  <View
                    style={[
                      styles.statusIconWrap,
                      {
                        backgroundColor: pending
                          ? "#FFF4E5"
                          : "#ECFDF3",
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        pending
                          ? "time-outline"
                          : "checkmark"
                      }
                      size={rf(2)}
                      color={
                        pending ? "#F79009" : "#12B76A"
                      }
                    />
                  </View>

                  <View style={{ marginLeft: rw(3) }}>
                    <Text style={styles.orderId}>
                      {item.orderId}
                    </Text>
                    <Text style={styles.orderName}>
                      {item.customerName}
                    </Text>
                    <Text style={styles.orderTime}>
                      {item.collectedAt
                        ? `Collected at ${new Date(
                          item.collectedAt
                        ).toLocaleString()}`
                        : item.depositedAt
                          ? `Deposited at ${new Date(
                            item.depositedAt
                          ).toLocaleString()}`
                          : ""}
                    </Text>
                  </View>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={[
                      styles.orderAmount,
                      {
                        color: pending
                          ? "#F79009"
                          : "#12B76A",
                      },
                    ]}
                  >
                    ₹{item.amount}
                  </Text>

                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: pending
                          ? "#FFF4E5"
                          : "#ECFDF3",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: pending
                          ? "#F79009"
                          : "#12B76A",
                        fontSize: rf(1.3),
                        fontWeight: "600",
                      }}
                    >
                      {pending ? "Pending" : "Deposited"}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}

        <TouchableOpacity
          style={[
            styles.depositNowBtn,
            !hasOrders && { opacity: 0.5 },
          ]}
          disabled={!hasOrders}
        >
          <Text style={styles.depositNowText}>
            Deposit Cash Now
          </Text>
        </TouchableOpacity>

        <Text style={styles.noteText}>
          Note: {data.rules?.warningMessage}
        </Text>

        <View style={{ height: rh(4) }} />
      </ScrollView>
    </View>
  );
}

const InfoCard = ({ icon, value, title, subtitle }) => (
  <View style={styles.infoCard}>
    <View style={styles.infoIconWrap}>
      <Ionicons
        name={icon}
        size={rf(2.1)}
        color="#12B76A"
      />
    </View>
    <Text style={styles.infoValue}>{value}</Text>
    <Text style={styles.infoTitle}>{title}</Text>
    <Text style={styles.infoSub}>{subtitle}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: rw(4),
    backgroundColor: "#FFF",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: rf(2.2), fontWeight: "600" },
  robotIcon: { width: rw(7), height: rw(7), resizeMode: "contain" },
  row: { flexDirection: "row", alignItems: "center" },
  greenCard: {
    backgroundColor: "#12B76A",
    margin: rw(4),
    padding: rw(5),
    borderRadius: rw(3),
  },
  greenIconWrap: {
    backgroundColor: "#ECFDF3",
    padding: rw(2),
    borderRadius: 50,
  },
  greenLabel: {
    color: "#EFFFF6",
    marginLeft: rw(2),
    fontSize: rf(1.7),
  },
  greenAmount: {
    color: "#FFF",
    fontSize: rf(3.2),
    fontWeight: "700",
    marginVertical: rh(1),
  },
  depositRow: {
    backgroundColor: "#FFF",
    padding: rw(4),
    borderRadius: rw(2),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  depositText: { color: "#667085" },
  depositAmount: { fontWeight: "700", fontSize: rf(2) },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: rw(4),
  },
  infoCard: {
    width: "48%",
    backgroundColor: "#FFF",
    padding: rw(4),
    borderRadius: rw(3),
  },
  infoIconWrap: {
    backgroundColor: "#ECFDF3",
    padding: rw(2),
    borderRadius: 50,
    alignSelf: "flex-start",
  },
  infoValue: {
    fontSize: rf(2.2),
    fontWeight: "700",
    marginTop: rh(1),
  },
  infoTitle: { color: "#667085", marginTop: rh(0.4) },
  infoSub: { color: "#98A2B3", fontSize: rf(1.4) },
  sectionTitle: {
    marginHorizontal: rw(4),
    marginBottom: rh(1),
    fontSize: rf(2),
    fontWeight: "600",
  },
  orderCard: {
    backgroundColor: "#FFF",
    marginHorizontal: rw(4),
    marginBottom: rh(1.2),
    padding: rw(4),
    borderRadius: rw(3),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusIconWrap: { padding: rw(2), borderRadius: 50 },
  orderId: { fontWeight: "600" },
  orderName: { color: "#667085" },
  orderTime: { color: "#98A2B3", fontSize: rf(1.3) },
  orderAmount: { fontSize: rf(1.9), fontWeight: "700" },
  statusPill: {
    paddingHorizontal: rw(3),
    paddingVertical: rh(0.5),
    borderRadius: 20,
    marginTop: rh(0.6),
  },
  depositNowBtn: {
    backgroundColor: "#12B76A",
    margin: rw(4),
    paddingVertical: rh(1.8),
    borderRadius: rw(3),
    alignItems: "center",
  },
  depositNowText: {
    color: "#FFF",
    fontSize: rf(2),
    fontWeight: "600",
  },
  noteText: {
    marginHorizontal: rw(4),
    color: "#667085",
    fontSize: rf(1.4),
    lineHeight: rf(2.1),
  },
});
