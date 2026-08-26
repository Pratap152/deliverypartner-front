import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { setKitFlowStep } from '../../redux/slices/kitSlice';
import { useKitAddress } from '../../hooks/useCreateKitAddress';

const PickupLocationScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = getStyles(isTablet);

  const dispatch = useDispatch();
  const currentRiderId = useSelector(state => state.profile?.data?._id ?? null);
  const riderKitData = useSelector(state =>
    currentRiderId ? state.kit?.riders?.[currentRiderId] ?? null : null
  );

  const { getKitAddress } = useKitAddress();
  const { source, kitItems = [], totalAmount = 0 } = route?.params || {};

  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(riderKitData?.selectedZone ?? null);
  const [loading, setLoading] = useState(false);
  const [zonesError, setZonesError] = useState(null);

  const fetchZones = async () => {
    try {
      setLoading(true);
      setZonesError(null);

      const locations = await getKitAddress();

      const mappedLocations = Array.isArray(locations)
        ? locations.map(location => ({
          id: location.id,
          name: location.officeLocation,
          city: location.officeLocation,
          contactName: location.contactName,
          officeNo: location.officeNo,
          address: location.officeAddress,
        }))
        : [];

      setZones(mappedLocations);
    } catch (error) {
      setZonesError(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to fetch pickup locations'
      );

      setZones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  useEffect(() => {
    if (!currentRiderId) return;

    dispatch(
      setKitFlowStep({
        riderId: currentRiderId,
        currentStep: 'PickupLocationScreen',
        deliveryMode: 'offline',
        selectedZone,
        kitItems,
        totalAmount,
      })
    );
  }, [dispatch, currentRiderId, selectedZone, kitItems, totalAmount]);

  const handleContinue = () => {
    if (!selectedZone) return;

    dispatch(
      setKitFlowStep({
        riderId: currentRiderId,
        currentStep: 'PaymentTypeScreen',
        deliveryMode: 'offline',
        selectedZone,
        addressData: null,
        kitItems,
        totalAmount,
      })
    );

    navigation.navigate('PaymentTypeScreen', {
      source,
      deliveryMode: 'offline',
      selectedZone,
      kitItems,
      totalAmount,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={22} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Pickup City</Text>
            <View style={styles.headerSpacer} />
          </View>

          <Text style={styles.mainTitle}>Select your pickup city</Text>

          {loading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#142C63" />
              <Text style={styles.helperText}>Loading available cities...</Text>
            </View>
          ) : zonesError ? (
            <View style={styles.centerBox}>
              <Text style={styles.errorText}>{zonesError}</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={fetchZones}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : zones.length === 0 ? (
            <View style={styles.centerBox}>
              <Text style={styles.helperText}>No pickup cities available right now.</Text>
            </View>
          ) : (
            zones.map((zone, index) => {
              const isSelected =
                selectedZone?.id === zone?.id;

              return (
                <TouchableOpacity
                  key={zone?.id || index}
                  style={[styles.storeCard, isSelected && styles.storeCardSelected]}
                  onPress={() => setSelectedZone(zone)}
                >
                  <View style={styles.cardTopRow}>
                    <View style={styles.cardTextWrap}>
                      <View style={styles.cardTextWrap}>
                        <Text style={styles.storeName}>
                          {zone?.city || 'Pickup City'}
                        </Text>

                        <Text style={styles.contactName}>
                          Contact: {zone?.contactName || '--'}
                        </Text>

                        <Text style={styles.officeNo}>
                          Phone: {zone?.officeNo || '--'}
                        </Text>

                        <Text style={styles.storeAddress}>
                          {zone?.address || 'Address not available'}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.radioOuter,
                        isSelected && styles.radioOuterActive,
                      ]}
                    >
                      {isSelected ? <View style={styles.radioInner} /> : null}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.primaryBtn, !selectedZone && styles.primaryBtnDisabled]}
            disabled={!selectedZone}
            onPress={handleContinue}
          >
            <Text style={styles.primaryBtnText}>Continue to Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PickupLocationScreen;

const getStyles = isTablet =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F7FB',
    },

    wrapper: {
      flex: 1,
    },

    scrollContent: {
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

    mainTitle: {
      fontSize: isTablet ? 22 : 16,
      fontWeight: '700',
      color: '#1E293B',
      marginBottom: 16,
    },

    storeCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      padding: 16,
      marginBottom: 14,
    },

    storeCardSelected: {
      borderColor: '#2F80ED',
      backgroundColor: '#EFF6FF',
    },

    cardTopRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },

    cardTextWrap: {
      flex: 1,
    },

    storeName: {
      fontSize: isTablet ? 18 : 16,
      fontWeight: '700',
      color: '#0F172A',
      marginBottom: 6,
    },
    contactName: {
      color: '#334155',
      fontSize: 13,
      marginBottom: 4,
    },

    officeNo: {
      color: '#475569',
      fontSize: 13,
      marginBottom: 6,
    },
    storeAddress: {
      color: '#475569',
      fontSize: 13,
      marginBottom: 4,
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