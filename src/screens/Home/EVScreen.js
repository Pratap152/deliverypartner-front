import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

const MIN_KM = 10;
const MAX_KM = 200;

const PETROL_COST_PER_LITRE = 100;
const PETROL_MILEAGE = 45; // km/litre
const EV_COST_PER_UNIT = 5;
const EV_KM_PER_UNIT = 50; // km/unit

const { width } = Dimensions.get('window');

const isTablet = width >= 768;

const scale = isTablet ? 1.35 : 1;

const EVScreen = () => {
  const [currentKm, setCurrentKm] = useState(50);

  const {petrolCost, evCost, savings} = useMemo(() => {
    const monthlyKm = currentKm * 30;

    const petrol = Math.round(
      (monthlyKm / PETROL_MILEAGE) * PETROL_COST_PER_LITRE,
    );

    const ev = Math.round(
      (monthlyKm / EV_KM_PER_UNIT) * EV_COST_PER_UNIT,
    );

    return {
      petrolCost: petrol,
      evCost: ev,
      savings: petrol - ev,
    };
  }, [currentKm]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>
          Calculate your{' '}
          <Text style={styles.greenText}>Monthly Savings</Text>
          {'\n'}
          while using Electric 2 Wheeler!
        </Text>

        <View style={styles.card}>
          {/* Top Section */}
          <View style={styles.topSection}>
            <Text style={styles.driveTitle}>
              Avg Drive Per Day
            </Text>

            <View style={styles.sliderRow}>
              <View style={styles.sliderContainer}>
                <Slider
                  minimumValue={MIN_KM}
                  maximumValue={MAX_KM}
                  step={1}
                  value={currentKm}
                  onValueChange={setCurrentKm}
                  minimumTrackTintColor="#8BC53F"
                  maximumTrackTintColor="#D3D3D3"
                  thumbTintColor="#8BC53F"
                />

                <View style={styles.rangeRow}>
                  <Text style={styles.rangeText}>
                    {MIN_KM} km
                  </Text>

                  <Text style={styles.rangeText}>
                    {MAX_KM} km
                  </Text>
                </View>
              </View>

              <View style={styles.kmBox}>
                <Text style={styles.kmValue}>
                  {currentKm}
                </Text>
                <Text style={styles.kmText}>km</Text>
              </View>
            </View>
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <Text style={styles.savingTitle}>
              Your total Savings
            </Text>

            <Text style={styles.perMonth}>
              Per Month
            </Text>

            <Text style={styles.amount}>
              ₹{savings}
            </Text>

            <View style={styles.separator} />

            <View style={styles.row}>
              <Text style={styles.label}>
                Petrol Cost / Month
              </Text>

              <View style={styles.right}>
                <Text style={styles.value}>
                  ₹{petrolCost}
                </Text>

                <Text style={styles.note}>
                  Avg petrol cost ₹100/Litre
                </Text>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                EV Cost / Month
              </Text>

              <View style={styles.right}>
                <Text style={styles.value}>
                  ₹{evCost}
                </Text>

                <Text style={styles.note}>
                  Avg Electricity cost ₹5/Unit
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EVScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },

  content: {
  padding: isTablet ? 32 : 20,
  alignItems: 'center',
},

  heading: {
  width: '100%',
  maxWidth: isTablet ? 800 : '100%',
  fontSize: 26 * scale,
  fontWeight: '700',
  color: '#222',
  lineHeight: 36 * scale,
  marginBottom: isTablet ? 30 : 20,
},

  greenText: {
    color: '#8BC53F',
  },

  card: {
  backgroundColor: '#fff',
  borderRadius: 22,
  overflow: 'hidden',
  elevation: 5,
  width: '100%',
  maxWidth: isTablet ? 800 : '100%',
},

 topSection: {
  backgroundColor: '#DDF2B5',
  padding: isTablet ? 30 : 20,
},

  driveTitle: {
  textAlign: 'center',
  fontSize: 22 * scale,
  fontWeight: '700',
  marginBottom: isTablet ? 28 : 20,
},

  sliderRow: {
  flexDirection: 'row',
  alignItems: 'center',
},

  sliderContainer: {
  flex: 1,
  marginRight: isTablet ? 25 : 15,
},

  kmBox: {
  width: isTablet ? 110 : 75,
  height: isTablet ? 110 : 75,
  borderRadius: 16,
  backgroundColor: '#8BC53F',
  justifyContent: 'center',
  alignItems: 'center',
},

  kmValue: {
  color: '#fff',
  fontSize: isTablet ? 42 : 28,
  fontWeight: '700',
},

  kmText: {
  color: '#fff',
  fontSize: isTablet ? 22 : 18,
  fontWeight: '600',
},
  rangeRow: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  rangeText: {
  fontSize: isTablet ? 18 : 14,
  color: '#555',
},

  bottomSection: {
  padding: isTablet ? 32 : 22,
},

 savingTitle: {
  textAlign: 'center',
  fontSize: isTablet ? 30 : 22,
  color: '#666',
},

  perMonth: {
  textAlign: 'center',
  fontSize: isTablet ? 34 : 26,
  fontWeight: '700',
  color: '#444',
  marginTop: 8,
},

  amount: {
  textAlign: 'center',
  fontSize: isTablet ? 72 : 50,
  fontWeight: '800',
  color: '#444',
  marginVertical: isTablet ? 30 : 20,
},

  separator: {
    height: 1,
    backgroundColor: '#ECECEC',
    marginBottom: 20,
  },

  row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: isTablet ? 35 : 25,
},

  label: {
  flex: 1,
  fontSize: isTablet ? 24 : 18,
  color: '#555',
},

  right: {
    alignItems: 'flex-end',
  },

  value: {
  fontSize: isTablet ? 32 : 24,
  fontWeight: '700',
  color: '#333',
},

  note: {
  marginTop: 6,
  fontSize: isTablet ? 16 : 12,
  color: '#888',
},
});