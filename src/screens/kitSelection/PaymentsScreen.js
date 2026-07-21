import React, { useState, useEffect, useMemo } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';

import phonePayImage from '../../assets/phone-pay-logo.png';
import googlePayImage from '../../assets/google-pay-logo.png';
import paytmImage from '../../assets/paytm-logo.jpg';

import apiClient from '../../services/ApiClient';
import { COLORS } from '../../utils/colors';
import { useKitAddress } from '../../hooks/useCreateKitAddress';
import { setKitCompleted, setKitFlowStep } from '../../redux/slices/kitSlice';
import { patchPayment, saveResponse } from '../../services/paymentsService';

const PAYMENT_METHODS = [
  { id: 'phonepe', label: 'PhonePe', image: phonePayImage, type: 'logo' },
  { id: 'gpay', label: 'Google Pay', image: googlePayImage, type: 'logo' },
  { id: 'paytm', label: 'Paytm', image: paytmImage, type: 'logo' },
  { id: 'upi', label: 'Pay via UPI ID', type: 'upi' },
];

export default function PaymentsScreen({ route }) {
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
    route?.params?.totalAmount ?? riderKitData?.totalAmount ?? 0;
  const paymentType =
    route?.params?.paymentType ?? riderKitData?.paymentType ?? 'online';
  const selectedEmiPlan =
    route?.params?.selectedEmiPlan ?? riderKitData?.selectedEmiPlan ?? null;
  const source = route?.params?.source ?? riderKitData?.source ?? null;

  const [selectedPayment, setSelectedPayment] = useState(
    route?.params?.selectedPaymentMethod ??
      riderKitData?.selectedPaymentMethod ??
      null
  );
  const [upiId, setUpiId] = useState(
    route?.params?.upiId ?? riderKitData?.upiId ?? ''
  );
  const [isLoading, setIsLoading] = useState(false);

  const isEmiFlow = paymentType === 'emi';

  const pickupLocationId =
    selectedZone?.id ??
    selectedZone?._id ??
    selectedZone?.pickupLocationId ??
    null;

  const formatAmount = amount =>
    Number(amount || 0).toFixed(2).replace(/\.00$/, '');

  const primaryAmount = useMemo(() => {
    if (isEmiFlow && selectedEmiPlan?.monthlyAmount) {
      return selectedEmiPlan.monthlyAmount;
    }
    return totalAmount;
  }, [isEmiFlow, selectedEmiPlan, totalAmount]);

  useEffect(() => {
    const nextSelectedPayment =
      route?.params?.selectedPaymentMethod ??
      riderKitData?.selectedPaymentMethod ??
      null;

    const nextUpiId = route?.params?.upiId ?? riderKitData?.upiId ?? '';

    setSelectedPayment(prev =>
      prev !== nextSelectedPayment ? nextSelectedPayment : prev
    );
    setUpiId(prev => (prev !== nextUpiId ? nextUpiId : prev));
  }, [
    route?.params?.selectedPaymentMethod,
    riderKitData?.selectedPaymentMethod,
    route?.params?.upiId,
    riderKitData?.upiId,
  ]);

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
        selectedPaymentMethod: selectedPayment,
        upiId,
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
    selectedPayment,
    upiId,
  ]);

  const handleSelectPayment = id => {
    setSelectedPayment(id);
    if (id !== 'upi') {
      setUpiId('');
    }
  };

  const handlePayment = async () => {
    if (!selectedPayment) {
      Alert.alert('Select payment method', 'Please select a payment method first');
      return;
    }

    if (selectedPayment === 'upi' && !upiId.trim()) {
      Alert.alert('Enter UPI ID', 'Please enter your UPI ID to continue');
      return;
    }

    if (isEmiFlow && !selectedEmiPlan) {
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
          Alert.alert('Payment failed', 'Pickup location is missing');
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
        paymentType: isEmiFlow ? 'EMI' : 'FULL',
        paymentMethod: selectedPayment,
        ...(isEmiFlow && selectedEmiPlan
          ? {
              emiMonths: selectedEmiPlan?.months,
              emiPlanId: selectedEmiPlan?.id,
            }
          : {}),
        ...(selectedPayment === 'upi' ? { upiId: upiId.trim() } : {}),
      };

      const requestIds = payableRequest.id;

      const postResponse = await saveResponse(requestIds, paymentSelectionPayload);

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
        Alert.alert('Payment error', 'Request IDs not available for payment completion');
        return;
      }

      const patchResponse = await patchPayment(requestIdsForComplete);

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
        apiResponse: {
          ...patchResponse.data,
          totalAmount: primaryAmount,
          totalItems: riderKitData?.kitItems?.length ?? null,
          data: riderKitData?.kitItems ?? patchResponse.data?.data,
        },
        deliveryMode,
        paymentType,
        totalAmount: primaryAmount,
        selectedEmiPlan,
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
        activeOpacity={0.85}
        style={[
          styles.card,
          selected && styles.cardSelected,
          selected && item.id === 'upi' && styles.upiCardSelected,
        ]}
        onPress={() => handleSelectPayment(item.id)}
        disabled={isLoading}
      >
        <View style={styles.paymentRow}>
          <View style={styles.paymentLeft}>
            {item.type === 'logo' ? (
              <Image
                source={item.image}
                style={styles.paymentImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.paymentLabel}>{item.label}</Text>
            )}
          </View>

          <View style={[styles.radioOuter, selected && styles.radioOuterActive]}>
            {selected ? <View style={styles.radioInner} /> : null}
          </View>
        </View>

        {selected && item.id === 'upi' && (
          <View style={styles.upiContainer}>
            <Text style={styles.upiHint}>Enter your UPI ID</Text>
            <TextInput
              style={styles.upiInput}
              value={upiId}
              onChangeText={setUpiId}
              placeholder="example@upi"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              autoCorrect={false}
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
          <Text style={styles.summaryLabel}>
            {isEmiFlow ? 'Monthly EMI' : 'Total Payable'}
          </Text>

          <Text style={styles.summaryAmount}>₹{formatAmount(primaryAmount)}</Text>

          {isEmiFlow && selectedEmiPlan ? (
            <>
              <Text style={styles.summarySubText}>
                {selectedEmiPlan?.months} months • {selectedEmiPlan?.interestRate}% interest
              </Text>
              <Text style={styles.summarySubText}>
                Total payable: ₹{formatAmount(selectedEmiPlan?.totalAmount)}
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
              style={styles.loader}
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
                {isEmiFlow
                  ? `Pay ₹${formatAmount(primaryAmount)} EMI`
                  : `Pay ₹${formatAmount(primaryAmount)}`}
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
      paddingBottom: 12,
    },
    card: {
      borderWidth: 1,
      borderColor: '#E2E8F0',
      borderRadius: width * 0.02,
      padding: isTablet ? 24 : width * 0.035,
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
    upiCardSelected: {
      backgroundColor: '#F8FAFF',
    },
    paymentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    paymentLeft: {
      flex: 1,
      justifyContent: 'center',
      minHeight: isTablet ? 60 : 42,
    },
    paymentImage: {
      width: isTablet ? 180 : 110,
      height: isTablet ? 54 : 32,
    },
    paymentLabel: {
      fontSize: isTablet ? 22 : 16,
      fontWeight: '600',
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
      marginLeft: 12,
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
    upiHint: {
      fontSize: 13,
      color: '#64748B',
      marginBottom: 8,
    },
    upiInput: {
      height: 46,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 12,
      borderColor: '#CBD5E1',
      color: COLORS.textPrimary,
      backgroundColor: '#FFFFFF',
    },
    loader: {
      marginBottom: 12,
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
