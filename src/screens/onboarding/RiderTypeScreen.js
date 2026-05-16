import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';

import DeviceInfo from 'react-native-device-info';
import { COLORS } from '../../utils/colors';
import apiClient from '../../services/ApiClient';
import Svg, { Path } from 'react-native-svg';

const isTablet = DeviceInfo.isTablet();

const CONTENT_MAX_WIDTH = 700; // max card area width on tablet
const H_PADDING = isTablet ? 40 : rw(5);

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
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => setSelectedType(item.id)}
        activeOpacity={0.8}
      >
        {/* Radio on the LEFT so it never overlaps text */}
        <View
          style={[
            styles.radioOuter,
            isSelected && { borderColor: COLORS.primary },
          ]}
        >
          {isSelected && <View style={styles.radioInner} />}
        </View>

        <View style={styles.cardTextBlock}>
          <Text style={styles.cardTitle}>{item.label}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Wave sits behind everything */}
      <View style={styles.waveContainer} pointerEvents="none">
        <Svg height={rh(90)} width="100%" viewBox="0 50 130 240">
          <Path
            fill="#e0f9f8"
            d="M0,150C200,80,900,220,720,170C1040,140,1240,200,1440,180V320H0Z"
          />
        </Svg>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('../../assets/RiderType.png')}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Centred content card */}
        <View style={styles.contentBox}>
          <Text style={styles.title}>Select your rider type</Text>

          <View style={styles.optionsWrapper}>
            {riderTypes.map(renderOption)}
          </View>

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
      </ScrollView>
    </View>
  );
};

export default RiderTypeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  waveContainer: {
    position: 'absolute',
    top: rh(13),
    left: 0,
    right: 0,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    alignItems: 'center',
    paddingBottom: 40,
  },

  image: {
    width: isTablet ? '55%' : rw(95),
    height: isTablet ? rh(32) : rh(40),
    marginTop: rh(6),
  },

  contentBox: {
    width: isTablet ? CONTENT_MAX_WIDTH : '100%',
    alignSelf: 'center',
    paddingHorizontal: H_PADDING,
    paddingTop: isTablet ? 30 : 0,
  },

  title: {
    fontSize: isTablet ? 26 : rf(2.5),
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginVertical: rh(3),
  },

  optionsWrapper: {
    width: '100%',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isTablet ? 16 : 12,
    paddingVertical: isTablet ? 20 : rh(2),
    paddingHorizontal: isTablet ? 20 : rw(4),
    borderRadius: isTablet ? 16 : rw(4),
    backgroundColor: COLORS.white,
    marginBottom: rh(2),
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },

  cardSelected: {
    backgroundColor: '#DFF5F8',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  cardTextBlock: {
    flex: 1,
  },

  cardTitle: {
    fontSize: isTablet ? 20 : rf(2.1),
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  cardDescription: {
    fontSize: isTablet ? 15 : rf(1.8),
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: isTablet ? 22 : undefined,
  },

  radioOuter: {
    width: isTablet ? 26 : rw(5),
    height: isTablet ? 26 : rw(5),
    borderRadius: isTablet ? 13 : rw(5),
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  radioInner: {
    width: isTablet ? 13 : rw(2.5),
    height: isTablet ? 13 : rw(2.5),
    borderRadius: isTablet ? 7 : rw(2.5),
    backgroundColor: COLORS.primary,
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: isTablet ? 18 : rh(2),
    borderRadius: isTablet ? 40 : rw(8),
    alignItems: 'center',
    marginTop: rh(2),
  },

  buttonText: {
    color: COLORS.white,
    fontSize: isTablet ? 20 : rf(2.2),
    fontWeight: '600',
  },
});