import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, BackHandler, Alert } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';
import { getOnboardingStatus } from '../../services/onboardingApi';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaView } from 'react-native-safe-area-context';

const isTablet = DeviceInfo.isTablet();
const containerMaxWidth = isTablet ? 900 : '100%';

const POLL_INTERVAL = 8000; // 8 seconds

const ProcessingVerificationScreen = () => {

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Exit App",
          "Are you sure you want to exit the app?",
          [
            {
              text: "No",
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: () => BackHandler.exitApp(),
            },
          ]
        );

        return true; // Prevent default behavior
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.screenWrapper}>
        <View style={styles.container}>
          <Image source={require('../../assets/Notify.png')} style={styles.image} />
          <Text style={styles.text}>
            We will notify once the verification is{'\n'}
            successfully completed
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProcessingVerificationScreen;

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: containerMaxWidth,
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
    fontSize: isTablet ? 24 : responsiveFontSize(2.2),
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
    lineHeight: isTablet ? 36 : responsiveHeight(3),
  },
});
