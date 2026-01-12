import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { useOtp } from '../../hooks/useOtp';
import OtpInput from '../../components/common/OTPInputBox';
import { sendOTPApi } from './LoginEntryScreen';
import { tokenService } from '../../services/TokenService';
import apiClient from '../../services/ApiClient';

const COLORS = {
  primary: '#16C2D5',
  textDark: '#444',
  textLight: '#777',
  border: '#A5A5A5',
  white: '#fff',
  black: '#000',
  error: 'red',
};

/* ================= VERIFY OTP API ================= */
const verifyOTPApi = async (phone, otp) => {
  try {
    const response = await apiClient.post(
      '/api/mobile/verify-static-otp',
      { phone, otp },
      { skipAuth: true },
    );

    return { status: response.status, data: response.data };
  } catch (err) {
    if (err.response) {
      return {
        status: err.response.status,
        data: err.response.data || {},
      };
    }
    return { status: 500, data: { message: 'Network error' } };
  }
};

const LoginVerifyScreen = ({ route, navigation }) => {
  const phone = route?.params?.phone;

  const {
    otp,
    inputRefs,
    handleChange,
    handleKeyPress,
    clearOtp,
    setOtpFromAutoFill,
  } = useOtp(6);

  const [timer, setTimer] = useState(50);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timer === 0) {
      setIsResendEnabled(true);
      return;
    }
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useFocusEffect(
    React.useCallback(() => {
      clearOtp();
      setError('');
    }, []),
  );

  /* ================= VERIFY OTP ================= */
  const handleVerify = async () => {
    if (isVerifying) return;

    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      setIsVerifying(true);
      setError('');

      const result = await verifyOTPApi(phone, fullOtp);

      if (result.status !== 200) {
        setError('Invalid or expired OTP');
        return;
      }

      const { accessToken, refreshToken } = result.data;

      if (!accessToken) {
        setError('Authentication failed. Try again.');
        return;
      }

      await tokenService.set({ accessToken, refreshToken });

      // ✅ Let SplashScreen decide next route
      navigation.replace('SplashScreen');
    } catch (err) {
      setError('Something went wrong. Try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  /* ================= RESEND OTP ================= */
  const handleResendOtp = async () => {
    if (!isResendEnabled) return;

    if (resendCount >= 3) {
      setError('You have reached the resend limit. Try again later.');
      return;
    }

    const result = await sendOTPApi(phone);

    if (result.status === 200) {
      setResendCount(prev => prev + 1);
      setTimer(50);
      setIsResendEnabled(false);
      clearOtp();
      setError('');
    } else {
      setError('Failed to resend OTP. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        A 6-digit OTP has been sent to{' '}
        <Text style={styles.phoneNumber}>+91 {phone}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('LoginEntryScreen')}
        >
          <Text style={styles.changeNumber}> Change</Text>
        </TouchableOpacity>
      </Text>

      <Text style={styles.label}>Enter OTP</Text>

      <OtpInput
        otp={otp}
        inputRefs={inputRefs}
        handleChange={handleChange}
        handleKeyPress={handleKeyPress}
        setOtpFromAutoFill={setOtpFromAutoFill}
        showError={!!error}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.verifyButton, isVerifying && { opacity: 0.5 }]}
        onPress={handleVerify}
        disabled={isVerifying}
      >
        <Text style={styles.verifyText}>
          {isVerifying ? 'Verifying...' : 'Verify OTP'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleResendOtp}
        disabled={!isResendEnabled}
        style={styles.resendContainer}
      >
        <Text style={[styles.resend, isResendEnabled && styles.resendEnabled]}>
          {timer > 0
            ? `Resend code in 00:${String(timer).padStart(2, '0')}`
            : 'Resend OTP'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: rw(6),
    backgroundColor: COLORS.white,
  },
  subtitle: {
    marginTop: rh(6),
    color: COLORS.textDark,
    fontSize: rf(2.2),
    lineHeight: rf(2.7),
  },
  phoneNumber: {
    fontWeight: '900',
    color: COLORS.black,
    fontSize: rf(2.2),
  },
  changeNumber: {
    color: COLORS.error,
    fontWeight: '600',
    fontSize: rf(2),
  },
  label: {
    marginTop: rh(3),
    fontSize: rf(2.2),
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.error,
    marginTop: rh(0.8),
    fontSize: rf(1.9),
  },
  verifyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: rh(1.8),
    borderRadius: rw(8),
    alignItems: 'center',
    marginTop: rh(2),
  },
  verifyText: {
    color: COLORS.white,
    fontSize: rf(2.3),
    fontWeight: '700',
  },
  resendContainer: {
    marginTop: rh(2.5),
    alignItems: 'center',
  },
  resend: {
    fontSize: rf(1.9),
    color: COLORS.textLight,
  },
  resendEnabled: {
    color: COLORS.primary,
  },
});

export default LoginVerifyScreen;
