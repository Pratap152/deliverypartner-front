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

const RulesCard = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={onPress}>

      <View style={styles.leftContainer}>

        <View style={styles.iconContainer}>
          <Ionicons
            name="document-text-outline"
            size={24}
            color="#1F3365"
          />
        </View>

        <View>
          <Text style={styles.title}>
            Attendance Rules
          </Text>

          <Text style={styles.subtitle}>
            View attendance policy and rules
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

export default RulesCard;

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: responsiveHeight(2),
    marginBottom: 18,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

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
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  title: {
    fontSize: responsiveFontSize(1.9),
    fontWeight: '700',
    color: '#1F3365',
  },

  subtitle: {
    marginTop: 3,
    fontSize: responsiveFontSize(1.6),
    color: '#7A7A7A',
  },

});