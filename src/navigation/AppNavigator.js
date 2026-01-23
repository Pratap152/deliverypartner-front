import { View, Text, StatusBar } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';

import OnBoardingScreen from '../screens/onboarding/OnBoardingScreen';
import LoginEntryScreen from '../screens/onboarding/LoginEntryScreen';
import LoginVerifyScreen from '../screens/onboarding/LoginVerifyScreen';
import AppPermissionScreen from '../screens/onboarding/AppPermissionScreen';
import VehicleSelectionScreen from '../screens/onboarding/VehicleSelectionScreen';
import PersonalInfoScreen from '../screens/onboarding/PersonalInfoScreen';
import FaceInstructionScreen from '../screens/onboarding/FaceInstructionScreen';
import FaceVerificationScreen from '../screens/onboarding/FaceVerificationScreen';
import DocumentVerifyScreen from '../screens/onboarding/DocumentVerifyScreen';
import AadharEntryScreen from '../screens/onboarding/AadharEntryScreen';
import AadharVerifyScreen from '../screens/onboarding/AadharVerifyScreen';
import PanUploadScreen from '../screens/onboarding/PanUploadScreen';
import LicenseUploadScreen from '../screens/onboarding/LicenseUploadScreen';
import ProcessingVerificationScreen from '../screens/onboarding/ProcessingVerificationScreen';
import SelectCityScreen from '../screens/onboarding/SelectCityScreen';
import AreaSelectionScreen from '../screens/onboarding/AreaSelectionScreen';
import SplashScreen from '../screens/onboarding/SplashScreen';
import PaymentsScreen from '../screens/onboarding/PaymentsScreen';
import SuccessScreen from '../screens/onboarding/SuccessScreen';
import HelpCenterList from '../screens/help/HelpCenterList';
import HelpIssueScreen from '../screens/help/HelpIssueScreen';
import HomeDashboard from '../screens/dashboard/HomeDashboard';
import ReportIssue from '../screens/Home/ReportIssue';
// import CustomerNotResponding from '../screens/Home/CustomerNotResponding';
import AddBankDetails from '../screens/Home/AddBankDetails';
import ReferEarn from '../screens/Home/ReferEarn';
import IncentiveDetails from '../screens/Home/IncentiveDetails';
import ReferFrd from '../screens/Home/ReferFrd';
import SuccessfullDelivered from '../screens/Home/SuccessfullDelivered';
// import SwipeOnlineOffline from '../screens/Home/SwipeOnlineOffline';
import KitPickupSelection from '../screens/kitSelection/KitPickupSelection';
import KitSelectionScreen from '../screens/kitSelection/KitSelectionScreen';
import OrderDetailsScreen from '../screens/Home/OrderDetailsScreen';
import QRScannerScreen from '../screens/Home/QRScannerScreen';
import OrderPopupScreen from '../screens/Home/OrdersPopupScreen';
import LiveTracking from '../../src/screens/Home/LiveTracking'; 
import MapScreen from '../screens/Home/MapScreen';
import SlotHistoryScreen from '../screens/slots/SlotHistoryScreen';
import EarningsHistoryScreen from '../screens/earnings/EarningsHistoryScreen';
import OrderHistory from '../screens/profile/OrderHistory';
import SlotBookingScreen from '../screens/dashboard/SlotBookingScreen';
//import ProfileScreen from '../screens/dashboard/ProfileScreen';
import ProfileNavigator from './ProfileNavigator';
import EarningsScreen from '../screens/dashboard/EarningsScreen';
import SlotHistory from '../screens/profile/SlotHistory';
import WeekEarnings from '../screens/incentives/WeekEarnings';
import DailyGuarentee from '../screens/incentives/DailyGuarentee';
import PeakHourBonusScreen from '../screens/incentives/PeakHourBonusScreen';
// import Timer from '../screens/Home/Timer';
import Wallet from '../screens/profile/Wallet';
const Stack = createNativeStackNavigator();
const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, statusBarStyle: 'light' }}
      initialRouteName="SplashScreen"
      
    >
      <Stack.Screen name="KitPickupSelection" component={KitPickupSelection} />
      <Stack.Screen name="KitSelectionScreen" component={KitSelectionScreen} />
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name='HomeDashboard' component={HomeDashboard} />
      {/* <Stack.Screen name="Splash" component={SplashScreen} /> */}
      <Stack.Screen name="OnBoardingScreen" component={OnBoardingScreen} />
      <Stack.Screen name="LoginEntryScreen" component={LoginEntryScreen} />
      <Stack.Screen name="LoginVerifyScreen" component={LoginVerifyScreen} />
      <Stack.Screen
        name="AppPermissionScreen"
        component={AppPermissionScreen}
      />
      <Stack.Screen name="SelectCityScreen" component={SelectCityScreen} />
      <Stack.Screen
        name="AreaSelectionScreen"
        component={AreaSelectionScreen}
      />
      <Stack.Screen
        name="VehicleSelectionScreen"
        component={VehicleSelectionScreen}
      />
      <Stack.Screen name="PersonalInfoScreen" component={PersonalInfoScreen} />
      <Stack.Screen
        name="FaceInstructionScreen"
        component={FaceInstructionScreen}
      />
      <Stack.Screen
        name="FaceVerificationScreen"
        component={FaceVerificationScreen}
      />
      <Stack.Screen
        name="DocumentVerifyScreen"
        component={DocumentVerifyScreen}
      />
      <Stack.Screen name="AadharEntryScreen" component={AadharEntryScreen} />
      <Stack.Screen name="AadharVerifyScreen" component={AadharVerifyScreen} />
      <Stack.Screen name="PanUploadScreen" component={PanUploadScreen} />
      <Stack.Screen name="LicenseUploadScreen" component={LicenseUploadScreen}/>
      <Stack.Screen name="ProcessingVerificationScreen" component={ProcessingVerificationScreen} />
      <Stack.Screen name="PaymentsScreen" component={PaymentsScreen} />
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />

      <Stack.Screen name="HelpCenter" component={HelpCenterList} />
      <Stack.Screen name="OrderHistory" component={OrderHistory} />
      <Stack.Screen name="SlotHistory" component={SlotHistory} />

      <Stack.Screen name="HelpCenterList" component={HelpCenterList} />
      <Stack.Screen name="HelpIssueScreen" component={HelpIssueScreen} />
      <Stack.Screen
        name="AddBankDetails"
        component={AddBankDetails}
      />
      
      <Stack.Screen
        name="SlotHistoryScreen"
        component={SlotHistoryScreen}
      />
      <Stack.Screen
        name="EarningsHistoryScreen"
        component={EarningsHistoryScreen}
      />
       {/* <Stack.Screen name="" component={} />
      <Stack.Screen name="" component={} />
      <Stack.Screen name="" component={} />  */}
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} /> 
      <Stack.Screen name='SuccessfullDelivered' component={SuccessfullDelivered} />
      <Stack.Screen name='ReferEarn' component={ReferEarn} />
      <Stack.Screen name='ReferFrd' component={ReferFrd} />
      <Stack.Screen name="IncentiveDetails" component={IncentiveDetails} options={{ headerShown: true, title: "Incentive Details" }}/>
      <Stack.Screen name="Map" component={MapScreen}  options={{ headerShown: false }}/>
      {/* <Stack.Screen name="Timer" component={Timer}/> */}
      {/* <Stack.Screen name="CustomerNotResponding" component={CustomerNotResponding}/> */}
      <Stack.Screen name="ReportIssue" component={ReportIssue} />
      {/* <Stack.Screen name='SwipeOnlineOffline' component={SwipeOnlineOffline} /> */}
      <Stack.Screen name='OrderPopupScreen' component={OrderPopupScreen} />
      <Stack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} />
      <Stack.Screen name="QRScannerScreen" component={QRScannerScreen} />
      <Stack.Screen name="LiveTracking" component={LiveTracking} />
      <Stack.Screen name="SlotBookingScreen" component={SlotBookingScreen} />
        {/* <Stack.Screen name="ProfileScreen" component={ProfileScreen} /> */}
        <Stack.Screen name="ProfileNavigator" component={ProfileNavigator} />
        <Stack.Screen name="EarningsScreen" component={EarningsScreen} /> 
        <Stack.Screen name="WeekEarnings" component={WeekEarnings} />
        <Stack.Screen name="DailyGuarentee" component={DailyGuarentee} />
        <Stack.Screen name="PeakHourBonusScreen" component={PeakHourBonusScreen} /> 
        <Stack.Screen name="Wallet" component ={Wallet}/>
    </Stack.Navigator>
  );
};

export default AppNavigator;
