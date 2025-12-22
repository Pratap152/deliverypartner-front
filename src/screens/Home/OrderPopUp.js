import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function OrderPoUp() {
  const [visible, setVisible] = useState(true);

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>New Order Received</Text>

          <Text>Pickup: ABC Restaurant</Text>
          <Text>Drop: Customer Location</Text>
          <Text>Distance: 3.2 km</Text>

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
