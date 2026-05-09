import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  ActivityIndicator,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/common/Header';

import phonePayImage from '../../assets/phone-pay-logo.png';
import googlePayImage from '../../assets/google-pay-logo.png';
import paytmImage from '../../assets/paytm-logo.jpg';
import upiImage from '../../assets/upi-logo.png';

import apiClient from '../../services/ApiClient';
import { COLORS } from '../../utils/colors';
import { TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PAYMENT_METHODS = [
  { id: 'phonepe', label: 'PhonePe', image: phonePayImage },
  { id: 'gpay', label: 'Google Pay', image: googlePayImage },
  { id: 'paytm', label: 'Paytm', image: paytmImage },
  { id: 'upi', label: 'UPI', image: upiImage },
];

export default function PaymentsScreen({ route }) {
  const [tab, setTab] = useState('Online');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [offlineAddress, setOfflineAddress] = useState([]);
  const [error, setError] = useState('');

  const { width, height } = useWindowDimensions();
  const styles = getStyles(width, height);
  const navigation = useNavigation();

  const { apiResponse, deliveryMode } = route?.params || {};

  const payableRequest = useMemo(() => {
    const items = apiResponse?.data || [];
    return (
      items.find(item => item.status === 'PAYMENT_PENDING') ||
      items[0] ||
      null
    );
  }, [apiResponse]);

  useEffect(() => {
    if (tab === 'Offline') {
      fetchOfflineStores();
    }
  }, [tab]);

  const fetchOfflineStores = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/admin/get-offline-stores');

      if (!response.data.success) {
        setError('Unable to fetch stores. Please try again.');
        return;
      }

      setOfflineAddress(response.data?.data || []);
    } catch (err) {
      setError('Something went wrong. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentMode = () => {
    if (tab === 'Offline') return 'OFFLINE';
    return 'ONLINE';
  };

  const getPaymentMethodType = (type) => {
    if (type === 'emi') return 'EMI';
    return 'FULL';
  };

  


 const handlePaymentType = async (type) => {
  if (!selectedPayment && tab === 'Online') {
    Alert.alert('Select payment method', 'Please select a payment method first');
    return;
  }

  if (!payableRequest?.id) {
    Alert.alert('Payment error', 'No payable joining kit request found');
    return;
  }

  if (tab === 'Offline' && !selectedAddress) {
    Alert.alert('Select address', 'Please select an offline store');
    return;
  }

  try {
    setIsLoading(true);

    const requestIds = payableRequest.id;

    const paymentSelectionPayload = {
      paymentMode: getPaymentMode(),
      paymentType: getPaymentMethodType(type),
      ...(type === 'emi' ? { emiMonths: 3 } : {}),
    };


    const postResponse = await apiClient.post(
      `/api/kit/payment/${requestIds}`,
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
    console.log('AXIOS ERROR URL =>', err?.config?.url);
    console.log('AXIOS ERROR STATUS =>', err?.response?.status);
    console.log('AXIOS ERROR DATA =>', JSON.stringify(err?.response?.data, null, 2));

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
        {item.id == 'upi' && (
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
          ]}
          onPress={() => setSelectedPayment(item.id)}
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
                width: 150,
                height: 50,
                overflow: 'hidden',
              }}
            >
              <Image
                source={item.image}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover',
                }}
              />
            </View>

            <View style={styles.radioOuter}>
              {selected && <View style={styles.radioInner} />}
            </View>
          </View>

          {selected && item.id === 'upi' && (
            <View
              style={{
                marginTop: 20,
                gap: 20,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  height: 43,
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  borderColor: COLORS.border,
                }}
                placeholder="Enter UPI ID here"
                placeholderTextColor="darkgrey"
              />

              <TouchableOpacity
                style={{
                  width: '90%',
                  margin: 'auto',
                  height: 39,
                  borderRadius: 50,
                  backgroundColor: '#00A63E',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: '600',
                  }}
                >
                  Pay with UPI
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </>
    );
  };

  const renderAddressItem = ({ item }) => {
    const selected = selectedAddress === item._id;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.addressCard, selected && styles.addressCardSelected]}
        onPress={() => setSelectedAddress(item._id)}
      >
        <View style={styles.addressTopRow}>
          <View style={styles.addressRadioOuter}>
            {selected && <View style={styles.addressRadioInner} />}
          </View>
          <Text style={styles.addressTitle} numberOfLines={3}>
            {item.completeAddress}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Header text={'Payment Options'} />

        <View style={styles.segmentRow}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              tab === 'Online' && styles.segmentActive,
            ]}
            onPress={() => setTab('Online')}
            disabled={isLoading}
          >
            <Text
              style={[
                styles.segmentText,
                tab === 'Online' && styles.segmentTextActive,
              ]}
            >
              Online
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentButton,
              tab === 'Offline' && styles.segmentActive,
            ]}
            onPress={() => setTab('Offline')}
            disabled={isLoading}
          >
            <Text
              style={[
                styles.segmentText,
                tab === 'Offline' && styles.segmentTextActive,
              ]}
            >
              Offline
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {tab === 'Online' ? (
            <FlatList
              data={PAYMENT_METHODS}
              keyExtractor={i => i.id}
              renderItem={renderPaymentItem}
            />
          ) : isLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ActivityIndicator size={'large'} color={COLORS.primary} />
            </View>
          ) : (
            <FlatList
              data={offlineAddress}
              keyExtractor={item => item._id}
              renderItem={renderAddressItem}
            />
          )}
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={COLORS.primary}
            style={{ marginBottom: 12 }}
          />
        ) : null}

        {tab === 'Online' && (
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
              <Text style={styles.payTypeTextActive}>Full Payment</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.payTypeBtnActive,
                (!selectedPayment || isLoading) && {
                  backgroundColor: COLORS.border,
                  borderColor: COLORS.border,
                },
              ]}
              onPress={() => handlePaymentType('emi')}
              disabled={!selectedPayment || isLoading}
            >
              <Text style={styles.payTypeTextActive}>Pay EMI</Text>
            </TouchableOpacity>
          </View>
        )}

        {tab === 'Offline' && (
          <TouchableOpacity
            style={[
              styles.payTypeBtnActive,
              (!selectedAddress || isLoading) && {
                backgroundColor: COLORS.border,
                borderColor: COLORS.border,
              },
            ]}
            disabled={!selectedAddress || isLoading}
            onPress={() => handlePaymentType('full')}
          >
            <Text style={styles.payTypeTextActive}>Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const getStyles = (width, height) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  container: { 
    flex: 1, 
    paddingHorizontal: width * 0.05, 
    paddingTop: height * 0.022 
  },
  segmentRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: width * 0.07,
    padding: width * 0.01,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignSelf: 'stretch',
    marginBottom: height * 0.022,
    marginTop: height * 0.035,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: height * 0.01,
    alignItems: 'center',
    borderRadius: width * 0.06,
  },
  segmentActive: { backgroundColor: COLORS.primary },
  segmentText: { 
    fontSize: width * 0.04, 
    color: COLORS.textPrimary, 
    fontWeight: '500' 
  },
  segmentTextActive: { color: COLORS.white },
  content: { flex: 1 },
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
  addressCard: {
    borderRadius: width * 0.02,
    padding: width * 0.03,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: height * 0.012,
  },
  addressCardSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  addressTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressRadioOuter: {
    width: width * 0.055,
    height: width * 0.055,
    borderRadius: width * 0.028,
    borderWidth: 1.5,
    borderColor: '#bff0f2',
    marginRight: width * 0.025,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  addressRadioInner: {
    width: width * 0.025,
    height: width * 0.025,
    borderRadius: width * 0.013,
    backgroundColor: COLORS.white,
  },
  addressTitle: {
    flex: 1,
    fontSize: width * 0.04,
    color: COLORS.white,
    fontWeight: '500',
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
  
});

