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
      <Ionicons
        name="calendar-outline"
        size={26}
        color="#1F3365"
      />

      <View style={styles.textContainer}>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,

    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  textContainer: {
    marginLeft: 14,
  },

  month: {
    fontSize: responsiveFontSize(2.3),
    fontWeight: '700',
    color: '#1F3365',
  },

  year: {
    marginTop: 2,
    fontSize: responsiveFontSize(1.8),
    color: '#7A7A7A',
    fontWeight: '500',
  },
});