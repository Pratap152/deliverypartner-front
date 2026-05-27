// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {
//   responsiveHeight,
//   responsiveWidth,
//   responsiveFontSize,
// } from 'react-native-responsive-dimensions';
// // import ProfileScreen from "../screens/dashboard/ProfileScreen";

// import SlotsNavigator from './SlotsNavigator';
// import HomeDashboard from '../screens/dashboard/HomeDashboard';
// import ProfileNavigator from "./ProfileNavigator";
// import NotificationScreen from '../screens/dashboard/NotificationScreen';
// import EarningsNavigator from './EarningsNavigator';
// import HomeNavigator from './HomeNavigator';

// const Tab = createBottomTabNavigator();

// const BottomTabNavigator = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarActiveTintColor: '#0CBACE',
//         tabBarInactiveTintColor: '#9CA3AF',
//         tabBarStyle: {
//           height: responsiveHeight(8),
//           paddingBottom: responsiveHeight(0.8),
//         },
//         tabBarLabelStyle: {
//           fontSize: responsiveFontSize(1.5),
//           marginTop: responsiveHeight(0.3),
//         },
//         tabBarIcon: ({ color }) => {
//           let iconName;

//           switch (route.name) {
//             case 'Home':
//               iconName = 'home';
//               break;
//             case 'SlotBooking':
//               iconName = 'calendar';
//               break;
//             case 'Earnings':
//               iconName = 'wallet';
//               break;
//             case 'Alerts':
//               iconName = 'notifications';
//               break;
//             case 'Profile':
//               iconName = 'person';
//               break;
//           }

//           return (
//             <Ionicons
//               name={iconName}
//               size={responsiveFontSize(4)}
//               color={color}
//             />
//           );
//         },
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeNavigator} />
//       <Tab.Screen name="Earnings" component={EarningsNavigator} />
//       <Tab.Screen name="SlotBooking" component={SlotsNavigator} />
//       <Tab.Screen name="Alerts" component={NotificationScreen} />
//       {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
//       <Tab.Screen name="Profile" component={ProfileNavigator} />

//     </Tab.Navigator>
//   );
// };

// export default BottomTabNavigator;


import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import DeviceInfo from 'react-native-device-info';

import SlotsNavigator from './SlotsNavigator';
import ProfileNavigator from "./ProfileNavigator";
import NotificationScreen from '../screens/dashboard/NotificationScreen';
import EarningsNavigator from './EarningsNavigator';
import HomeNavigator from './HomeNavigator';

const Tab = createBottomTabNavigator();

const isTablet = DeviceInfo.isTablet();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: '#0CBACE',
        tabBarInactiveTintColor: '#9CA3AF',

        // IMPORTANT FIX
        tabBarLabelPosition: 'below-icon',

        tabBarStyle: {
          height: isTablet
            ? responsiveHeight(7)
            : responsiveHeight(8),

          paddingBottom: isTablet
            ? responsiveHeight(0.5)
            : responsiveHeight(0.8),

          paddingTop: isTablet
            ? responsiveHeight(0.2)
            : responsiveHeight(0.5),
        },

        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },

        tabBarLabelStyle: {
          fontSize: isTablet
            ? responsiveFontSize(1)
            : responsiveFontSize(1.5),

          marginTop: isTablet
            ? -2
            : responsiveHeight(0.3),

          paddingBottom: isTablet ? 2 : 0,

          fontWeight: '500',
        },

        tabBarIcon: ({ color }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;

            case 'SlotBooking':
              iconName = 'calendar';
              break;

            case 'Earnings':
              iconName = 'wallet';
              break;

            case 'Alerts':
              iconName = 'notifications';
              break;

            case 'Profile':
              iconName = 'person';
              break;
          }

          return (
            <Ionicons
              name={iconName}
              size={
                isTablet
                  ? responsiveFontSize(2.2)
                  : responsiveFontSize(4)
              }
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />

      <Tab.Screen
        name="Earnings"
        component={EarningsNavigator}
      />

      <Tab.Screen
        name="SlotBooking"
        component={SlotsNavigator}
      />

      <Tab.Screen
        name="Alerts"
        component={NotificationScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;