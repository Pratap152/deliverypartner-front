import React, { useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';

const Splash = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('OnBoardingScreen');
    }, 4000); // 3 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <>
      <StatusBar
        backgroundColor="#1D2D63"
        barStyle="light-content"
      />

      <View style={styles.container}>
        <Image
          source={require('../../assets/Splash.png')}
              style={{
                width: 250,
                height: 250,
              }}
              resizeMode="contain"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D2D63',
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default Splash;