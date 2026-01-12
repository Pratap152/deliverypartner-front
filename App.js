import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';

import AppNavigator from './src/navigation/AppNavigator';
import { store } from './src/redux/store';
import { AuthProvider } from './src/hooks/useAuth';
<<<<<<< HEAD

import { tokenService } from './src/services/TokenService';
import { sessionService } from './src/services/SessionService';
import { refreshTokenIfNeeded } from './src/api/RefreshManager';
import {
  navigationRef,
  navigateAndReset,
} from './src/navigation/RootNavigation';

const App = () => {
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
import { navigationRef } from './src/navigation/RootNavigation';

const App = () => {
>>>>>>> 275bb894800481e1027ccc266a9ae118110d0f32
  return (
    <Provider store={store}>
      <AuthProvider>
        <NavigationContainer ref={navigationRef}>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </Provider>
  );
};

export default App;
