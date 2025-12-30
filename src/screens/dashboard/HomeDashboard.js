import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const HomeDashboard = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Coming Soon...</Text>
      <Pressable
        onPress={() => {
          navigation.navigate('PaymentsScreen');
        }}
      >
        <Text> Go to PaymentsScreen</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  heading: {
    fontSize: 29,
    fontWeight: '700',
    color: '#0CBACE',
  },
});

export default HomeDashboard;
