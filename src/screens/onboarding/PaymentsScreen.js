import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/common/Header';

import phonePayImage from '../../assets/phone-pay-logo.png';
import googlePayImage from '../../assets/google-pay-logo.png';
import paytmImage from '../../assets/paytm-logo.jpg';
import razorPayImage from '../../assets/razor-pay-logo.jpg';
import upiImage from '../../assets/upi-logo.png';

import { COLORS } from '../../utils/colors';
import { TextInput } from 'react-native';

const PAYMENT_METHODS = [
  { id: 'phonepe', label: 'PhonePe', image: phonePayImage },
  { id: 'gpay', label: 'Google Pay', image: googlePayImage },
  { id: 'paytm', label: 'Paytm', image: paytmImage },
  // { id: 'razorpay', label: 'Razorpay', image: razorPayImage },
  { id: 'upi', label: 'UPI', image: upiImage },
];

const OFFLINE_ADDRESSES = [
  {
    id: 'addr1',
    title:
      '1st Floor, Street, No.7, PB House, HUDA Techno Enclave, Madhapur, Hyderabad, Telangana 500081',
  },
  {
    id: 'addr2',
    title:
      'Plot no 200, PR Nagar, Karmika Nagar, Moti Nagar, Hyderabad, Telangana 500114',
  },
  {
    id: 'addr3',
    title:
      '7-1-45/1/15, 1st Floor, Reddy Complex, Bukkampet Road, Ameerpet post, Begumpet, Hyderabad, Telangana 500038',
  },
];

export default function PaymentsScreen() {
  const [tab, setTab] = useState('Online'); // 'Online' | 'Offline'
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(
    OFFLINE_ADDRESSES[0].id,
  );

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
                width: item.id === 'razorpay' ? 270 : 150,
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
                  marginLeft: item.id === 'razorpay' ? -50 : 0,
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
    const selected = selectedAddress === item.id;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.addressCard, selected && styles.addressCardSelected]}
        onPress={() => setSelectedAddress(item.id)}
      >
        <View style={styles.addressTopRow}>
          <View style={styles.addressRadioOuter}>
            {selected && <View style={styles.addressRadioInner} />}
          </View>
          <Text style={styles.addressTitle} numberOfLines={3}>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Header text={'Payment Options'} />

        {/* Segment control */}
        <View style={styles.segmentRow}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              tab === 'Online' && styles.segmentActive,
            ]}
            onPress={() => setTab('Online')}
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

        {/* Content */}
        <View style={styles.content}>
          {tab === 'Online' ? (
            <FlatList
              data={PAYMENT_METHODS}
              keyExtractor={i => i.id}
              renderItem={renderPaymentItem}
            />
          ) : (
            <FlatList
              data={OFFLINE_ADDRESSES}
              keyExtractor={i => i.id}
              renderItem={renderAddressItem}
            />
          )}
        </View>

        {/* Continue button */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.continueButton}
          disabled={
            (tab === 'Online' && !selectedPayment) ||
            (tab === 'Offline' && !selectedAddress)
          }
          onPress={() => {
            if (tab === 'Online') {
              console.log('Selected payment:', selectedPayment);
            } else {
              console.log('Selected address:', selectedAddress);
            }
          }}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 18 },

  segmentRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignSelf: 'stretch',
    marginBottom: 18,
    marginTop: 30,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 24,
  },
  segmentActive: {
    backgroundColor: COLORS.primary,
  },
  segmentText: { fontSize: 16, color: COLORS.textPrimary, fontWeight: '500' },
  segmentTextActive: { color: COLORS.white },
  content: { flex: 1 },
  card: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    backgroundColor: COLORS.white,
    marginBottom: 20,
  },
  cardSelected: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  cardLabel: { flex: 1, fontSize: 16 },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },

  addressCard: {
    borderRadius: 8,
    padding: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: 10,
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
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#bff0f2',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  addressRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.white,
  },
  addressTitle: {
    flex: 1,
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '500',
  },

  continueButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginBottom: 12,
  },
  continueText: { color: COLORS.white, fontWeight: '600', fontSize: 16 },
});
