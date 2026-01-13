import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/home/Header';
import SwipeAction from '../../components/home/SwipeAction';
import BannerCarousel from '../../components/home/BannerCarousel';
import StatsCard from '../../components/home/StatsCard';
import ActiveShiftBanner from '../../components/home/ActiveShiftBanner';
import PeakHoursBanner from '../../components/home/PeakHoursBanner';
import WeeklyStatsCard from '../../components/home/WeeklyStatsCard';
import { banners, todayStats, weeklyStats } from '../../components/home/data/home.mock';

const HomeDashboard = ({ navigation }) => {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Header />
        {!isOnline ? (
          <>
            <SwipeAction
              label="Swipe For Online"
              backgroundColor="#22C55E"
              onSwipeSuccess={() => setIsOnline(true)}
            />

            <View style={styles.carouselWrapper}>
              <BannerCarousel data={banners} />
            </View>
          </>
        ) : (
          <SwipeAction
            label="Swipe For Offline"
            backgroundColor="#6B7280"
            onSwipeSuccess={() => setIsOnline(false)}
          />
        )}

        <Text style={styles.sectionTitle}>Today's Progress</Text>

        <View style={styles.statsRow}>
          {todayStats.map(item => (
            <StatsCard key={item.id} {...item} />
          ))}
        </View>

        <View style={styles.banner}>
          <TouchableOpacity onPress={() => { navigation.navigate("OrderPopupScreen") }}>
            <Text>Navigate to OrderPopupScreen</Text>
          </TouchableOpacity>
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
