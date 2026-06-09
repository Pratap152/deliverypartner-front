import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  BackHandler,
  Alert
} from 'react-native';
import { useFocusEffect } from "@react-navigation/native";

import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

import { COLORS } from '../../utils/colors';
import apiClient from '../../services/ApiClient';

import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const RiderTypeScreen = ({ navigation }) => {

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

  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);

  const riderTypes = [
    {
      id: 'INDIVIDUAL_EMPLOYEE',
      label: 'Individual',
      description:
        'Work independently, manage your own schedule, and earn directly per delivery.',
    },
    {
      id: 'ZESTBOT_EMPLOYEE',
      label: 'Zestbot Employee',
      description:
        'Join Zestbot as a delivery partner and complete onboarding through the standard rider process.',
    },
    {
      id: 'COMPANY_EMPLOYEE',
      label: 'Company Employee',
      description:
        'Join as part of a registered delivery company with fixed benefits and structured shifts.',
    },
  ];

  const handleContinue = async () => {
    if (!selectedType) return;

    try {
      setLoading(true);

      await apiClient.post('/api/company/rider/type', {
        riderType: selectedType,
      });

      if (
        selectedType === 'INDIVIDUAL_EMPLOYEE' ||
        selectedType === 'ZESTBOT_EMPLOYEE'
      ) {
        navigation.navigate('SelectCityScreen');
      } else {
        navigation.navigate('EmployeeDetailsScreen');
      }
    } catch (err) {
      console.log(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const renderOption = item => {
    const isSelected = selectedType === item.id;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => setSelectedType(item.id)}
        activeOpacity={0.8}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{item.label}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>

        <View
          style={[
            styles.radioOuter,
            isSelected && { borderColor: COLORS.primary },
          ]}
        >
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* CONTENT */}
      <View style={styles.content}>
        <Image
          source={require('../../assets/RiderType.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.waveContainer}>
          <Svg height={rh(100)} width="100%" viewBox="50 80 100 170">
            <Path
              fill="#e0f9f8"
              d="M0,150C200,80,900,220,720,170C1040,140,1240,200,1440,180V320H0Z"
            />
          </Svg>
        </View>

        <View style={styles.bottomContent}>
          <Text style={styles.title}>Select your rider type</Text>

          <View style={styles.optionsWrapper}>
            {riderTypes.map(renderOption)}
          </View>
        </View>
      </View>

      {/* BUTTON */}
      <TouchableOpacity
        style={[styles.button, { opacity: selectedType ? 1 : 0.5 }]}
        disabled={!selectedType || loading}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Please wait...' : 'Continue'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RiderTypeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  content: {
    flex: 1,
  },

  image: {
    width: rw(85),
    height: rh(30),
    alignSelf: 'center',
    marginTop: rh(6),
  },

  waveContainer: {
    position: 'absolute',
    top: rh(5),
    width: '100%',
  },

  bottomContent: {
    marginTop: rh(7),
    paddingHorizontal: rw(5),
  },

  title: {
    fontSize: isTablet ? rf(2.8) : rf(2.5),
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginVertical: rh(1),
  },

  optionsWrapper: {
    marginTop: rh(1),
    alignSelf: 'center',
    width: isTablet ? '90%' : '100%',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: rh(1.5),
    paddingHorizontal: rw(4),
    borderRadius: rw(4),
    backgroundColor: COLORS.white,
    marginBottom: rh(1.2),
  },

  cardSelected: {
    backgroundColor: '#DFF5F8',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  cardTitle: {
    fontSize: isTablet ? rf(2.3) : rf(2.1),
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  cardDescription: {
    fontSize: isTablet ? rf(2.0) : rf(1.8),
    color: COLORS.textSecondary,
    marginTop: rh(0.5),
  },

  radioOuter: {
    width: isTablet ? rw(3.5) : rw(5),
    height: isTablet ? rw(3.5) : rw(5),
    borderRadius: 999,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioInner: {
    width: isTablet ? rw(1.8) : rw(2.5),
    height: isTablet ? rw(1.8) : rw(2.5),
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },

  button: {
    position: 'absolute',
    bottom: rh(5),
    left: isTablet ? rw(15) : rw(5),
    right: isTablet ? rw(15) : rw(5),
    backgroundColor: COLORS.primary,
    paddingVertical: rh(2),
    borderRadius: rw(8),
    alignItems: 'center',
  },

  buttonText: {
    color: COLORS.white,
    fontSize: rf(2.2),
    fontWeight: '600',
  },
});