import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function BookSlotModal({ visible, slots, onClose, onConfirm }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Slot Information</Text>

          {slots.map((s) => (
            <Text key={s.slotId}>
              {s.day} • {s.startTime} - {s.endTime}
            </Text>
          ))}

          <TouchableOpacity style={styles.confirm} onPress={onConfirm}>
            <Text style={styles.text}>Confirm Slot</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFF",
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  title: { fontWeight: "700", marginBottom: 10 },
  confirm: {
    backgroundColor: "#4C4CFF",
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
  },
  text: { color: "#FFF", textAlign: "center" },
  cancel: { textAlign: "center", marginTop: 10 },
});
