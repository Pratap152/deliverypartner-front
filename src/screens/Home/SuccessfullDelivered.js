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

  const getSuccessMessage = () => {
    if (paymentMethod === 'ONLINE') {
      return "money is collected using online payment";
    }
    return "money is collected using cash";
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/success.png")}
        style={styles.successImage}
        resizeMode="contain"
      />

      <Text style={styles.successTitle}>Delivery Completed</Text>
      <Text style={styles.successSubtitle}>Successfully</Text>
      <Text style={styles.paymentMethodText}>{getSuccessMessage()}</Text>

      <View style={styles.earningsCard}>
        <Text style={styles.earningsTitle}>Earnings Added</Text>
        <Text style={styles.amount}>₹{roundedAmount}</Text>

        {(codCollected > 0 || paymentMethod === 'CASH' || paymentMethod === 'ONLINE') && (
          <>
            <View style={styles.divider} />
            <Text style={[styles.earningsTitle, { marginTop: 10 }]}>
              {paymentMethod === 'ONLINE' ? 'Online Payment Received' : 'Cash Collected'}
            </Text>
            <Text style={styles.codAmount}>₹{codCollected || 0}</Text>
          </>
        )}
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
  paymentMethodText: {
    fontSize: wp("4%"),
    color: "#4B5563",
    marginTop: hp("1%"),
    fontWeight: "500",
    textAlign: 'center',
  },

  earningsCard: {
    marginTop: hp("4%"),
    width: wp("80%"),
    backgroundColor: "#d4f5e7ff",
    borderRadius: wp("4%"),
    paddingVertical: hp("4%"),
    alignItems: "center",
  },

  earningsTitle: {
    fontSize: wp("5%"),
    color: "#333",
    marginBottom: hp("1%"),
    fontWeight: "500",
  },

  amount: {
    fontSize: wp("10%"),
    fontWeight: "700",
    color: "#1E8E3E",
    marginBottom: hp("1%"),
  },

  codAmount: {
    fontSize: wp("8%"),
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: hp("1%"),
  },

  divider: {
    width: '80%',
    height: 1,
    backgroundColor: '#A7D7C5',
    marginVertical: hp('1.5%'),
  },

  backButton: {
    position: "absolute",
    bottom: hp("4%"),
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
