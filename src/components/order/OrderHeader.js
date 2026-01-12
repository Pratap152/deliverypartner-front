import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


const OrderHeader = ({ orderId, statusText, icon, onIconPress }) => {
  const iconSource =
    icon === 'call'
      ? require('../../assets/call.png')
      : require('../../assets/help.png');

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Order#{orderId}</Text>
        <Text style={styles.subtitle}>{statusText}</Text>
      </View>

      <TouchableOpacity style={styles.iconWrapper} onPress={onIconPress}>
        <Image source={iconSource} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

export default memo(OrderHeader);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp('1.5%'),
  },
  title: {
    fontSize: wp('5.5%'),
    fontWeight: '700',
  },
  subtitle: {
    fontSize: wp('3.2%'),
    color: '#6B6B6B',
    marginTop: hp('0.3%'),
  },
  iconWrapper: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: '#E8F7F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: wp('5%'),
    height: wp('5%'),
  },
});
