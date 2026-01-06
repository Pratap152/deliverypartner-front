import React, { useEffect } from 'react';
<<<<<<< Updated upstream
import { AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
=======
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/hooks/useAuth';
>>>>>>> Stashed changes
import { Provider } from 'react-redux';

import AppNavigator from './src/navigation/AppNavigator';
import { store } from './src/redux/store';
<<<<<<< Updated upstream
import { AuthProvider } from './src/hooks/useAuth';

import { tokenService } from './src/services/TokenService';
import { sessionService } from './src/services/SessionService';
=======
>>>>>>> Stashed changes
import { navigationRef, navigateAndReset } from './src/navigation/RootNavigation';
import ToastComponent from './src/components/common/ToastComponent';

const App = () => {
<<<<<<< Updated upstream
  useEffect(() => {
  let mounted = true;

  const bootstrap = async () => {
    try {
      const tokens = await tokenService.get();
      if (!mounted) return;

      console.log('Bootstrap tokens:', tokens);

      // 1️⃣ Access token exists → go to app
      if (tokens?.accessToken) {
        navigateAndReset('MainTabs');
        return;
      }

      // 2️⃣ Try refresh if refresh token exists
      if (tokens?.refreshToken) {
        try {
          await refreshTokenIfNeeded(true);

          if (!mounted) return;
          navigateAndReset('MainTabs');
          return;
        } catch (err) {
          console.log('Refresh failed during bootstrap');
        }
      }

      // 3️⃣ No tokens or refresh failed → login
      navigateAndReset('LoginEntryScreen');
    } catch (err) {
      console.error('App bootstrap failed:', err);
      navigateAndReset('LoginEntryScreen');
    }
  };

  bootstrap();

  // 🔁 Refresh token when app returns to foreground
  const sub = AppState.addEventListener('change', state => {
    if (state === 'active') {
      refreshTokenIfNeeded(true).catch(() => {});
    }
  });

  return () => {
    mounted = false;
    sub.remove();
  };
}, []);


=======
>>>>>>> Stashed changes
  return (
    <NavigationContainer ref={navigationRef}>
      <Provider store={store}>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </Provider>
    </NavigationContainer>
  );
};

export default App;
