import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { COLORS } from '../../utils/colors';

const SuccessScreen = () => {
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
