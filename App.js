import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';

import AppNavigator from './src/navigation/AppNavigator';
import { store } from './src/redux/store';
import { AuthProvider } from './src/hooks/useAuth';

import { tokenService } from './src/services/TokenService';
import { sessionService } from './src/services/SessionService';
import { refreshTokenIfNeeded } from './src/api/RefreshManager';
import { navigationRef, navigateAndReset } from './src/navigation/RootNavigation';
import {getAuthHeaders} from "./src/services/slots/slots.service";


const App = () => {
   
  // useEffect(() => {
  //   let mounted = true;

  //   const bootstrap = async () => {
  //     try {
  //       const tokens = await tokenService.get();

  //       if (!mounted) return;

  //       console.log('Bootstrap tokens:', tokens);

  //       if (!tokens?.accessToken) {
  //         console.log('if entered....'); 
  //         navigateAndReset('OnBoardingScreen');
  //         return;
  //       }

  //       await refreshTokenIfNeeded()

  //       const onboardingComplete =
  //         await sessionService.isOnboardingComplete();

  //       navigateAndReset(
  //         onboardingComplete ? 'HomeDashboard' : 'OnBoardingScreen'
  //       );
  //     } catch (err) {
  //       console.error('App bootstrap failed:', err);
  //       navigateAndReset('LoginEntryScreen');
  //     }
  //   };

  //   bootstrap();

  //   const sub = AppState.addEventListener('change', state => {
  //     if (state === 'active') {
  //       refreshTokenIfNeeded(true);
  //     }
  //   });

  //   return () => {
  //     mounted = false;
  //     sub.remove();
  //   };
  // }, []);

  return (
    <NavigationContainer >
      <Provider store={store}>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </Provider>
    </NavigationContainer>
  );
  // return (
  //   <NavigationContainer ref={navigationRef}>
  //     <Provider store={store}>
  //       <AuthProvider>
  //         <AppNavigator />
  //       </AuthProvider>
  //     </Provider>
  //   </NavigationContainer>
  // );
};

export default App;
