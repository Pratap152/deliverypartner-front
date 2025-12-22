import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";

export default function ReportIssue() {
  const [selectedIssue, setSelectedIssue] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    console.log("Issue:", selectedIssue);
    console.log("Comment:", comment);
    // API call / navigation can be added here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report Issue</Text>

      {/* Issue options */}
      <TouchableOpacity
        style={[
          styles.option,
          selectedIssue === "CUSTOMER_NOT_RESPONDING" && styles.active,
        ]}
        onPress={() => setSelectedIssue("CUSTOMER_NOT_RESPONDING")}
      >
        <Text>Customer not responding</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          selectedIssue === "WRONG_ADDRESS" && styles.active,
        ]}
        onPress={() => setSelectedIssue("WRONG_ADDRESS")}
      >
        <Text>Wrong address</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          selectedIssue === "PAYMENT_ISSUE" && styles.active,
        ]}
        onPress={() => setSelectedIssue("PAYMENT_ISSUE")}
      >
        <Text>Payment issue</Text>
      </TouchableOpacity>

      {/* Comment box */}
      <TextInput
        placeholder="Add comments (optional)"
        value={comment}
        onChangeText={setComment}
        style={styles.input}
        multiline
      />

      {/* Submit */}
      <TouchableOpacity
        style={[
          styles.submitBtn,
          !selectedIssue && { opacity: 0.5 },
        ]}
        disabled={!selectedIssue}
        onPress={handleSubmit}
      >
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}
