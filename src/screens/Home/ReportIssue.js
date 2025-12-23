import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";


export default function ReportIssue({
  reasons = [
    "Customer not answering calls",
    "Customer phone switched off",
    "Wrong contact number provided",
    "Customer not reachable at location",
    "Customer rejected the call",
    "Network issue while calling customer",
    "Other",
  ],
  onSubmit,
}) {
  const [selectedReason, setSelectedReason] = useState("");
  const [notes, setNotes] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = () => {
    if (!selectedReason) return;

    const payload = { reason: selectedReason, notes };
    onSubmit ? onSubmit(payload) : console.log(payload);
    Alert.alert("Success", "Issue submitted successfully");
  };

  const isDisabled = !selectedReason;

  return (
    <View style={styles.mainContainer}>
      {/* SCROLLABLE CONTENT */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Report an Issue</Text>
        <Text style={styles.subtitle}>
          Give detailed information about the issue
        </Text>

        {/* Reason */}
        <Text style={styles.label}>Reason</Text>
        <TouchableOpacity
          style={styles.selectBox}
          activeOpacity={0.8}
          onPress={() => setShowDropdown(true)}
        >
          <Text
            style={[
              styles.selectText,
              !selectedReason && styles.placeholder,
            ]}
            numberOfLines={1}
          >
            {selectedReason || "Select reason"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#777" /> 
        </TouchableOpacity>

        {/* Notes */}  
        <Text style={[styles.label, { marginTop: 20 }]}>
          Additional Notes
        </Text>
        <TextInput
          style={styles.textArea}
          placeholder="Enter additional information"
          placeholderTextColor="#A0A0A0"
          multiline
          value={notes}
          onChangeText={setNotes}
        />
      </ScrollView>
      {/* FIXED BOTTOM BUTTON */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            isDisabled && styles.disabledButton,
          ]}
          activeOpacity={0.9}
          disabled={isDisabled}
          onPress={handleSubmit}
        >
          <Text
            style={[
              styles.submitText,
              isDisabled && styles.disabledText,
            ]}
          >
            Submit Issue
          </Text>
        </TouchableOpacity>
      </View>

      {/* DROPDOWN MODAL */}
      <Modal transparent visible={showDropdown} animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.dropdownContainer}>
            {reasons.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedReason(item);
                  setShowDropdown(false);
                }}
              >
                <Text style={styles.dropdownText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 130,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#777",
  },

  label: {
    marginTop: 24,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },

  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "#FFF",
  },

  selectText: {
    fontSize: 14,
    color: "#000",
    flex: 1,
    marginRight: 8,
  },

  placeholder: {
    color: "#A0A0A0",
  },

  textArea: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 14,
    minHeight: 100,
    fontSize: 14,
    color: "#000",
    textAlignVertical: "top",
    backgroundColor: "#FFF",
  },

  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EAEAEA",
  },

  submitButton: {
    backgroundColor: "#10B7C4",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  disabledButton: {
    backgroundColor: "#A0DDE2",
  },

  submitText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },

  disabledText: {
    color: "#EAF7F9",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  dropdownContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 10,
  },

  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  dropdownText: {
    fontSize: 14,
    color: "#000",
  },
});
