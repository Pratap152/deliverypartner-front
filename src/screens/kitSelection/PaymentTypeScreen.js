import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { setKitFlowStep } from '../../redux/slices/kitSlice';
import ComingSoonModal from '../../components/kit/ComingSoonModal';

const PaymentTypeScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = getStyles(isTablet);

  const dispatch = useDispatch();
  const currentRiderId = useSelector(state => state.profile?.data?._id ?? null);
  const riderKitData = useSelector(state =>
    currentRiderId ? state.kit?.riders?.[currentRiderId] ?? null : null
  );

  const source = route?.params?.source ?? riderKitData?.source ?? null;
  const deliveryMode = route?.params?.deliveryMode ?? riderKitData?.deliveryMode ?? null;
  const addressData = route?.params?.addressData ?? riderKitData?.addressData ?? null;
  const selectedZone = route?.params?.selectedZone ?? riderKitData?.selectedZone ?? null;
  const kitItems = route?.params?.kitItems ?? riderKitData?.kitItems ?? null;
  const totalAmount = route?.params?.totalAmount ?? riderKitData?.totalAmount ?? null;

  const [paymentType, setPaymentType] = useState(
    route?.params?.paymentType ?? riderKitData?.paymentType ?? null
  );
  const [showComingSoon, setShowComingSoon] = useState(false);

  const isHomeDelivery = deliveryMode === 'online';

  const offlinePaymentTitle = isHomeDelivery
    ? 'Cash on Delivery (COD)'
    : 'Offline Payment';

const offlinePaymentSubtitle = isHomeDelivery
  ? 'Pay in cash when your kit is delivered.'
  : 'Submit request for offline payment flow';

  useEffect(() => {
    const nextPaymentType =
      route?.params?.paymentType ?? riderKitData?.paymentType ?? null;

    setPaymentType(prev => (prev !== nextPaymentType ? nextPaymentType : prev));
  }, [route?.params?.paymentType, riderKitData?.paymentType]);

  useEffect(() => {
    if (!currentRiderId) return;

    dispatch(
      setKitFlowStep({
        riderId: currentRiderId,
        currentStep: 'PaymentTypeScreen',
        deliveryMode,
        addressData,
        selectedZone,
        paymentType,
        kitItems,
        totalAmount,
        source,
        selectedPaymentMethod: null,
      })
    );
  }, [
    dispatch,
    currentRiderId,
    deliveryMode,
    addressData,
    selectedZone,
    paymentType,
    kitItems,
    totalAmount,
    source,
  ]);

  const handleContinue = () => {
  if (!paymentType) return;

  if (paymentType === 'online') {
    if (deliveryMode === 'offline') {
      setShowComingSoon(true);
      return;
    }

    navigation.navigate('PaymentsScreen', {
      source,
      deliveryMode,
      addressData,
      selectedZone,
      paymentType: 'online',
      kitItems,
      totalAmount,
      selectedPaymentMethod: null,
      selectedEmiPlan: null,
    });
    return;
  }

  if (paymentType === 'offline') {
    navigation.navigate('OfflinePaymentsScreen', {
      source,
      deliveryMode,
      addressData,
      selectedZone,
      paymentType: 'offline',
      kitItems,
      totalAmount,
    });
    return;
  }

  if (paymentType === 'emi') {
    navigation.navigate('EmiPlanScreen', {
      source,
      deliveryMode,
      addressData,
      selectedZone,
      paymentType: 'emi',
      kitItems,
      totalAmount,
    });
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Options</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Text style={styles.mainTitle}>Choose payment type</Text>

        <TouchableOpacity
          style={[styles.optionCard, paymentType === 'online' && styles.optionCardActive]}
          onPress={() => setPaymentType('online')}
        >
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.optionTitle}>Online Payment</Text>
              <Text style={styles.optionSubtitle}>Continue with online payment methods</Text>
            </View>
            <View style={[styles.radioOuter, paymentType === 'online' && styles.radioOuterActive]}>
              {paymentType === 'online' ? <View style={styles.radioInner} /> : null}
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, paymentType === 'offline' && styles.optionCardActive]}
          onPress={() => setPaymentType('offline')}
        >
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.optionTitle}>{offlinePaymentTitle}</Text>
              <Text style={styles.optionSubtitle}>{offlinePaymentSubtitle}</Text>
            </View>
            <View style={[styles.radioOuter, paymentType === 'offline' && styles.radioOuterActive]}>
              {paymentType === 'offline' ? <View style={styles.radioInner} /> : null}
            </View>
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={[styles.optionCard, paymentType === 'emi' && styles.optionCardActive]}
          onPress={() => setPaymentType('emi')}
        >
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.optionTitle}>EMI</Text>
              <Text style={styles.optionSubtitle}>Choose EMI to pay in monthly installments</Text>
            </View>
            <View style={[styles.radioOuter, paymentType === 'emi' && styles.radioOuterActive]}>
              {paymentType === 'emi' ? <View style={styles.radioInner} /> : null}
            </View>
          </View>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={[styles.primaryBtn, !paymentType && styles.primaryBtnDisabled]}
          onPress={handleContinue}
          disabled={!paymentType}
        >
          <Text style={styles.primaryBtnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>

      <ComingSoonModal
        visible={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />
    </SafeAreaView>
  );
};

export default PaymentTypeScreen;

const getStyles = isTablet =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FB' },
    contentContainer: { paddingHorizontal: isTablet ? 60 : 20, paddingTop: 12, paddingBottom: 32 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerSpacer: { width: 40 },
    headerTitle: { fontSize: isTablet ? 28 : 18, fontWeight: '700', color: '#0F172A' },
    mainTitle: { fontSize: isTablet ? 22 : 16, fontWeight: '700', color: '#1E293B', marginBottom: 16 },
    optionCard: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#E2E8F0',
      borderRadius: 16,
      padding: 16,
      marginBottom: 14,
    },
    optionCardActive: {
      borderColor: '#2F80ED',
      backgroundColor: '#EFF6FF',
    },
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    optionTitle: {
      fontSize: isTablet ? 18 : 16,
      fontWeight: '700',
      color: '#0F172A',
      marginBottom: 4,
    },
    optionSubtitle: {
      fontSize: 13,
      color: '#64748B',
      lineHeight: 18,
    },
    radioOuter: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: '#CBD5E1',
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioOuterActive: {
      borderColor: '#2F80ED',
    },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#2F80ED',
    },
    amountCard: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#E2E8F0',
      borderRadius: 14,
      padding: 16,
      marginTop: 10,
      marginBottom: 20,
    },
    amountLabel: {
      fontSize: 12,
      color: '#94A3B8',
      marginBottom: 4,
    },
    amountValue: {
      fontSize: isTablet ? 28 : 24,
      fontWeight: '800',
      color: '#0F172A',
    },
    primaryBtn: {
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