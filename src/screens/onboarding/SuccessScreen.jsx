import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../utils/colors';
import { setKitCompleted } from '../../redux/slices/kitSlice';

const formatEnum = value => {
  if (!value) return '';
  return value
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
};

const SuccessScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const { apiResponse, deliveryMode, paymentType } = route?.params || {};

  const items = Array.isArray(apiResponse?.data) ? apiResponse.data : [];
  const firstItem = items[0];
  const payment = firstItem?.Payment;

  const resolvedDeliveryMode =
    deliveryMode ||
    (firstItem?.deliveryMode === 'HOME_DELIVERY'
      ? 'online'
      : firstItem?.deliveryMode
      ? 'offline'
      : null);

  const isPaidFlow = !!paymentType || !!payment;

  useEffect(() => {
    const riderId =
      apiResponse?.data?.[0]?.riderId ??
      apiResponse?.data?.riderId ??
      firstItem?.riderId ??
      null;

    dispatch(
      setKitCompleted({
        apiResponse: apiResponse || null,
        deliveryMode: resolvedDeliveryMode || null,
        riderId,
      })
    );
  }, [apiResponse, resolvedDeliveryMode, firstItem, dispatch]);

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  const screenTitle = isPaidFlow
    ? 'Payment completed successfully'
    : 'Kit Request Submitted';

  const paymentStatus =
    payment?.status
      ? formatEnum(payment.status)
      : paymentType
      ? paymentType === 'emi'
        ? 'EMI Selected'
        : 'Full Payment'
      : null;

  const paymentTypeText =
    payment?.paymentType
      ? formatEnum(payment.paymentType)
      : paymentType
      ? paymentType === 'emi'
        ? 'EMI Payment'
        : 'Full Payment'
      : null;

  const amountText =
    typeof apiResponse?.totalAmount === 'number'
      ? `₹${apiResponse.totalAmount}`
      : typeof apiResponse?.isEntireKitFree === 'boolean'
      ? apiResponse.isEntireKitFree
        ? 'Free'
        : typeof apiResponse?.totalPrice === 'number'
        ? `₹${apiResponse.totalPrice}`
        : null
      : typeof apiResponse?.totalPrice === 'number'
      ? `₹${apiResponse.totalPrice}`
      : typeof payment?.amount === 'number'
      ? `₹${payment.amount}`
      : null;

  const kitStatus = firstItem?.status ? formatEnum(firstItem.status) : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.iconOuter}>
          <View style={styles.iconInner}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>
        </View>

        <Text style={styles.title}>{screenTitle}</Text>

        {isPaidFlow ? (
          <Text style={styles.subtitle}>
            Your payment has been updated successfully.
          </Text>
        ) : apiResponse?.message ? (
          <Text style={styles.subtitle}>{apiResponse.message}</Text>
        ) : null}

        {(apiResponse?.totalItems ||
          amountText ||
          paymentStatus ||
          paymentTypeText ||
          resolvedDeliveryMode ||
          kitStatus) && (
          <View style={styles.card}>
            {apiResponse?.totalItems ? (
              <View style={styles.row}>
                <Text style={styles.label}>Total Items</Text>
                <Text style={styles.value}>{apiResponse.totalItems}</Text>
              </View>
            ) : null}

            {resolvedDeliveryMode ? (
              <View style={styles.row}>
                <Text style={styles.label}>Delivery Mode</Text>
                <Text style={styles.value}>
                  {resolvedDeliveryMode === 'online'
                    ? 'Home Delivery'
                    : 'Offline Pickup'}
                </Text>
              </View>
            ) : null}

            {paymentStatus ? (
              <View style={styles.row}>
                <Text style={styles.label}>Payment Status</Text>
                <Text style={styles.value}>{paymentStatus}</Text>
              </View>
            ) : null}

            {paymentTypeText ? (
              <View style={styles.row}>
                <Text style={styles.label}>Payment Type</Text>
                <Text style={styles.value}>{paymentTypeText}</Text>
              </View>
            ) : null}

            {kitStatus ? (
              <View style={styles.row}>
                <Text style={styles.label}>Kit Status</Text>
                <Text style={styles.value}>{kitStatus}</Text>
              </View>
            ) : null}

            {amountText ? (
              <View style={[styles.row, styles.lastRow]}>
                <Text style={styles.label}>Total Amount</Text>
                <Text style={styles.amountValue}>{amountText}</Text>
              </View>
            ) : null}
          </View>
        )}

        {items.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Kit Items</Text>

            {items.map((item, index) => (
              <View
                key={item.id || index}
                style={[
                  styles.itemRow,
                  index === items.length - 1 && {
                    borderBottomWidth: 0,
                    paddingBottom: 0,
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  {item.assetType ? (
                    <Text style={styles.itemTitle}>{formatEnum(item.assetType)}</Text>
                  ) : null}
                  {item.quantity ? (
                    <Text style={styles.itemMeta}>Qty: {item.quantity}</Text>
                  ) : null}
                </View>

                {typeof item.isFree === 'boolean' ? (
                  <Text style={styles.itemPrice}>
                    {item.isFree
                      ? 'Free'
                      : typeof item.price === 'number'
                      ? `₹${item.price}`
                      : ''}
                  </Text>
                ) : typeof item.price === 'number' ? (
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.primaryButton} onPress={handleGoHome}>
          <Text style={styles.primaryButtonText}>Go to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    padding: 20,
    paddingBottom: 32,
  },
  iconOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#DCFCE7',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  iconInner: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: COLORS.success || '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '800',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 16,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: '#64748B',
  },
  value: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'right',
  },
  amountValue: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'right',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 16,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  itemMeta: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  primaryButton: {
    backgroundColor: '#142C63',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});