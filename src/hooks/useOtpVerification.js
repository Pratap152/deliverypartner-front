import { useEffect, useRef, useState } from 'react';
import apiClient from '../services/ApiClient';

const useOtpVerification = otpLength => {
  const [otp, setOtp] = useState(new Array(otpLength).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (value, index) => {
  // Remove non-numeric characters
  const cleanedValue = value.replace(/[^0-9]/g, '');

  setError('');

  // ===== HANDLE FULL OTP PASTE =====
  if (cleanedValue.length > 1) {
    const pastedOtp = cleanedValue.slice(0, otpLength).split('');

    const newOtp = Array(otpLength).fill('');

    pastedOtp.forEach((digit, idx) => {
      newOtp[idx] = digit;
    });

    setOtp(newOtp);

    // Focus last input
    const focusIndex =
      pastedOtp.length >= otpLength
        ? otpLength - 1
        : pastedOtp.length;

    inputRefs.current[focusIndex]?.focus();

    return;
  }

  // ===== NORMAL SINGLE DIGIT =====
  const newOtp = [...otp];
  newOtp[index] = cleanedValue;

  setOtp(newOtp);

  // Move to next input
  if (cleanedValue && index < otpLength - 1) {
    inputRefs.current[index + 1]?.focus();
  }
};

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async (aadharNumber, onSuccess) => {
    setLoading(true);
    const enteredOtp = otp.join('');

    try {
      const response = await apiClient.post(
        '/api/rider/aadhar/verify-otp',
        {
          aadharNumber: aadharNumber.replace(/\s/g, ''),
          otp: enteredOtp,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (response.status !== 200) {
        setError(response.data?.message || 'OTP verification failed');
        return;
      }

      setSuccess(response.data.message);
      onSuccess();
    } catch (error) {
      console.log('Error While verifying Otp', error);
      setError(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handlePress = index => {
    inputRefs.current[index]?.setSelection(1, 1);
  };

  return {
    otp,
    loading,
    error,
    success,
    inputRefs,
    handleChange,
    handleKeyPress,
    handlePress,
    handleSubmit,
  };
};

export default useOtpVerification;
