import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppState } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/hooks/useAuth';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

import { sessionService } from './src/services/SessionService';
import { tokenService } from './src/services/TokenService';
import { navigationRef, navigateAndReset } from './src/navigation/RootNavigation';
import { refreshTokenIfNeeded } from './src/api/RefreshManager';

const App = () => {
  useEffect(() => {
    const bootstrap = async () => {
      const tokens = await tokenService.get();
      const session = await sessionService.get();

      if (!tokens?.accessToken) {
        navigateAndReset('LoginEntryScreen');
        return;
      }

      if (session?.onboardingComplete) {
        navigateAndReset('HomeDashboard');
      } else {
        navigateAndReset('DocumentVerifyScreen');
      }
    };

    bootstrap();

    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        refreshTokenIfNeeded(true);
      }
    });

    return () => sub.remove();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <AuthProvider>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
