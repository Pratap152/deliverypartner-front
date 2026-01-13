import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const OrderActions = ({ actions, onActionPress }) => {
  return (
    <View style={styles.container}>
      {actions.map((action, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            action.type === 'secondary' && styles.secondary,
          ]}
          onPress={() => onActionPress(action)} 
        >
          <Text
            style={[
              styles.text,
              action.type === 'secondary' && styles.secondaryText,
            ]}
          >
            {action.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default memo(OrderActions);
const styles = StyleSheet.create(
  { container: { marginTop: 'auto', }, 
  button: { backgroundColor: '#E5ECFF', paddingVertical: hp('1.8%'), borderRadius: wp('12%'), alignItems: 'center', marginBottom: hp('1%'), }, secondary: { backgroundColor: '#FFF4E5', }, text: { fontSize: wp('3.6%'), fontWeight: '600', }, secondaryText: { color: '#D97A00', }, });