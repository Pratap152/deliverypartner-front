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
  Platform,
  BackHandler,
  Alert
} from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DeviceInfo from 'react-native-device-info';
import PrimaryButton from '../../components/common/PrimaryButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { personalInfo } from '../../services/onboardingApi';

export default function PersonalInfoScreen({ navigation, route }) {

  const fromPreview = route?.params?.fromPreview ?? false;

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Exit App",
          "Are you sure you want to exit the app?",
          [
            {
              text: "No",
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: () => BackHandler.exitApp(),
            },
          ]
        );

        return true; // Prevent default behavior
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  // FORM DATA
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    secondaryPhone: '',
    email: '',
    gender: '',
    referralCode: '',
    area: '',
    state: '',
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
    // Name max 50 chars and only letters/spaces
    if (field === 'fullName') {
      value = value.replace(/[^A-Za-z\s]/g, '').slice(0, 50);
    }

    // Mobile numbers only digits and max 10
    if (field === 'secondaryPhone') {
      value = value.replace(/[^0-9]/g, '').slice(0, 10);
    }

    // Email max 100 chars
    if (field === 'email') {
      value = value.slice(0, 100).trim();
    }

    // Referral code max 20 chars
    if (field === 'referralCode') {
      value = value.slice(0, 20);
    }
    // Area max 100 chars
    if (field === 'area') {
      value = value.replace(/[^A-Za-z\s]/g, '').slice(0, 100);
    }

    // State max 100 chars
    if (field === 'state') {
      value = value.replace(/[^A-Za-z\s]/g, '').slice(0, 100);
    }

    setFormData(prev => ({ ...prev, [field]: value }));

    let error = '';

    if (field === 'fullName') error = validateName(value);
    if (field === 'secondaryPhone') error = validateMobile(value);
    if (field === 'email') error = validateEmail(value);
    if (field === 'area') error = validateArea(value);
    if (field === 'state') error = validateState(value);

    setErrors(prev => ({ ...prev, [field]: error }));
  };

  /* ---------------- VALIDATIONS ---------------- */

  const validateName = v => {
    if (!v.trim()) return 'Name is required';

    if (v.trim().length < 3)
      return 'Name must contain at least 3 characters';

    if (!/^[A-Za-z\s]+$/.test(v))
      return 'Only alphabets and spaces are allowed';

    return '';
  };

  const validateEmail = v => {
    if (!v.trim()) return 'Email is required';

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

    if (!gmailRegex.test(v.trim()))
      return 'Please enter a valid Gmail address';

    return '';
  };

  const validateMobile = v => {
    if (!v) return 'Mobile number is required';

    if (!/^[6-9]\d{9}$/.test(v))
      return 'Enter a valid 10-digit mobile number';

    return '';
  };

  const validateArea = value => {
    if (!value.trim()) return 'Area is required';

    if (value.trim().length < 2)
      return 'Area must contain at least 2 characters';

    if (!/^[A-Za-z\s]+$/.test(value))
      return 'Only alphabets and spaces are allowed';

    return '';
  };

  const validateState = value => {
    if (!value.trim()) return 'State is required';

    if (value.trim().length < 2)
      return 'State must contain at least 2 characters';

    if (!/^[A-Za-z\s]+$/.test(value))
      return 'Only alphabets and spaces are allowed';

    return '';
  };
  const validateForm = () => {
    const newErrors = {
      fullName: validateName(formData.fullName),
      dob: (() => {
        if (!formData.dob) return 'DOB required';

        const [dd, mm, yyyy] = formData.dob.split('-');
        const dob = new Date(yyyy, mm - 1, dd);

        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();

        const monthDiff = today.getMonth() - dob.getMonth();

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < dob.getDate())
        ) {
          age--;
        }

        return age >= 18 ? '' : 'You must be at least 18 years old';
      })(),
      email: validateEmail(formData.email),
      secondaryPhone: validateMobile(formData.secondaryPhone),
      gender: formData.gender ? '' : 'Gender required',
      area: validateArea(formData.area),
      state: validateState(formData.state),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every(e => !e);
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      fullName: formData.fullName.trim(),
      dob: formatDobForApi(formData.dob),
      gender: formData.gender,
      secondaryPhone: formData.secondaryPhone.trim(),
      email: formData.email.trim(),
      area: formData.area.trim(),
      state: formData.state.trim(),
      referralCode: formData.referralCode.trim(),
    };

    console.log('submit', payload);

    try {
      setSubmitting(true);

      const res = await personalInfo(payload);

      console.log('STATUS:', res.status);
      console.log('BODY:', res.data);

      if (fromPreview) {
        navigation.goBack();
      } else {
        navigation.replace('SplashScreen');
      }

    } catch (err) {
      const apiMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Something went wrong. Please try again.';

      setErrors(prev => ({
        ...prev,
        secondaryPhone: apiMsg,
      }));

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
          color={selected ? '#1F3365' : '#9CA3AF'}
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
            placeholder="Enter Your Name"
            placeholderTextColor="darkgrey"
            maxLength={50}
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
          {errors.dob && (
            <Text style={styles.err}>{errors.dob}</Text>
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
            placeholder="Enter Your Email ID"
            placeholderTextColor="darkgrey"
            maxLength={100}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.err}>{errors.email}</Text>}

          {/* AREA */}
          <Text style={styles.fieldName}>Area</Text>
          <TextInput
            value={formData.area}
            onChangeText={text => handleChange('area', text)}
            style={styles.input}
            placeholder="Enter Your Area"
            placeholderTextColor="darkgrey"
            maxLength={100}
          />
          {errors.area && (
            <Text style={styles.err}>{errors.area}</Text>
          )}

          {/* STATE */}
          <Text style={styles.fieldName}>State</Text>
          <TextInput
            value={formData.state}
            onChangeText={text => handleChange('state', text)}
            style={styles.input}
            placeholder="Enter Your State"
            placeholderTextColor="darkgrey"
            maxLength={100}
          />
          {errors.state && (
            <Text style={styles.err}>{errors.state}</Text>
          )}
          {/* REFERRAL CODE */}
          <Text style={styles.fieldName}>Referral Code (Optional)</Text>
          <TextInput
            value={formData.referralCode}
            onChangeText={t => handleChange('referralCode', t)}
            style={styles.input}
            placeholder="Enter Referral Code"
            placeholderTextColor="darkgrey"
            maxLength={20}
          />
          {errors.referralCode && <Text style={styles.err}>{errors.referralCode}</Text>}

          {/* GENDER */}
          <Text style={styles.fieldName}>Gender</Text>
          <View style={styles.genderContainer}>
            <GenderRadio value="male" label="Male" />
            <GenderRadio value="female" label="Female" />
          </View>
          {errors.gender && (
            <Text style={styles.err}>{errors.gender}</Text>
          )}

          {/* SUBMIT */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Submit"
              onPress={handleSubmit}
              bgColor='#1F3365'
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
      marginBottom: isTablet ? 35 : 15,
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
      marginBottom: isTablet ? 24 : 15,
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
      marginBottom: isTablet ? 25 : 20,
    },
  });
};