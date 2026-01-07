import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
//import { useNavigation } from '@react-navigation/native';

const ProcessingVerificationScreen = () => {
  ///const navigation = useNavigation();

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: 'MainTabs' }],
  //     });
  //   }, 3000); // ⏱ 3 seconds delay

  //   return () => clearTimeout(timer); // ✅ cleanup
  // }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/Notify.png')} style={styles.image} />
      <Text style={styles.text}>
        We will notify once the verification is{'\n'}
        successfully completed
      </Text>
    </View>
  );
};

export default ProcessingVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(5),
  },

  image: {
    width: responsiveWidth(70),
    height: responsiveHeight(35),
    resizeMode: 'contain',
    marginBottom: responsiveHeight(3),
  },

  text: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
    lineHeight: responsiveHeight(3),
  },
});
