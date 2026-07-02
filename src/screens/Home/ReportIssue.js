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
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { orderService } from "../../services/order/OrderService";
const REASONS = [
  "Customer not answering calls",
  "Customer phone switched off",
  "Wrong contact number provided",
  "Customer not reachable at location",
  "Customer rejected the call",
  "Network issue while calling customer",
  "Other",
];

const REASON_CODE_MAP = {
  "Customer not answering calls": "CUSTOMER_NOT_RESPONDING",
  "Customer phone switched off": "CUSTOMER_NOT_RESPONDING",
  "Wrong contact number provided": "INVALID_CONTACT",
  "Customer not reachable at location": "CUSTOMER_NOT_REACHABLE",
  "Customer rejected the call": "CUSTOMER_REJECTED_CALL",
  "Network issue while calling customer": "NETWORK_ISSUE",
  "Other": "OTHER",
};

export default function ReportIssue({ route, navigation }) {
  const { orderId } = route.params;


  const [selectedReason, setSelectedReason] = useState("");
  const [notes, setNotes] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    Alert.alert(
      "Cancel Reporting?",
      "Customer responded? Your entered details will be discarded.",
      [
        {
          text: "Continue Editing",
          style: "cancel",
        },
        {
          text: "Yes, Go Back",
          style: "destructive",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };
  const handleSubmit = async () => {
    if (!selectedReason || submitting) return;

    try {
      setSubmitting(true);

      const reasonCode =
        REASON_CODE_MAP[selectedReason] || "OTHER";

      const reasonText =
        notes?.trim() || selectedReason;

      const res = await orderService.cancelOrder(
        orderId,
        reasonCode,
        reasonText
      );

      Alert.alert(
        "Order Cancelled",
        res.message || "Order cancelled successfully",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: "MainTabs" }],
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error("Cancel order error:", error);

      const msg =
        error.response?.data?.message ||
        "Unable to report issue. Please try again.";

      Alert.alert("Error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = !selectedReason || submitting;

  return (
    <View style={styles.mainContainer}>
      {/* SCROLLABLE CONTENT */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View />

          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="close" size={26} color="#666" />
          </TouchableOpacity>
        </View>
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
          <Ionicons name="chevron-down" size={wp("5%")} color="#777" />
        </TouchableOpacity>

        {/* Notes */}
        <Text style={[styles.label, { marginTop: hp("3%") }]}>
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
          {submitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text
              style={[
                styles.submitText,
                isDisabled && styles.disabledText,
              ]}
            >
              Submit Issue
            </Text>
          )}
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
            <ScrollView>
              {REASONS.map((item, index) => (
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

            </ScrollView>
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
    padding: 5,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp("5%"),
    paddingTop: hp("2.5%"),
    paddingBottom: hp("18%"),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  title: {
    fontSize: wp("6%"),
    fontWeight: "900",
    color: "#000",
  },

  subtitle: {
    marginTop: hp("0.8%"),
    fontSize: wp("4.4%"),
    color: "#777",
  },

  label: {
    marginTop: hp("3%"),
    marginBottom: hp("0.8%"),
    fontSize: wp("3.6%"),
    fontWeight: "500",
    color: "#000",
  },

  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: wp("2.5%"),
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("2%"),
    backgroundColor: "#FFF",
  },

  selectText: {
    fontSize: wp("3.6%"),
    color: "#000",
    flex: 1,
    marginRight: wp("2%"),
  },

  placeholder: {
    color: "#A0A0A0",
  },

  textArea: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: wp("2.5%"),
    padding: wp("4%"),
    minHeight: hp("14%"),
    fontSize: wp("3.6%"),
    color: "#000",
    textAlignVertical: "top",
    backgroundColor: "#FFF",
  },

  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: wp("5%"),
    backgroundColor: "#FFFFFF",
  },

  submitButton: {
    backgroundColor: "#10B7C4",
    paddingVertical: hp("2.2%"),
    marginVertical: hp("2%"),
    borderRadius: wp("8%"),
    alignItems: "center",
  },

  disabledButton: {
    backgroundColor: "#A0DDE2",
  },

  submitText: {
    color: "#FFF",
    fontSize: wp("4%"),
    fontWeight: "600",
  },

  disabledText: {
    color: "#EAF7F9",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    paddingHorizontal: wp("5%"),
  },

  dropdownContainer: {
    backgroundColor: "#FFF",
    borderRadius: wp("3%"),
    paddingVertical: hp("1%"),
    maxHeight: hp("60%"),
  },

  dropdownItem: {
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("4%"),
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  dropdownText: {
    fontSize: wp("3.6%"),
    color: "#000",
  },
});
