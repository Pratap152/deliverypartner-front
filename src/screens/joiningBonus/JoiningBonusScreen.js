import React, { useEffect, useState } from 'react';
import {
  View,
  StatusBar,
  ActivityIndicator,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getJoiningBonus } from '../../services/JoiningBonusService';

import HeaderBar from '../../components/joiningBonus/HeaderBar';
import ProgressCard from '../../components/joiningBonus/ProgressCard';
import BonusCard from '../../components/joiningBonus/BonusCard';

const isTablet = DeviceInfo.isTablet();

/* -------------------------------------------------------------------------- */
/*                               STATIC DATA                                  */
/* -------------------------------------------------------------------------- */

// const joiningBonus = {
//   ruleType: 'TASK',

//   programName: 'Referral Joining Bonus',

//   todayDay: 3,

//   totalDays: 7,

//   completedDays: 2,

//   earnedAmount: 200,

//   payoutStatus: 'PENDING',

//   validFrom: '2026-07-01T00:00:00.000Z',

//   validTill: '2026-12-31T23:59:59.999Z',

//   tasks: [
//     {
//       dayNumber: 1,
//       targetOrders: 5,
//       completedOrders: 5,
//       rewardAmount: 100,
//       status: 'COMPLETED',
//     },
//     {
//       dayNumber: 2,
//       targetOrders: 6,
//       completedOrders: 6,
//       rewardAmount: 100,
//       status: 'COMPLETED',
//     },
//     {
//       dayNumber: 3,
//       targetOrders: 8,
//       completedOrders: 5,
//       rewardAmount: 150,
//       status: 'RUNNING',
//     },
//     {
//       dayNumber: 4,
//       targetOrders: 10,
//       completedOrders: 0,
//       rewardAmount: 200,
//       status: 'UPCOMING',
//     },
//     {
//       dayNumber: 5,
//       targetOrders: 10,
//       completedOrders: 0,
//       rewardAmount: 200,
//       status: 'UPCOMING',
//     },
//     {
//       dayNumber: 6,
//       targetOrders: 12,
//       completedOrders: 0,
//       rewardAmount: 250,
//       status: 'UPCOMING',
//     },
//     {
//       dayNumber: 7,
//       targetOrders: 15,
//       completedOrders: 0,
//       rewardAmount: 300,
//       status: 'UPCOMING',
//     },
//   ],
// };

/* -------------------------------------------------------------------------- */

// const joiningBonus = {
//   ruleType: 'FIXED_TARGET',

//   programName: 'Welcome Joining Bonus',

//   targetOrders: 100,

//   completedOrders: 45,

//   pendingOrders: 55,

//   progressPercentage: 45,

//   rewardAmount: 500,

//   earnedAmount: 0,

//   payoutStatus: 'PENDING',

//   validFrom: '2026-07-22T00:00:00.000Z',

//   validTill: '2026-08-22T23:59:59.000Z',
// };

const JoiningBonusScreen = ({ navigation }) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [joiningBonus, setJoiningBonus] = useState();

  useEffect(() => {
    const fetchJoiningBonus = async () => {
      try {
        setLoading(true);
        const response = await getJoiningBonus();
        setJoiningBonus(response.data);
        console.log("RESPONSE: ", response.data);
      } catch (error) {
        setError(" Error, Please come again later");
        console.log("Joining Bonus Error: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJoiningBonus();
  }, []);

  const insets = useSafeAreaInsets();

  const isTaskBased = joiningBonus?.ruleType === 'TASK';

  const progressData = isTaskBased
    ? {
      title: 'Monthly Progress',
      subtitle: 'Complete tasks all the month and earn extra rewards!',
      completed: joiningBonus?.completedDays,
      total: joiningBonus?.totalDays,
      percentage: Math.round(
        (joiningBonus?.completedDays / joiningBonus?.totalDays) * 100,
      ),
      reward: joiningBonus?.earnedAmount,
      label: 'Tasks Completed',
      countText: `${joiningBonus?.completedDays}/${joiningBonus?.totalDays}`,
    }
    : {
      title: 'Joining Bonus',
      subtitle: 'Complete the target and unlock your joining bonus!',
      completed: joiningBonus?.completedOrders,
      total: joiningBonus?.targetOrders,
      percentage: joiningBonus?.progressPercentage,
      reward: joiningBonus?.rewardAmount,
      label: 'Orders Completed',
      countText: `${joiningBonus?.completedOrders}/${joiningBonus?.targetOrders}`,
    };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1B2A5B" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!joiningBonus) {
    return (
      <View style={styles.center}>
        <Text>No Joining Bonus Available</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
        },
      ]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <HeaderBar
        title={joiningBonus?.programName}
        onBack={() => navigation.goBack()}
      />

      <ProgressCard
        data={progressData}
        isTaskBased={isTaskBased}
      />

      <BonusCard
        data={joiningBonus}
        isTaskBased={isTaskBased}
      />
    </View>
  );
};

export default JoiningBonusScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorText: {
    color: 'red',
    fontSize: isTablet ? 22 : 16,
  },
});