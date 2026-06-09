import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  StyleSheet,
  useWindowDimensions,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DeviceInfo from 'react-native-device-info';

import apiClient from '../../services/ApiClient';
import PrimaryButton from '../../components/common/PrimaryButton';
import { SafeAreaView } from 'react-native-safe-area-context';




export default function PersonalInfoScreen({ navigation }) {
  // FORM DATA
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    primaryPhone: '',
    secondaryPhone: '',
    email: '',
    gender: '',
    referralCode: ''
  });

  const [isModalVisible, setModalVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { width } = useWindowDimensions();
  const isTablet = DeviceInfo.isTablet();
  const styles = createStyles(isTablet, width);

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
    if (field === 'referralCode') error = '';

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
      referralCode: formData.referralCode
    };

    console.log('submit', payload);
    setSubmitting(true);

    try {
      const res = await apiClient.post('/api/rider/personal-info', payload);

      console.log('STATUS:', res.status);
      console.log('BODY:', res.data);

      navigation.replace('SplashScreen');
    } catch (err) {
      const apiMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Something went wrong. Please try again.';

      setErrors(prev => ({ ...prev, referralCode: apiMsg }));

      console.log('API ERROR:', err.response?.status, err.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

  /* UI  */

  const GenderRadio = ({ value, label }) => {
    const selected = formData.gender === value;
    return (
      <TouchableOpacity
        onPress={() => handleChange('gender', value)}
        style={styles.genderOption}
      >
        <Ionicons
          name={selected ? 'radio-button-on' : 'radio-button-off'}
          size={isTablet ? 28 : 22}
          color={selected ? '#00B5CC' : '#9CA3AF'}
        />
        <Text style={styles.genderText}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView style={styles.formWrapper}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>
              Personal Information
            </Text>
          </View>
          {/* NAME */}
          <Text style={styles.fieldName}>User Name</Text>
          <TextInput
            value={formData.fullName}
            onChangeText={t => handleChange('fullName', t)}
            style={styles.input}
            placeholder='Enter Your Name'
            placeholderTextColor='darkgrey'
          />
          {errors.fullName && <Text style={styles.err}>{errors.fullName}</Text>}

          {/* DOB */}
          <Text style={styles.fieldName}>Date of Birth</Text>
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              setModalVisible(true);
            }}
            style={styles.input}
          >
            <Text
              style={[
                styles.dateText,
                !formData.dob && styles.placeholderText,
              ]}
            >
              {formData.dob || 'DD-MM-YYYY'}
            </Text>
            <Ionicons
              name='calendar-outline'
              size={isTablet ? 24 : 18}
              color="#4B5563"
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isModalVisible}
            mode="date"
            maximumDate={new Date()}
            onConfirm={handleConfirm}
            onCancel={() => setModalVisible(false)}
          />

          {/* MOBILE */}
          <Text style={styles.fieldName}>Mobile Number</Text>
          <TextInput
            keyboardType="number-pad"
            value={formData.primaryPhone}
            onChangeText={t => handleChange('primaryPhone', t)}
            style={styles.input}
            placeholder='Enter Your Mobile No.'
            placeholderTextColor='darkgrey'
            maxLength={10}
          />
          {errors.primaryPhone && (
            <Text style={styles.err}>{errors.primaryPhone}</Text>
          )}

          {/* ALT MOBILE */}
          <Text style={styles.fieldName}>Alternative Mobile Number</Text>
          <TextInput
            keyboardType="number-pad"
            value={formData.secondaryPhone}
            onChangeText={t => handleChange('secondaryPhone', t)}
            style={styles.input}
            placeholder='Enter Your Alernative Mobile No.'
            placeholderTextColor='darkgrey'
            maxLength={10}
          />
          {errors.secondaryPhone && (
            <Text style={styles.err}>{errors.secondaryPhone}</Text>
          )}

          {/* EMAIL */}
          <Text style={styles.fieldName}>Email</Text>
          <TextInput
            value={formData.email}
            onChangeText={t => handleChange('email', t.toLowerCase())}
            style={styles.input}
            placeholder='Enter Your Email ID'
            placeholderTextColor='darkgrey'
          />
          {errors.email && <Text style={styles.err}>{errors.email}</Text>}

          {/* REFERRAL CODE */}
          <Text style={styles.fieldName}>Referral Code (Optional)</Text>
          <TextInput
            value={formData.referralCode}
            onChangeText={t => handleChange('referralCode', t)}
            style={styles.input}
            placeholder='Enter Referral Code'
            placeholderTextColor='darkgrey'
          />
          {errors.referralCode && <Text style={styles.err}>{errors.referralCode}</Text>}

          {/* GENDER */}
          <Text style={styles.fieldName}>Gender</Text>
          <View style={styles.genderContainer}>
            <GenderRadio value="male" label="Male" />
            <GenderRadio value="female" label="Female" />
          </View>


          {/* SUBMIT */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Submit"
              onPress={handleSubmit}
              bgColor="#00B5CC"
              textColor="#fff"
              loading={submitting}
              disabled={submitting}
            />
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ---------------- STYLES ---------------- */

const createStyles = (isTablet, width) => {
  const formWidth = isTablet
    ? width > 1000
      ? '58%'
      : '72%'
    : '100%';

  return StyleSheet.create({
    keyboardContainer: {
      flex: 1,
      backgroundColor: '#F8FAFC',
    },

    scrollContent: {
      flexGrow: 1,
      paddingBottom: isTablet ? 40 : 24,
      alignItems: 'center',
    },

    formWrapper: {
      width: formWidth,
      paddingHorizontal: isTablet ? 20 : 24,
    },

    headerContainer: {
      alignItems: 'center',
      marginBottom: isTablet ? 40 : 28,
    },

    headerTitle: {
      fontSize: isTablet ? 34 : 24,
      fontWeight: '700',
      color: '#111827',
    },

    fieldName: {
      fontSize: isTablet ? 20 : 15,
      fontWeight: '600',
      color: '#374151',
      marginBottom: isTablet ? 8 : 6,
    },

    input: {
      borderWidth: 1,
      borderColor: '#D1D5DB',
      borderRadius: isTablet ? 18 : 12,
      paddingHorizontal: isTablet ? 18 : 14,
      paddingVertical: isTablet ? 18 : 12,
      marginBottom: isTablet ? 24 : 18,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
      color: '#111827',
      fontSize: isTablet ? 20 : 15,
    },

    placeholderText: {
      color: 'darkgrey',
    },

    dateText: {
      fontSize: isTablet ? 20 : 15,
      color: '#111827',
    },

    genderContainer: {
      flexDirection: 'row',
      gap: isTablet ? 50 : 30,
      marginTop: 6,
      marginBottom: isTablet ? 50 : 35,
    },

    genderOption: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: isTablet ? 10 : 6,
    },

    genderText: {
      fontSize: isTablet ? 20 : 15,
      color: '#111827',
      fontWeight: '500',
    },

    err: {
      color: '#DC2626',
      marginTop: -10,
      marginBottom: isTablet ? 18 : 14,
      fontSize: isTablet ? 16 : 13,
    },

    buttonContainer: {
      marginTop: 10,
      marginBottom: isTablet ? 30 : 20,
    },
  });
};