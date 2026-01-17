import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import AppNavigator from './src/navigation/AppNavigator';
import { store } from './src/redux/store';
import { AuthProvider } from './src/hooks/useAuth';
import { navigationRef } from './src/navigation/RootNavigation';
import { useEffect } from 'react';
import { authEvents, AUTH_EVENTS } from './src/services/AuthEvents';
import { authService } from './src/services/AuthService';
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
