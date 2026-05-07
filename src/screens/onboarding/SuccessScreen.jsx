import { Image, StyleSheet, Text, View, BackHandler } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../utils/colors';

const SuccessScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/success.png')}
        resizeMode="contain"
      />
      <Text style={styles.successText}>Completed Successfully</Text>
    </View>
  );
};
export default SuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    fontSize: 36,
    fontWeight: '500',
    color: COLORS.success,
    marginTop: 20,
    textAlign:'center',
    alignSelf:'center'
  },
});
