import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { tokenService } from '../../services/TokenService';
import { resolveNextScreen } from '../../utils/onboardingFlow';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    bootstrap();
  }, []);

  const bootstrap = async () => {
    const { accessToken } = await tokenService.get();

    if (!accessToken) {
      navigation.replace('LoginEntryScreen');
      return;
    }

    const next = await resolveNextScreen();
    navigation.replace(next);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default SplashScreen;
