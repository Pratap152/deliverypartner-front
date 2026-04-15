import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';

import PrimaryButton from '../../components/common/PrimaryButton';
import { setSelectedVehicle } from '../../redux/slices/vehicleSlice';
import apiClient from '../../services/ApiClient'; // interceptor-based api

const submitVehicleType = async vehicleType => {
  const res = await apiClient.post('/api/rider/vehicle', {
    type: vehicleType,
  });
  return res.data;
};

const VehicleSelectionScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const selectedVehicle = useSelector(state => state.vehicle.selectedVehicle);

  const [localSelected, setLocalSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = type => {
    setLocalSelected(type);
    dispatch(setSelectedVehicle(type));
  };

  const handleSubmit = async () => {
    if (!selectedVehicle || loading) return;

    try {
      setLoading(true);

      await submitVehicleType(selectedVehicle);

      //  ALWAYS go through Splash
      navigation.replace('SplashScreen');
    } catch (error) {
      console.log('Vehicle submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>

        <Text style={styles.header}>Select Vehicle</Text>
      </View>

      {/* Bike */}
      <Pressable
        style={[styles.card, localSelected === 'bike' && styles.selectedCard]}
        onPress={() => handleSelect('bike')}
      >
        <Image source={require('../../assets/Bike.png')} style={styles.image} />
        <Text
          style={[styles.text, localSelected === 'bike' && styles.selectedText]}
        >
          Bike / Scooty
        </Text>

        {localSelected === 'bike' && (
          <Ionicons
            name="checkmark"
            size={responsiveFontSize(3.5)}
            color="#fff"
          />
        )}
      </Pressable>

      {/* EV */}
      <Pressable
        style={[styles.card, localSelected === 'ev' && styles.selectedCard]}
        onPress={() => handleSelect('ev')}
      >
        <Image source={require('../../assets/Ev.png')} style={styles.image} />
        <Text
          style={[styles.text, localSelected === 'ev' && styles.selectedText]}
        >
          EV Vehicle
        </Text>

        {localSelected === 'ev' && (
          <Ionicons
            name="checkmark"
            size={responsiveFontSize(3.5)}
            color="#fff"
          />
        )}
      </Pressable>

      {localSelected && (
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <PrimaryButton
            title={loading ? 'Submitting...' : 'Submit'}
            onPress={handleSubmit}
            disabled={loading}
            bgColor="#00B5CC"
            textColor="#fff"
          />
        </View>
      )}
    </View>
  );
};

export default VehicleSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: responsiveWidth(5),
    backgroundColor: '#fff',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // 🔥 this centers the title
    marginVertical: responsiveHeight(2),
    position: 'relative',
  },

  backButton: {
    position: 'absolute',
    left: 0, // keeps arrow on left
  },

  header: {
    fontSize: responsiveFontSize(2.7),
    fontWeight: '600',
  },
  card: {
    width: responsiveWidth(90),
    minHeight: responsiveHeight(18),
    flexDirection: 'row',
    alignItems: 'center',
    padding: responsiveWidth(4),
    marginBottom: responsiveHeight(2.5),
    borderWidth: 1.5,
    borderColor: '#73d1df',
    borderRadius: responsiveWidth(3),
    backgroundColor: '#fff',
  },

  selectedCard: {
    backgroundColor: '#00B5CC',
    borderColor: '#00B5CC',
  },

  image: {
    width: responsiveWidth(26),
    height: responsiveHeight(14),
    resizeMode: 'contain',
  },

  text: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '420',
    color: '#000',
    marginLeft: responsiveWidth(3),
    flex: 1,
  },

  selectedText: {
    color: '#fff',
  },
});
