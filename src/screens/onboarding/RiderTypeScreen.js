
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

import { COLORS } from '../../utils/colors';
import apiClient from '../../services/ApiClient';

import Svg, { Path } from 'react-native-svg';

const RiderTypeScreen = ({ navigation }) => {
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

      if (selectedType === 'INDIVIDUAL_EMPLOYEE') {
        navigation.navigate('SelectCityScreen');
      } else if (selectedType === 'COMPANY_EMPLOYEE') {
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
        style={[
          styles.card,
          isSelected && styles.cardSelected,
        ]}
        onPress={() => setSelectedType(item.id)}
        activeOpacity={0.8}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{item.label}</Text>
          <Text style={styles.cardDescription}>
            {item.description}
          </Text>
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
      <Image
        source={require('../../assets/RiderType.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.waveContainer}>

        <Svg
          height={rh(90)}
          width="100%"
          viewBox="0 50 130 240"
        >
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

      {/* BUTTON */}
      <TouchableOpacity
        style={[
          styles.button,
          { opacity: selectedType ? 1 : 0.5 },
        ]}
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

  image: {
    width: rw(95),
    height: rh(40),
    alignSelf: 'center',
    marginTop: rh(6),
  },

  waveContainer: {
    position: 'absolute',
    top: rh(13),
    width: '100%',
  },

  bottomContent: {
    marginTop: rh(2),
    paddingHorizontal: rw(5),
  },

  title: {
    fontSize: rf(2.5),
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginVertical: rh(3),
  },

  optionsWrapper: {
    marginTop: rh(1),
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: rw(4),
    borderRadius: rw(4),
    backgroundColor: COLORS.white,
    marginBottom: rh(2),
  },

  cardSelected: {
    backgroundColor: '#DFF5F8',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  cardTitle: {
    fontSize: rf(2.1),
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  cardDescription: {
    fontSize: rf(1.8),
    color: COLORS.textSecondary,
    marginTop: rh(0.5),
  },

  radioOuter: {
    width: rw(5),
    height: rw(5),
    borderRadius: rw(5),
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioInner: {
    width: rw(2.5),
    height: rw(2.5),
    borderRadius: rw(2.5),
    backgroundColor: COLORS.primary,
  },

  button: {
    position: 'absolute',
    bottom: rh(5),
    left: rw(5),
    right: rw(5),
    backgroundColor: COLORS.primary,
    paddingVertical: rh(2),
    borderRadius: rw(3),
    alignItems: 'center',
  },

  buttonText: {
    color: COLORS.white,
    fontSize: rf(2.2),
    fontWeight: '600',
  },
});