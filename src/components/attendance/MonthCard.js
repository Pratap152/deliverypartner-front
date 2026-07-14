import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const MonthCard = ({ month, year }) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthName =
    month >= 1 && month <= 12
      ? monthNames[month - 1]
      : '';

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name="calendar-outline"
          size={28}
          color="#1F3365"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.label}>Month</Text>

        <Text style={styles.month}>
          {monthName}
        </Text>

        <Text style={styles.year}>
          {year}
        </Text>
      </View>
    </View>
  );
};

export default MonthCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F3365',
    borderRadius: 20,
    paddingVertical: responsiveHeight(2.2),
    paddingHorizontal: responsiveWidth(5),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,

    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textContainer: {
    marginLeft: 16,
    flex: 1,
  },

  label: {
    color: '#D9E3F0',
    fontSize: responsiveFontSize(1.5),
    fontWeight: '500',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  month: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(2.5),
    fontWeight: '700',
  },

  year: {
    marginTop: 4,
    color: '#D9E3F0',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
  },
});