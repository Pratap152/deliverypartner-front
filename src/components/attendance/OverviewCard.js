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
      bg: '#F1FAF3',
      border: '#D5EFD9',
    },
    {
      title: 'Present',
      value: `${presentDays} Days`,
      icon: 'checkmark-circle-outline',
      color: '#1565C0',
      bg: '#F2F8FE',
      border: '#D5E7FB',
    },
    {
      title: 'Hours',
      value: `${workingHours}`,
      icon: 'time-outline',
      color: '#EF6C00',
      bg: '#FFF8EF',
      border: '#FFE1BE',
    },
  ];
  return (
    <View style={styles.container}>
      {cards.map((item, index) => (
        <View
          key={index}
          style={[
            styles.card,
            {
              borderColor: item.border,
            },
          ]}>

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
    borderRadius: 18,
    paddingVertical: responsiveHeight(2.2),
    alignItems: 'center',

    borderWidth: 1,

    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  title: {
    fontSize: responsiveFontSize(1.45),
    color: '#8A94A6',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  value: {
    marginTop: 8,
    fontSize: responsiveFontSize(2.05),
    fontWeight: '700',
    color: '#1F3365',
    textAlign: 'center',
    paddingHorizontal: 6,
  },
});