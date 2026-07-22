import { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';

import { isValidAadhaar } from '../utils/helpers';
import apiClient from '../services/ApiClient';

export default function useAadhaarVerification() {
  const navigation = useNavigation();
  const [aadhaar, setAadhaar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const rawAadhaar = aadhaar.replace(/\s/g, '');

    if (rawAadhaar.length === 12) {
      setError(isValidAadhaar(rawAadhaar) ? '' : 'Invalid Aadhaar number.');
    } else {
      setError('');
    }
  }, [aadhaar]);

  const handleSubmit = async () => {
    if (!isValidAadhaar(aadhaar)) {
      setError('Invalid Aadhaar number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/api/rider/aadhar/send-otp', {
        aadharNumber: aadhaar.replace(/\s/g, ''),
      });

      if (response.status !== 200) {
        setError(response.data?.message || 'Failed to send OTP');
        return;
      }

      navigation.navigate('AadharVerifyScreen', {
        otp: response.data.otp,
        aadharNumber: aadhaar,
      });

      setAadhaar('');
    } catch (error) {
      console.log('Error aadhaar send otp', error);
      setError(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  function formatAadhaarInput(value) {
    return value
      .replace(/\D/g, '')
      .slice(0, 12)
      .replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  const handleOnChange = text => {
    const formattedAadhaar = formatAadhaarInput(text);
    setAadhaar(formattedAadhaar);
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
