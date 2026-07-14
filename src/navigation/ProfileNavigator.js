import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import PersonalDetails from '../screens/profile/PersonalDetails';
import RiderAssets from '../screens/profile/RiderAssets';
import Documents from '../screens/profile/Documents';
import Insurance from '../screens/profile/Insurance';
import Wallet from '../screens/profile/Wallet';
import CashBalance from '../screens/profile/CashBalance';
import AttendanceScreen from '../screens/profile/AttendanceScreen';
import AttendanceDetailsScreen from '../screens/profile/AttendanceDetailsScreen';
import AttendanceRulesScreen from '../screens/profile/AttendanceRulesScreen';
import MonthlySummaryScreen from '../screens/profile/MonthlySummaryScreen';
import CameraScreen from '../screens/profile/CameraScreen';
import BankAC from '../screens/profile/BankAC';
import SlotHistory from '../screens/profile/SlotHistory';
import RewardsScreen from '../screens/profile/Rewards';
import OrderHistory from '../screens/profile/OrderHistory';
import OrderHistoryDetails from '../screens/profile/OrderHistoryDetails';
import AboutScreen from '../screens/profile/AboutScreen';

const Stack = createNativeStackNavigator();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
      <Stack.Screen name="RiderAssets" component={RiderAssets} />
      <Stack.Screen name="Documents" component={Documents} />
      <Stack.Screen name="Insurance" component={Insurance} />
      <Stack.Screen name="Wallet" component={Wallet} />
      <Stack.Screen name="CashBalance" component={CashBalance} />
      <Stack.Screen name="AttendanceScreen" component={AttendanceScreen} />
      <Stack.Screen name="AttendanceDetailsScreen" component={AttendanceDetailsScreen} />
      <Stack.Screen name="AttendanceRulesScreen" component={AttendanceRulesScreen} />
      <Stack.Screen name="MonthlySummaryScreen" component={MonthlySummaryScreen} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
      <Stack.Screen name="BankAC" component={BankAC} />
      <Stack.Screen name="SlotHistory" component={SlotHistory} />
      <Stack.Screen name="OrderHistory" component={OrderHistory} />
      <Stack.Screen name="OrderHistoryDetails" component={OrderHistoryDetails} />
      <Stack.Screen name="RewardsScreen" component={RewardsScreen} />
      <Stack.Screen name="AboutScreen" component={AboutScreen} />
    </Stack.Navigator>
  );
}
