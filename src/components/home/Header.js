
import { Image } from '@shopify/react-native-skia';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Header = () => {
  return (
    <View style={styles.container}>
      {/* Left Section */}
      <View style={styles.left}>
        <View style={styles.profileIcon}>
          <Ionicons name="person-outline" size={18} color="#1F2937" />
        </View>

        <Text style={styles.name}>Rajesh</Text>
      </View>

      {/* Right Section */}
      <View style={styles.right}>
        <TouchableOpacity style={styles.location}>
          <Ionicons name="location-outline" size={14} color="#374151" />
          <Text style={styles.locationText}>Hyderabad</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.help}>
          {/* <Ionicons name="help-circle-outline" size={22} color="#1F2937" /> */}
      
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: wp('14%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F6FBFF',
    paddingHorizontal: wp('5%'),
  },

  /* Left */
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    backgroundColor: '#E5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('2.5%'),
  },
  name: {
    fontSize: wp('4.2%'),
    fontWeight: '600',
    color: '#111827',
  },

  /* Right */
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5F3FF',
    paddingHorizontal: wp('3%'),
    paddingVertical: wp('1.2%'),
    borderRadius: wp('5%'),
    marginRight: wp('3%'),
  },
  locationText: {
    fontSize: wp('3.2%'),
    color: '#1F2937',
    marginLeft: 4,
    fontWeight: '500',
  },
  help: {
    padding: wp('1%'),
  },
});

export default Header;
