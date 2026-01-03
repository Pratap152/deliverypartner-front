import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function BookSlotModal({ visible, slots, date: selectedDateStr, onClose, onConfirm }) {
  if (!visible) return null;

  // Helper: 12h format
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    let hours = parseInt(h, 10);
    const suffix = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, "0")}:${m} ${suffix}`;
  };

  // Helper: Get Full Date String (e.g. "Tuesday, 10 Oct")
  const getFormattedDate = (dateStr) => {
    if (!dateStr) return "Selected Day";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Selected Day";
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    return d.toLocaleDateString('en-US', options);
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>

          {/* --- HEADER --- */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Slot Information</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* --- SLOTS LIST --- */}
            {slots.map((slot, index) => (
              <View key={slot.slotId} style={[styles.slotCard, index > 0 && styles.slotCardBorder]}>
                {/* Day Row */}
                <View style={styles.row}>
                  <View style={[styles.iconBox, { backgroundColor: "#EBF5FF" }]}>
                    <Ionicons name="calendar-outline" size={20} color="#4C4CFF" />
                  </View>
                  <View>
                    <Text style={styles.label}>Day</Text>
                    {/* Use getFormattedDate with fallback to passed prop */}
                    <Text style={styles.value}>
                      {getFormattedDate(slot.date || selectedDateStr)}
                    </Text>
                  </View>
                </View>

                {/* Time Row */}
                <View style={styles.row}>
                  <View style={[styles.iconBox, { backgroundColor: "#F3E8FF" }]}>
                    <Ionicons name="time-outline" size={20} color="#9333EA" />
                  </View>
                  <View>
                    <Text style={styles.label}>Time</Text>
                    <Text style={styles.value}>
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </Text>
                  </View>
                </View>

                {/* Type/Earnings Row (Mock data based on UI image) */}
                <View style={styles.row}>
                  <View style={[styles.iconBox, { backgroundColor: "#FEE2E2" }]}>
                    <Ionicons name="alert-circle-outline" size={20} color="#EF4444" />
                  </View>
                  <View>
                    <Text style={styles.label}>Slot Type</Text>
                    <Text style={styles.value}>FILLING FAST</Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.iconBox, { backgroundColor: "#DCFCE7" }]}>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#16A34A" />
                  </View>
                  <View>
                    <Text style={styles.label}>Additional Earnings</Text>
                    <Text style={styles.value}>Yes</Text>
                  </View>
                </View>
              </View>
            ))}

            {/* --- RULES SECTION --- */}
            <View style={styles.rulesContainer}>
              <Text style={styles.rulesTitle}>Rules / Conditions</Text>
              <View style={styles.ruleItem}>
                <View style={styles.dot} />
                <Text style={styles.ruleText}>Mandatory login is required.</Text>
              </View>
              <View style={styles.ruleItem}>
                <View style={styles.dot} />
                <Text style={styles.ruleText}>No-show penalty may apply.</Text>
              </View>
              <View style={styles.ruleItem}>
                <View style={styles.dot} />
                <Text style={styles.ruleText}>Late login reduces priority.</Text>
              </View>
            </View>

            {/* --- WARNING BOX --- */}
            <View style={styles.warningBox}>
              <Ionicons name="warning-outline" size={20} color="#D97706" style={{ marginRight: 10 }} />
              <Text style={styles.warningText}>
                Please review all information carefully before confirming your slot booking.
              </Text>
            </View>

          </ScrollView>

          {/* --- FOOTER BUTTONS --- */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmText}>Confirm Slot</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)", // Darker overlay
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    width: "100%",
    maxHeight: SCREEN_HEIGHT * 0.85,
    overflow: "hidden",
  },

  // Header
  header: {
    backgroundColor: "#4C4CFF",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },

  // Scroll Area
  scrollContainer: {
    maxHeight: "70%",
  },
  scrollContent: {
    padding: 20,
  },

  // Slot Card
  slotCard: {
    marginBottom: 24,
  },
  slotCardBorder: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  label: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "600",
  },

  // Rules
  rulesContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 20,
    marginBottom: 20,
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 16,
  },
  ruleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#00BCD4", // Cyan bullet
    marginTop: 8,
    marginRight: 12,
  },
  ruleText: {
    fontSize: 14,
    color: "#4B5563",
    flex: 1,
    lineHeight: 20,
  },

  // Warning
  warningBox: {
    backgroundColor: "#FFFBEB", // Light Yellow
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  warningText: {
    fontSize: 13,
    color: "#92400E", // Dark Orange/Brown
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },

  // Footer
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  cancelText: {
    color: "#4B5563",
    fontWeight: "600",
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#4C4CFF", // Match App Theme
    alignItems: "center",
    justifyContent: "center",
  },
  confirmText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
