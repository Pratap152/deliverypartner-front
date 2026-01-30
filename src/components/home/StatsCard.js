// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';


// const StatsCard = ({ value, label }) => (
//   <View style={styles.card}>
//     <Text style={styles.value}>{value}</Text>
//     <Text style={styles.label}>{label}</Text>
//   </View>
// );

// const styles = StyleSheet.create({
//   card: {
//     width: wp('28%'),
//     backgroundColor: '#fff',
//     borderRadius: wp('4%'),
//     padding: wp('4%'),
//     alignItems: 'center',
//   },
//   value: {
//     fontSize: wp('4.5%'),
//     fontWeight: '700',
//   },
//   label: {
//     fontSize: wp('3.2%'),
//     marginTop: wp('1%'),
//   },
// });

// export default React.memo(StatsCard);
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import EarningsScreen from '../../screens/dashboard/EarningsScreen';
import SlotHistory from '../../screens/profile/SlotHistory';
import OrderHistory from '../../screens/profile/OrderHistory';
import EarningsNavigator from '../../navigation/EarningsNavigator';

const StatItem = ({ icon, value, label, bgColor, screen }) => {
 const navigation = useNavigation();
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={()=>navigation.navigate(screen)}>
      <View style={[styles.iconWrapper, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={wp('5%')} color="#fff" />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

const StatsCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <StatItem
          icon="trending-up"
          value="₹842"
          label="Earnings"
          bgColor="#2ECC71" // green
          screen={EarningsNavigator}

        />
        <StatItem
          icon="time-outline"
          value="4h 23m"
          label="Online"
          bgColor="#8E7CF3" // purple
          screen={SlotHistory}
        />
        <StatItem
          icon="cart-outline"
          value="12"
          label="Orders"
          bgColor="#FF6FAE" // pink
          screen={OrderHistory}
        />
      </View>
    </View>
  );
};

export default React.memo(StatsCard);
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp('2%'),
    marginTop: wp('4%'),
  },
  title: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: '#111',
    marginBottom: wp('4%'),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp('3%'),
  },
  card: {
    width: wp('28%'),
    backgroundColor: '#FFFFFF',
    borderRadius: wp('4%'),
    paddingVertical: wp('4%'),
    alignItems: 'center',

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,

    // Android shadow
    elevation: 4,
  },
  iconWrapper: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: wp('3%'),
  },
  value: {
    fontSize: wp('4.3%'),
    fontWeight: '700',
    color: '#111',
  },
  label: {
    fontSize: wp('3.2%'),
    color: '#8E8E93',
    marginTop: wp('1%'),
  },
});
