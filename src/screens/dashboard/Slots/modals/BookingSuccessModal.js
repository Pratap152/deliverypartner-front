import React from 'react';
import Modal from 'react-native-modal';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';

export default function BookingSuccessModal({ visible, onClose }) {
  return (
    <Modal isVisible={visible}>
      <View style={styles.successModal}>
        <Text style={styles.successTitle}>Slot Booked</Text>
        <Text style={styles.successSub}>Go online & start earning</Text>

        <TouchableOpacity style={styles.successBtn} onPress={onClose}>
          <Text style={styles.successBtnText}>Go Online</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
