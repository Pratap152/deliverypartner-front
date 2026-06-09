import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  useWindowDimensions,
  BackHandler,
  Alert
} from 'react-native';
import { useFocusEffect } from "@react-navigation/native";

import DeviceInfo from 'react-native-device-info';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';

import PrimaryButton from '../../components/common/PrimaryButton';
import { setSelectedVehicle } from '../../redux/slices/vehicleSlice';
import apiClient from '../../services/ApiClient'; // interceptor-based api
import { SafeAreaView } from 'react-native-safe-area-context';

const submitVehicleType = async vehicleType => {
  const res = await apiClient.post('/api/rider/vehicle', {
    type: vehicleType,
  });
  return res.data;
};

const VehicleSelectionScreen = ({ navigation }) => {

  useFocusEffect(
    React.useCallback(() => {
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

  const dispatch = useDispatch();

  const selectedVehicle = useSelector(state => state.vehicle.selectedVehicle);

  const [localSelected, setLocalSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const { width } = useWindowDimensions();
  const isTablet = DeviceInfo.isTablet();
  const styles = createStyles(isTablet, width);

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

  const vehicles = [
    {
      key: 'bike',
      label: 'Bike / Scooty',
      image: require('../../assets/Bike.png'),
    },
    {
      key: 'ev',
      label: 'EV Vehicle',
      image: require('../../assets/Ev.png'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Select Vehicle</Text>
        </View>

        {/* SUBTITLE */}
        <Text style={styles.subTitle}>
          Choose your preferred delivery vehicle
        </Text>

        {/* VEHICLES */}
        <View style={styles.cardsContainer}>
          {vehicles.map(vehicle => {
            const isSelected = localSelected === vehicle.key;

            return (
              <Pressable
                key={vehicle.key}
                style={[
                  styles.card,
                  isSelected &&
                  styles.selectedCard,
                ]}
                onPress={() =>
                  handleSelect(vehicle.key)
                }
              >
                {/* IMAGE */}
                <Image
                  source={vehicle.image}
                  style={styles.image}
                />

                {/* TEXT */}
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.text,
                      isSelected &&
                      styles.selectedText,
                    ]}
                  >
                    {vehicle.label}
                  </Text>

                  <Text
                    style={[
                      styles.description,
                      isSelected &&
                      styles.selectedDescription,
                    ]}
                  >
                    {vehicle.key === 'bike'
                      ? 'Petrol vehicle for delivery'
                      : 'Electric vehicle for delivery'}
                  </Text>
                </View>

                {/* CHECK */}
                {isSelected && (
                  <View style={styles.checkContainer}>
                    <Ionicons
                      name="checkmark"
                      size={isTablet ? 30 : 22}
                      color="#00B5CC"
                    />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {localSelected && (
          <View style={styles.buttonWrapper}>
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
    </SafeAreaView>
  );
};

export default VehicleSelectionScreen;

/* ================= STYLES ================= */

const createStyles = (isTablet, width) => {
  const contentWidth = isTablet
    ? width > 1000
      ? '58%'
      : '74%'
    : '100%';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8FAFC',
      alignItems: 'center',
    },

    contentWrapper: {
      flex: 1,
      width: contentWidth,
      paddingHorizontal: isTablet ? 30 : 20,
      paddingBottom: isTablet ? 30 : 20,
    },

    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },

    backButton: {
      position: 'absolute',
      left: 0,
      padding: 4,
    },

    header: {
      fontSize: isTablet ? 34 : 26,
      fontWeight: '700',
      color: '#111827',
    },

    subTitle: {
      textAlign: 'center',
      marginTop: 14,
      marginBottom: isTablet ? 40 : 28,
      fontSize: isTablet ? 18 : 14,
      color: '#6B7280',
      lineHeight: isTablet ? 28 : 20,
    },

    cardsContainer: {
      gap: isTablet ? 24 : 18,
    },

    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderWidth: 1.5,
      borderColor: '#D1D5DB',
      borderRadius: isTablet ? 24 : 18,
      paddingHorizontal: isTablet ? 24 : 18,
      paddingVertical: isTablet ? 22 : 16,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },

    selectedCard: {
      backgroundColor: '#00B5CC',
      borderColor: '#00B5CC',
    },

    image: {
      width: isTablet ? 120 : 90,
      height: isTablet ? 120 : 90,
      resizeMode: 'contain',
    },

    textContainer: {
      flex: 1,
      marginLeft: isTablet ? 20 : 14,
    },

    text: {
      fontSize: isTablet ? 24 : 18,
      fontWeight: '700',
      color: '#111827',
    },

    selectedText: {
      color: '#fff',
    },

    description: {
      marginTop: 6,
      fontSize: isTablet ? 17 : 13,
      color: '#6B7280',
      lineHeight: isTablet ? 26 : 18,
    },

    selectedDescription: {
      color: '#E0F7FA',
    },

    checkContainer: {
      width: isTablet ? 44 : 34,
      height: isTablet ? 44 : 34,
      borderRadius: 999,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },

    buttonWrapper: {
      flex: 1,
      justifyContent: 'flex-end',
      marginTop: 30,
    },
  });
};