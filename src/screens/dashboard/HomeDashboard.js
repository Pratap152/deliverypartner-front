import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../../components/home/Header";
import StatsCard from "../../components/home/StatsCard";
import ActiveShiftBanner from "../../components/home/ActiveShiftBanner";
import PeakHoursBanner from "../../components/home/PeakHoursBanner";
import WeeklyStatsCard from "../../components/home/WeeklyStatsCard";
import { banners, todayStats } from "../../components/home/data/home.mock";
import SwipeOnlineToggle from "../../components/home/SwipeOnlineToggle";
import ShiftStartedBanner from "../../components/home/ShiftStartedBanner";
import BannerCarousel from "../../components/home/BannerCarousel";
import { useRider } from "../../context/RiderContext";

const HomeDashboard = () => {
  const { isOnline, goOnline, goOffline, isLoading } = useRider();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Header />

        {/* ONLINE / OFFLINE TOGGLE */}
        <SwipeOnlineToggle
          isOnline={isOnline}
          isLoading={isLoading}
          onSwipeOnline={goOnline}
          onSwipeOffline={goOffline}
        />

        {/* Shift started banner */}
        {isOnline && <ShiftStartedBanner />}

        {/* Banner carousel only if offline */}
        {!isOnline && (
          <View style={styles.carouselWrapper}>
            <BannerCarousel data={banners} />
          </View>
        )}

        <Text style={styles.sectionTitle}>Today's Progress</Text>

        <View style={styles.statsRow}>
          {todayStats.map(item => (
            <StatsCard key={item.id} {...item} />
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
  safe: { flex: 1, backgroundColor: "#F6FBFF" },
  scrollContent: { paddingHorizontal: wp("5%"), paddingBottom: hp("5%") },
  carouselWrapper: { marginTop: hp("2%") },
  sectionTitle: { marginTop: hp("3%"), fontSize: wp("4.5%"), fontWeight: "700" },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: hp("2%") },
});

export default HomeDashboard;

