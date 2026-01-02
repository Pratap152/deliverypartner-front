import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function CancelSlotModal({
  visible,
  slot,
  onClose,
  onConfirm,
}) {
  if (!slot) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.header}>Slot Cancellation</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Day</Text>
            <Text style={styles.value}>{slot.day}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Time</Text>
            <Text style={styles.value}>
              {slot.startTime} - {slot.endTime}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Slot Type</Text>
            <Text style={styles.value}>{slot.slotType}</Text>
          </View>

          <Text style={styles.warning}>
            No amount will be deducted from payout.
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Don’t Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmText}>Yes, Cancel</Text>
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
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
  },

  header: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF3B30",
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },

  label: {
    fontSize: 13,
    color: "#8E8E93",
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },

  warning: {
    fontSize: 12,
    color: "#FF3B30",
    marginTop: 12,
  },

  actions: {
    flexDirection: "row",
    marginTop: 20,
  },

  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D1D6",
    marginRight: 10,
    alignItems: "center",
  },

  cancelText: {
    color: "#000",
    fontWeight: "600",
  },

  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#FF3B30",
    alignItems: "center",
  },

  confirmText: {
    color: "#FFF",
    fontWeight: "700",
  },
});

