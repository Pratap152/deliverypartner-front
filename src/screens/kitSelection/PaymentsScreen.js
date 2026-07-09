import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  useWindowDimensions,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import phonePayImage from '../../assets/phone-pay-logo.png';
import googlePayImage from '../../assets/google-pay-logo.png';
import paytmImage from '../../assets/paytm-logo.jpg';

import apiClient from '../../services/ApiClient';
import { COLORS } from '../../utils/colors';
import { useKitAddress } from '../../hooks/useCreateKitAddress';

import { useDispatch, useSelector } from 'react-redux';
import { setKitCompleted, setKitFlowStep } from '../../redux/slices/kitSlice';

const PAYMENT_METHODS = [
  { id: 'phonepe', label: 'PhonePe', image: phonePayImage },
  { id: 'gpay', label: 'Google Pay', image: googlePayImage },
  { id: 'paytm', label: 'Paytm', image: paytmImage },
  { id: 'upi', label: 'UPI ID', image: null },
];

export default function PaymentsScreen({ route }) {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [upiId, setUpiId] = useState('');

  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = getStyles(width, height, isTablet);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { createKitAddress } = useKitAddress();

  const currentRiderId = useSelector(state => state.profile?.data?._id ?? null);

  const riderKitData = useSelector(state =>
    currentRiderId ? state.kit?.riders?.[currentRiderId] ?? null : null
  );

  const deliveryMode =
    route?.params?.deliveryMode ?? riderKitData?.deliveryMode ?? null;
  const addressData =
    route?.params?.addressData ?? riderKitData?.addressData ?? null;
  const selectedZone =
    route?.params?.selectedZone ?? riderKitData?.selectedZone ?? null;
  const apiResponse =
    route?.params?.apiResponse ?? riderKitData?.apiResponse ?? null;
  const totalAmount =
    route?.params?.totalAmount ?? riderKitData?.totalAmount ?? null;
  const paymentType =
    route?.params?.paymentType ?? riderKitData?.paymentType ?? 'emi';
  const selectedEmiPlan =
    route?.params?.selectedEmiPlan ?? riderKitData?.selectedEmiPlan ?? null;
  const source = route?.params?.source ?? riderKitData?.source ?? null;

  const pickupLocationId =
    selectedZone?.id ??
    selectedZone?._id ??
    selectedZone?.pickupLocationId ??
    null;

  const formatAmount = amount =>
    Number(amount || 0).toFixed(2).replace(/\.00$/, '');

  useEffect(() => {
    if (!currentRiderId) return;

    dispatch(
      setKitFlowStep({
        riderId: currentRiderId,
        currentStep: 'PaymentsScreen',
        apiResponse,
        deliveryMode,
        addressData,
        selectedZone,
        totalAmount,
        paymentType,
        selectedEmiPlan,
        source,
      })
    );
  }, [
    dispatch,
    currentRiderId,
    apiResponse,
    deliveryMode,
    addressData,
    selectedZone,
    totalAmount,
    paymentType,
    selectedEmiPlan,
    source,
  ]);

  const handlePayment = async () => {
    if (!selectedPayment) {
      Alert.alert('Select payment method', 'Please select a payment method first');
      return;
    }

    if (selectedPayment === 'upi' && !upiId.trim()) {
      Alert.alert('Enter UPI ID', 'Please enter your UPI ID to continue');
      return;
    }

    if (!selectedEmiPlan) {
      Alert.alert('EMI plan missing', 'Please select an EMI plan before continuing');
      return;
    }

    try {
      setIsLoading(true);

      let kitResponse;

      if (deliveryMode === 'online') {
        kitResponse = await createKitAddress(
          addressData?.name,
          addressData?.address,
          addressData?.pincode
        );
      } else {
        if (!pickupLocationId) {
          Alert.alert('Payment failed', 'pickupLocationId missing for selected pickup zone');
          return;
        }

        kitResponse = await createKitAddress(
          selectedZone?.zone?.name || selectedZone?.name,
          selectedZone?.addressLine1,
          selectedZone?.pincode,
          'PICKUP',
          pickupLocationId
        );
      }

      const items = kitResponse?.data || [];
      const payableRequest =
        items.find(item => item.status === 'PAYMENT_PENDING') ||
        items[0] ||
        null;

      if (!payableRequest?.id) {
        Alert.alert('Payment error', 'No payable joining kit request found');
        return;
      }

      const paymentSelectionPayload = {
        paymentMode: 'ONLINE',
        paymentType: 'EMI',
        emiMonths: selectedEmiPlan?.months,
        emiPlanId: selectedEmiPlan?.id,
        paymentApp: selectedPayment,
        ...(selectedPayment === 'upi' ? { upiId: upiId.trim() } : {}),
      };

      const requestIds = payableRequest.id;

      const postResponse = await apiClient.post(
        `/api/kit/payment?requestIds=${requestIds}`,
        paymentSelectionPayload
      );

      if (!postResponse?.data?.success) {
        Alert.alert(
          'Payment error',
          postResponse?.data?.message || 'Failed to select payment'
        );
        return;
      }

      const requestIdsForComplete =
        postResponse?.data?.data
          ?.map(item => item.assetRequestId)
          .filter(Boolean)
          .join(',') || payableRequest.id;

      if (!requestIdsForComplete) {
        Alert.alert('Payment error', 'requestIds not available for payment completion');
        return;
      }

      const patchResponse = await apiClient.patch(
        `/api/kit/payments/complete?requestIds=${requestIdsForComplete}`
      );

      if (!patchResponse?.data?.success) {
        Alert.alert(
          'Payment error',
          patchResponse?.data?.message || 'Failed to complete payment'
        );
        return;
      }

      const riderId =
        patchResponse?.data?.data?.[0]?.riderId ??
        apiResponse?.data?.[0]?.riderId ??
        null;

      dispatch(
        setKitCompleted({
          riderId: currentRiderId || riderId,
          kitCompleted: true,
          apiResponse: patchResponse.data,
          deliveryMode,
          currentStep: 'SuccessScreen',
          addressData,
          selectedZone,
        })
      );

      navigation.replace('SuccessScreen', {
        apiResponse: patchResponse.data,
        deliveryMode,
        source,
      });
    } catch (err) {
      Alert.alert(
        'Payment failed',
        err?.response?.data?.message || err?.message || 'Something went wrong'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderPaymentItem = ({ item }) => {
    const selected = selectedPayment === item.id;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.card, selected && styles.cardSelected]}
        onPress={() => setSelectedPayment(item.id)}
        disabled={isLoading}
      >
        <View style={styles.paymentRow}>
          <View style={styles.paymentLeft}>
            {item.image ? (
              <Image source={item.image} style={styles.paymentImage} resizeMode="cover"/>
            ) : (
              <Text style={styles.upiLabel}>{item.label}</Text>
            )}
          </View>

          <View style={[styles.radioOuter, selected && styles.radioOuterActive]}>
            {selected ? <View style={styles.radioInner} /> : null}
          </View>
        </View>

        {selected && item.id === 'upi' && (
          <View style={styles.upiContainer}>
            <TextInput
              style={styles.upiInput}
              value={upiId}
              onChangeText={setUpiId}
              placeholder="Enter UPI ID"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#0F172A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Payment Options</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Payable</Text>
          <Text style={styles.summaryAmount}>₹{formatAmount(totalAmount)}</Text>

          {selectedEmiPlan ? (
            <>
              <Text style={styles.summarySubText}>
                EMI: ₹{formatAmount(selectedEmiPlan?.monthlyAmount)}/month
              </Text>
              <Text style={styles.summarySubText}>
                {selectedEmiPlan?.months} months • {selectedEmiPlan?.interestRate}% interest
              </Text>
              <Text style={styles.summarySubText}>
                Total payable on EMI: ₹{formatAmount(selectedEmiPlan?.totalAmount)}
              </Text>
            </>
          ) : (
            <Text style={styles.summarySubText}>
              Complete your payment using your preferred method
            </Text>
          )}
        </View>

        <View style={styles.content}>
          <FlatList
            data={PAYMENT_METHODS}
            keyExtractor={item => item.id}
            renderItem={renderPaymentItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />

          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
              style={{ marginBottom: 12 }}
            />
          ) : null}

          <View style={styles.payTypeRow}>
            <TouchableOpacity
              style={[
                styles.payTypeBtn,
                (!selectedPayment || isLoading) && styles.payTypeBtnDisabled,
              ]}
              onPress={handlePayment}
              disabled={!selectedPayment || isLoading}
            >
              <Text style={styles.payTypeText}>
                {selectedEmiPlan
                  ? `Pay ₹${formatAmount(selectedEmiPlan?.monthlyAmount)} EMI`
                  : 'Continue Payment'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (width, height, isTablet) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    container: {
      flex: 1,
      paddingHorizontal: width * 0.05,
      paddingTop: height * 0.02,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    backBtn: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    headerSpacer: {
      width: 40,
    },
    headerTitle: {
      textAlign: 'center',
      fontSize: isTablet ? 32 : 24,
      fontWeight: '700',
      color: COLORS.textPrimary,
    },
    summaryCard: {
      backgroundColor: COLORS.white,
      borderWidth: 1,
      borderColor: COLORS.primary,
      borderRadius: 16,
      padding: isTablet ? 22 : 16,
      marginBottom: 18,
    },
    summaryLabel: {
      fontSize: isTablet ? 18 : 14,
      color: COLORS.textSecondary || '#64748B',
      marginBottom: 6,
      fontWeight: '600',
    },
    summaryAmount: {
      fontSize: isTablet ? 30 : 24,
      fontWeight: '700',
      color: COLORS.primary,
      marginBottom: 8,
    },
    summarySubText: {
      fontSize: isTablet ? 16 : 13,
      color: COLORS.textSecondary || '#64748B',
      marginTop: 2,
    },
    content: {
      flex: 1,
      marginTop: height * 0.01,
    },
    listContent: {
      paddingBottom: 10,
    },
    card: {
      borderWidth: 1,
      borderColor: '#E2E8F0',
      borderRadius: width * 0.02,
      padding: isTablet ? 24 : width * 0.03,
      backgroundColor: COLORS.white,
      marginBottom: height * 0.02,
    },
    cardSelected: {
      borderColor: COLORS.primary,
      backgroundColor: '#EFF6FF',
      shadowColor: COLORS.primary,
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    paymentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    paymentLeft: {
      width: isTablet ? 220 : 170,
      minHeight: isTablet ? 64 : 44,
      justifyContent: 'center',
      overflow: 'hidden',
    },
    paymentImage: {
      width: '100%',
      height: isTablet ? 56 : 40,
    },
    upiLabel: {
      fontSize: isTablet ? 22 : 18,
      fontWeight: '700',
      color: COLORS.textPrimary,
    },
    radioOuter: {
      width: isTablet ? 30 : 22,
      height: isTablet ? 30 : 22,
      borderRadius: isTablet ? 15 : 11,
      borderWidth: 2,
      borderColor: '#CBD5E1',
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioOuterActive: {
      borderColor: COLORS.primary,
    },
    radioInner: {
      width: isTablet ? 14 : 10,
      height: isTablet ? 14 : 10,
      borderRadius: isTablet ? 7 : 5,
      backgroundColor: COLORS.primary,
    },
    upiContainer: {
      marginTop: 16,
    },
    upiInput: {
      height: 46,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 12,
      borderColor: COLORS.border,
      color: COLORS.textPrimary,
      backgroundColor: '#FFFFFF',
    },
    payTypeRow: {
      marginBottom: height * 0.015,
      marginTop: 8,
    },
    payTypeBtn: {
      backgroundColor: COLORS.primary,
      paddingVertical: height * 0.017,
      borderRadius: width * 0.025,
      borderWidth: 1.5,
      borderColor: COLORS.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    payTypeBtnDisabled: {
      backgroundColor: COLORS.border,
      borderColor: COLORS.border,
      opacity: 0.8,
    },
    payTypeText: {
      color: COLORS.white,
      fontSize: isTablet ? 20 : width * 0.038,
      fontWeight: '600',
      textAlign: 'center',
      paddingHorizontal: 6,
    },
  });