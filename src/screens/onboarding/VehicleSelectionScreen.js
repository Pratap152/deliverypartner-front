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
import PrimaryButton from '../../components/common/PrimaryButton';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedVehicle } from '../../redux/slices/vehicleSlice';
import axios from 'axios';
import WEBSITE_URL from '../../utils/host';
import { useAuth } from '../../hooks/useAuth';

const VehicleSelectionScreen = ({ navigation }) => {
  const { authToken } = useAuth();
  const dispatch = useDispatch();

  const selectedVehicle = useSelector(state => state.vehicle.selectedVehicle);

  const [localSelected, setLocalSelected] = useState(null);

  const handleSelect = type => {
    setLocalSelected(type);
    dispatch(setSelectedVehicle(type));
  };

  const handleSubmit = async () => {
    try {
      const response = await SendVehicleType(selectedVehicle);
      console.log('Vehicle saved:', response);
      navigation.navigate('PersonalInfoScreen');
    } catch (error) {
      console.log('Vehicle submit error:', error);
    }
  };

  const SendVehicleType = async vehicleType => {
    try {
      if (!authToken) {
        throw new Error('Auth token not found');
      }

      const payload = {
        type: vehicleType,
      };

      const response = await axios.post(
        `${WEBSITE_URL}/api/rider/vehicle`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      console.log('Vehicle API Response:', response.data);
      return response.data;
    } catch (error) {
      console.log('Vehicle API Error:', error.response?.data || error.message);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={22} color="#000" />
      </TouchableOpacity>
      <Text style={styles.header}>Select Vehicle</Text>

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
            title="Submit"
            onPress={handleSubmit}
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

  header: {
    fontSize: responsiveFontSize(3),
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: responsiveHeight(2),
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

  textWrapper: {
    flex: 1,
    marginLeft: responsiveWidth(3),
  },

  text: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '600',
    color: '#000',
  },

  selectedText: {
    color: '#fff',
  },
});
