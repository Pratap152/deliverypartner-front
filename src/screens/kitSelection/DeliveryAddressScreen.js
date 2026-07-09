import React, { useEffect, useState } from 'react';
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

  const [name, setName] = useState(riderKitData?.addressData?.name ?? '');
  const [mobile, setMobile] = useState(riderKitData?.addressData?.mobile ?? '');
  const [address, setAddress] = useState(riderKitData?.addressData?.address ?? '');
  const [city, setCity] = useState(riderKitData?.addressData?.city ?? '');
  const [pincode, setPincode] = useState(riderKitData?.addressData?.pincode ?? '');
  const [landmark, setLandmark] = useState(riderKitData?.addressData?.landmark ?? '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!currentRiderId) return;

    dispatch(
      setKitFlowStep({
        riderId: currentRiderId,
        currentStep: 'DeliveryAddressScreen',
        deliveryMode: 'online',
        addressData: { name, mobile, address, city, pincode, landmark },
        kitItems,
        totalAmount,
      })
    );
  }, [dispatch, currentRiderId, name, mobile, address, city, pincode, landmark, kitItems, totalAmount]);

  const validate = () => {
    const nextErrors = {};

    if (!name.trim() || name.trim().length < 2) {
      nextErrors.name = 'Enter valid name';
    }
    if (!/^\d{10}$/.test(mobile.trim())) {
      nextErrors.mobile = 'Enter valid mobile number';
    }
    if (!address.trim() || address.trim().length < 8) {
      nextErrors.address = 'Enter complete address';
    }
    if (!city.trim()) {
      nextErrors.city = 'Enter city';
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      nextErrors.pincode = 'Enter valid pincode';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;

    const addressData = {
      name: name.trim(),
      mobile: mobile.trim(),
      address: address.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
      landmark: landmark.trim(),
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
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
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

          <TextInput
            placeholder="Mobile Number"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            maxLength={10}
          />
          {errors.mobile ? <Text style={styles.error}>{errors.mobile}</Text> : null}

          <TextInput
            placeholder="Complete Address"
            placeholderTextColor="#94A3B8"
            style={[styles.input, styles.multilineInput]}
            value={address}
            onChangeText={setAddress}
            multiline
          />
          {errors.address ? <Text style={styles.error}>{errors.address}</Text> : null}

          <TextInput
            placeholder="City"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            value={city}
            onChangeText={setCity}
          />
          {errors.city ? <Text style={styles.error}>{errors.city}</Text> : null}

          <TextInput
            placeholder="Pincode"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            value={pincode}
            onChangeText={setPincode}
            keyboardType="number-pad"
            maxLength={6}
          />
          {errors.pincode ? <Text style={styles.error}>{errors.pincode}</Text> : null}

          <TextInput
            placeholder="Landmark (Optional)"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            value={landmark}
            onChangeText={setLandmark}
          />

          <TouchableOpacity style={styles.primaryBtn} onPress={handleContinue}>
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
    container: { flex: 1, backgroundColor: '#F5F7FB' },
    contentContainer: { paddingHorizontal: isTablet ? 60 : 20, paddingTop: 12, paddingBottom: 32 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerSpacer: { width: 40 },
    headerTitle: { fontSize: isTablet ? 28 : 18, fontWeight: '700', color: '#0F172A' },
    formTitle: { fontSize: isTablet ? 22 : 16, fontWeight: '700', color: '#1E293B', marginBottom: 16 },
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
    primaryBtnText: {
      color: '#FFFFFF',
      fontSize: isTablet ? 20 : 16,
      fontWeight: '700',
    },
  });