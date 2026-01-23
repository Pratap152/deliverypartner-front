import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EarningsScreen from "../screens/dashboard/EarningsScreen";
import EarningsHistoryScreen from '../screens/earnings/EarningsHistoryScreen';
const Stack = createNativeStackNavigator();
export default function EarningsNavigator() {
    return (    
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="EarningsScreen" component={EarningsScreen} />
            <Stack.Screen name="EarningsHistoryScreen" component={EarningsHistoryScreen} />
        </Stack.Navigator>
    );
}