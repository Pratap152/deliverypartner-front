import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Ionicons from "react-native-vector-icons/Ionicons";

const SIZE = 120;
const STROKE =8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CustomerNotResponding({
  title = "Customer Not Responding",
  duration = 20,
  onCallPress,
  onMarkIssuePress,
}) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const progress =
    CIRCUMFERENCE - (timeLeft / duration) * CIRCUMFERENCE;

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Ionicons name="warning-outline" size={18} color="#F7931E" />
        <Text style={styles.title}>{title}</Text>
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
            stroke="#00B5C8"
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
      <TouchableOpacity
        style={[
          styles.callBtn,
          timeLeft !== 0 && styles.disabledBtn
        ]}
        disabled={timeLeft !== 0}
        onPress={onCallPress}
      >
        <Ionicons name="call-outline" size={18} color="#fff" />
        <Text style={styles.btnText}>Call Customer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.issueBtn,
          timeLeft !== 0 && styles.disabledBtn
        ]}
        disabled={timeLeft !== 0}
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
  paddingHorizontal: 20,
  alignItems: "center",
},

  header: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 20,
},
title: {
  marginLeft: 8,
  color: "#F7931E",
  fontSize: 14,
  fontWeight: "600",
},

  circleBox: {
    alignItems: "center",
    justifyContent: "center",
  },

 timerText: {
  position: "absolute",
  fontSize: 32,
  fontWeight: "700",
  color: "#2B2B2B",
},


  subText: {
  marginVertical: 12,
  color: "#9E9E9E",
  fontSize: 13,
},


callBtn: {
  flexDirection: "row",
  backgroundColor: "#00B5C8",
  width: "100%",
  paddingVertical: 14,
  borderRadius: 10,
  justifyContent: "center",
  marginTop: 10,
},

issueBtn: {
  flexDirection: "row",
  backgroundColor: "#E53935",
  width: "100%",
  paddingVertical: 14,
  borderRadius: 10,
  justifyContent: "center",
  marginTop: 12,
},

disabledBtn: {
  backgroundColor: "#DADADA",
},


  
  btnText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
  },

  
});
