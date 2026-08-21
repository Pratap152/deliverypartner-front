import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SummaryItem from './SummaryItem';
import { formatMoney } from '../../../utils/formatMoney';
import { useNavigation } from '@react-navigation/native';

export default function MonthlySummaryCard({ summary, riderType }) {
  const navigation = useNavigation();

  const isIndividual = riderType === 'INDIVIDUAL_EMPLOYEE';
  const isZestBot = riderType === 'ZESTBOT_EMPLOYEE';

  const handlePress = () => {
    navigation.navigate('EarningsHistoryScreen', {
      mode: isIndividual ? 'MONTH' : 'TODAY',
    });
  };

  /*
   * INDIVIDUAL
   * ----------------
   * This Month:
   *   orders
   *   baseEarnings
   *   tips
   *   incentives
   *   total
   *
   * ZESTBOT
   * ----------------
   * Today:
   *   orders
   *   attendanceAmount -> Salary
   *   tips
   *   incentives
   *   total
   */

  const salary = isZestBot
    ? summary?.attendanceAmount ?? 0
    : summary?.baseEarnings ?? 0;

  const total = summary?.total ?? 0;
  const orders = summary?.orders ?? 0;
  const tips = summary?.tips ?? 0;
  const incentives = summary?.incentives ?? 0;

  const CardContent = () => (
    <LinearGradient
      colors={['#047D4D', '#23B484']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* =========================
          HEADER
      ========================= */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>
            {isIndividual ? 'This Month' : 'Today'}
          </Text>

          <Text style={styles.headerSub}>
            Summary
          </Text>
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>
            {isIndividual
              ? 'Total Earnings'
              : 'Total Earnings'}
          </Text>

          <Text style={styles.totalValue}>
            ₹{formatMoney(total)}
          </Text>
        </View>
      </View>

      {/* =========================
          METRICS
      ========================= */}
      <View style={styles.metrics}>

        {/* ROW 1 */}
        <View style={styles.metricRow}>
          <SummaryItem
            label="Orders"
            value={orders}
          />

          <SummaryItem
            label={isZestBot ? 'Salary' : 'Base Earnings'}
            value={`₹${formatMoney(salary)}`}
          />
        </View>

        {/* ROW 2 */}
        <View
          style={[
            styles.metricRow,
            { marginTop: hp(1) },
          ]}
        >
          <SummaryItem
            label="Tips"
            value={`₹${formatMoney(tips)}`}
          />

          <SummaryItem
            label="Incentives"
            value={`₹${formatMoney(incentives)}`}
          />
        </View>
      </View>
    </LinearGradient>
  );

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.pressed,
        ]}
      >
        <CardContent />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: wp(95),
    alignSelf: 'center',
    marginTop: hp(2),
  },

  pressable: {
    borderRadius: wp(4),
  },

  pressed: {
    transform: [{ scale: 0.985 }],
  },

  card: {
    borderRadius: wp(4),
    padding: wp(4),

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 18,
        shadowOffset: {
          width: 0,
          height: 10,
        },
      },

      android: {
        elevation: 8,
      },
    }),
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: wp(5),
    fontWeight: '700',
  },

  headerSub: {
    color: '#E6F5FF',
    fontSize: wp(4),
    marginTop: hp(0.4),
  },

  totalBox: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: wp(3),
    borderRadius: wp(2),
    alignItems: 'flex-start',
    maxWidth: wp(48),
  },

  totalLabel: {
    color: '#E8FDFB',
    fontSize: wp(3.5),
    fontWeight: '500',
  },

  totalValue: {
    color: '#fff',
    fontSize: wp(5),
    fontWeight: '800',
    marginTop: hp(0.3),
  },

  metrics: {
    marginTop: hp(2),
  },

  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});