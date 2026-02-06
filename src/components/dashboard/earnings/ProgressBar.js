import React from 'react';
import { View, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function ProgressBar({ progress, accentColor }) {
  return (
    <View style={styles.track}>
      <View
        style={[
          styles.fill,
          {
            width: `${Math.min(progress, 100)}%`,
            backgroundColor: accentColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: hp(1),
    backgroundColor: '#E5E7EB',
    borderRadius: wp(2),
    overflow: 'hidden',
    marginTop: hp(1),
  },
  fill: {
    height: '100%',
    borderRadius: wp(2),
  },
});
