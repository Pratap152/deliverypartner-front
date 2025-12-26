import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ReferralBanner from '../Home/ReferralBanner';
import Clipboard from "@react-native-clipboard/clipboard";
import { Alert } from "react-native";
import { Share } from "react-native";


import {

  widthPercentageToDP as wp,

  heightPercentageToDP as hp,

} from "react-native-responsive-screen";
const { width } = Dimensions.get("window");

export default function ReferEarn({navigation}) {
  const referralCode = "ABDIJIEOPJI1234";

const copyToClipboard = () => {
  Clipboard.setString(referralCode);
  Alert.alert("Copied!", "Referral code copied to clipboard");
};
const shareReferralCode = async () => {
  try {
    await Share.share({
      message: `Join using my referral code: ${referralCode} and start earning! 🚀`,
    });
  } catch (error) {
    console.log("Share error:", error);
  }
};
  return (
      
      <ScrollView contentContainerStyle={styles.container}>
      <ReferralBanner />
    <View style={styles.container}>
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
          <TouchableOpacity onPress={copyToClipboard}>
            <MaterialIcons name="content-copy" size={22} />
          </TouchableOpacity>

          <TouchableOpacity style={{ marginLeft: 12 }} onPress={shareReferralCode}>
            <MaterialIcons name="share" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Refer Now Button */}
      <TouchableOpacity style={styles.button} onPress={()=>{navigation.navigate('ReferFrd')}}>
        <Text style={styles.buttonText}>Refer Now</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp("2.5%"),
    paddingHorizontal: wp("5%"),
  },

  title: {
    marginHorizontal: wp("3%"),
    fontSize: wp("5%"),
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
    paddingHorizontal: wp("5%"),
  },

  card: {
    width: "47%",
    borderRadius: wp("4%"),
    padding: wp("4%"),
  },

  greenCard: {
    backgroundColor: "#F54900",
    borderRadius:wp("5%")
  },

  orangeCard: {
    backgroundColor: "#F54900",
  },

  cardValue: {
    color: "#fff",
    fontSize: wp("6%"),
    fontWeight: "bold",
    marginTop: hp("1%"),
  },

  cardLabel: {
    color: "#fff",
    fontSize: wp("3.2%"),
    marginTop: hp("0.5%"),
  },

  codeBox: {
    margin: wp("5%"),
    padding: wp("4%"),
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: wp("3%"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  codeText: {
    fontSize: wp("4%"),
    fontWeight: "600",
    letterSpacing: 1,
  },

  iconRow: {
    flexDirection: "row",
  },

  button: {
    backgroundColor: "#2E8B57",
    marginVertical:wp("40%"),
    marginHorizontal: wp("10%"),
    paddingVertical: hp("2%"),
    borderRadius: wp("10%"),
    alignItems: "center",
    marginBottom: hp("3%"),
  },

  buttonText: {
    color: "#fff",
    fontSize: wp("4.2%"),
    fontWeight: "600",
  },
});
