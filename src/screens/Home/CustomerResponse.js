import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,Image
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");
export default CustomerResponse = ({
  amount = 45,
  onBackHome,
  onViewEarnings,
}) => {
  return (
    <View style={styles.container}>
      {/* Success Icon */}
      <View style={styles.iconWrapper}>
  <View style={styles.outerCircle}>
    <Image
      source={require("../../assets/success.png")}
      style={styles.successImage}
      resizeMode="contain"
    />
  </View>
</View>


      {/* Success Text */}
      <Text style={styles.successTitle}>Delivery Completed</Text>
      <Text style={styles.successSubtitle}>Successfully</Text>

      {/* Earnings Card */}
      <View style={styles.earningsCard}>
        <Text style={styles.earningsTitle}>Earnings Added</Text>
        <Text style={styles.amount}>₹{amount}</Text>

        <TouchableOpacity
          style={styles.viewEarningsBtn}
          activeOpacity={0.8}
          onPress={onViewEarnings}
        >
          <Text style={styles.viewEarningsText}>
            View all Earnings →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Button */}
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.9}
        onPress={onBackHome}
      >
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  /* Icon */
  iconWrapper: {
    marginBottom: 30,
  },
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#DFF5E6",
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Text */
  successTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E8E3E",
  },
  successSubtitle: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "600",
    color: "#1E8E3E",
  },

  /* Earnings Card */
  earningsCard: {
    marginTop: 30,
    width: width * 0.75,
    backgroundColor: "#E8FFF5",
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
  },
  earningsTitle: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  amount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E8E3E",
    marginBottom: 10,
  },
  viewEarningsBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
  },
  viewEarningsText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E8E3E",
  },

  /* Bottom Button */
  backButton: {
    position: "absolute",
    bottom: 30,
    width: "90%",
    backgroundColor: "#10B7C4",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  successImage: {
  width: 200,
  height: 200,
},

});
