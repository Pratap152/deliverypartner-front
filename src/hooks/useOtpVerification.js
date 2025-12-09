import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import WEBSITE_URL from '../utils/host';
import { useAuth } from './useAuth';

const useOtpVerification = otpLength => {
  const [otp, setOtp] = useState(new Array(otpLength).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inputRefs = useRef([]);

  const { authToken } = useAuth();

  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyaWRlcklkIjoiNjkzNDAxOTZiNjQ2M2M5ZTNjM2E1NGMzIiwicGhvbmUiOiI3MDkzOTAxNTEzIiwiaWF0IjoxNzY1MTg3NDIyLCJleHAiOjE3NjU3OTIyMjJ9.OqsHXRlr7G7f2coVaYn5J-DXuIla4GRSHBWiHmCeAW4';

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs?.current[0]?.focus();
    }
  }, []);

  const handleChange = (value, index) => {
    if (isNaN(+value)) return;
    setError('');
    let newOtp = [...otp];

    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < otpLength - 1 && inputRefs?.current[index + 1]) {
      inputRefs?.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs?.current[index - 1]) {
        inputRefs?.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async (aadharNumber, onSuccess) => {
    setLoading(true);
    const enteredOtp = otp.join('');

    try {
      const reponse = await axios.post(
        `${WEBSITE_URL}/aadhar/verify-otp`,
        {
          aadharNumber,
          otp: enteredOtp,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken || token}`,
          },
        },
      );

      if (reponse.status !== 200) {
        setError(reponse.data.message);
        return;
      }

      setSuccess(reponse.data.message);

      onSuccess();
    } catch (error) {
      console.log('Error While verifying Otp', error?.response?.data);
      setError(error?.response?.data?.message);
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
