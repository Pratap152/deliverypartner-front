import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import apiClient from '../../services/ApiClient';

export default function PersonalInfoScreen({ navigation }) {
  // FORM DATA
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    primaryPhone: '',
    secondaryPhone: '',
    email: '',
    gender: '',
  });

  const [isModalVisible, setModalVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- HELPERS ---------------- */

  const formatDate = d => {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const formatDobForApi = ddmmyyyy => {
    const [dd, mm, yyyy] = ddmmyyyy.split('-');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleConfirm = date => {
    setModalVisible(false);
    handleChange('dob', formatDate(date));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    let error = '';
    if (field === 'fullName') error = validateName(value);
    if (field === 'primaryPhone') error = validateMobile(value);
    if (field === 'secondaryPhone') error = validateMobile(value);
    if (field === 'email') error = validateEmail(value);

    setErrors(prev => ({ ...prev, [field]: error }));
  };

  /* ---------------- VALIDATIONS ---------------- */

  const validateName = v =>
    !v
      ? 'Name is required'
      : /^[A-Za-z\s]{3,}$/.test(v)
      ? ''
      : 'Only alphabets allowed';

  const validateEmail = v =>
    /^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z]{2,})+$/.test(v) ? '' : 'Invalid email';

  const validateMobile = v =>
    /^[6-9]\d{9}$/.test(v) ? '' : 'Enter valid 10-digit number';

  const validateForm = () => {
    const newErrors = {
      fullName: validateName(formData.fullName),
      dob: formData.dob ? '' : 'DOB required',
      email: validateEmail(formData.email),
      primaryPhone: validateMobile(formData.primaryPhone),
      secondaryPhone: validateMobile(formData.secondaryPhone),
      gender: formData.gender ? '' : 'Gender required',
    };

    if (
      formData.primaryPhone &&
      formData.secondaryPhone &&
      formData.primaryPhone === formData.secondaryPhone
    ) {
      newErrors.secondaryPhone = 'Numbers must be different';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(e => !e);
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      fullName: formData.fullName,
      dob: formatDobForApi(formData.dob),
      gender: formData.gender,
      primaryPhone: formData.primaryPhone,
      secondaryPhone: formData.secondaryPhone,
      email: formData.email,
    };

    console.log('submit', payload);
    setSubmitting(true);

    try {
      const res = await apiClient.post('/api/rider/personal-info', payload);

      console.log('STATUS:', res.status);
      console.log('BODY:', res.data);

      // ✅ Always go to Splash to re-evaluate onboarding stage
      navigation.replace('SplashScreen');
    } catch (err) {
      console.log('API ERROR:', err.response?.status, err.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- UI ---------------- */

  const GenderRadio = ({ value, label }) => {
    const selected = formData.gender === value;
    return (
      <TouchableOpacity
        onPress={() => handleChange('gender', value)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: hp('0.8%') }}
      >
        <Ionicons
          name={selected ? 'radio-button-on' : 'radio-button-off'}
          size={22}
          color={selected ? 'black' : 'grey'}
        />
        <Text>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: hp('6%') }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ marginTop: hp('5%'), alignItems: 'center' }}>
          <Text style={{ fontSize: wp('5%'), fontWeight: '700' }}>
            Personal Information
          </Text>
        </View>

        <View style={{ marginTop: hp('3%'), marginLeft: wp('6%') }}>
          {/* NAME */}
          <Text>User Name</Text>
          <TextInput
            value={formData.fullName}
            onChangeText={t => handleChange('fullName', t)}
            style={styles.input}
          />
          {errors.fullName && <Text style={styles.err}>{errors.fullName}</Text>}

          {/* DOB */}
          <Text>Date of Birth</Text>
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              setModalVisible(true);
            }}
            style={styles.input}
          >
            <Text>{formData.dob || 'DD-MM-YYYY'}</Text>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isModalVisible}
            mode="date"
            maximumDate={new Date()}
            onConfirm={handleConfirm}
            onCancel={() => setModalVisible(false)}
          />

          {/* MOBILE */}
          <Text>Mobile Number</Text>
          <TextInput
            keyboardType="number-pad"
            value={formData.primaryPhone}
            onChangeText={t => handleChange('primaryPhone', t)}
            style={styles.input}
          />
          {errors.primaryPhone && (
            <Text style={styles.err}>{errors.primaryPhone}</Text>
          )}

          {/* ALT MOBILE */}
          <Text>Alternative Mobile Number</Text>
          <TextInput
            keyboardType="number-pad"
            value={formData.secondaryPhone}
            onChangeText={t => handleChange('secondaryPhone', t)}
            style={styles.input}
          />
          {errors.secondaryPhone && (
            <Text style={styles.err}>{errors.secondaryPhone}</Text>
          )}

          {/* EMAIL */}
          <Text>Email</Text>
          <TextInput
            value={formData.email}
            onChangeText={t => handleChange('email', t.toLowerCase())}
            style={styles.input}
          />
          {errors.email && <Text style={styles.err}>{errors.email}</Text>}

          {/* GENDER */}
          <Text>Gender</Text>
          <View style={{ flexDirection: 'row', gap: wp('12%') }}>
            <GenderRadio value="male" label="Male" />
            <GenderRadio value="female" label="Female" />
          </View>

          {/* SUBMIT */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting}
            style={styles.submit}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontWeight: '600' }}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  input: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: wp('2.5%'),
    padding: hp('1.2%'),
    marginBottom: hp('1.5%'),
    width: wp('90%'),
  },
  submit: {
    marginTop: hp('5%'),
    backgroundColor: '#0CBACE',
    paddingVertical: hp('1.5%'),
    borderRadius: wp('4%'),
    width: wp('90%'),
    alignItems: 'center',
  },
  err: {
    color: 'red',
    marginBottom: hp('1%'),
  },
};
