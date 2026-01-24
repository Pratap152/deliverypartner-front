import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import SlotBookingScreen from '../../screens/dashboard/SlotBookingScreen';
import SlotsNavigator from '../../navigation/SlotsNavigator';
const ActiveShiftBanner = (
) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Shift</Text>
      <Text style={styles.subtitle}>Evening Peak • 6:00 PM - 11:00 PM</Text>
      <Text style={styles.info}>Earn up to 2x during peak hours</Text>

      <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate(SlotsNavigator)}>
        <Text style={styles.buttonText}>Book now and go online</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#6D5DF6',
    borderRadius: wp('4%'),
    padding: wp('4%'),
    marginTop: wp('4%'),
  },
  title: {
    fontSize: wp('4.3%'),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: wp('3.5%'),
    color: '#E0E7FF',
    marginTop: 4,
  },
  info: {
    fontSize: wp('3.4%'),
    color: '#D1D5FF',
    marginTop: 6,
  },
  button: {
    marginTop: wp('3%'),
    backgroundColor: '#FFFFFF',
    paddingVertical: wp('2.5%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
  },
  buttonText: {
    color: '#6D5DF6',
    fontWeight: '700',
    fontSize: wp('3.6%'),
  },
});

export default ActiveShiftBanner;
