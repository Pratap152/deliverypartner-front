import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { useAuth } from '../../hooks/useAuth';

export default function PersonalInfoScreen({ navigation }) {
  const { authToken } = useAuth();

  // FORM DATA
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    primaryPhone: '',
    secondaryPhone: '',
    email: '',
    gender: '',
  });

  // UI states for mobile fields
  const [mobileDigits, setMobileDigits] = useState('');
  const [altDigits, setAltDigits] = useState('');

  // DOB
  const [isModalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const formatDate = d => {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const handleConfirm = selectedDate => {
    setModalVisible(false);
    setDate(selectedDate);
    handleChange('dob', formatDate(selectedDate));
  };
  const handleCancel = () => setModalVisible(false);

  const handleChange = (field, value) =>
    setFormData(f => ({ ...f, [field]: value }));

  // helper
  const extractDigits = (s = '') => String(s).replace(/\D/g, '');

  const setMobileValue = digits => {
    setMobileDigits(digits);
    handleChange('primaryPhone', digits);
  };
  const setAltValue = digits => {
    setAltDigits(digits);
    handleChange('secondaryPhone', digits);
  };

  // VALIDATIONS
  const validateName = fullName => {
    if (!fullName) return 'Name is required';
    return '';
  };
  const validateDOB = dob => {
    if (!dob) return 'Date of birth is required';
    return '';
  };
  const validateGender = gender => {
    if (!gender) return 'Gender is required';
    return '';
  };
  const validateEmail = email => {
    if (!email) return 'Email is required';
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email) ? '' : 'Enter a valid email address';
  };
  const validateMobile = primaryPhone => {
    if (!primaryPhone) return 'Mobile number is required';
    return primaryPhone.length === 10
      ? ''
      : 'Enter a valid 10-digit mobile number';
  };
  const validateAlternativeMobile = secondaryPhone => {
    if (!secondaryPhone) return 'Alternative Mobile number is required';
    return secondaryPhone.length === 10
      ? ''
      : 'Enter a valid 10-digit alternative mobile number';
  };

  const validateForm = () => {
    const newErrors = {};
    newErrors.fullName = validateName(formData.fullName);
    newErrors.dob = validateDOB(formData.dob);
    newErrors.email = validateEmail(formData.email);
    newErrors.primaryPhone = validateMobile(formData.primaryPhone);
    newErrors.secondaryPhone = validateAlternativeMobile(
      formData.secondaryPhone,
    );
    newErrors.gender = validateGender(formData.gender);

    // Prevent same number
    if (
      formData.primaryPhone &&
      formData.secondaryPhone &&
      formData.primaryPhone === formData.secondaryPhone
    ) {
      newErrors.secondaryPhone =
        'Alternative number cannot be same as mobile number';
    }
    setErrors(newErrors);
    return Object.values(newErrors).every(e => !e);
  };

  // helper
  const formatDobForApi = (ddmmyyyy = '') => {
    if (!ddmmyyyy) return '';
    const parts = ddmmyyyy.split('-');
    if (parts.length !== 3) return ddmmyyyy;
    const [dd, mm, yyyy] = parts;
    return `${yyyy}-${mm}-${dd}`;
  };

  // ON SUBMIT
  const onSubmit = async () => {
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

    setLoading(true);
    try {
      // CALLING API
      const res = await fetch(
        'https://delivarypartner.onrender.com/api/rider/personal-info',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const json = await res.json().catch(() => ({}));
      console.log('STATUS:', res.status);
      console.log('BODY:', json);
      if (res.ok) {
        console.log('Details uploaded successfully');
        navigation.navigate('FaceInstructionScreen');
      } else {
        console.log('Error');
      }
    } catch (err) {
      console.log('error in fetch ', err);
    } finally {
      setLoading(false);
    }
  };

  // RADIO BUTTON
  const GenderRadio = ({ value, label }) => {
    const selected = formData.gender === value;
    return (
      <TouchableOpacity
        onPress={() => handleChange('gender', value)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
      >
        <Ionicons
          name={selected ? 'radio-button-on' : 'radio-button-off'}
          color={selected ? 'black' : '#666'}
          size={22}
        />
        <Text>{label}</Text>
      </TouchableOpacity>
    );
  };

  // STYLING
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ flexDirection: 'row', gap: 75, marginTop: 55, marginLeft: 20 }}
      >
        {/* BACK BUTTON */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={22} color="black" />
        </TouchableOpacity>
        {/* HEADING */}
        <Text style={{ fontSize: 20, fontWeight: 700 }}>
          Personal Information
        </Text>
      </View>

      <View style={{ flex: 1, marginTop: 35, marginLeft: 30 }}>
        {/* USER NAME */}
        <Text style={{ marginBottom: 5, fontWeight: 500 }}>User Name</Text>
        <TextInput
          placeholder="enter your name"
          placeholderTextColor={'#888'}
          value={formData.fullName}
          onChangeText={text => handleChange('fullName', text)}
          style={{
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: 18,
            width: '90%',
          }}
        />
        {errors.fullName ? (
          <Text style={{ color: 'red', marginBottom: 10 }}>
            {errors.fullName}
          </Text>
        ) : null}

        {/* DOB */}
        <Text style={{ marginBottom: 5, fontWeight: 500 }}>Date of Birth</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            borderWidth: 1,
            paddingVertical: 9,
            paddingHorizontal: 12,
            borderRadius: 10,
            width: '90%',
            marginBottom: 18,
            flexDirection: 'row',
            gap: 200,
          }}
        >
          <Text style={{ color: formData.dob ? '#000' : '#888' }}>
            {formData.dob ? formData.dob : 'DD-MM-YYYY'}
          </Text>
          <Ionicons name="calendar-outline" size={22} color="#444" />
        </TouchableOpacity>
        {errors.dob ? (
          <Text style={{ color: 'red', marginBottom: 10 }}>{errors.dob}</Text>
        ) : null}

        <DateTimePickerModal
          isVisible={isModalVisible}
          mode="date"
          maximumDate={new Date()}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />

        {/* MOBILE NO. */}
        <Text style={{ marginBottom: 5, fontWeight: 500 }}>Mobile Number</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderRadius: 10,
            width: '90%',
            marginBottom: 18,
            overflow: 'hidden',
          }}
        >
          <Text
            style={{
              paddingHorizontal: 12,
              paddingVertical: 10,
              backgroundColor: '#f3f3f3',
              borderRightWidth: 1,
              borderRightColor: '#eee',
            }}
          >
            +91
          </Text>

          <TextInput
            placeholder="enter mobile number"
            placeholderTextColor="#888"
            value={mobileDigits}
            onChangeText={text => {
              let digits = extractDigits(text);
              if (digits.length > 10) digits = digits.slice(-10);
              if (digits.length > 10) return;
              setMobileValue(digits);
            }}
            keyboardType="number-pad"
            maxLength={10}
            style={{
              flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 12,
              color: 'black',
            }}
          />
        </View>
        {errors.primaryPhone ? (
          <Text style={{ color: 'red', marginBottom: 10 }}>
            {errors.primaryPhone}
          </Text>
        ) : null}

        {/* ALTERNATIVE MOBILE NO. */}
        <Text style={{ marginBottom: 5, fontWeight: 500 }}>
          Alternative Mobile Number
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderRadius: 10,
            width: '90%',
            marginBottom: 18,
            overflow: 'hidden',
          }}
        >
          <Text
            style={{
              paddingHorizontal: 12,
              paddingVertical: 10,
              backgroundColor: '#f3f3f3',
              borderRightWidth: 1,
              borderRightColor: '#eee',
            }}
          >
            +91
          </Text>

          <TextInput
            placeholder="enter alternative mobile number"
            placeholderTextColor="#888"
            value={altDigits}
            onChangeText={text => {
              let digits = extractDigits(text);
              if (digits.length > 10) digits = digits.slice(-10);
              if (digits.length > 10) return;
              setAltValue(digits);
            }}
            keyboardType="number-pad"
            maxLength={10}
            style={{
              flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 12,
              color: 'black',
            }}
          />
        </View>
        {errors.secondaryPhone ? (
          <Text style={{ color: 'red', marginBottom: 10 }}>
            {errors.secondaryPhone}
          </Text>
        ) : null}

        {/* MAIL ID */}
        <Text style={{ marginBottom: 5, fontWeight: 500 }}> Email Id</Text>
        <TextInput
          placeholder="e.g., xyz@gmail.com"
          placeholderTextColor={'#888'}
          value={formData.email}
          onChangeText={text => handleChange('email', text.toLowerCase())}
          style={{
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: 18,
            width: '90%',
          }}
        />
        {errors.email ? (
          <Text style={{ color: 'red', marginBottom: 10 }}>{errors.email}</Text>
        ) : null}

        {/* GENDER */}
        <Text style={{ marginBottom: 5, fontWeight: 500 }}>Gender</Text>
        <View style={{ flexDirection: 'row', gap: 50, marginBottom: 10 }}>
          <GenderRadio value="male" label="Male" />
          <GenderRadio value="female" label="Female" />
        </View>
        {errors.gender ? (
          <Text style={{ color: 'red', marginBottom: 10 }}>
            {errors.gender}
          </Text>
        ) : null}
      </View>

      {/* SUBMIT BUTTON */}
      <TouchableOpacity
        style={{
          marginBottom: 50,
          alignSelf: 'center',
          backgroundColor: '#0CBACE',
          paddingVertical: 10,
          borderRadius: 25,
          width: '60%',
        }}
        onPress={onSubmit}
      >
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 20,
            color: 'white',
            fontWeight: 600,
          }}
        >
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
}
