import { useState, useEffect, useRef } from 'react';

import { isValidAadhaar } from '../utils/helpers';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import WEBSITE_URL from '../utils/host';
import { useAuth } from './useAuth';

export default function useAadhaarVerification() {
  const navigation = useNavigation();
  const [aadhaar, setAadhaar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const { authToken } = useAuth();

  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyaWRlcklkIjoiNjkzNDAxOTZiNjQ2M2M5ZTNjM2E1NGMzIiwicGhvbmUiOiI3MDkzOTAxNTEzIiwiaWF0IjoxNzY1MTg3NDIyLCJleHAiOjE3NjU3OTIyMjJ9.OqsHXRlr7G7f2coVaYn5J-DXuIla4GRSHBWiHmCeAW4';

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (aadhaar.length === 12) {
      setError(isValidAadhaar(aadhaar) ? '' : 'Invalid Aadhaar number.');
    }
  }, [aadhaar]);

  console.log(authToken);

  const handleSubmit = async () => {
    console.log('sending aadhaar otp....');
    if (!isValidAadhaar(aadhaar)) {
      setError('Invalid Aadhaar number.');
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(
        `${WEBSITE_URL}/aadhar/send-otp`,
        {
          aadharNumber: aadhaar,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken || token}`,
          },
        },
      );

      console.log('aadhaar send otp success', response);
      if (response.status !== 200) {
        setError(response.data.message);
        return;
      }
      navigation.navigate('AadharVerifyScreen', {
        otp: response.data.otp,
        aadharNumber: aadhaar,
      });
      setAadhaar('');
    } catch (error) {
      console.log('Error aadhaar send otp', error?.response?.data);
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = text => {
    const numericText = text.replace(/\D/g, '');

    setAadhaar(numericText);
  };

  return {
    aadhaar,
    loading,
    error,
    inputRef,
    setAadhaar,
    handleSubmit,
    handleOnChange,
    isValid: isValidAadhaar(aadhaar),
  };
}
