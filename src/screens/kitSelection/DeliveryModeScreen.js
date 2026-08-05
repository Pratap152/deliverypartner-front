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

const DeliveryModeScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = getStyles(isTablet);

  const dispatch = useDispatch();
  const currentRiderId = useSelector(state => state.profile?.data?._id ?? null);
  const riderKitData = useSelector(state =>
    currentRiderId ? state.kit?.riders?.[currentRiderId] ?? null : null
  );

  const { source, kitItems = [], totalAmount = 0 } = route?.params || {};
  const [deliveryMode, setDeliveryMode] = useState(
    riderKitData?.deliveryMode || 'online'
  );
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    if (!currentRiderId) return;

    dispatch(
      setKitFlowStep({
        riderId: currentRiderId,
        currentStep: 'DeliveryModeScreen',
        deliveryMode,
        kitItems,
        totalAmount,
      })
    );
  }, [dispatch, currentRiderId, deliveryMode, kitItems, totalAmount]);

  const handleContinue = () => {
    if (deliveryMode === 'online') {
      setShowComingSoon(true);
      return;
    }

    navigation.navigate('PickupLocationScreen', {
      source,
      kitItems,
      totalAmount,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose Delivery Mode</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Text style={styles.mainTitle}>How do you want to receive your kit?</Text>

        <TouchableOpacity
          style={[styles.optionCard, deliveryMode === 'online' && styles.optionCardActive]}
          onPress={() => setDeliveryMode('online')}
        >
          <View style={styles.optionTopRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.optionTitle}>Home Delivery</Text>
              <Text style={styles.optionSubText}>
                Get the kit delivered to your address{'\n'}Delivery charges may apply
              </Text>
            </View>
            <View style={[styles.radioOuter, deliveryMode === 'online' && styles.radioOuterActive]}>
              {deliveryMode === 'online' ? <View style={styles.radioInner} /> : null}
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, deliveryMode === 'offline' && styles.optionCardActive]}
          onPress={() => setDeliveryMode('offline')}
        >
          <View style={styles.optionTopRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.optionTitle}>Pickup From Store</Text>
              <Text style={styles.optionSubText}>
                Collect from nearest store{'\n'}Pay online or offline at store
              </Text>
            </View>
            <View style={[styles.radioOuter, deliveryMode === 'offline' && styles.radioOuterActive]}>
              {deliveryMode === 'offline' ? <View style={styles.radioInner} /> : null}
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>

      <ComingSoonModal
        visible={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />
    </SafeAreaView>
  );
};

export default DeliveryModeScreen;

const getStyles = isTablet =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FB' },
    contentContainer: { paddingHorizontal: isTablet ? 60 : 20, paddingTop: 12, paddingBottom: 32, flexGrow: 1 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerSpacer: { width: 40 },
    headerTitle: { fontSize: isTablet ? 28 : 18, fontWeight: '700', color: '#0F172A' },
    mainTitle: { fontSize: isTablet ? 24 : 18, fontWeight: '700', color: '#1E293B', marginBottom: 20 },
    optionCard: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#E2E8F0',
      borderRadius: 16,
      padding: 18,
      marginBottom: 14,
    },
    optionCardActive: {
      borderColor: '#2F80ED',
      backgroundColor: '#EFF6FF',
    },
    optionTopRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    optionTitle: {
      fontSize: isTablet ? 20 : 16,
      fontWeight: '700',
      color: '#0F172A',
      marginBottom: 6,
    },
    optionSubText: {
      fontSize: isTablet ? 16 : 13,
      color: '#64748B',
      lineHeight: 20,
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
    continueBtn: {
      marginTop: 'auto',
      backgroundColor: '#142C63',
      borderRadius: 14,
      paddingVertical: 18,
      alignItems: 'center',
    },
    continueText: {
      color: '#FFFFFF',
      fontSize: isTablet ? 20 : 16,
      fontWeight: '700',
    },
  });