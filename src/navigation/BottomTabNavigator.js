import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';

import SlotsNavigator from './SlotsNavigator';
import ProfileNavigator from "./ProfileNavigator";
import NotificationScreen from '../screens/dashboard/NotificationScreen';
import EarningsNavigator from './EarningsNavigator';
import HomeNavigator from './HomeNavigator';

const Tab = createBottomTabNavigator();

const isTablet = DeviceInfo.isTablet();

const BottomTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,

        tabBarActiveTintColor:"#3558AA" ,
        tabBarInactiveTintColor: '#9CA3AF',

        tabBarLabelPosition: 'below-icon',

        tabBarStyle: {
          backgroundColor: '#FFFFFF',

          height: isTablet
            ? responsiveHeight(7) + insets.bottom
            : responsiveHeight(7.3) + insets.bottom,

          paddingTop: 3,

          paddingBottom: Math.max(insets.bottom, 6),

          borderTopWidth: 0,

          elevation: 8,

          shadowOpacity: 0,
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