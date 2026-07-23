import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const isTablet = DeviceInfo.isTablet();

const HeaderBar = ({ title = 'Joining Bonus', onBack }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}>
      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBack}
          style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={isTablet ? 30 : 24}
            color="#FFF"
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          {title}
        </Text>
      </View>
    </View>
  );
};

export default memo(HeaderBar);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#233B71',
    borderBottomLeftRadius: isTablet ? 42 : 28,
    borderBottomRightRadius: isTablet ? 42 : 28,
    paddingHorizontal: isTablet ? 34 : 20,
    paddingBottom: isTablet ? 120 : 90,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: isTablet ? 24 : 10,
  },

  backButton: {
    marginRight: isTablet ? 24 : 16,
  },

  title: {
    color: '#FFF',
    fontSize: isTablet ? 32 : 24,
    fontWeight: '700',
  },
});