import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Ionicons from "react-native-vector-icons/Ionicons";

const SIZE = 160;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CustomerNotResponding({
  title = "Customer Not Responding",
  duration = 120,
  onCallPress,
  onMarkIssuePress,
  onClose,
}) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration]);


  const progress =
    CIRCUMFERENCE - (timeLeft / duration) * CIRCUMFERENCE;
  const isDisabled = timeLeft !== 0;

  // 📞 Call dialer
  const handleCallCustomer = () => {
    const fakeNumber = "tel:9876543210";
    Linking.openURL(fakeNumber).catch(() => {
      console.log("Unable to open dialer");
    });
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons
            name="warning-outline"
            size={18}
            color="#F7931E"
          />
          <Text style={styles.title}>{title}</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            console.log("Close clicked");
            onClose && onClose();
          }}
        >
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.circleBox}>
        <Svg width={SIZE} height={SIZE}>
          <Circle
            stroke="#E6E6E6"
            fill="none"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE}
          />
          <Circle
            stroke="#3558AA"
            fill="none"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={progress}
            strokeLinecap="round"
          />
        </Svg>

        <Text style={styles.timerText}>{timeLeft}</Text>
      </View>

      <Text style={styles.subText}>Wait for {duration} Seconds</Text>

      {/* Buttons */}
      {/* Call Button */}
      <TouchableOpacity
        style={[styles.callBtn, isDisabled && styles.disabledBtn]}
        disabled={isDisabled}
        onPress={handleCallCustomer}
      >
        <Ionicons name="call-outline" size={18} color="#fff" />
        <Text style={styles.btnText}>Call Customer</Text>
      </TouchableOpacity>
      {/* Mark Issue Button */}
      <TouchableOpacity
        style={[styles.issueBtn, isDisabled && styles.disabledBtn]}
        disabled={isDisabled}
        onPress={onMarkIssuePress}
      >
        <Ionicons name="alert-circle-outline" size={18} color="#fff" />
        <Text style={styles.btnText}>Mark as Issue</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 40,
  },

  header: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    marginLeft: 6,
    color: "#F7931E",
    fontWeight: "600",
  },

  circleBox: {
    alignItems: "center",
    justifyContent: "center",
  },

  timerText: {
    position: "absolute",
    fontSize: 38,
    fontWeight: "700",
    color: "#333",
  },

  subText: {
    marginVertical: 16,
    color: "#999",
  },

  callBtn: {
    flexDirection: "row",
    backgroundColor: "#6B6B6B",
    width: "85%",
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: "center",
    marginBottom: 12,
  },

  issueBtn: {
    flexDirection: "row",
    backgroundColor: "#E53935",
    width: "85%",
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: "center",
  },
  disabledBtn: {
    opacity: 0.4,
  },

  btnText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
  },
});
