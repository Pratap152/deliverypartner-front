import { useState, useEffect, useRef } from 'react';

import { isValidAadhaar } from '../utils/helpers';
import { useNavigation } from '@react-navigation/native';
import WEBSITE_URL from '../utils/host';
import { useAuth } from './useAuth';

import axios from 'axios';

import api from '../api/ApiClient';

export default function useAadhaarVerification() {
  const navigation = useNavigation();
  const [aadhaar, setAadhaar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const { authToken } = useAuth();

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
    console.log('sending aadhaar otp...');
    if (!isValidAadhaar(aadhaar)) {
      setError('Invalid Aadhaar number.');
      return;
    }
    setLoading(true);

    setError('');
    try {
      const response = await axios.post(
        `${WEBSITE_URL}/aadhar/send-otp`,
        {
          aadharNumber: aadhaar.split(' ').join(''),
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

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
      console.log('Error aadhaar send otp', error);
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  function formatAadhaarInput(value) {
    return value
      .replace(/\D/g, '') // remove non-digits
      .slice(0, 12) // max 12 digits
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
