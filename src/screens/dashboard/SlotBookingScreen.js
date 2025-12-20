import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const SlotBookingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Coming Soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  heading: {
    fontSize: 29,
    fontWeight: '700',
    color: '#0CBACE',
  },
});

export default SlotBookingScreen;
