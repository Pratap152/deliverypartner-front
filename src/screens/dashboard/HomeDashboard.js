import React, {
  useEffect,
  useState,
  useCallback,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  BackHandler,
  Alert,
  RefreshControl,
} from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/home/Header';
import StatsCard from '../../components/home/StatsCard';
import ActiveShiftBanner from '../../components/home/ActiveShiftBanner';
import PeakHoursBanner from '../../components/home/PeakHoursBanner';
import WeeklyStatsCard from '../../components/home/WeeklyStatsCard';
import LocationBlocker from '../../components/home/LocationBlocker';
import TermsAgreementModal from '../../components/home/TermsAgreementModal';

import {
  getHomeBanners,
  todayStats,
} from '../../components/home/data/BannerApi';

import SwipeOnlineToggle from '../../components/home/SwipeOnlineToggle';
import BannerCarousel from '../../components/home/BannerCarousel';
import ActiveOrderCard from '../../components/home/ActiveOrderCard';

import { useRider } from '../../context/RiderContext';

import {
  checkLocationRequirements,
  requestLocationRequirements,
  listenAppResume,
} from '../../utils/locationPermission';

import {
  getAgreementStatus,
  saveAgreementStatus,
} from '../../services/termsDocumentsService';


import  useEarningsDashboard  from '../../hooks/useEarningsDashboard';

const HomeDashboard = () => {
  const navigation = useNavigation();

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [loadingAgreement, setLoadingAgreement] = useState(false);
  const [locationReady, setLocationReady] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pullRefreshing, setPullRefreshing] = useState(false);
  const [banners, setBanners] = useState([]);

 const {
  data: earningsData,
  loading: earningsLoading,
  onRefresh: refreshEarnings,
} = useEarningsDashboard();

