import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const EnableGPSModal = ({ visible, onAllow, onDeny }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Icon */}
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>📍</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Enable GPS</Text>

          {/* Description */}
          <Text style={styles.description}>
            To go online and receive orders, we need access to your GPS.
            Please enable location services.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.allowButton}
              onPress={onAllow}
              activeOpacity={0.8}
            >
              <Text style={styles.allowText}>Allow</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.denyButton}
              onPress={onDeny}
              activeOpacity={0.8}
            >
              <Text style={styles.denyText}>Deny</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EnableGPSModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E0F7F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    fontSize: 22,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  allowButton: {
    backgroundColor: "#00A6A6",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  allowText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  denyButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  denyText: {
    color: "#333",
    fontWeight: "500",
    fontSize: 15,
  },
});
