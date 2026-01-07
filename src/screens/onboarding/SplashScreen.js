import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { tokenService } from '../../services/TokenService';
import { resolveNextScreen } from '../../utils/onboardingFlow';

const SplashScreen = ({ navigation }) => {
  const mounted = useRef(true);

  useEffect(() => {
    bootstrap();

    return () => {
      mounted.current = false;
    };
  }, []);

  const bootstrap = async () => {
    try {
      const { accessToken } = await tokenService.get();

      if (!accessToken) {
        navigation.replace('LoginEntryScreen');
        return;
      }

      const nextScreen = await resolveNextScreen();

      if (mounted.current) {
        navigation.replace(nextScreen);
      }
    } catch (err) {
      console.error('Splash error:', err);
      navigation.replace('LoginEntryScreen');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default SplashScreen;
