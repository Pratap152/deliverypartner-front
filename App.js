import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from "./src/hooks/useAuth";
import{store} from "./src/redux/store"
import { Provider } from 'react-redux';

const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Provider store={store}>
        <AppNavigator />
        </Provider>
      </AuthProvider>
    </NavigationContainer>

  );
};

export default App;