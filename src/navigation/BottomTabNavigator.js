import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import HomeDashboard from '../screens/dashboard/HomeDashboard';
import ProfileScreen from '../screens/dashboard/ProfileScreen';
import NotificationScreen from '../screens/dashboard/NotificationScreen';
import EarningsScreen from '../screens/dashboard/EarningsScreen';
import SlotBookingScreen from '../screens/dashboard/SlotBookingScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0CBACE',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          height: responsiveHeight(8),
          paddingBottom: responsiveHeight(0.8),
        },
        tabBarLabelStyle: {
          fontSize: responsiveFontSize(1.5),
          marginTop: responsiveHeight(0.3),
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
              size={responsiveFontSize(4)}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeDashboard} />
      <Tab.Screen name="Earnings" component={EarningsScreen} />
      <Tab.Screen name="SlotBooking" component={SlotBookingScreen} />
      <Tab.Screen name="Alerts" component={NotificationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
