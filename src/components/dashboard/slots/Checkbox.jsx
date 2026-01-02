import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Checkbox({ checked, onPress, disabled = false }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,
        disabled && styles.disabled,
      ]}
    >
      <View
        style={[
          styles.box,
          checked && styles.checkedBox,
        ]}
      >
        {checked && (
          <Ionicons
            name="checkmark"
            size={14}
            color="#FFF"
          />
        )}
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 4,
  },

  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#C7C7CC",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },

  checkedBox: {
    backgroundColor: "#4C4CFF",
    borderColor: "#4C4CFF",
  },

  disabled: {
    opacity: 0.5,
  },
});
