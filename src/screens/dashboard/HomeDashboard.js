import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import Header from "../../components/home/Header";
import StatsCard from "../../components/home/StatsCard";
import ActiveShiftBanner from "../../components/home/ActiveShiftBanner";
import PeakHoursBanner from "../../components/home/PeakHoursBanner";
import WeeklyStatsCard from "../../components/home/WeeklyStatsCard";
import {
  getHomeBanners,
  todayStats,
} from "../../components/home/data/home.mock";
import SwipeOnlineToggle from "../../components/home/SwipeOnlineToggle";
import BannerCarousel from "../../components/home/BannerCarousel";
import { useRider } from "../../context/RiderContext";
const HomeDashboard = () => {
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
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Header />

        {/* ONLINE / OFFLINE TOGGLE */}
        <SwipeOnlineToggle
          isOnline={isOnline}
          isLoading={refreshing}
          onSwipeOnline={goOnline}
          onSwipeOffline={goOffline}
        />

        {/* Banner carousel only if offline */}
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
        <ActiveShiftBanner />
        <PeakHoursBanner />

        <WeeklyStatsCard />
      </ScrollView>
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
  

