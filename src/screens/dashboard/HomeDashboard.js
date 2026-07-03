import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import Header from "../../components/home/Header";
import StatsCard from "../../components/home/StatsCard";
import ActiveShiftBanner from "../../components/home/ActiveShiftBanner";
import PeakHoursBanner from "../../components/home/PeakHoursBanner";
import WeeklyStatsCard from "../../components/home/WeeklyStatsCard";
import LocationBlocker from "../../components/home/LocationBlocker";
import {
  getHomeBanners,
  todayStats,
} from "../../components/home/data/home.mock";
import SwipeOnlineToggle from "../../components/home/SwipeOnlineToggle";
import BannerCarousel from "../../components/home/BannerCarousel";
import { useRider } from "../../context/RiderContext";
import { checkLocationRequirements, requestLocationRequirements, listenAppResume } from '../../utils/locationPermission';

const HomeDashboard = () => {

  const [locationReady, setLocationReady] = useState(false);

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

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Exit App",
          "Are you sure you want to exit the app?",
          [
            {
              text: "No",
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: () => BackHandler.exitApp(),
            },
          ]
        );

        return true; // Prevent default behavior
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  const navigation = useNavigation();
  const { isOnline, goOnline, goOffline, isLoading, totalOnlineMinutes, refreshing, fetchRiderStatus } = useRider();
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      await fetchRiderStatus();

      const bannerData = await getHomeBanners();

      setBanners(bannerData);
    } catch (error) {
      console.log('HOME DATA ERROR:', error);
    }
  };

  if (refreshing) return null;

  return (
   <SafeAreaView
    style={styles.safe}
    edges={['top']}
>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Header />

        {/* ONLINE / OFFLINE TOGGLE */}
        <SwipeOnlineToggle
          isOnline={isOnline}
          isLoading={isLoading}
          onSwipeOnline={goOnline}
          onSwipeOffline={goOffline}
        />

        {/* Banner carousel visible in offline */}
        {!isOnline && (
          <View style={styles.carouselWrapper}>
            <BannerCarousel data={banners} />
          </View>
        )}
        <Text style={styles.sectionTitle}>Today's Progress</Text>

        <View style={styles.statsRow}>
          {todayStats.map(item => (
            <StatsCard key={item.id} {...item} isOnline={isOnline} totalOnlineMinutes={totalOnlineMinutes} />
          ))}
        </View>
        {/* Banner carousel visible in online */}
        {isOnline && (
          <View style={styles.carouselWrapper}>
            <BannerCarousel data={banners} />
          </View>
        )}
        <ActiveShiftBanner />
        <PeakHoursBanner />

        <WeeklyStatsCard />
      </ScrollView>
      
      <LocationBlocker
        visible={!locationReady}
        onEnable={async () => {
          const granted =
            await requestLocationRequirements();

          setLocationReady(granted);
        }}
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
    marginTop: hp('2%'),
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
    backgroundColor: "#4CC9C0",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginTop: hp('3%'),
  },
});

export default HomeDashboard;