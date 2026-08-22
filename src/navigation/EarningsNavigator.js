import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EarningsScreen from "../screens/dashboard/EarningsScreen";
import EarningsHistoryScreen from '../screens/earnings/EarningsHistoryScreen';
import WeekEarnings from '../screens/incentives/WeekEarnings';
import DailyGuarentee from '../screens/incentives/DailyGuarentee';
import PeakHourBonusScreen from '../screens/incentives/PeakHourBonusScreen';
import BankAC from '../screens/profile/BankAC';
import SalaryDetails from '../screens/earnings/SalaryDetailsScreen';


const Stack = createNativeStackNavigator();
export default function EarningsNavigator() {
    return (    
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="EarningsScreen" component={EarningsScreen} />
            <Stack.Screen name="EarningsHistoryScreen" component={EarningsHistoryScreen} />
            <Stack.Screen name="WeekEarnings" component={WeekEarnings} />
            <Stack.Screen name="BankAC" component={BankAC} />
            <Stack.Screen name="DailyGuarentee" component={DailyGuarentee} />
            <Stack.Screen name="PeakHourBonusScreen" component={PeakHourBonusScreen} /> 
             <Stack.Screen name="SalaryDetails" component={SalaryDetails} /> 
        </Stack.Navigator>
    );
}