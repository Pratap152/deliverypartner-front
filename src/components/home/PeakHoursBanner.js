// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

// const PeakHoursBanner = () => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Peak Hour Bonus</Text>
//       <Text style={styles.subtitle}>
//         Earn more during busy delivery times
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#0EA5E9',
//     borderRadius: wp('4%'),
//     padding: wp('4%'),
//     marginTop: wp('3%'),
//   },
//   title: {
//     fontSize: wp('4%'),
//     fontWeight: '700',
//     color: '#FFFFFF',
//   },
//   subtitle: {
//     fontSize: wp('3.4%'),
//     color: '#E0F2FE',
//     marginTop: 6,
//   },
// });

// export default PeakHoursBanner;
import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const PeakHourBonusBanner = () => {
  const navigation=useNavigation();
  return (
    <LinearGradient
      colors={['#0EA5E9', '#0284C7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* LEFT CONTENT */}
      <View style={styles.leftContent}>
        <Text style={styles.title}>
          Peak Hour Bonus – Earn{'\n'}More During Busy Times
        </Text>

        <Text style={styles.subtitle}>
          Complete orders between 7 PM – 10 PM and earn extra rewards
        </Text>

        <TouchableOpacity activeOpacity={0.85} style={styles.button} onPress={()=>navigation.navigate('PeakHourBonusScreen')}>
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default memo(PeakHourBonusBanner);
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: wp('4%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: wp('5%'),
    alignItems: 'center',
    marginTop: wp('4%'),
  },

  leftContent: {
    flex: 1,
    paddingRight: wp('2%'),
  },

  title: {
    fontSize: wp('4.3%'),
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: wp('5.5%'),
  },

  subtitle: {
    fontSize: wp('3.2%'),
    color: '#E0F2FE',
    marginTop: wp('2%'),
    lineHeight: wp('4.5%'),
  },

  button: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: wp('4%'),
    paddingVertical: wp('2%'),
    borderRadius: wp('6%'),
    marginTop: wp('3%'),
  },

  buttonText: {
    color: '#0284C7',
    fontSize: wp('3.2%'),
    fontWeight: '600',
  },

  image: {
    width: wp('30%'),
    height: wp('26%'),
  },
});
