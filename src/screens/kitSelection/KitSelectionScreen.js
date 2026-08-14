import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
  Image,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { setKitFlowStep } from '../../redux/slices/kitSlice';
import { useKitAddress } from '../../hooks/useCreateKitAddress';
import { getRiderAssets } from '../../services/profile/profileApiService';

import kitImage1 from '../../assets/kitSelectionBag.jpg';
import kitImage2 from '../../assets/kitSelectionTshirt.png';

const formatAssetName = value => {
  if (!value) return '';
  return value
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
};

const STATIC_PREVIEW_IMAGES = [kitImage1, kitImage2];

const KitSelectionScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = getStyles(isTablet);

  const dispatch = useDispatch();
  const currentRiderId = useSelector(state => state.profile?.data?._id ?? null);
  const source = route?.params?.source ?? 'homeBanner';

  const { getJoiningKit } = useKitAddress();

  const [kitData, setKitData] = useState([]);
  const [kitError, setKitError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const totalPrice = useMemo(() => {
    return kitData.reduce((sum, item) => sum + (Number(item?.price) || 0), 0);
  }, [kitData]);

  const handleBackNavigation = () => {
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
      return true;
    }

    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'MainTabs',
          params: {
            screen: 'Home',
          },
        },
      ],
    });
    return true;
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackNavigation
    );
    return () => subscription.remove();
  }, [navigation, source]);

  const fetchJoiningKit = async () => {
    try {
      setLoading(true);
      setKitError(null);

      const statusRes = await getRiderAssets();
      const statusBody = statusRes?.data || {};

      if (statusBody?.hasRequestedKit) {
        navigation.replace('SuccessScreen', { source });
        return;
      }

      const response = await getJoiningKit();
      setKitData(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      setKitError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch kit details'
      );
      setKitData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoiningKit();
  }, []);

  useEffect(() => {
    if (!currentRiderId) return;

    dispatch(
      setKitFlowStep({
        riderId: currentRiderId,
        currentStep: 'KitSelectionScreen',
        kitItems: kitData,
        totalAmount: totalPrice,
      })
    );
  }, [dispatch, currentRiderId, kitData, totalPrice]);

  const handleContinue = () => {
    navigation.navigate('DeliveryModeScreen', {
      source,
      kitItems: kitData,
      totalAmount: totalPrice,
    });
  };

  const previewItems = kitData.slice(0, 2);

  const getPreviewSource = (item, index) => {
    const imageKey = item?.id ?? `${item?.assetName}-${index}`;

    if (item?.imageUrl && !imageErrors[imageKey]) {
      return { uri: item.imageUrl };
    }

    return STATIC_PREVIEW_IMAGES[index] || STATIC_PREVIEW_IMAGES[0];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBackNavigation} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kit Selection</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Text style={styles.sectionTitle}>OnBoarding Kit</Text>

        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#142C63" />
            <Text style={styles.helperText}>Loading kit details...</Text>
          </View>
        ) : kitError ? (
          <View style={styles.centerBox}>
            <Text style={styles.errorText}>{kitError}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchJoiningKit}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.kitPreviewCard}>
              {previewItems.map((item, index) => {
                const imageKey = item?.id ?? `${item?.assetName}-${index}`;

                return (
                  <View key={imageKey} style={styles.previewItem}>
                    <Image
                      source={getPreviewSource(item, index)}
                      style={styles.previewImage}
                      resizeMode="contain"
                      onError={() =>
                        setImageErrors(prev => ({
                          ...prev,
                          [imageKey]: true,
                        }))
                      }
                    />
                  </View>
                );
              })}
            </View>

            <View style={styles.includesBlock}>
              <Text style={styles.includesTitle}>Kit Includes</Text>
              {kitData.map(item => (
                <View key={item.id} style={styles.includeRow}>
                  <View style={styles.greenDot} />
                  <Text style={styles.includeText}>
                    {formatAssetName(item.assetName || item.assetType)}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.amountBlock}>
              <Text style={styles.amountLabel}>Kit Amount</Text>
              <Text style={styles.amountValue}>₹{totalPrice}</Text>
            </View>
          </>
        )}

        <TouchableOpacity
          style={[
            styles.continueBtn,
            (!kitData.length || loading) && styles.continueBtnDisabled,
          ]}
          onPress={handleContinue}
          disabled={!kitData.length || loading}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default KitSelectionScreen;

const getStyles = isTablet =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F7FB',
    },
    contentContainer: {
      paddingHorizontal: isTablet ? 60 : 20,
      paddingTop: 12,
      paddingBottom: 32,
      flexGrow: 1,
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
    sectionTitle: {
      fontSize: isTablet ? 22 : 16,
      fontWeight: '700',
      color: '#1E293B',
      marginBottom: 12,
    },
    kitPreviewCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 18,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      minHeight: 150,
    },
    previewItem: {
      width: isTablet ? 180 : 110,
      height: isTablet ? 180 : 110,
      justifyContent: 'center',
      alignItems: 'center',
    },
    previewImage: {
      width: '100%',
      height: '100%',
    },
    includesBlock: {
      marginBottom: 24,
    },
    includesTitle: {
      fontSize: isTablet ? 20 : 16,
      fontWeight: '700',
      color: '#1E293B',
      marginBottom: 10,
    },
    includeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    greenDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#34C759',
      marginRight: 10,
    },
    includeText: {
      fontSize: isTablet ? 18 : 14,
      color: '#475569',
      fontWeight: '500',
    },
    amountBlock: {
      marginTop: 4,
      marginBottom: 30,
    },
    amountLabel: {
      fontSize: isTablet ? 18 : 12,
      color: '#94A3B8',
      marginBottom: 4,
    },
    amountValue: {
      fontSize: isTablet ? 34 : 30,
      color: '#0F172A',
      fontWeight: '800',
    },
    continueBtn: {
      marginTop: 'auto',
      backgroundColor: '#142C63',
      borderRadius: 14,
      paddingVertical: 18,
      alignItems: 'center',
    },
    continueBtnDisabled: {
      opacity: 0.6,
    },
    continueText: {
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
      marginBottom: 20,
    },
    helperText: {
      marginTop: 12,
      color: '#64748B',
      fontSize: 14,
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