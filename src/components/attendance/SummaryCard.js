import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

const SummaryCard = ({ onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
      onPress={onPress}>

      <View style={styles.leftContainer}>

        <View style={styles.iconContainer}>
          <Ionicons
            name="stats-chart-outline"
            size={24}
            color="#2E7D32"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Monthly Summary
          </Text>

          <Text style={styles.subtitle}>
            View attendance statistics for this month
          </Text>
        </View>

      </View>

      <Ionicons
        name="chevron-forward"
        size={24}
        color="#1F3365"
      />

    </TouchableOpacity>
  );
};

export default SummaryCard;

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: responsiveHeight(2),

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: responsiveHeight(3),

    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: responsiveFontSize(1.9),
    fontWeight: '700',
    color: '#1F3365',
  },

  subtitle: {
    marginTop: 4,
    fontSize: responsiveFontSize(1.6),
    color: '#7A7A7A',
    lineHeight: 20,
  },

});