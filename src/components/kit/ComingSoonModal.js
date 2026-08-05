import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ComingSoonModal = ({
  visible,
  onClose,
  title = 'Coming Soon',
  message = 'This service will be available soon. Please check back in a future update.',
}) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = getStyles(isTablet);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="time-outline" size={isTablet ? 40 : 32} color="#2F80ED" />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Got it</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ComingSoonModal;

const getStyles = isTablet =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(15, 23, 42, 0.55)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    card: {
      width: '100%',
      maxWidth: isTablet ? 440 : 360,
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 24,
      alignItems: 'center',
    },
    iconWrap: {
      width: isTablet ? 72 : 56,
      height: isTablet ? 72 : 56,
      borderRadius: isTablet ? 36 : 28,
      backgroundColor: '#EFF6FF',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: isTablet ? 22 : 18,
      fontWeight: '700',
      color: '#0F172A',
      marginBottom: 8,
      textAlign: 'center',
    },
    message: {
      fontSize: isTablet ? 18 : 16,
      color: '#29292b',
      textAlign: 'center',
      lineHeight: isTablet ? 24 : 20,
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#142C63',
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 32,
      alignSelf: 'stretch',
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: isTablet ? 18 : 15,
      fontWeight: '700',
    },
  });