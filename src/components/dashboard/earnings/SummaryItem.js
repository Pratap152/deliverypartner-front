import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function SummaryItem({ label, value }) {
  const safeLabel =
    typeof label === 'string' || typeof label === 'number'
      ? label
      : '';

  const safeValue =
    typeof value === 'string' || typeof value === 'number'
      ? value
      : '';

  return (
    <View style={styles.item}>
      {safeLabel !== '' && <Text style={styles.label}>{safeLabel}</Text>}
      {safeValue !== '' && <Text style={styles.value}>{safeValue}</Text>}
    </View>
  );
}


const styles = StyleSheet.create({
  item: {
    flex:1
    
  },
  label: {
    fontSize: wp(4),
    color: '#E6F5FF',
   

  },
  value: {
    fontSize: wp(5),
    color: '#E6F5FF',
    fontWeight:'800'
    
  },
});
