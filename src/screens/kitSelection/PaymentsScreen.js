import React, { useState } from 'react';
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

import phonePayImage from '../../assets/phone-pay-logo.png';
import googlePayImage from '../../assets/google-pay-logo.png';
import paytmImage from '../../assets/paytm-logo.jpg';
import upiImage from '../../assets/upi-logo.png';

import apiClient from '../../services/ApiClient';
import { COLORS } from '../../utils/colors';

import { useKitAddress } from '../../hooks/useCreateKitAddress';

import { useDispatch } from 'react-redux';
import { setKitCompleted } from '../../redux/slices/kitSlice';


const PAYMENT_METHODS = [
  { id: 'phonepe', label: 'PhonePe', image: phonePayImage },
  { id: 'gpay', label: 'Google Pay', image: googlePayImage },
  { id: 'paytm', label: 'Paytm', image: paytmImage },
  { id: 'upi', label: 'UPI', image: upiImage },
  { id: 'cod', label: 'Cash on Delivery', image: null },
];

export default function PaymentsScreen({ route }) {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [upiId, setUpiId] = useState('');

  const { width, height } = useWindowDimensions();
  const styles = getStyles(width, height);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { createKitAddress } = useKitAddress();
  const { deliveryMode, addressData, selectedZone } = route?.params || {};
  const { apiResponse} = route?.params || {};

  const handlePaymentType = async type => {

    if (!selectedPayment) {
      Alert.alert('Select payment method', 'Please select a payment method first');
      return;
    }

    if (selectedPayment === 'cod' && type === 'emi') {
      Alert.alert('Invalid option', 'EMI is not available for Cash on Delivery');
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
        kitResponse = await createKitAddress(
          selectedZone?.zone?.name || selectedZone?.name,
          selectedZone?.addressLine1,
          selectedZone?.pincode,
          'PICKUP',
          selectedZone?.id
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
        paymentType: type === 'emi' ? 'EMI' : 'FULL',
        ...(type === 'emi' && selectedPayment !== 'cod' ? { emiMonths: 3 } : {}),
      };

      const postResponse = await apiClient.post(
        `/api/kit/payment/${payableRequest.id}`,
        paymentSelectionPayload
      );

      if (!postResponse?.data?.success) {
        Alert.alert(
          'Payment error',
          postResponse?.data?.message || 'Failed to select payment'
        );
        return;
      }

      const assetRequestId = postResponse?.data?.data?.[0]?.assetRequestId;

      if (!assetRequestId) {
        Alert.alert('Payment error', 'assetRequestId not received from POST response');
        return;
      }

      const patchResponse = await apiClient.patch(
        `/api/kit/payments/complete/${assetRequestId}`
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
          kitCompleted: true,
          riderId,
          apiResponse: patchResponse.data,
          deliveryMode,
        })
      );

      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'SuccessScreen',
            params: {
              apiResponse: patchResponse.data,
              deliveryMode,
            },
          },
        ],
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
      <>
        {item.id === 'upi' && (
          <Text
            style={{
              fontSize: 24,
              fontWeight: '600',
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            Other options
          </Text>
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.card,
            selected && styles.cardSelected,
            selected && item.id === 'upi' && { backgroundColor: '#DBFBFF' },
            selected && item.id === 'cod' && { backgroundColor: '#FFF7E6' },
          ]}
          onPress={() => setSelectedPayment(item.id)}
          disabled={isLoading}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 170,
                minHeight: 50,
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {item.image ? (
                <Image
                  source={item.image}
                  style={{ width: '100%', height: 50, resizeMode: 'cover' }}
                />
              ) : (
                <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.textPrimary }}>
                  {item.label}
                </Text>
              )}
            </View>

            <View style={styles.radioOuter}>
              {selected && <View style={styles.radioInner} />}
            </View>
          </View>

          {selected && item.id === 'upi' && (
            <View style={{ marginTop: 20, gap: 20 }}>
              <TextInput
                style={{
                  flex: 1,
                  height: 43,
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  borderColor: COLORS.border,
                }}
                value={upiId}
                onChangeText={setUpiId}
                placeholder="Enter UPI ID here"
                placeholderTextColor="darkgrey"
              />

              <TouchableOpacity
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  height: 39,
                  borderRadius: 50,
                  backgroundColor: '#00A63E',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
                  Pay with UPI
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Payment Options</Text>

        <View style={styles.content}>
          <FlatList
            data={PAYMENT_METHODS}
            keyExtractor={item => item.id}
            renderItem={renderPaymentItem}
            showsVerticalScrollIndicator={false}
          />
        </View>

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
              styles.payTypeBtnActive,
              (!selectedPayment || isLoading) && {
                backgroundColor: COLORS.border,
                borderColor: COLORS.border,
              },
            ]}
            onPress={() => handlePaymentType('full')}
            disabled={!selectedPayment || isLoading}
          >
            <Text style={styles.payTypeTextActive}>
              {selectedPayment === 'cod' ? 'Continue' : 'Full Payment'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.payTypeBtnActive,
              (!selectedPayment || selectedPayment === 'cod' || isLoading) && {
                backgroundColor: COLORS.border,
                borderColor: COLORS.border,
              },
            ]}
            onPress={() => handlePaymentType('emi')}
            disabled={!selectedPayment || selectedPayment === 'cod' || isLoading}
          >
            <Text style={styles.payTypeTextActive}>Pay EMI</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (width, height) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.white },
    container: {
      flex: 1,
      paddingHorizontal: width * 0.05,
      paddingTop: height * 0.022,
    },
    content: { flex: 1, marginTop: height * 0.035 },
    card: {
      borderWidth: 1,
      borderColor: COLORS.primary,
      borderRadius: width * 0.02,
      padding: width * 0.03,
      backgroundColor: COLORS.white,
      marginBottom: height * 0.025,
    },
    cardSelected: {
      borderColor: COLORS.primary,
      shadowColor: COLORS.primary,
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    radioOuter: {
      width: width * 0.055,
      height: width * 0.055,
      borderRadius: width * 0.028,
      borderWidth: 1.5,
      borderColor: COLORS.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioInner: {
      width: width * 0.03,
      height: width * 0.03,
      borderRadius: width * 0.015,
      backgroundColor: COLORS.primary,
    },
    payTypeRow: {
      flexDirection: 'row',
      gap: width * 0.03,
      marginBottom: height * 0.015,
      marginHorizontal: width * 0.01,
    },
    payTypeBtnActive: {
      backgroundColor: COLORS.primary,
      flex: 1,
      paddingVertical: height * 0.015,
      borderRadius: width * 0.025,
      borderWidth: 1.5,
      borderColor: COLORS.primary,
      alignItems: 'center',
    },
    payTypeTextActive: {
      color: COLORS.white,
      fontSize: width * 0.038,
      fontWeight: '600',
    },
    headerTitle: {
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '700',
      color: COLORS.textPrimary,
    },
  });