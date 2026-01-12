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
    if (isNaN(+value)) return;
    setError('');

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < otpLength - 1) {
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
        '/aadhar/verify-otp',
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
