import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';

const ToastView = ({ icon, bgColor, text1, text2 }) => (
  <View style={[styles.toastContainer, { backgroundColor: bgColor }]}>
    <Icon name={icon} size={24} color="#FFFFFF" />

    <View style={styles.textContainer}>
      <Text style={styles.title}>{text1}</Text>
      <Text style={styles.message}>{text2}</Text>
    </View>
  </View>
);

const toastConfig = {
  success: (props) => (
    <ToastView
      {...props}
      icon="checkmark-circle"
      bgColor="blue"
    />
  ),

  error: (props) => (
    <ToastView
      {...props}
      icon="close-circle"
      bgColor="#D32F2F"
    />
  ),
};

const ToastComponent = () => {
  return <Toast config={toastConfig} />;
};

export default ToastComponent;

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 40,
    width: '90%',
    alignSelf: 'center',
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  message: {
    color: '#F2F2F2',
    fontSize: 13,
    marginTop: 2,
  },
});
