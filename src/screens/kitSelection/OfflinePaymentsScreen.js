import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { setKitCompleted, setKitFlowStep } from '../../redux/slices/kitSlice';
import { useKitAddress } from '../../hooks/useCreateKitAddress';

const formatValue = value => {
  if (value === null || value === undefined || value === '') return null;
  return String(value);
};

const OfflinePaymentScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = getStyles(isTablet);

  const dispatch = useDispatch();
  const { createKitAddress } = useKitAddress();

  const currentRiderId = useSelector(state => state.profile?.data?._id ?? null);
  const riderKitData = useSelector(state =>
    currentRiderId ? state.kit?.riders?.[currentRiderId] ?? null : null
  );

  const source = route?.params?.source ?? riderKitData?.source ?? null;
  const deliveryMode = route?.params?.deliveryMode ?? riderKitData?.deliveryMode ?? null;
  const addressData = route?.params?.addressData ?? riderKitData?.addressData ?? null;
  const selectedZone = route?.params?.selectedZone ?? riderKitData?.selectedZone ?? null;
  const totalAmount = route?.params?.totalAmount ?? riderKitData?.totalAmount ?? null;
  const paymentType = route?.params?.paymentType ?? riderKitData?.paymentType ?? 'offline';

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!currentRiderId) return;

    dispatch(
      setKitFlowStep({
        riderId: currentRiderId,
        currentStep: 'OfflinePaymentScreen',
        deliveryMode,
        addressData,
        selectedZone,
        paymentType,
        totalAmount,
        source,
      })
    );
  }, [dispatch, currentRiderId, deliveryMode, addressData, selectedZone, paymentType, totalAmount, source]);

  const pickupLocationId =
    selectedZone?.id ??
    selectedZone?._id ??
    selectedZone?.pickupLocationId ??
    null;

  const handleSubmitOfflineRequest = async () => {
    try {
      setSubmitting(true);

      let kitResponse;

      if (deliveryMode === 'offline') {
        if (!pickupLocationId) {
          Alert.alert('Request failed', 'Pickup location is missing');
          return;
        }

        kitResponse = await createKitAddress(
          selectedZone?.zone?.name || selectedZone?.name,
          selectedZone?.addressLine1,
          selectedZone?.pincode,
          'PICKUP',
          pickupLocationId
        );
      } else if (deliveryMode === 'online') {
        kitResponse = await createKitAddress(
          addressData?.name,
          addressData?.address,
          addressData?.pincode
        );
      } else {
        Alert.alert('Request failed', 'Delivery mode is missing');
        return;
      }

      const riderId =
        kitResponse?.data?.[0]?.riderId ??
        currentRiderId ??
        null;

      dispatch(
        setKitCompleted({
          riderId,
          kitCompleted: true,
          apiResponse: kitResponse,
          deliveryMode,
          currentStep: 'SuccessScreen',
          addressData,
          selectedZone,
        })
      );

      navigation.replace('SuccessScreen', {
        apiResponse: kitResponse,
        deliveryMode,
        paymentType,
        source,
      });
    } catch (error) {
      Alert.alert(
        'Request failed',
        error?.response?.data?.message || error?.message || 'Something went wrong'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const locationTitle =
    selectedZone?.zone?.name ||
    selectedZone?.name ||
    addressData?.name ||
    null;

  const locationAddress =
    deliveryMode === 'offline'
      ? [
          selectedZone?.addressLine1,
          selectedZone?.addressLine2,
          selectedZone?.city,
          selectedZone?.state,
          selectedZone?.pincode,
        ]
          .filter(Boolean)
          .join(', ')
      : [addressData?.address, addressData?.city, addressData?.pincode]
          .filter(Boolean)
          .join(', ');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Offline Payment</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Summary</Text>

          {formatValue(deliveryMode) ? (
            <View style={styles.row}>
              <Text style={styles.label}>Delivery Mode</Text>
              <Text style={styles.value}>
                {deliveryMode === 'offline' ? 'Offline Pickup' : 'Home Delivery'}
              </Text>
            </View>
          ) : null}

          {formatValue(locationTitle) ? (
            <View style={styles.row}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{locationTitle}</Text>
            </View>
          ) : null}

          {formatValue(locationAddress) ? (
            <View style={styles.row}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{locationAddress}</Text>
            </View>
          ) : null}

          {formatValue(totalAmount) ? (
            <View style={styles.row}>
              <Text style={styles.label}>Amount</Text>
              <Text style={styles.value}>₹{totalAmount}</Text>
            </View>
          ) : null}

          <View style={[styles.row, styles.lastRow]}>
            <Text style={styles.label}>Payment Type</Text>
            <Text style={styles.value}>Offline</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, submitting && styles.primaryBtnDisabled]}
          disabled={submitting}
          onPress={handleSubmitOfflineRequest}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryBtnText}>Confirm Request</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OfflinePaymentScreen;

const getStyles = isTablet =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FB' },
    contentContainer: { paddingHorizontal: isTablet ? 60 : 20, paddingTop: 12, paddingBottom: 32 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerSpacer: { width: 40 },
    headerTitle: { fontSize: isTablet ? 28 : 18, fontWeight: '700', color: '#0F172A' },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      padding: 18,
      marginBottom: 24,
    },
    cardTitle: {
      fontSize: isTablet ? 20 : 16,
      fontWeight: '700',
      color: '#0F172A',
      marginBottom: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#F1F5F9',
    },
    lastRow: { borderBottomWidth: 0 },
    label: {
      flex: 1,
      color: '#64748B',
      fontSize: 14,
    },
    value: {
      flex: 1,
      color: '#0F172A',
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'right',
    },
    primaryBtn: {
      backgroundColor: '#142C63',
      borderRadius: 14,
      paddingVertical: 18,
      alignItems: 'center',
    },
    primaryBtnDisabled: {
      opacity: 0.7,
    },
    primaryBtnText: {
      color: '#FFFFFF',
      fontSize: isTablet ? 20 : 16,
      fontWeight: '700',
    },
  });