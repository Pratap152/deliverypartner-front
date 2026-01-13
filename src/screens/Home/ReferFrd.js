import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Toast from 'react-native-toast-message';
import ReferralBanner from './ReferralBanner';

function ReferFrd(){
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // 📞 Phone validation
  const validatePhone = (value) => {
    if (!/^\d*$/.test(value)) {
      return 'Only numbers are allowed';
    }

    if (value.length !== 10) {
      return 'Phone number must be 10 digits';
    }

    if (!/^[6-9]/.test(value)) {
      return 'Phone number must start with 6, 7, 8, or 9';
    }

    if (/^(\d)\1{9}$/.test(value)) {
      return 'Invalid phone number sequence';
    }

    return '';
  };

  const handleConfirm = useCallback(() => {
    if (!name || !phone || !city) {
      // Alert.alert('Error', 'All fields are required');
     Toast.show({
  type: 'error',
  text1: 'Error',
  text2: 'All fields are required',
});

      return;
    }

    const error = validatePhone(phone);
    if (error) {
      setPhoneError(error);
      return;
    }

    setPhoneError('');
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Details added successfully',
      position: 'top',
    });
    setName('');
    setPhone('');
    setCity('');

    console.log({ name, phone, city });
  }, [name, phone, city]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ReferralBanner />

      <View style={styles.titleRow}>
              <View style={styles.line} />
              <Text style={styles.title}>Refer & Earn</Text>
              <View style={styles.line} />
            </View>

      <Text style={styles.sectionSubtitle}>
        Enter the details below so we can get to know about your Refer
      </Text>

      <View style={styles.formContainer}>
        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          placeholder="Please enter first name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        {/* Phone */}
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          placeholder="Please enter Phone Number"
          keyboardType="number-pad"
          maxLength={10}
          style={[
            styles.input,
            phoneError ? styles.inputError : null,
          ]}
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            setPhoneError(text.length ? validatePhone(text) : '');
          }}
        />

        {phoneError ? (
          <Text style={styles.errorText}>{phoneError}</Text>
        ) : null}

        {/* City */}
        <Text style={styles.label}>Friend's City Name</Text>
        <TextInput
          placeholder="Please enter City"
          style={styles.input}
          value={city}
          onChangeText={setCity}
        />

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
          activeOpacity={0.85}
        >
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ReferFrd;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingBottom: hp("6%"),
  },

  sectionSubtitle: {
    fontSize: wp("3.2%"),
    color: '#6F6F6F',
    marginTop: hp("0.8%"),
    marginHorizontal: wp("4%"),
    marginBottom: hp("2.5%"),
    lineHeight: hp("2.3%"),
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp("2.5%"),
    paddingHorizontal: wp("5%"),
  },

  title: {
    marginHorizontal: wp("2.5%"),
    fontWeight: "600",
    fontSize: wp("5%"),
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },

  formContainer: {
    marginHorizontal: wp("4%"),
    padding: wp("3%"),
  },

  label: {
    fontSize: wp("3.2%"),
    color: '#6F6F6F',
    marginBottom: hp("0.8%"),
  },

  input: {
    height: hp("6%"),
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: wp("2%"),
    paddingHorizontal: wp("3%"),
    fontSize: wp("3.6%"),
    color: '#000',
    marginBottom: hp("2%"),
    backgroundColor: '#FFF',
  },

  inputError: {
    borderColor: 'red',
  },

  errorText: {
    color: 'red',
    fontSize: wp("3%"),
    marginTop: hp("-1%"),
    marginBottom: hp("1%"),
  },

  confirmButton: {
    backgroundColor: '#0A8F4D',
    height: hp("6%"),
    borderRadius: hp("3%"),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp("6%"),
  },

  confirmButtonText: {
    color: '#FFF',
    fontSize: wp("4%"),
    fontWeight: '600',
  },
});
