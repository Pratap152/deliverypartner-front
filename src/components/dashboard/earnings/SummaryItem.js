import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function SummaryItem({ label, value }) {
  return (
    <View style={styles.item}>
      {label && <Text style={styles.label}>{label}</Text>}
      {value && <Text style={styles.value}>{value}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flex:1
    
  },
  label: {
    fontSize: wp(4),
    color: '#6B7280',

  },
  value: {
    fontSize: wp(4),
    fontWeight: '500',
    
  },
});
