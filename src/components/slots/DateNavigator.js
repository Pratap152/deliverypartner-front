import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dayjs from 'dayjs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

const DateNavigator = ({
  selectedDate,
  onPrevious,
  onNext,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={onPrevious}>
        <Ionicons
          name="chevron-back"
          size={22}
          color="#1F3365"
        />
      </TouchableOpacity>

      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>
          {dayjs(selectedDate).format('DD MMM YYYY')}
        </Text>

        <Text style={styles.dayText}>
          {dayjs(selectedDate).format('dddd')}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.arrowButton}
        onPress={onNext}>
        <Ionicons
          name="chevron-forward"
          size={22}
          color="#1F3365"
        />
      </TouchableOpacity>
    </View>
  );
};

export default DateNavigator;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp(4),
    marginTop: hp(1.5),
    marginBottom: hp(1),
    paddingVertical: hp(1.2),
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },

  arrowButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dateContainer: {
    alignItems: 'center',
    flex: 1,
  },

  dateText: {
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    color: '#1F3365',
  },

  dayText: {
    marginTop: hp(0.3),
    fontSize: responsiveFontSize(1.5),
    color: '#7A7A7A',
    fontWeight: '500',
  },
});