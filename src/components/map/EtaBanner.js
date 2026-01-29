import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EtaBanner = ({ eta }) => (
  <View style={styles.container}>
    <Text style={styles.text}>🚴 ETA: {eta}</Text>
  </View>
);

export default EtaBanner;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 4,
  },
  text: {
    fontWeight: '700',
  },
});
