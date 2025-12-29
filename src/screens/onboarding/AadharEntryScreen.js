import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../../utils/colors';

import useAadhaarVerification from '../../hooks/useAadhaarVerification';

const AadhaarVerificationScreen = () => {
  const {
    aadhaar,
    loading,
    error,
    inputRef,
    isValid,
    handleOnChange,
    handleSubmit,
  } = useAadhaarVerification();

  console.log(aadhaar);

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
          <View style={{ width: '95%' }}>
            <Text style={styles.title}>Fill Aadhar Card Details</Text>
            <Text style={styles.description}>
              Instant Verification of your Aadhar with OTP
            </Text>
            <TextInput
              ref={inputRef}
              maxLength={14}
              style={styles.input}
              value={aadhaar}
              onChangeText={text => handleOnChange(text)}
              placeholder="Enter Aadhar Number"
              keyboardType="number-pad"
              autoFocus
              placeholderTextColor={COLORS.black60}
            />
            {error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!isValid || loading}
              style={[styles.otpBtn, isValid && styles.active]}
            >
              {loading ? (
                <ActivityIndicator size={'small'} color={'white'} />
              ) : (
                <Text
                  style={[styles.otpBtnText, isValid && styles.activeTextColor]}
                >
                  Get OTP
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AadhaarVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
  },
  form: {
    marginTop: 10,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 28,
    fontWeight: '500',
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  description: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
    color: COLORS.textSecondary,
    marginTop: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.primary,
    paddingHorizontal: 10,
    marginTop: 30,
    fontFamily: 'Roboto',
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '500',
  },
  otpBtn: {
    height: 54,
    maxWidth: 348,
    backgroundColor: COLORS.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    borderRadius: 10,
    cursor: 'pointer',
  },
  otpBtnText: {
    fontFamily: 'Roboto',
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  active: {
    backgroundColor: COLORS.primary,
  },
  activeTextColor: {
    color: COLORS.white,
  },
  error: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.error,
    marginTop: 2,
  },
});
