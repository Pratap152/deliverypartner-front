import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";

/* ---------- MOCK DATA (API REPLACE LATER) ---------- */
const MOCK_DATA = {
  cashSummary: {
    totalCashCollected: 3250,
    toDeposit: 2850,
    depositRequired: true,
  },
  lastDeposit: {
    amount: 2500,
    date: "12/14/2024",
  },
  pendingOrdersSummary: {
    count: 3,
    label: "To be deposited",
  },
  cashOrderHistory: [
    {
      id: "ORD-1234",
      name: "Amit Sharma",
      amount: 450,
      status: "PENDING",
      time: "12/16/2024 · 02:45 PM",
    },
    {
      id: "ORD-1233",
      name: "Priya Patel",
      amount: 320,
      status: "PENDING",
      time: "12/16/2024 · 01:30 PM",
    },
    {
      id: "ORD-1231",
      name: "Sneha Joshi",
      amount: 650,
      status: "DEPOSITED",
      time: "12/15/2024 · 08:45 PM",
    },
  ],
};

export default function CashBalanceScreen({ navigation }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(MOCK_DATA);
  }, []);

  if (!data) return null;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={rf(2.6)} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Rider Assets</Text>

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
              <Ionicons name="wallet-outline" size={rf(2.2)} color="#12B76A" />
            </View>
            <Text style={styles.greenLabel}>Cash Collected</Text>
          </View>

          <Text style={styles.greenAmount}>₹{data.cashSummary.totalCashCollected}</Text>

          <View style={styles.depositRow}>
            <Text style={styles.depositText}>To Deposit</Text>
            <Text style={styles.depositAmount}>₹{data.cashSummary.toDeposit}</Text>
          </View>
        </View>

        {/* DEPOSIT REQUIRED */}
        {data.cashSummary.depositRequired && (
          <View style={styles.depositAlert}>
            <View style={styles.row}>
              <View style={styles.alertIconWrap}>
                <Ionicons name="alert-outline" size={rf(2)} color="#F04438" />
              </View>
              <Text style={styles.alertTitle}>Deposit Required</Text>
            </View>

            <Text style={styles.alertMsg}>
              You have ₹{data.cashSummary.toDeposit} pending deposit. Please visit
              the nearest collection center to deposit your cash.
            </Text>

            <TouchableOpacity style={styles.findBtn}>
              <Text style={styles.findBtnText}>Find Collection Center</Text>
            </TouchableOpacity>
          </View>
        )}

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
        <Text style={styles.sectionTitle}>Cash Order History</Text>

        {data.cashOrderHistory.map((item) => {
          const pending = item.status === "PENDING";
          return (
            <View key={item.id} style={styles.orderCard}>
              <View style={styles.row}>
                <View
                  style={[
                    styles.statusIconWrap,
                    { backgroundColor: pending ? "#FFF4E5" : "#ECFDF3" },
                  ]}
                >
                  <Ionicons
                    name={pending ? "time-outline" : "checkmark"}
                    size={rf(2)}
                    color={pending ? "#F79009" : "#12B76A"}
                  />
                </View>

                <View style={{ marginLeft: rw(3) }}>
                  <Text style={styles.orderId}>{item.id}</Text>
                  <Text style={styles.orderName}>{item.name}</Text>
                  <Text style={styles.orderTime}>{item.time}</Text>
                </View>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={[
                    styles.orderAmount,
                    { color: pending ? "#F79009" : "#12B76A" },
                  ]}
                >
                  ₹{item.amount}
                </Text>

                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: pending ? "#FFF4E5" : "#ECFDF3" },
                  ]}
                >
                  <Text
                    style={{
                      color: pending ? "#F79009" : "#12B76A",
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

        {/* DEPOSIT CASH BUTTON */}
        <TouchableOpacity style={styles.depositNowBtn}>
          <Text style={styles.depositNowText}>Deposit Cash Now</Text>
        </TouchableOpacity>

        {/* NOTE */}
        <Text style={styles.noteText}>
          Note: Cash must be deposited within 24 hours of collection. Failure to
          deposit may result in account suspension.
        </Text>

        <View style={{ height: rh(4) }} />
      </ScrollView>
    </View>
  );
}

/* ---------- INFO CARD ---------- */
const InfoCard = ({ icon, value, title, subtitle }) => (
  <View style={styles.infoCard}>
    <View style={styles.infoIconWrap}>
      <Ionicons name={icon} size={rf(2.1)} color="#12B76A" />
    </View>
    <Text style={styles.infoValue}>{value}</Text>
    <Text style={styles.infoTitle}>{title}</Text>
    <Text style={styles.infoSub}>{subtitle}</Text>
  </View>
);

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },

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

  greenLabel: { color: "#EFFFF6", marginLeft: rw(2), fontSize: rf(1.7) },

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

  depositAlert: {
    backgroundColor: "#FFF7ED",
    marginHorizontal: rw(4),
    padding: rw(4),
    borderRadius: rw(3),
    borderLeftWidth: 4,
    borderLeftColor: "#F79009",
  },

  alertIconWrap: {
    backgroundColor: "#FFEAD5",
    padding: rw(2),
    borderRadius: 50,
  },

  alertTitle: {
    marginLeft: rw(2),
    fontSize: rf(2),
    fontWeight: "600",
    color: "#B54708",
  },

  alertMsg: {
    marginTop: rh(1),
    color: "#7A2E0E",
    fontSize: rf(1.6),
    lineHeight: rf(2.3),
  },

  findBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#FF7A00",
    paddingHorizontal: rw(6),
    paddingVertical: rh(1.3),
    borderRadius: 50,
    marginTop: rh(2),
  },

  findBtnText: { color: "#FFF", fontWeight: "600" },

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

  infoValue: { fontSize: rf(2.2), fontWeight: "700", marginTop: rh(1) },
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

  statusIconWrap: {
    padding: rw(2),
    borderRadius: 50,
  },

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
 