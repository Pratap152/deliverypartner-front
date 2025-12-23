import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

export default function ReferEarn() {
  return (
    <View style={styles.container}>
      {/* Top Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Earn upto</Text>
        <Text style={styles.amount}>₹1000</Text>
        <Text style={styles.bannerText}>For every referral</Text>

        <Image
        source={require('../../assets/Earn.png')}
        style={styles.moneyBagImage}
      />
      </View>

      {/* Refer & Earn Title */}
      <View style={styles.titleRow}>
        <View style={styles.line} />
        <Text style={styles.title}>Refer & Earn</Text>
        <View style={styles.line} />
      </View>

      {/* Info Cards */}
      <View style={styles.cardRow}>
        <View style={[styles.card, styles.greenCard]}>
          <Ionicons name="people" size={28} color="#fff" />
          <Text style={styles.cardValue}>5</Text>
          <Text style={styles.cardLabel}>Joined people</Text>
        </View>

        <View style={[styles.card, styles.orangeCard]}>
          <Ionicons name="wallet" size={28} color="#fff" />
          <Text style={styles.cardValue}>₹5120</Text>
          <Text style={styles.cardLabel}>Total Earnings</Text>
        </View>
      </View>

      {/* Referral Code */}
      <View style={styles.codeBox}>
        <Text style={styles.codeText}>ABDIJIEOPJI1234</Text>

        <View style={styles.iconRow}>
          <TouchableOpacity>
            <MaterialIcons name="content-copy" size={22} />
          </TouchableOpacity>

          <TouchableOpacity style={{ marginLeft: 12 }}>
            <MaterialIcons name="share" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Refer Now Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Refer Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  banner: {
    backgroundColor: "#019C5D",
    height: width * 0.65,
    padding: 20,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    justifyContent: "center",
  },

  bannerText: {
    color: "#fff",
    fontSize: 20,
  },

  amount: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#FFD54F",
    marginVertical: 5,
  },

  illustration: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 20,
  },

  title: {
    marginHorizontal: 10,
    fontWeight: "600",
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  card: {
    width: "47%",
    borderRadius: 14,
    padding: 16,
  },

  greenCard: {
    backgroundColor: "#2ECC71",
  },

  orangeCard: {
    backgroundColor: "#FF6F00",
  },

  cardValue: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 6,
  },

  cardLabel: {
    color: "#fff",
    fontSize: 13,
    marginTop: 2,
  },

  codeBox: {
    margin: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  codeText: {
    fontWeight: "600",
    letterSpacing: 1,
  },

  iconRow: {
    flexDirection: "row",
  },

  button: {
    backgroundColor: "#2E8B57",
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
