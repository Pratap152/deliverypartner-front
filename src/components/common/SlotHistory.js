import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');
const isTablet = width >= 768;

export default function SlotHistory() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.navigate('SlotHistoryScreen')}
      style={styles.slots_history}
    >
      <MaterialIcons
        name="history"
        size={isTablet ? 26 : 22}
        color="#374151"
        style={styles.icon}
      />

      <Text style={styles.historyText}>
        View Slots History
      </Text>

      <MaterialIcons
        name="keyboard-arrow-right"
        size={isTablet ? 30 : 24}
        color="#374151"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  slots_history: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#EEF6FF',

    width: isTablet ? '96%' : wp(94),
    height: isTablet ? 64 : 52,

    borderRadius: 14,

    marginTop: 16,
    marginBottom: 12,

    borderWidth: 1,
    borderColor: '#D7E8FF',

    paddingHorizontal: 16,

    shadowColor: '#2563EB',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },

  icon: {
    marginRight: 12,
  },

  historyText: {
    flex: 1,
    fontSize: isTablet ? 20 : 15,
    fontWeight: '600',
    color: '#374151',
  },
});