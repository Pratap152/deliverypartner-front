import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
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

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

/* =========================================================
   REWARD SECTIONS
   ========================================================= */

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

  {
    key: 'joining',
    title: 'Joining Bonus',
    description: 'Complete your joining milestones and earn rewards',
    icon: 'gift-outline',
    iconColor: '#E91E63',
    iconBg: '#FCE7F3',
    badge: 'New',
    badgeColor: '#E91E63',
    badgeBg: '#FCE7F3',
  },
];

/* =========================================================
   SCREEN
   ========================================================= */

const RewardsScreen = ({ navigation }) => {

  /* =======================================================
     EARNINGS DASHBOARD
     ======================================================= */

  const { data: earningsData } = useEarningsDashboard();

  const incentives = earningsData?.incentives || [];

  
  const riderType = earningsData?.riderType || '';

  const isZestbotEmployee =
    riderType === 'ZESTBOT_EMPLOYEE';

  const isIndividual =
    riderType === 'INDIVIDUAL_EMPLOYEE';


  /* =======================================================
     INCENTIVE PROGRESS
     ======================================================= */

  const {
    dailyIncentivesProgress,
    weeklyIncentivesProgress,
    peakIncentivesProgress,

    fetchDailyIncentivesProgress,
    fetchWeeklyIncentivesProgress,
    fetchPeakIncentivesProgress,
  } = useIncentives();



  useEffect(() => {
    if (!isIndividual) {
      return;
    }

    fetchDailyIncentivesProgress();
    fetchWeeklyIncentivesProgress();
    fetchPeakIncentivesProgress();

  }, [
    isIndividual,
    fetchDailyIncentivesProgress,
    fetchWeeklyIncentivesProgress,
    fetchPeakIncentivesProgress,
  ]);


  /* =======================================================
     VISIBLE REWARD SECTIONS
     ======================================================= */

  const visibleRewardSections = isZestbotEmployee
    ? REWARD_SECTIONS.filter(
        item =>
          item.key === 'refer' ||
          item.key === 'joining'
      )
    : REWARD_SECTIONS;


  /* =======================================================
     HANDLE REWARD CARD PRESS
     ======================================================= */

  const handlePress = (item) => {

    /* -------------------------------------------------------
       PEAK
       ------------------------------------------------------- */

    if (item.key === 'peak') {

      const peakItem = incentives.find(
        i => i.type === 'peak'
      );

      navigation.navigate(
        'PeakHourBonusScreen',
        {
          ...peakItem,
          peakIncentivesProgress,
        }
      );

      return;
    }


    /* -------------------------------------------------------
       DAILY
       ------------------------------------------------------- */

    if (item.key === 'daily') {

      const dailyItem = incentives.find(
        i => i.type === 'daily'
      );

      navigation.navigate(
        'DailyGuarentee',
        {
          ...dailyItem,
          dailyIncentivesProgress,
        }
      );

      return;
    }


    /* -------------------------------------------------------
       WEEKLY
       ------------------------------------------------------- */

    if (item.key === 'weekly') {

      const weeklyItem = incentives.find(
        i => i.type === 'weekly'
      );

      navigation.navigate(
        'WeekEarnings',
        {
          ...weeklyItem,
          weeklyIncentivesProgress,
        }
      );

      return;
    }


    /* -------------------------------------------------------
       REFER & EARN
       ------------------------------------------------------- */

    if (item.key === 'refer') {

      navigation.navigate('ReferEarn');

      return;
    }


    /* -------------------------------------------------------
       JOINING BONUS
       ------------------------------------------------------- */

    if (item.key === 'joining') {

      navigation.navigate('JoiningBonusScreen');

      return;
    }
  };


  /* =======================================================
     UI
     ======================================================= */

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >

      {/* ===================================================
          HEADER
          =================================================== */}

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={rf(2.6)}
            color="#101828"
          />
        </TouchableOpacity>


        <Text style={styles.headerTitle}>
          Rewards
        </Text>


        <TouchableOpacity
          style={styles.rightIconWrapper}
          onPress={() =>
            navigation.navigate('HelpCenterList')
          }
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={isTablet ? 34 : 24}
            color="#192A51"
          />
        </TouchableOpacity>

      </View>


      {/* ===================================================
          CONTENT
          =================================================== */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <View
          style={{
            height: rh(1.5),
          }}
        />


        {/* =================================================
            REWARD CARDS
            ================================================= */}

        {visibleRewardSections.map(item => (

          <TouchableOpacity
            key={item.key}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => handlePress(item)}
          >

            {/* ---------------------------------------------
                ICON
                --------------------------------------------- */}

            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: item.iconBg,
                },
              ]}
            >

              <Ionicons
                name={item.icon}
                size={rf(2.8)}
                color={item.iconColor}
              />

            </View>


            {/* ---------------------------------------------
                CONTENT
                --------------------------------------------- */}

            <View style={styles.content}>

              <View style={styles.rowBetween}>

                <Text style={styles.title}>
                  {item.title}
                </Text>


                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: item.badgeBg,
                    },
                  ]}
                >

                  <Text
                    style={[
                      styles.badgeText,
                      {
                        color: item.badgeColor,
                      },
                    ]}
                  >
                    {item.badge}
                  </Text>

                </View>

              </View>


              <Text style={styles.description}>
                {item.description}
              </Text>

            </View>


            {/* ---------------------------------------------
                ARROW
                --------------------------------------------- */}

            <Ionicons
              name="chevron-forward"
              size={rf(2.2)}
              color="#98A2B3"
              style={styles.arrow}
            />

          </TouchableOpacity>

        ))}


        <View
          style={{
            height: rh(4),
          }}
        />

      </ScrollView>

    </SafeAreaView>
  );
};


export default RewardsScreen;


/* =========================================================
   STYLES
   ========================================================= */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },


  scrollContent: {
    paddingBottom: rh(2),
  },


  /* =======================================================
     HEADER
     ======================================================= */

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


  rightIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },


  /* =======================================================
     CARD
     ======================================================= */

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


  /* =======================================================
     ICON
     ======================================================= */

  iconBox: {
    width: rw(13),
    height: rw(13),
    borderRadius: rw(3.5),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rw(3.2),
    flexShrink: 0,
  },


  /* =======================================================
     CONTENT
     ======================================================= */

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


  /* =======================================================
     BADGE
     ======================================================= */

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


  /* =======================================================
     ARROW
     ======================================================= */

  arrow: {
    marginLeft: rw(2),
  },

});