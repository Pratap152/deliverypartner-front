// import React, { memo } from 'react';
// import { View, Text, StyleSheet, Image } from 'react-native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';

// const DeliverToCard = ({ name, address }) => {
//   return (
//     <View style={styles.container}>
//       <View style={styles.iconWrapper}>
//         <Text style={styles.icon}>🏠</Text>
//       </View>

//       <View style={styles.textContainer}>
//         <Text style={styles.title}>Deliver To</Text>
//         <Text style={styles.name}>{name}</Text>
//         <Text style={styles.address}>{address}</Text>
//       </View>
//     </View>
//   );
// };

// export default memo(DeliverToCard);

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     borderRadius: wp('3%'),
//     padding: wp('3.5%'),
//     borderWidth: 1,
//     borderColor: '#E6E6E6',
//     marginBottom: hp('1.5%'),
//   },
//   iconWrapper: {
//     width: wp('12%'),
//     height: wp('12%'),
//     borderRadius: wp('4.5%'),
//     backgroundColor: '#E8F7F0',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: wp('3%'),
//     marginTop:20
//   },
//   icon: {
//     fontSize: wp('5.5%'),
//   },
//   textContainer: {
//     flex: 1,
//     padding: wp('2.5%'),
//   },
//   title: {
//     fontSize: wp('4.0%'),
//     color: '#1C1C1C',
//     fontWeight: '600',
//     marginBottom: hp('0.3%'),
//   },
//   name: {
//     fontSize: wp('3.6%'),
//     fontWeight: '600',
//     color: '#1C1C1C',
//   },
//   address: {
//     fontSize: wp('3.2%'),
//     color: '#6F6F6F',
//     marginTop: hp('0.3%'),
//     lineHeight: hp('2.2%'),
//   },
// });
