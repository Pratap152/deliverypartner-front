import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';
import { getOnboardingStatus } from '../../services/onboardingApi';

const POLL_INTERVAL = 8000; // 8 seconds

const ProcessingVerificationScreen = () => {
  const navigation = useNavigation();
  const intervalRef = useRef(null);

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const res = await getOnboardingStatus();

        if (
          res?.success &&
          res?.onboardingProgress?.kycCompleted &&
          res?.isFullyRegistered
        ) {
          // stop polling
          clearInterval(intervalRef.current);

          // always go through splash
          navigation.replace('SplashScreen');
        }
      } catch (err) {
        console.log('Verification polling error:', err);
      }
    };

    // 🔹 first check immediately
    checkVerificationStatus();

    // 🔹 then poll every 8 seconds
    intervalRef.current = setInterval(checkVerificationStatus, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/Notify.png')} style={styles.image} />
      <Text style={styles.text}>
        We will notify once the verification is{'\n'}
        successfully completed
      </Text>
    </View>
  );
};

export default ProcessingVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(5),
  },

  image: {
    width: responsiveWidth(70),
    height: responsiveHeight(35),
    resizeMode: 'contain',
    marginBottom: responsiveHeight(3),
  },

  text: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
    lineHeight: responsiveHeight(3),
  },
});
