import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,Image
} from "react-native";
import {

  widthPercentageToDP as wp,

  heightPercentageToDP as hp,

} from "react-native-responsive-screen";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

export default function SuccessfullDelivered({
  amount = 45,
  onBackHome,
  onViewEarnings,
  navigation
}) {
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
        <Text style={styles.amount}>₹{amount}</Text>

        <TouchableOpacity
          style={styles.viewEarningsBtn}
          onPress={onViewEarnings}
          activeOpacity={0.8}
        >
          <Text style={styles.viewEarningsText}>
            View all Earnings →
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackHome}
        activeOpacity={0.9}
      ><TouchableOpacity
  onPress={() => navigation.navigate('HomeDashboard')}
  activeOpacity={0.7}
>
  <Text style={styles.backButtonText}>Back to Home</Text>
</TouchableOpacity>
        {/* <Text style={styles.backButtonText}>Back to Home</Text> */}
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
    fontSize: wp("12%"),
    fontWeight: "700",
    color: "#1E8E3E",
    marginBottom: hp("2%"),
  },

  viewEarningsBtn: {
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.2%"),
    backgroundColor: "#FFFFFF",
    borderRadius: wp("6%"),
  },

  viewEarningsText: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: "black",
  },

  backButton: {
    position: "absolute",
    bottom: hp("4%"),
    width: wp("90%"),
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
