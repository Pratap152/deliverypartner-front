import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  Animated,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";


const STATUS_LABEL = {
  ASSIGNED: "Go to Pickup",
  RIDER_EN_ROUTE_TO_PICKUP: "Heading to Pickup",
  RIDER_ARRIVED_AT_PICKUP: "Reached Pickup",
  PICKED_UP: "Order Picked Up",
  IN_TRANSIT: "Heading to Customer",
  RIDER_ARRIVED_AT_DROP: "Reached Customer",
};

export default function ActiveOrderCard({ activeOrder }) {
  const navigation = useNavigation();
  const shakeAnim = React.useRef(new Animated.Value(0)).current;
  useFocusEffect(
    React.useCallback(() => {
      Vibration.vibrate(300);

      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }, [activeOrder?.orderId])
  );
  const handleNavigation = () => {
    switch (activeOrder.currentStatus) {
      case "ASSIGNED":
        navigation.navigate("OrderDetailsScreen", {
          orderId: activeOrder.orderId,
          status: "ASSIGNED",
        });
        break;

      case "RIDER_EN_ROUTE_TO_PICKUP":
        navigation.navigate("MapScreen", {
          orderId: activeOrder.orderId,
          type: "navigateToPickup",
        });
        break;

      case "RIDER_ARRIVED_AT_PICKUP":
        navigation.navigate("OrderDetailsScreen", {
          orderId: activeOrder.orderId,
          status: "RIDER_ARRIVED_AT_PICKUP",
        });
        break;

      case "PICKED_UP":
      case "IN_TRANSIT":
        navigation.navigate("MapScreen", {
          orderId: activeOrder.orderId,
          type: "navigateToDrop",
        });
        break;

      case "RIDER_ARRIVED_AT_DROP":
        navigation.navigate("OrderDetailsScreen", {
          orderId: activeOrder.orderId,
          status: "RIDER_ARRIVED_AT_DROP",
        });
        break;
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handleNavigation}>
      <Animated.View
        style={{
          transform: [{ translateX: shakeAnim }],
        }}
      >
        <LinearGradient
          colors={["#FFEFEF", "#f98080"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >

          <View style={styles.left}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="bicycle"
                size={26}
                color="#2563EB"
              />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>Active Order</Text>

              <Text style={styles.subtitle}>
                {STATUS_LABEL[activeOrder.currentStatus]}
              </Text>
            </View>
          </View>

          <View style={styles.resumeButton}>

            <Ionicons
              name="arrow-forward"
              size={18}
              color="#2563EB"
            />
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: hp("2%"),
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderColor: "#fa0606",
    borderWidth: 1,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#7CB9FF",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },

  textContainer: {
    marginLeft: 14,
    flex: 1,
  },

  title: {
    fontSize: wp("4.5%"),
    fontWeight: "700",
    color: "#173B6C",
  },

  subtitle: {
    marginTop: 5,
    fontSize: wp("3.6%"),
    color: "#4B5563",
  },

  resumeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
});