const {
  riderType = '',
} = earningsData || {};

  const {
    isOnline,
    goOnline,
    goOffline,
    isLoading,
    totalOnlineMinutes,
    fetchRiderStatus,
    activeOrder,
    checkCurrentOrder,
  } = useRider();

  /*
   * ============================================================
   * AGREEMENT
   * ============================================================
   */

  useEffect(() => {
    checkAgreementStatus();
  }, []);

  const checkAgreementStatus = async () => {
    try {
      const response = await getAgreementStatus();

      if (
        response.data.deliveryPartnerAgreementAccepted === false ||
        response.data.operationsPolicyAccepted === false ||
        response.data.privacyPolicyAccepted === false ||
        response.data.informationConfirmed === false ||
        response.data.electronicConsentAccepted === false
      ) {
        setShowTermsModal(true);
      } else {
        setShowTermsModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptTerms = async () => {
    try {
      setLoadingAgreement(true);

      const payload = {
        deliveryPartnerAgreementAccepted: true,
        operationsPolicyAccepted: true,
        privacyPolicyAccepted: true,
        informationConfirmed: true,
        electronicConsentAccepted: true,
      };

      const response = await saveAgreementStatus(payload);

      if (response?.status === 200) {
        setShowTermsModal(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingAgreement(false);
    }
  };

  /*
   * ============================================================
   * LOCATION
   * ============================================================
   */

  const validateLocation = async () => {
    const status = await checkLocationRequirements();
    setLocationReady(status);
  };

  useEffect(() => {
    validateLocation();

    const subscription = listenAppResume(() => {
      validateLocation();
    });

    return () => subscription.remove();
  }, []);

  /*
   * ============================================================
   * BACK BUTTON
   * ============================================================
   */

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit the app?',
          [
            {
              text: 'No',
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => BackHandler.exitApp(),
            },
          ]
        );

        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  /*
   * ============================================================
   * HOME DATA
   * ============================================================
   */

  useFocusEffect(
    useCallback(() => {
      loadHomeData();
    }, [])
  );


  useFocusEffect(
  useCallback(() => {
    let mounted = true;

    const refreshHomeEarnings = async () => {
      try {
        await refreshEarnings();
      } catch (error) {
        if (mounted) {
          console.log(
            'Home earnings refresh error:',
            error,
          );
        }
      }
    };

    refreshHomeEarnings();

    return () => {
      mounted = false;
    };
  }, [refreshEarnings]),
);

  const loadHomeData = async () => {
    try {
      await fetchRiderStatus();
      await checkCurrentOrder();

      const bannerData = await getHomeBanners();
      setBanners(bannerData);
    } catch (error) {
      console.log('Home data error:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  

  /*
   * ============================================================
   * PULL TO REFRESH
   * ============================================================
   */

  const onRefresh = useCallback(async () => {
  try {
    setPullRefreshing(true);

    await Promise.all([
      fetchRiderStatus(),
      checkCurrentOrder(),
      checkAgreementStatus(),
      validateLocation(),
      refreshEarnings(),
    ]);

    const bannerData = await getHomeBanners();
    setBanners(bannerData);
  } catch (error) {
    console.log('Refresh error:', error);
  } finally {
    setPullRefreshing(false);
  }
}, [
  fetchRiderStatus,
  checkCurrentOrder,
  refreshEarnings,
]);

  /*
   * ============================================================
   * INITIAL LOADER
   * ============================================================
   */

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator
          size="large"
          color="#1F3365"
        />
      </SafeAreaView>
    );
  }

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top']}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={pullRefreshing}
            onRefresh={onRefresh}
            colors={['#1F3365']}
            tintColor="#1F3365"
          />
        }
      >

        <Header />

        {/* ONLINE / OFFLINE TOGGLE */}
        <SwipeOnlineToggle
          isOnline={isOnline}
          isLoading={isLoading}
          onSwipeOnline={goOnline}
          onSwipeOffline={goOffline}
        />

        {/* ACTIVE ORDER */}
        {activeOrder && (
          <ActiveOrderCard
            activeOrder={activeOrder}
          />
        )}

        {/* BANNER CAROUSEL - OFFLINE */}
        {!isOnline && (
          <View style={styles.carouselWrapper}>
            <BannerCarousel data={banners} />
          </View>
        )}

        {/* TODAY'S PROGRESS */}
        {riderType === 'INDIVIDUAL_EMPLOYEE' && (
          <Text style={styles.sectionTitle}>
            Today's Progress
          </Text>
        )}  

        {riderType === 'ZESTBOT_EMPLOYEE' && (
          <Text style={styles.sectionTitle}>
            Monthly Progress
          </Text>
        )}

        <View style={styles.statsRow}>
          {todayStats.map(item => (
            <StatsCard
              key={item.id}
              {...item}
              isOnline={isOnline}
              totalOnlineMinutes={totalOnlineMinutes}
            />
          ))}
        </View>

        {/* BANNER CAROUSEL - ONLINE */}
        {isOnline && (
          <View style={styles.carouselWrapper}>
            <BannerCarousel data={banners} />
          </View>
        )}

        {/* ACTIVE SHIFT */}
        <ActiveShiftBanner />

        {/* PEAK HOURS BANNER */}
        {riderType === 'INDIVIDUAL_EMPLOYEE' && (
          <PeakHoursBanner />
        )}

        {/* WEEKLY STATS */}
        <WeeklyStatsCard />

      </ScrollView>

      {/* LOCATION BLOCKER */}
      <LocationBlocker
        visible={!locationReady}
        onEnable={async () => {
          const granted =
            await requestLocationRequirements();

          setLocationReady(granted);
        }}
      />

      {/* TERMS MODAL */}
      <TermsAgreementModal
        visible={showTermsModal}
        loading={loadingAgreement}
        onAccept={handleAcceptTerms}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F6FBFF',
  },

  container: {
    paddingHorizontal: wp('5%'),
  },

  carouselWrapper: {
    marginTop: hp('2%'),
  },

  sectionTitle: {
    marginTop: hp('3%'),
    fontSize: wp('4.5%'),
    fontWeight: '700',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  weekCard: {
    backgroundColor: '#E9FFF3',
    borderRadius: wp('4%'),
    padding: wp('4%'),
    marginTop: hp('3%'),
    marginBottom: hp('4%'),
  },

  weekTitle: {
    fontSize: wp('4.2%'),
    fontWeight: '700',
    marginBottom: hp('1%'),
  },

  banner: {
    backgroundColor: '#4CC9C0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginTop: hp('3%'),
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6FBFF',
  },
});

export default HomeDashboard;