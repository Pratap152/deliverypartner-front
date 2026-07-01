import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import useIncentives from '../../hooks/useIncentives';
import useEarningsDashboard from '../../hooks/useEarningsDashboard';

const REWARD_SECTIONS = [
  {
    key: 'peak',
    title: 'Peak Hour Incentives',
    description: 'Earn extra bonuses during busy hours',
    icon: 'flash-outline',
    iconColor: '#00B2C9',
    iconBg: '#E6F9FB',
    badge: 'Active Now',
    badgeColor: '#00B2C9',
    badgeBg: '#E6F9FB',
  },
  {
    key: 'daily',
    title: 'Daily Incentive',
    description: 'Complete daily order targets & earn bonuses',
    icon: 'calendar-outline',
    iconColor: '#12B76A',
    iconBg: '#ECFDF3',
    badge: 'Today',
    badgeColor: '#12B76A',
    badgeBg: '#ECFDF3',
  },
  {
    key: 'weekly',
    title: 'Weekly Incentive',
    description: 'Hit weekly targets to unlock bigger rewards',
    icon: 'trophy-outline',
    iconColor: '#F79009',
    iconBg: '#FFFAEB',
    badge: 'This Week',
    badgeColor: '#F79009',
    badgeBg: '#FFFAEB',
  },
  {
    key: 'refer',
    title: 'Refer & Earn',
    description: 'Invite friends and earn rewards for every signup',
    icon: 'people-outline',
    iconColor: '#7B61FF',
    iconBg: '#F4F0FF',
    badge: 'Unlimited',
    badgeColor: '#7B61FF',
    badgeBg: '#F4F0FF',
  },
];

const RewardsScreen = ({ navigation }) => {
  const {
    dailyIncentivesProgress,
    weeklyIncentivesProgress,
    peakIncentivesProgress,
    fetchDailyIncentivesProgress,
    fetchWeeklyIncentivesProgress,
    fetchPeakIncentivesProgress,
  } = useIncentives();

  const { data } = useEarningsDashboard();
  const incentives = data?.incentives || [];


  useEffect(() => {
    fetchDailyIncentivesProgress();
    fetchWeeklyIncentivesProgress();
    fetchPeakIncentivesProgress();
  }, []);

  const handlePress = (item) => {
    if (item.key === 'peak') {
      const peakItem = incentives.find(i => i.type === 'peak');
      navigation.navigate('PeakHourBonusScreen', { ...peakItem, peakIncentivesProgress });
      return;
    }

    if (item.key === 'daily') {
      const dailyItem = incentives.find(i => i.type === 'daily');
      navigation.navigate('DailyGuarentee', { ...dailyItem, dailyIncentivesProgress });
      return;
    }

    if (item.key === 'weekly') {
      const weeklyItem = incentives.find(i => i.type === 'weekly');
      navigation.navigate('WeekEarnings', { ...weeklyItem, weeklyIncentivesProgress });
      return;
    }

    if (item.key === 'refer') {
      navigation.navigate('ReferEarn');
    }
  };

  return (
 <SafeAreaView
      style={styles.container}
      edges={['top']}
    >      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={rf(2.6)} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Rewards</Text>

        <TouchableOpacity
          style={styles.rightIconWrapper}
          onPress={() => navigation.navigate('HelpCenterList')}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color="#13ACBE"
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ height: rh(1.5) }} />

        {/* REWARD CARDS */}
        {REWARD_SECTIONS.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => handlePress(item)}
          >
            {/* Icon */}
            <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
              <Ionicons name={item.icon} size={rf(2.8)} color={item.iconColor} />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <View style={styles.rowBetween}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={[styles.badge, { backgroundColor: item.badgeBg }]}>
                  <Text style={[styles.badgeText, { color: item.badgeColor }]}>
                    {item.badge}
                  </Text>
                </View>
              </View>
              <Text style={styles.description}>{item.description}</Text>
            </View>

            {/* Arrow */}
            <Ionicons
              name="chevron-forward"
              size={rf(2.2)}
              color="#98A2B3"
              style={styles.arrow}
            />
          </TouchableOpacity>
        ))}

        <View style={{ height: rh(4) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default RewardsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rw(4),
    paddingVertical: rh(2.2),
    backgroundColor: '#FFFFFF',
    elevation: 3,
  },

  headerTitle: {
    fontSize: rf(2.3),
    fontWeight: '700',
    color: '#101828',
  },

  robotIcon: {
    width: rw(7.5),
    height: rw(7.5),
    resizeMode: 'contain',
  },

  // Banner
  banner: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: rw(4),
    marginTop: rh(2),
    borderRadius: rw(4),
    padding: rw(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },

  bannerLabel: {
    fontSize: rf(1.7),
    color: '#667085',
    marginBottom: rh(0.4),
  },

  bannerAmount: {
    fontSize: rf(3.8),
    fontWeight: '700',
    color: '#101828',
  },

  bannerSub: {
    fontSize: rf(1.6),
    color: '#98A2B3',
    marginTop: rh(0.5),
    maxWidth: rw(55),
  },

  // Tabs
  tabsContainer: {
    paddingHorizontal: rw(4),
    paddingVertical: rh(1.8),
    gap: rw(2),
    flexDirection: 'row',
  },

  tab: {
    paddingHorizontal: rw(4),
    paddingVertical: rh(0.8),
    borderRadius: rw(5),
    borderWidth: 1,
    borderColor: '#E4E7EC',
    backgroundColor: '#FFFFFF',
  },

  tabActive: {
    backgroundColor: '#101828',
    borderColor: '#101828',
  },

  tabText: {
    fontSize: rf(1.7),
    fontWeight: '500',
    color: '#667085',
  },

  tabTextActive: {
    color: '#FFFFFF',
  },

  // Section label
  sectionLabel: {
    fontSize: rf(1.5),
    fontWeight: '600',
    color: '#98A2B3',
    letterSpacing: 0.8,
    marginHorizontal: rw(4),
    marginBottom: rh(1),
  },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: rw(4),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rw(4),
    paddingVertical: rh(2),
    marginHorizontal: rw(4),
    marginBottom: rh(1.5),
    elevation: 2,
  },

  iconBox: {
    width: rw(13),
    height: rw(13),
    borderRadius: rw(3.5),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rw(3.2),
    flexShrink: 0,
  },

  content: {
    flex: 1,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rh(0.5),
  },

  title: {
    fontSize: rf(2),
    fontWeight: '600',
    color: '#101828',
    flex: 1,
    marginRight: rw(2),
  },

  description: {
    fontSize: rf(1.7),
    color: '#667085',
  },

  badge: {
    paddingHorizontal: rw(2.5),
    paddingVertical: rh(0.4),
    borderRadius: rw(3),
    flexShrink: 0,
  },

  badgeText: {
    fontSize: rf(1.5),
    fontWeight: '600',
  },

  arrow: {
    marginLeft: rw(2),
  },
});