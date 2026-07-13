import React, { useEffect, useRef, useCallback } from 'react';
import { View, ActivityIndicator, BackHandler, Alert } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import { tokenService } from '../../services/TokenService';
import { resolveNextScreen } from '../../utils/onboardingFlow';

const SplashScreen = ({ navigation }) => {

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Exit App",
          "Are you sure you want to exit the app?",
          [
            {
              text: "No",
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: () => BackHandler.exitApp(),
            },
          ]
        );

        return true; // Prevent default behavior
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

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
    <View style={styles.loaderContainer}>
      <ActivityIndicator
              size="large"
              color="#1F3365"
            />
    </View>
  );
};


const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6FBFF',
  },
});

export default SplashScreen;