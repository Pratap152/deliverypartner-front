import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";

export default function CustomerResponse() {
  const customerNumber = "9876543210";

  const handleCallCustomer = () => {
    Linking.openURL(`tel:${customerNumber}`);
  };

  const handleWait = () => {
    console.log("Waiting for customer...");
  };

  const handleReportIssue = () => {
    console.log("Issue reported to support");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Not Responding</Text>

      <Text style={styles.description}>
        The customer is not responding to calls. Please try again or report the issue.
      </Text>

      <TouchableOpacity style={styles.primaryBtn} onPress={handleCallCustomer}>
        <Text style={styles.primaryText}>Call Customer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn} onPress={handleWait}>
        <Text style={styles.secondaryText}>Wait 5 Minutes</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleReportIssue}>
        <Text style={styles.reportText}>Report Issue</Text>
      </TouchableOpacity>
    </View>
  );
}
