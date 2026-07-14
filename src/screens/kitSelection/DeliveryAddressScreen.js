import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { setKitFlowStep } from '../../redux/slices/kitSlice';

const DeliveryAddressScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = getStyles(isTablet);

  const dispatch = useDispatch();
  const currentRiderId = useSelector(state => state.profile?.data?._id ?? null);
  const riderKitData = useSelector(state =>
    currentRiderId ? state.kit?.riders?.[currentRiderId] ?? null : null
  );

  const { source, kitItems = [], totalAmount = 0 } = route?.params || {};

  const [formData, setFormData] = useState({
    name: riderKitData?.addressData?.name ?? '',
    mobile: riderKitData?.addressData?.mobile ?? '',
    address: riderKitData?.addressData?.address ?? '',
    city: riderKitData?.addressData?.city ?? '',
    pincode: riderKitData?.addressData?.pincode ?? '',
    landmark: riderKitData?.addressData?.landmark ?? '',
  });

  const [errors, setErrors] = useState({});

  const validateName = value => {
    if (!value.trim()) return 'Name is required';
    if (value.trim().length < 3) return 'Name must contain at least 3 characters';
    if (!/^[A-Za-z\s]+$/.test(value.trim())) {
      return 'Only alphabets and spaces are allowed';
    }
    return '';
  };

  const validateMobile = value => {
    if (!value) return 'Mobile number is required';
    if (!/^[6-9]\d{9}$/.test(value)) {
      return 'Enter a valid 10-digit mobile number';
    }
    return '';
  };

  const validateAddress = value => {
    if (!value.trim()) return 'Address is required';
    if (value.trim().length < 8) return 'Enter complete address';
    return '';
  };

  const validateCity = value => {
    if (!value.trim()) return 'City is required';
    if (value.trim().length < 2) return 'City must contain at least 2 characters';
    if (!/^[A-Za-z\s]+$/.test(value.trim())) {
      return 'Only alphabets and spaces are allowed';
    }
    return '';
  };

  const validatePincode = value => {
    if (!value) return 'Pincode is required';
    if (!/^\d{6}$/.test(value)) return 'Enter valid 6-digit pincode';
    return '';
  };

  const validateLandmark = value => {
    if (!value.trim()) return '';
    if (value.trim().length < 2) return 'Landmark must contain at least 2 characters';
    return '';
  };

  const handleChange = (field, value) => {
    if (field === 'name') {
      value = value.replace(/[^A-Za-z\s]/g, '').slice(0, 50);
    }

    if (field === 'mobile') {
      value = value.replace(/[^0-9]/g, '').slice(0, 10);

      if (value.length > 0 && !/^[6-9]/.test(value)) {
        return;
      }
    }

    if (field === 'city') {
      value = value.replace(/[^A-Za-z\s]/g, '').slice(0, 50);
    }

    if (field === 'pincode') {
      value = value.replace(/[^0-9]/g, '').slice(0, 6);
    }

    if (field === 'address') {
      value = value.slice(0, 200);
    }

    if (field === 'landmark') {
      value = value.slice(0, 100);
    }

    setFormData(prev => ({ ...prev, [field]: value }));

    let error = '';
    if (field === 'name') error = validateName(value);
    if (field === 'mobile') error = validateMobile(value);
    if (field === 'address') error = validateAddress(value);
    if (field === 'city') error = validateCity(value);
    if (field === 'pincode') error = validatePincode(value);
    if (field === 'landmark') error = validateLandmark(value);

    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateForm = () => {
    const nextErrors = {
      name: validateName(formData.name),
      mobile: validateMobile(formData.mobile),
      address: validateAddress(formData.address),
      city: validateCity(formData.city),
      pincode: validatePincode(formData.pincode),
      landmark: validateLandmark(formData.landmark),
    };

    setErrors(nextErrors);
    return Object.values(nextErrors).every(error => !error);
  };

  const isFormValid = useMemo(() => {
    return (
      !validateName(formData.name) &&
      !validateMobile(formData.mobile) &&
      !validateAddress(formData.address) &&
      !validateCity(formData.city) &&
      !validatePincode(formData.pincode) &&
      !validateLandmark(formData.landmark)
    );
  }, [formData]);

  useEffect(() => {
    if (!currentRiderId) return;

    dispatch(
      setKitFlowStep({
        riderId: currentRiderId,
        currentStep: 'DeliveryAddressScreen',
        deliveryMode: 'online',
        addressData: {
          name: formData.name,
          mobile: formData.mobile,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          landmark: formData.landmark,
        },
        kitItems,
        totalAmount,
      })
    );
  }, [dispatch, currentRiderId, formData, kitItems, totalAmount]);

  const handleContinue = () => {
    if (!validateForm()) return;

    const addressData = {
      name: formData.name.trim(),
      mobile: formData.mobile.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      pincode: formData.pincode.trim(),
      landmark: formData.landmark.trim(),
    };

    dispatch(
      setKitFlowStep({
        riderId: currentRiderId,
        currentStep: 'PaymentTypeScreen',
        deliveryMode: 'online',
        addressData,
        selectedZone: null,
        kitItems,
        totalAmount,
      })
    );

    navigation.navigate('PaymentTypeScreen', {
      source,
      deliveryMode: 'online',
      addressData,
      kitItems,
      totalAmount,
    });
  };

  const getInputStyle = field => [
    styles.input,
    field === 'address' && styles.multilineInput,
    errors[field] ? styles.inputError : null,
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={22} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Delivery Address</Text>
            <View style={styles.headerSpacer} />
          </View>

          <Text style={styles.formTitle}>Enter delivery address</Text>

          <TextInput
            placeholder="Name"
            placeholderTextColor="#94A3B8"
            style={getInputStyle('name')}
            value={formData.name}
            onChangeText={text => handleChange('name', text)}
            maxLength={50}
          />
          {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

          <TextInput
            placeholder="Mobile Number"
            placeholderTextColor="#94A3B8"
            style={getInputStyle('mobile')}
            value={formData.mobile}
            onChangeText={text => handleChange('mobile', text)}
            keyboardType="number-pad"
            maxLength={10}
          />
          {errors.mobile ? <Text style={styles.error}>{errors.mobile}</Text> : null}

          <TextInput
            placeholder="Complete Address"
            placeholderTextColor="#94A3B8"
            style={getInputStyle('address')}
            value={formData.address}
            onChangeText={text => handleChange('address', text)}
            multiline
            maxLength={200}
          />
          {errors.address ? <Text style={styles.error}>{errors.address}</Text> : null}

          <TextInput
            placeholder="City"
            placeholderTextColor="#94A3B8"
            style={getInputStyle('city')}
            value={formData.city}
            onChangeText={text => handleChange('city', text)}
            maxLength={50}
          />
          {errors.city ? <Text style={styles.error}>{errors.city}</Text> : null}

          <TextInput
            placeholder="Pincode"
            placeholderTextColor="#94A3B8"
            style={getInputStyle('pincode')}
            value={formData.pincode}
            onChangeText={text => handleChange('pincode', text)}
            keyboardType="number-pad"
            maxLength={6}
          />
          {errors.pincode ? <Text style={styles.error}>{errors.pincode}</Text> : null}

          <TextInput
            placeholder="Landmark (Optional)"
            placeholderTextColor="#94A3B8"
            style={getInputStyle('landmark')}
            value={formData.landmark}
            onChangeText={text => handleChange('landmark', text)}
            maxLength={100}
          />
          {errors.landmark ? <Text style={styles.error}>{errors.landmark}</Text> : null}

          <TouchableOpacity
            style={[styles.primaryBtn, !isFormValid && styles.primaryBtnDisabled]}
            onPress={handleContinue}
            disabled={!isFormValid}
          >
            <Text style={styles.primaryBtnText}>Save & Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DeliveryAddressScreen;

const getStyles = isTablet =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F7FB',
    },
    keyboardContainer: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: isTablet ? 60 : 20,
      paddingTop: 12,
      paddingBottom: 32,
      flexGrow: 1,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    backBtn: {
      width: 40,
      height: 40,
      justifyContent: 'center',
    },
    headerSpacer: {
      width: 40,
    },
    headerTitle: {
      fontSize: isTablet ? 28 : 18,
      fontWeight: '700',
      color: '#0F172A',
    },
    formTitle: {
      fontSize: isTablet ? 22 : 16,
      fontWeight: '700',
      color: '#1E293B',
      marginBottom: 16,
    },
    input: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      paddingHorizontal: 14,
      paddingVertical: 14,
      fontSize: 14,
      color: '#0F172A',
      marginBottom: 10,
    },
    inputError: {
      borderColor: '#DC2626',
    },
    multilineInput: {
      minHeight: 90,
      textAlignVertical: 'top',
    },
    error: {
      color: '#DC2626',
      fontSize: 12,
      marginTop: -4,
      marginBottom: 10,
      marginLeft: 2,
    },
    primaryBtn: {
      marginTop: 24,
      backgroundColor: '#142C63',
      borderRadius: 14,
      paddingVertical: 18,
      alignItems: 'center',
    },
    primaryBtnDisabled: {
      opacity: 0.5,
    },
    primaryBtnText: {
      color: '#FFFFFF',
      fontSize: isTablet ? 20 : 16,
      fontWeight: '700',
    },
  });