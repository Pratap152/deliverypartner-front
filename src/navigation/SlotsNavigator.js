import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SlotBookingScreen from "../screens/dashboard/SlotBookingScreen";
import SlotHistoryScreen from '../screens/slots/SlotHistoryScreen';


const Stack = createNativeStackNavigator();

export default function SlotsNavigator() {
    return (    
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SlotBookingScreen" component={SlotBookingScreen} />
            <Stack.Screen name="SlotHistoryScreen" component={SlotHistoryScreen} />
        </Stack.Navigator>
    );
}           