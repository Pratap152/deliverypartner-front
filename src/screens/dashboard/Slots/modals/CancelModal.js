import React from 'react';
import Modal from 'react-native-modal';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';

export default function CancelModal({ visible, slots, onClose, onConfirm }) {
  return (
    <Modal isVisible={visible} onBackdropPress={onClose}>
      <View style={styles.modalDanger}>
        <Text style={styles.modalTitle}>Slot Cancellation</Text>

        <Text style={styles.modalText}>
          Cancelling {slots.length} slot(s)
        </Text>

        <Text style={styles.warning}>
          No amount will be deducted from payout
        </Text>

        <View style={styles.modalActions}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCancel}>Don't Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onConfirm}>
            <Text style={styles.modalDangerText}>Yes, Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
