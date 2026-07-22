

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeDashboard from '../screens/dashboard/HomeDashboard';
import PdfViewerScreen from '../screens/Home/PdfViewerScreen';
import OrderDetailsScreen from '../screens/order/OrderDetailsScreen';
import SuccessfullDelivered from '../screens/Home/SuccessfullDelivered';
import AddBankDetails from '../screens/Home/AddBankDetails';
import KitSelectionScreen from '../screens/kitSelection/KitSelectionScreen';
// import LiveTracking from '../screens/Home/LiveTracking';
import MapScreen from '../screens/order/MapScreen';
import React from 'react';
import EarningsHistoryScreen from '../screens/earnings/EarningsHistoryScreen';
import SlotHistory from '../screens/profile/SlotHistory';
import OrderHistory from '../screens/profile/OrderHistory';
import OrderHistoryDetails from '../screens/profile/OrderHistoryDetails';
import Tips from "../screens/Home/Tips"
import SlotBookingScreen from "../screens/dashboard/SlotBookingScreen";
import SlotHistoryScreen from '../screens/slots/SlotHistoryScreen';
import PeakHourBonusScreen from '../screens/incentives/PeakHourBonusScreen';

const Stack = createNativeStackNavigator();
function HomeNavigator() {
    return (
        <>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="HomeDashboard" component={HomeDashboard} />
                <Stack.Screen name="PdfViewerScreen" component={PdfViewerScreen}
                    options={({ route }) => ({
                        title: route.params.title,
                    })}
                />
                <Stack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} />
                <Stack.Screen name="SuccessfullDelivered" component={SuccessfullDelivered} />
                <Stack.Screen name="AddBankDetails" component={AddBankDetails} />

                <Stack.Screen name="PeakHourBonusScreen" component={PeakHourBonusScreen} />
                <Stack.Screen name="SlotBookingScreen" component={SlotBookingScreen} />
                <Stack.Screen name="SlotHistoryScreen" component={SlotHistoryScreen} />
                <Stack.Screen name="SlotHistory" component={SlotHistory} />
                <Stack.Screen name="OrderHistory" component={OrderHistory} />
                <Stack.Screen name="OrderHistoryDetails" component={OrderHistoryDetails} />
                <Stack.Screen name="EarningsHistoryScreen" component={EarningsHistoryScreen} />
                <Stack.Screen name="Tips" component={Tips} />
                <Stack.Screen name="KitSelectionScreen" component={KitSelectionScreen} />

                <Stack.Screen name='MapScreen' component={MapScreen} options={{
                    gestureEnabled: false, // Prevent swipe back
                }} />
            </Stack.Navigator>
        </>
    )
}
export default HomeNavigator;