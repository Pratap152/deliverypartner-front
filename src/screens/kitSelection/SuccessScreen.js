import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
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

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = getStyles(isTablet);

  const { apiResponse, deliveryMode, paymentType, source, totalAmount } = route?.params || {};

  const items = Array.isArray(apiResponse?.data) ? apiResponse.data : [];
  const firstItem = items[0] ?? null;
  const payment = firstItem?.Payment ?? null;

  const resolvedDeliveryMode =
    deliveryMode ??
    (firstItem?.deliveryMode === 'HOME_DELIVERY'
      ? 'online'
      : firstItem?.deliveryMode === 'PICKUP'
      ? 'offline'
      : null);

  const riderId =
    apiResponse?.data?.[0]?.riderId ??
    apiResponse?.data?.riderId ??
    firstItem?.riderId ??
    null;

  useEffect(() => {
    if (!riderId) return;

    dispatch(
      setKitCompleted({
        riderId,
        kitCompleted: true,
        apiResponse,
        deliveryMode: resolvedDeliveryMode,
        currentStep: 'SuccessScreen',
      })
    );
  }, [dispatch, riderId, apiResponse, resolvedDeliveryMode]);

  const handleGoHome = () => {
    if (source === 'riderAssets') {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'MainTabs',
            params: {
              screen: 'Profile',
              params: {
                screen: 'ProfileScreen',
              },
            },
          },
        ],
      });
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  const hasPaymentData = !!payment;
  const screenTitle = hasPaymentData ? 'Payment completed successfully' : 'Kit Request Submitted';

  const paymentStatus = payment?.status ? formatEnum(payment.status) : null;
  const paymentTypeText = payment?.paymentType ? formatEnum(payment.paymentType) : null;
  const kitStatus = firstItem?.status ? formatEnum(firstItem.status) : null;

  const derivedItemsTotal = items.reduce((sum, item) => {
  const itemPrice =
    typeof item?.price === 'number'
      ? item.price
      : typeof item?.totalPrice === 'number'
      ? item.totalPrice
      : 0;

  const qty = typeof item?.quantity === 'number' ? item.quantity : 1;

  if (item?.isFree) return sum;
  return sum + itemPrice * qty;
}, 0);

const resolvedAmount =
  typeof totalAmount === 'number'
    ? totalAmount
    : typeof payment?.amount === 'number'
    ? payment.amount
    : typeof payment?.paidAmount === 'number'
    ? payment.paidAmount
    : typeof firstItem?.totalAmount === 'number'
    ? firstItem.totalAmount
    : typeof apiResponse?.totalAmount === 'number'
    ? apiResponse.totalAmount
    : typeof firstItem?.totalPrice === 'number'
    ? firstItem.totalPrice
    : typeof apiResponse?.totalPrice === 'number'
    ? apiResponse.totalPrice
    : derivedItemsTotal > 0
    ? derivedItemsTotal
    : null;

const amountText =
  typeof apiResponse?.isEntireKitFree === 'boolean' && apiResponse.isEntireKitFree
    ? 'Free'
    : typeof resolvedAmount === 'number'
    ? `₹${resolvedAmount}`
    : null;

  const totalItems =
    typeof apiResponse?.totalItems === 'number'
      ? apiResponse.totalItems
      : Array.isArray(items) && items.length > 0
      ? items.length
      : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.iconOuter}>
          <View style={styles.iconInner}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>
        </View>

        <Text style={styles.title}>{screenTitle}</Text>

        {apiResponse?.message ? (
          <Text style={styles.subtitle}>{apiResponse.message}</Text>
        ) : null}

        {(totalItems !== null ||
          amountText ||
          paymentStatus ||
          paymentTypeText ||
          resolvedDeliveryMode ||
          kitStatus) ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Summary</Text>

            {totalItems !== null ? (
              <View style={styles.row}>
                <Text style={styles.label}>Total Items</Text>
                <Text style={styles.value}>{totalItems}</Text>
              </View>
            ) : null}

            {resolvedDeliveryMode ? (
              <View style={styles.row}>
                <Text style={styles.label}>Delivery Mode</Text>
                <Text style={styles.value}>
                  {resolvedDeliveryMode === 'online' ? 'Home Delivery' : 'Offline Pickup'}
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
        ) : null}

        {items.length > 0 ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Kit Items</Text>

            {items.map((item, index) => {
              const itemTitle = item?.assetType ? formatEnum(item.assetType) : null;
              const quantityText = item?.quantity ? `Qty: ${item.quantity}` : null;
              const itemPriceText =
                item?.isFree === true
                  ? 'Free'
                  : typeof item?.price === 'number'
                  ? `₹${item.price}`
                  : null;

              return (
                <View
                  key={item?.id ?? item?.assetType ?? index}
                  style={[
                    styles.itemRow,
                    index === items.length - 1 && styles.lastRow,
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    {itemTitle ? <Text style={styles.itemTitle}>{itemTitle}</Text> : null}
                    {quantityText ? <Text style={styles.itemMeta}>{quantityText}</Text> : null}
                  </View>

                  {itemPriceText ? <Text style={styles.itemPrice}>{itemPriceText}</Text> : null}
                </View>
              );
            })}
          </View>
        ) : null}

        <TouchableOpacity style={styles.primaryButton} onPress={handleGoHome}>
          <Text style={styles.primaryButtonText}>
            {source === 'riderAssets' ? 'Go to Profile' : 'Go to Home'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SuccessScreen;

const getStyles = isTablet =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#F8FAFC',
    },
    container: {
      paddingHorizontal: isTablet ? 80 : 20,
      paddingVertical: isTablet ? 30 : 20,
      paddingBottom: 32,
    },
    iconOuter: {
      width: isTablet ? 160 : 120,
      height: isTablet ? 160 : 120,
      borderRadius: isTablet ? 80 : 60,
      backgroundColor: '#DCFCE7',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      marginBottom: 20,
    },
    iconInner: {
      width: isTablet ? 110 : 78,
      height: isTablet ? 110 : 78,
      borderRadius: isTablet ? 55 : 39,
      backgroundColor: COLORS.success || '#22C55E',
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkIcon: {
      color: '#FFFFFF',
      fontSize: isTablet ? 54 : 38,
      fontWeight: '800',
    },
    title: {
      fontSize: isTablet ? 40 : 22,
      lineHeight: isTablet ? 52 : 30,
      fontWeight: '700',
      color: '#1E293B',
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: isTablet ? 18 : 14,
      lineHeight: isTablet ? 28 : 22,
      color: '#64748B',
      textAlign: 'center',
      marginBottom: 24,
      paddingHorizontal: 10,
    },
    card: {
      backgroundColor: '#FFFFFF',
      padding: isTablet ? 28 : 18,
      borderRadius: isTablet ? 24 : 18,
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
      fontSize: isTablet ? 18 : 14,
      color: '#64748B',
    },
    value: {
      flex: 1,
      fontSize: isTablet ? 20 : 14,
      fontWeight: '600',
      color: '#1E293B',
      textAlign: 'right',
    },
    amountValue: {
      flex: 1,
      fontSize: isTablet ? 28 : 18,
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
      paddingVertical: isTablet ? 24 : 18,
      borderRadius: isTablet ? 22 : 16,
      alignItems: 'center',
      marginBottom: 10,
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: isTablet ? 24 : 17,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
  });