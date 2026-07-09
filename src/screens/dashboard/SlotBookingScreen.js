import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

// Components
import ZestbotSlotsDetails from './ZestbotSlotsDetails';
import SlotsScreen from './SlotsScreen';

export default function SlotBookingScreen() {

const riderType = useSelector((state) => state.profile.data?.riderType?.trim());

  return (
    <View style={styles.container}>
      {
        riderType === "INDIVIDUAL_EMPLOYEE" ? (
          <SlotsScreen />
        ) :
        <ZestbotSlotsDetails />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
});
