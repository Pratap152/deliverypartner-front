import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRider } from "../../context/RiderContext";
 
 
export default function SuccessfullDelivered({ route, navigation }) {
  const { amount, codCollected, orderId, paymentMethod } = route.params || {};
  const roundedAmount = Math.round(amount || 0);
 
  const { isOnline, goOnline, goOffline, } = useRider();
 
  useEffect(() => {
    // Disable Android hardware back button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true // Returning true means we handled the event and prevent default behavior
    );
 
    // Disable iOS swipe gesture (if using stack navigator)
    navigation.setOptions({
      gestureEnabled: false,
    });
 
    return () => backHandler.remove();
  }, [navigation]);
 
  console.log(' [SuccessfulDelivered] Received params:', {
    amount,
    codCollected,
    orderId,
    paymentMethod
  });
 
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/success.png")}
        style={styles.successImage}
        resizeMode="contain"
      />
 
      <Text style={styles.successTitle}>Delivery Completed</Text>
      <Text style={styles.successSubtitle}>Successfully</Text>
 
      <View style={styles.earningsCard}>
        <Text style={styles.earningsTitle}>Earnings Added</Text>
 
        <Text style={styles.amount}>₹{roundedAmount}</Text>
 
        <View style={styles.divider} />
 
        <Text style={styles.paymentLabel}>Payment Method</Text>
 
        <Text style={styles.paymentMethod}>
          {paymentMethod || "N/A"}
        </Text>
 
        <Text style={styles.paymentReceived}>
          {paymentMethod === "ONLINE"
            ? "Online Payment Received"
            : "Cash Collected"}
        </Text>
 
        <Text style={styles.codAmount}>
          ₹{codCollected || 0}
        </Text>
      </View>
 
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })}
        activeOpacity={0.9}
      >
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingHorizontal: wp("5%"),
    paddingTop: hp("7%"),
  },
 
  successImage: {
    width: wp("50%"),
    height: wp("50%"),
    marginTop: hp("3%"),
  },
 
  successTitle: {
    marginTop: hp("3%"),
    fontSize: wp("6%"),
    fontWeight: "500",
    color: "#15A721",
  },
 
  successSubtitle: {
    fontSize: wp("6%"),
    fontWeight: "500",
    color: "#15A721",
  },
 
  earningsCard: {
    marginTop: hp("2%"),
    width: wp("80%"),
    backgroundColor: "#d4f5e7ff",
    borderRadius: wp("4%"),
    paddingVertical: hp("2%"),
    alignItems: "center",
  },
 
  earningsTitle: {
    fontSize: wp("5%"),
    color: "#333",
    marginBottom: hp("1%"),
    fontWeight: "500",
  },
 
  paymentLabel: {
    fontSize: wp("4%"),
    color: "#333",
    marginTop: hp("0.5%"),
    marginBottom: hp("0.3%"),
    fontWeight: "500",
  },
 
  paymentMethod: {
    fontSize: wp("5%"),
    fontWeight: "800",
    color: "#333333",
    marginBottom: hp("1.2%"),
  },
 
  paymentReceived: {
    fontSize: wp("4.2%"),
    fontWeight: "500",
    color: "#333",
    marginBottom: hp("0.5%"),
    textAlign: "center",
  },
 
  amount: {
    fontSize: wp("8%"),
    fontWeight: "700",
    color: "#1E8E3E",
    marginBottom: hp("0.5%"),
  },
 
  codAmount: {
    fontSize: wp("6.5%"),
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: hp("0.5%"),
  },
  divider: {
    width: "80%",
    height: 1,
    backgroundColor: "#A7D7C5",
    marginVertical: hp("0.8%"),
  },
 
  backButton: {
    marginTop: "auto",
    marginBottom: hp("5%"),
    width: wp("80%"),
    backgroundColor: "#10B7C4",
    paddingVertical: hp("2%"),
    borderRadius: wp("8%"),
    alignItems: "center",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: wp("4.5%"),
    fontWeight: "600",
  },
});
 
 