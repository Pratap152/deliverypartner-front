import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import ProfileNavigator from '../../navigation/ProfileNavigator';

const Header = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* LEFT SIDE */}
      <View style={styles.left}>
        <TouchableOpacity
          style={styles.profileWrapper}
          onPress={() => navigation.navigate(ProfileNavigator)}
        >
          <Image
            source={require('../../assets/profile.png')}
            style={styles.profileIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.name}>Rajesh</Text>
      </View>

      {/* RIGHT SIDE */}
      <View style={styles.right}>
        <TouchableOpacity style={styles.rightIconWrapper}>
          <Image
            source={require('../../assets/Location.png')}
            style={styles.rightIcons}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.rightIconWrapper}>
          <Image
            source={require('../../assets/help.png')}
            style={styles.rightIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  /* HEADER */
  container: {
    height: wp('14%'),
    backgroundColor: '#F6FBFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: wp('2%'),
  },

  /* LEFT */
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: wp('4.4%'),
    fontWeight: '600',
    color: '#111827',
  },

  /* PROFILE ICON (BIGGER) */
  profileWrapper: {
    width: wp('11%'),
    height: wp('11%'),
    borderRadius: wp('5.5%'),
    backgroundColor: '#E5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
    marginTop: wp('1.5%'),
  },
  profileIcon: {
    width: wp('12.5%'),
    height: wp('12.5%'),
    marginTop: wp('0.5%'),
  },

  /* RIGHT ICONS (SLIGHTLY SMALLER) */
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightIconWrapper: {
    width: wp('11%'),
    height: wp('11%'),
    borderRadius: wp('4.75%'),
    backgroundColor: '#E5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp('3%'),
  },
  rightIcon: {
    width: wp('6.2%'),
    height: wp('6.2%'),
  },
  rightIcons: {
    width: wp('12.5%'),
    height: wp('12.5%'),
  },
});

export default Header;
