import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { setKitFlowStep } from '../../redux/slices/kitSlice';
import apiClient from '../../services/ApiClient';

const EmiPlanScreen = ({ navigation, route }) => {
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
  const totalAmount = route?.params?.totalAmount ?? riderKitData?.totalAmount ?? null;

  const [loading, setLoading] = useState(false);
  const [plansError, setPlansError] = useState(null);
  const [kitAmount, setKitAmount] = useState(totalAmount ?? null);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(riderKitData?.selectedEmiPlan ?? null);

  const fetchEmiPlans = async () => {
    try {
      setLoading(true);
      setPlansError(null);

      const response = await apiClient.get('/api/kit/emi/plans', {
        headers: { 'x-client': 'mobile' },
      });

      const responseData = response?.data ?? {};
      const emiPlans = Array.isArray(responseData?.plans) ? responseData.plans : [];

      setKitAmount(responseData?.kitAmount ?? totalAmount ?? null);
      setPlans(emiPlans);
    } catch (error) {
      setPlansError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch EMI plans'
      );
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmiPlans();
  }, []);

  useEffect(() => {
    if (!currentRiderId) return;

    dispatch(
      setKitFlowStep({
        riderId: currentRiderId,
        currentStep: 'EmiPlanScreen',
        deliveryMode,
        addressData,
        selectedZone,
        paymentType: 'emi',
        totalAmount: kitAmount ?? totalAmount,
        source,
        selectedEmiPlan: selectedPlan,
      })
    );
  }, [
    dispatch,
    currentRiderId,
    deliveryMode,
    addressData,
    selectedZone,
    totalAmount,
    kitAmount,
    source,
    selectedPlan,
  ]);

  const formattedKitAmount = useMemo(() => {
    if (kitAmount === null || kitAmount === undefined) return null;
    return Number(kitAmount).toFixed(2).replace(/\.00$/, '');
  }, [kitAmount]);

  const formatCurrency = value => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return '0';
    return Number(value).toFixed(2).replace(/\.00$/, '');
  };

  const handleContinue = () => {
  if (!selectedPlan) {
    Alert.alert('Select EMI plan', 'Please select an EMI plan to continue');
    return;
  }

  dispatch(
    setKitFlowStep({
      riderId: currentRiderId,
      currentStep: 'PaymentsScreen',
      deliveryMode,
      addressData,
      selectedZone,
      paymentType: 'emi',
      totalAmount: kitAmount ?? totalAmount,
      source,
      selectedEmiPlan: selectedPlan,
    })
  );

  navigation.navigate('PaymentsScreen', {
    source,
    deliveryMode,
    addressData,
    selectedZone,
    totalAmount: kitAmount ?? totalAmount,
    paymentType: 'emi',
    selectedEmiPlan: selectedPlan,
  });
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={22} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>EMI Plan</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.title}>Choose your EMI plan</Text>
            {formattedKitAmount ? (
              <Text style={styles.subtitle}>Kit amount: ₹{formattedKitAmount}</Text>
            ) : null}
            <Text style={styles.note}>
              Select a repayment option that works best for you.
            </Text>
          </View>

          {loading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#142C63" />
              <Text style={styles.helperText}>Loading EMI plans...</Text>
            </View>
          ) : plansError ? (
            <View style={styles.centerBox}>
              <Text style={styles.errorText}>{plansError}</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={fetchEmiPlans}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : plans.length === 0 ? (
            <View style={styles.centerBox}>
              <Text style={styles.helperText}>No EMI plans available right now.</Text>
            </View>
          ) : (
            plans.map(plan => {
              const isSelected = selectedPlan?.id === plan?.id;
              const isNoCost = Number(plan?.interestRate) === 0;

              return (
                <TouchableOpacity
                  key={plan?.id}
                  style={[styles.planCard, isSelected && styles.planCardSelected]}
                  onPress={() => setSelectedPlan(plan)}
                  activeOpacity={0.85}
                >
                  <View style={styles.planTopRow}>
                    <View style={styles.planTextWrap}>
                      <View style={styles.planHeaderLine}>
                        <Text style={styles.planMonths}>{plan?.months} months</Text>
                        {isNoCost ? (
                          <View style={styles.badge}>
                            <Text style={styles.badgeText}>No Cost EMI</Text>
                          </View>
                        ) : null}
                      </View>

                      <Text style={styles.planMonthly}>
                        ₹{formatCurrency(plan?.monthlyAmount)}/month
                      </Text>
                    </View>

                    <View style={[styles.radioOuter, isSelected && styles.radioOuterActive]}>
                      {isSelected ? <View style={styles.radioInner} /> : null}
                    </View>
                  </View>

                  <View style={styles.metaRow}>
                    <View style={styles.metaBox}>
                      <Text style={styles.metaLabel}>Interest</Text>
                      <Text style={styles.metaValue}>{plan?.interestRate}%</Text>
                    </View>

                    <View style={styles.metaBox}>
                      <Text style={styles.metaLabel}>Total payable</Text>
                      <Text style={styles.metaValue}>₹{formatCurrency(plan?.totalAmount)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.primaryBtn, !selectedPlan && styles.primaryBtnDisabled]}
            disabled={!selectedPlan}
            onPress={handleContinue}
          >
            <Text style={styles.primaryBtnText}>
              {selectedPlan
                ? `Continue with ${selectedPlan.months}-month EMI`
                : 'Select an EMI Plan'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EmiPlanScreen;

const getStyles = isTablet =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F7FB',
    },
    wrapper: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: isTablet ? 60 : 20,
      paddingTop: 12,
      paddingBottom: 24,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    backBtn: {
      width: 40,
      height: 40,
      justifyContent: 'center',
    },
    headerSpacer: {
      width: 40,
    },
    headerTitle: {
      fontSize: isTablet ? 28 : 18,
      fontWeight: '700',
      color: '#0F172A',
    },
    summaryCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      padding: 18,
      marginBottom: 16,
    },
    title: {
      fontSize: isTablet ? 22 : 16,
      fontWeight: '700',
      color: '#0F172A',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 14,
      color: '#334155',
      marginBottom: 8,
    },
    note: {
      fontSize: 14,
      color: '#64748B',
      lineHeight: 22,
    },
    planCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      padding: 16,
      marginBottom: 14,
    },
    planCardSelected: {
      borderColor: '#2F80ED',
      backgroundColor: '#EFF6FF',
    },
    planTopRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    planTextWrap: {
      flex: 1,
    },
    planHeaderLine: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 8,
    },
    planMonths: {
      fontSize: isTablet ? 18 : 16,
      fontWeight: '700',
      color: '#0F172A',
    },
    badge: {
      backgroundColor: '#DCFCE7',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
    },
    badgeText: {
      color: '#166534',
      fontSize: 12,
      fontWeight: '700',
    },
    planMonthly: {
      fontSize: isTablet ? 20 : 18,
      fontWeight: '700',
      color: '#142C63',
      marginBottom: 12,
    },
    metaRow: {
      flexDirection: 'row',
      gap: 12,
    },
    metaBox: {
      flex: 1,
      backgroundColor: '#F8FAFC',
      borderRadius: 12,
      padding: 12,
    },
    metaLabel: {
      fontSize: 12,
      color: '#64748B',
      marginBottom: 4,
    },
    metaValue: {
      fontSize: 14,
      fontWeight: '700',
      color: '#0F172A',
    },
    radioOuter: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: '#CBD5E1',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
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
    footer: {
      paddingHorizontal: isTablet ? 60 : 20,
      paddingTop: 12,
      paddingBottom: 16,
      backgroundColor: '#F5F7FB',
      borderTopWidth: 1,
      borderTopColor: '#E2E8F0',
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
      textAlign: 'center',
      paddingHorizontal: 12,
    },
    centerBox: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      marginTop: 20,
    },
    helperText: {
      marginTop: 12,
      color: '#64748B',
      fontSize: 14,
      textAlign: 'center',
    },
    errorText: {
      color: '#DC2626',
      textAlign: 'center',
      fontSize: 14,
      marginBottom: 12,
    },
    retryBtn: {
      backgroundColor: '#142C63',
      borderRadius: 10,
      paddingHorizontal: 18,
      paddingVertical: 10,
    },
    retryText: {
      color: '#FFFFFF',
      fontWeight: '700',
    },
  });