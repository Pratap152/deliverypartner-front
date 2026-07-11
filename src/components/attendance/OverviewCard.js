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

const OverviewCard = ({
  estimatedSalary = 0,
  presentDays = 0,
  workingHours = 0,
}) => {

  const cards = [
    {
      title: 'Salary',
      value: `₹${Number(estimatedSalary).toLocaleString('en-IN')}`,
      icon: 'wallet-outline',
      color: '#2E7D32',
      bg: '#E8F5E9',
    },
    {
      title: 'Present',
      value: `${presentDays} Days`,
      icon: 'checkmark-circle-outline',
      color: '#1565C0',
      bg: '#E3F2FD',
    },
    {
      title: 'Hours',
      value: `${workingHours}`,
      icon: 'time-outline',
      color: '#EF6C00',
      bg: '#FFF3E0',
    },
  ];

  return (
    <View style={styles.container}>
      {cards.map((item, index) => (
        <View
          key={index}
          style={styles.card}>

          <View
            style={[
              styles.iconContainer,
              { backgroundColor: item.bg },
            ]}>
            <Ionicons
              name={item.icon}
              size={24}
              color={item.color}
            />
          </View>

          <Text
            numberOfLines={1}
            style={styles.title}>
            {item.title}
          </Text>

          <Text
            numberOfLines={2}
            style={styles.value}>
            {item.value}
          </Text>

        </View>
      ))}
    </View>
  );
};

export default OverviewCard;

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  card: {
    width: '31.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: responsiveHeight(2),
    alignItems: 'center',

    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: responsiveFontSize(1.6),
    color: '#7A7A7A',
    fontWeight: '600',
  },

  value: {
    marginTop: 6,
    fontSize: responsiveFontSize(1.9),
    fontWeight: '700',
    color: '#1F3365',
    textAlign: 'center',
    paddingHorizontal: 5,
  },

});