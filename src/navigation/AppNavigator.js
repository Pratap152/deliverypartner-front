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

import PaymentsScreen from '../screens/onboarding/PaymentsScreen';
import SuccessScreen from '../screens/onboarding/SuccessScreen';
import HelpCenterList from '../screens/help/HelpCenterList';
import HelpIssueScreen from '../screens/help/HelpIssueScreen';
import AddBankDetailsScreen from '../screens/wallets/BankDetailsScreen';
import KitPickupSelection from "../screens/kitSelection/KitPickupSelection";
import KitSelectionScreen from "../screens/kitSelection/KitSelectionScreen";
const Stack = createNativeStackNavigator();
const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, statusBarStyle: 'light' }}
      initialRouteName='KitSelectionScreen'
    >
      <Stack.Screen name="KitPickupSelection" component={KitPickupSelection} />
      <Stack.Screen name="KitSelectionScreen" component={KitSelectionScreen} />
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
      <Stack.Screen
        name="LicenseUploadScreen"
        component={LicenseUploadScreen}
      />
      <Stack.Screen
        name="ProcessingVerificationScreen"
        component={ProcessingVerificationScreen}
      />
      <Stack.Screen name="PaymentsScreen" component={PaymentsScreen} />
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />

      <Stack.Screen name="HelpCenter" component={HelpCenterList} />


      <Stack.Screen name="HelpIssueScreen" component={HelpIssueScreen} />
      <Stack.Screen
        name="AddBankDetailsScreen"
        component={AddBankDetailsScreen}
      />
       {/* <Stack.Screen name="" component={} />
      <Stack.Screen name="" component={} />
      <Stack.Screen name="" component={} />  */}
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} /> 
    </Stack.Navigator>
  ); n
};

export default AppNavigator;
