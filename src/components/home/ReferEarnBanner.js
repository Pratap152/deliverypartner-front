import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import ReferEarn from '../../assets/ReferEarn.png';
import { useNavigation } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ReferEarnBanner = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={ReferEarn} 
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        <View style={styles.contentWrapper}>
          <View style={styles.textContent}>
            <Text style={styles.title}>Refer & Earn</Text>
            <Text style={styles.title}>with Zest Bot</Text>
            <Text style={styles.subtitle}>
              Invite new delivery partners and earn exciting referral bonuses!
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.button}  
            onPress={() => {navigation.navigate('ReferEarn')}}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Refer Now</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: wp('3%'),
    marginHorizontal: wp('2%'),
    marginVertical: hp('1.8%'),
    overflow: 'hidden',
    height: hp('22%'), // Slightly taller for better proportions
    minHeight: hp('18%'), // Minimum height
    elevation: 0,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '150%',
  },
  imageStyle: {
    borderRadius: wp('3.5%'),
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: wp('6%'),
    paddingTop: hp('3.5%'),
    paddingBottom: hp('3%'),
    justifyContent: 'space-between',
  },
  textContent: {
    flex: 1,
    justifyContent:'flex-start'
  },
  title: {
    fontSize: hp('2%'),
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: hp('1%'),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { 
      width: 0, 
      height: hp('0.15%') 
    },
    textShadowRadius: wp('0.8%'),
    letterSpacing: wp('0.06%'),
    lineHeight: hp('3.2%'),
    maxWidth: wp('70%'), // Limit width for better readability
    textAlign:'right'
  },
  subtitle: {
    fontSize: hp('1.9%'),
    color: '#FFFFFF',
    opacity: 0.95,
    lineHeight: hp('2.5%'),
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { 
      width: 0, 
      height: hp('0.1%') 
    },
    textShadowRadius: wp('0.5%'),
    fontWeight: '400',
    maxWidth: wp('75%'),
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('6%'),
    paddingHorizontal: wp('7%'),
    paddingVertical: hp('1.5%'),
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: hp('0.3%'),
    },
    shadowOpacity: 0.15,
    shadowRadius: wp('1.5%'),
    elevation: 5,
    minWidth: wp('30%'), // Minimum button width
  },
  buttonText: {
    color: '#FF5722',
    fontSize: hp('2%'),
    fontWeight: '700',
    letterSpacing: wp('0.1%'),
    textAlign: 'center',
  },
});

export default ReferEarnBanner;