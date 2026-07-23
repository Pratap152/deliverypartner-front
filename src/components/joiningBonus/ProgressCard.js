import React, {memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const isTablet = DeviceInfo.isTablet();

const ProgressCard = ({data}) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={{flex: 1}}>
          <Text style={styles.title}>
            {data.title}
          </Text>

          <Text style={styles.subtitle}>
            {data.subtitle}
          </Text>
        </View>

        <Image
          source={require('../../assets/gift.png')}
          style={styles.gift}
        />
      </View>

      <View style={styles.progressRow}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${data.percentage}%`,
              },
            ]}
          />
        </View>

        <Text style={styles.percent}>
          {data.percentage}%
        </Text>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.infoBox}>
          <Text style={styles.label}>
            {data.label}
          </Text>

          <Text style={styles.value}>
            {data.countText}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoBox}>
          <Text style={styles.label}>
            Reward
          </Text>

          <Text style={styles.reward}>
            ₹{data.reward}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default memo(ProgressCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: isTablet ? 32 : 18,
    marginTop: isTablet ? -80 : -70,
    borderRadius: isTablet ? 24 : 14,
    padding: isTablet ? 30 : 20,
    elevation: 5,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: isTablet ? 30 : 20,
    fontWeight: '700',
    color: '#111',
  },

  subtitle: {
    marginTop: 8,
    fontSize: isTablet ? 20 : 14,
    color: '#555',
    lineHeight: isTablet ? 30 : 20,
  },

  gift: {
    width: isTablet ? 100 : 70,
    height: isTablet ? 100 : 70,
    resizeMode: 'contain',
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
  },

  progressBackground: {
    flex: 1,
    height: 8,
    borderRadius: 10,
    backgroundColor: '#DDD',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#1B2A5B',
  },

  percent: {
    marginLeft: 12,
    fontWeight: '700',
    fontSize: isTablet ? 24 : 18,
  },

  bottomRow: {
    flexDirection: 'row',
    marginTop: 24,
    alignItems: 'center',
  },

  infoBox: {
    flex: 1,
  },

  label: {
    color: '#666',
    fontSize: isTablet ? 18 : 13,
  },

  value: {
    marginTop: 8,
    fontSize: isTablet ? 34 : 24,
    fontWeight: '700',
  },

  reward: {
    marginTop: 8,
    fontSize: isTablet ? 34 : 24,
    fontWeight: '700',
    color: '#1B2A5B',
  },

  divider: {
    width: 1,
    height: 60,
    backgroundColor: '#DDD',
    marginHorizontal: 16,
  },
});