
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeDashboard from '../screens/dashboard/HomeDashboard';
import OrdersPopupScreen from '../screens/Home/OrdersPopupScreen';
import OrderDetailsScreen from '../screens/Home/OrderDetailsScreen';
import QRScannerScreen from '../screens/Home/QRScannerScreen';
import SuccessfullDelivered from '../screens/Home/SuccessfullDelivered';
import AddBankDetails from '../screens/Home/AddBankDetails';
import KitSelectionScreen from '../screens/kitSelection/KitSelectionScreen';
// import LiveTracking from '../screens/Home/LiveTracking';
import MapScreen from '../screens/Home/MapScreen';

const Stack = createNativeStackNavigator();
function HomeNavigator(){
    return(
        <>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeDashboard" component={HomeDashboard} />
      <Stack.Screen name='OrdersPopupScreen' component={OrdersPopupScreen}/>
      <Stack.Screen name='OrderDetailsScreen' component={OrderDetailsScreen}/>
      <Stack.Screen name='QRScannerScreen' component={QRScannerScreen}/>
      <Stack.Screen name='SuccessfullDelivered' component={SuccessfullDelivered}/>
      <Stack.Screen name='AddBankDetails' component={AddBankDetails}/>
      <Stack.Screen name='KitSelectionScreen' component={KitSelectionScreen}/>
      {/* <Stack.Screen name='LiveTracking' component={LiveTracking}/> */}
      {/* <Stack.Screen name='LiveMap' component={LiveMap}/> */}
      <Stack.Screen name='MapScreen' component={MapScreen}/>
    </Stack.Navigator>
        </>
    )
}
export default HomeNavigator;