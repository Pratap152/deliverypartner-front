import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import AppNavigator from './src/navigation/AppNavigator';
import { store } from './src/redux/store';
import { AuthProvider } from './src/hooks/useAuth';
import { navigationRef } from './src/navigation/RootNavigation';
import { GPSProvider, useGPS } from './src/context/GPSContext';
import EnableGPSModal from './src/components/map/GPSModal';
import { RiderProvider } from "./src/context/RiderContext";
import { useEffect } from "react";
import { authEvents, AUTH_EVENTS } from "./src/services/AuthEvents";
import { authService } from "./src/services/AuthService";

const GlobalGPSPopup = () => {
  const { showPopup, requestGPS, hidePopup } = useGPS();

  return (
    <EnableGPSModal
      visible={showPopup}
      onAllow={requestGPS}
      onDeny={hidePopup}
    />
   );
 };


 const App = () => {
  useEffect(() => {
    const unsubscribe = authEvents.subscribe(event => {
      if (event === AUTH_EVENTS.FORCE_LOGOUT) {
        authService.forceLogout();
      }
    });

    return unsubscribe;
  }, []);
   return (
    <GPSProvider>
       <Provider store={store}>
       <AuthProvider>
         <NavigationContainer ref={navigationRef}>
          <RiderProvider>
            <AppNavigator />
            <GlobalGPSPopup /> {/* 🔥 Overlay entire app */}
          </RiderProvider>
         </NavigationContainer>
       </AuthProvider>
     </Provider>
     </GPSProvider>
   
   );
 };

 export default App;
