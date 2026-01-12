import React from 'react';

import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/common/Header';
import OTPInputBox from '../../components/common/OTPInputBox';

import { useDispatch } from 'react-redux';
import { verifyDocument } from '../../redux/slices/documentsVerificationSlice';

import { COLORS } from '../../utils/colors';
import { isOtpFilled } from '../../utils/helpers';

import useOtpVerification from '../../hooks/useOtpVerification';

const OTP_LENGTH = 6;
const AadhaarOtpVerificationScreen = ({ route }) => {
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
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header />

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
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.description}>
            OTP was sent on your registrated mobile number
          </Text>

          <OTPInputBox
            otp={otp}
            inputRefs={inputRefs}
            handleChange={handleChange}
            handleKeyPress={handleKeyPress}
            handlePress={handlePress}
          />

          {/* <OtpInput
            otp={otp}
            error={error}
            inputRefs={inputRefs}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            handlePress={handlePress}
          /> */}

          {error && <Text style={styles.error}>{error}.</Text>}
          {success && (
            <Text style={styles.successText}>
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
    </SafeAreaView>
  );
};

export default AadhaarOtpVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
  },
  form: {
    marginTop: 10,
    paddingHorizontal: 30,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 28,
    fontWeight: '500',
    color: COLORS.black,
    lineHeight: 20,
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
    backgroundColor: COLORS.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    borderRadius: 10,
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
