import React from 'react';
import Modal from 'react-native-modal';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';

export default function BookingModal({ visible, slots, onClose, onConfirm }) {
  return (
    <Modal isVisible={visible} onBackdropPress={onClose}>
      <View style={styles.modal}>
        <Text style={styles.modalTitle}>Slot Information</Text>

        <Text style={styles.modalText}>
          Slots Selected: {slots.length}
        </Text>

        <View style={styles.modalActions}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCancel}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onConfirm}>
            <Text style={styles.modalConfirm}>Confirm Slot</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
