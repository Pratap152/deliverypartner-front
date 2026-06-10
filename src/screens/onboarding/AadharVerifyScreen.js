import React, {useCallback}from 'react';

import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  Alert
} from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import {
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import OTPInputBox from '../../components/common/OTPInputBox';

import { useDispatch } from 'react-redux';

import { COLORS } from '../../utils/colors';
import { isOtpFilled } from '../../utils/helpers';

import useOtpVerification from '../../hooks/useOtpVerification';
import DeviceInfo from 'react-native-device-info';

const isTablet = DeviceInfo.isTablet();
const containerMaxWidth = isTablet ? 900 : '100%';

const OTP_LENGTH = 6;
const AadhaarOtpVerificationScreen = ({ route }) => {

  useFocusEffect(
    useCallback(() => {
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
  const aadharNumber = route?.params?.aadharNumber;

  const dispatch = useDispatch();

  const {
    inputRefs,
    otp,
    loading,
    error,
    success,
    handleChange,
    handleKeyPress,
    handlePress,
    handleSubmit,
  } = useOtpVerification(OTP_LENGTH);

  const handleOnSuccess = () => {
    navigation.replace('SplashScreen');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.screenWrapper}>
        <View style={styles.container}>

          <View style={{ alignItems: 'center' }}>
            <Image
              source={require('../../assets/aadhaar.png')}
              style={{
                width: 110,
                height: 110,
              }}
              resizeMode="contain"
            />
          </View>
          <View style={styles.form}>
            <Text style={[styles.title, isTablet && { textAlign: 'center' }]}>Enter OTP</Text>
            <Text style={[styles.description, isTablet && { textAlign: 'center' }]}>
              OTP was sent on your registrated mobile number
            </Text>

            <View style={[isTablet && { width: '100%', maxWidth: 400 }]}>
              <OTPInputBox
                otp={otp}
                inputRefs={inputRefs}
                handleChange={handleChange}
                handleKeyPress={handleKeyPress}
                handlePress={handlePress}
              />
            </View>

            {error && <Text style={[styles.error, isTablet && { textAlign: 'center' }]}>{error}.</Text>}
            {success && (
              <Text style={[styles.successText, isTablet && { textAlign: 'center' }]}>
                {success || 'OTP Verified successfully.'}
              </Text>
            )}

            <TouchableOpacity
              onPress={() => handleSubmit(aadharNumber, handleOnSuccess)}
              disabled={!isOtpFilled(otp) || loading}
              style={[styles.btn, isOtpFilled(otp) && styles.activeBg]}
            >
              {loading ? (
                <ActivityIndicator size={'small'} color={'white'} />
              ) : (
                <Text
                  style={[
                    styles.btnText,
                    isOtpFilled(otp) && styles.activeTextColor,
                  ]}
                >
                  Verify OTP
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AadhaarOtpVerificationScreen;

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: containerMaxWidth,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
  },
  form: {
    marginTop: 10,
    paddingHorizontal: 30,
    ...(isTablet && { alignItems: 'center', width: '100%' }),
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: responsiveFontSize(2.7),
    fontWeight: '500',
    color: COLORS.black,
    lineHeight: 40,
  },
  description: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
    color: COLORS.black60,
    marginTop: 10,
    marginBottom: 20,
  },

  btn: {
    height: 54,
    width: '100%',
    maxWidth: isTablet ? 400 : '100%',
    backgroundColor: COLORS.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    borderRadius: 30,
    cursor: 'pointer',
  },
  btnText: {
    fontFamily: 'Roboto',
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  activeBg: {
    backgroundColor: COLORS.primary,
  },
  activeTextColor: {
    color: COLORS.white,
  },
  activeBorder: {
    borderColor: COLORS.primary,
  },
  error: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.error,
    marginTop: -5,
  },
  successText: {
    color: COLORS.success,
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
  },
});
