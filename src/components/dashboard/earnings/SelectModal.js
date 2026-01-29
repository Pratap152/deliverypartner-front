import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SelectModal({
  visible,
  title,
  data,
  onSelect,
  onClose,
  keyExtractor,
  labelExtractor,
  selectedValue,
  isItemDisabled,
  isItemHighlighted,
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.overlay}>
        <View style={styles.box}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={data}
            keyExtractor={(item, idx) =>
              keyExtractor ? keyExtractor(item) : String(item) + idx
            }
            renderItem={({ item }) => {
              const disabled = isItemDisabled?.(item);
              const highlighted = isItemHighlighted?.(item);
              const selected = selectedValue === item.week;

              return (
                <TouchableOpacity
                  disabled={disabled}
                  style={[
                    styles.item,
                    disabled && styles.disabledItem,
                    highlighted && styles.highlightItem,
                    selected && styles.selectedItem,
                  ]}
                  onPress={() => {
                    if (!disabled) {
                      onSelect(item);
                      onClose();
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.text,
                      disabled && styles.disabledText,
                      highlighted && styles.highlightText,
                      selected && styles.selectedText,
                    ]}
                  >
                    {labelExtractor ? labelExtractor(item) : String(item)}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  box: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "70%",
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: { fontSize: 18, fontWeight: "700" },
  close: { fontSize: 20 },

  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  disabledItem: {
    backgroundColor: "#f5f5f5",
  },

  highlightItem: {
    backgroundColor: "#ede3ff",
  },

  selectedItem: {
    borderLeftWidth: 4,
    borderLeftColor: "#9c50ff",
  },

  text: { fontSize: 16 },

  disabledText: {
    color: "#aaa",
  },

  highlightText: {
    fontWeight: "800",
    color: "#6b2cff",
  },

  selectedText: {
    color: "#9c50ff",
    fontWeight: "700",
  },
});
