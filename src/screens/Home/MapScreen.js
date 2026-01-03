import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ORDER_STATUS } from '../../config/orderStates';

const MapScreen = ({ route, navigation }) => {
  const { nextStatus } = route.params;

  const isPickup = nextStatus === ORDER_STATUS.AT_RESTAURANT;

  return (
    <View style={styles.container}>
      {/* Fake Map */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>🗺 Map Navigation</Text>
        <Text style={styles.etaText}>ETA: 8 mins</Text>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.replace('OrderDetails', {
            status: nextStatus,
          })
        }
      >
        <Text style={styles.buttonText}>
          {isPickup ? 'Arrived at Restaurant' : 'Arrived at Drop Location'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    justifyContent: 'space-between',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: wp('6%'),
    fontWeight: '700',
  },
  etaText: {
    fontSize: wp('4%'),
    marginTop: hp('1%'),
    color: '#374151',
  },
  button: {
    backgroundColor: '#16A34A',
    paddingVertical: hp('2%'),
    margin: wp('4%'),
    borderRadius: wp('12%'),
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: wp('4%'),
    fontWeight: '700',
  },
});

