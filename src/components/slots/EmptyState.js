import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const EmptyState = ({
  title = 'No Data Available',
  message = 'Nothing to display.',
}) => {
  return (
    <View style={styles.container}>
      <Ionicons
        name="calendar-clear-outline"
        size={70}
        color="#CBD5E1"
      />

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.message}>
        {message}
      </Text>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 70,
  },

  title: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },

  message: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});