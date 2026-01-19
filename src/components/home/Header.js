
// import { Image } from '@shopify/react-native-skia';
// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';
// import ProfileNavigator from '../../navigation/ProfileNavigator';

// const Header = () => {
//   const navigation = useNavigation();
//   return (
//     <View style={styles.container}>
//       {/* Left Section */}
//       <View style={styles.left}>
//         <View style={styles.profileIcon}>
//           <TouchableOpacity onPress={()=>navigation.navigate(ProfileNavigator)}>
//           <Ionicons name="person-outline" size={18} color="#1F2937"  />
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.name}>Rajesh</Text>
//       </View>

//       {/* Right Section */}
//       <View style={styles.right}>
//         <TouchableOpacity style={styles.location}>
//           <Ionicons name="location-outline" size={14} color="#374151" />
//           <Text style={styles.locationText}>Hyderabad</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.help}>
//           {/* <Ionicons name="help-circle-outline" size={22} color="#1F2937" /> */}
      
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     height: wp('14%'),
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#F6FBFF',
//     paddingHorizontal: wp('5%'),
//   },

//   /* Left */
//   left: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   profileIcon: {
//     width: wp('9%'),
//     height: wp('9%'),
//     borderRadius: wp('4.5%'),
//     backgroundColor: '#E5F3FF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: wp('2.5%'),
//   },
//   name: {
//     fontSize: wp('4.2%'),
//     fontWeight: '600',
//     color: '#111827',
//   },

//   /* Right */
//   right: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   location: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#E5F3FF',
//     paddingHorizontal: wp('3%'),
//     paddingVertical: wp('1.2%'),
//     borderRadius: wp('5%'),
//     marginRight: wp('3%'),
//   },
//   locationText: {
//     fontSize: wp('3.2%'),
//     color: '#1F2937',
//     marginLeft: 4,
//     fontWeight: '500',
//   },
//   help: {
//     padding: wp('1%'),
//   },
// });

// export default Header;
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import ProfileNavigator from '../../navigation/ProfileNavigator';

const Header = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* LEFT SIDE */}
      <View style={styles.left}>
        <TouchableOpacity
          style={styles.profileWrapper}
          onPress={() => navigation.navigate(ProfileNavigator)}
        >
          <Image
            source={require('../../assets/profile.png')}
            style={styles.profileIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.name}>Rajesh</Text>
      </View>

      {/* RIGHT SIDE */}
      <View style={styles.right}>
        <TouchableOpacity style={styles.rightIconWrapper}>
          <Image
            source={require('../../assets/Location.png')}
            style={styles.rightIcons}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.rightIconWrapper}>
          <Image
            source={require('../../assets/help.png')}
            style={styles.rightIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  /* HEADER */
  container: {
    height: wp('14%'),
    backgroundColor: '#F6FBFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: wp('2%'),
  },

  /* LEFT */
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: wp('4.4%'),
    fontWeight: '600',
    color: '#111827',
  },

  /* PROFILE ICON (BIGGER) */
  profileWrapper: {
    width: wp('11%'),
    height: wp('11%'),
    borderRadius: wp('5.5%'),
    backgroundColor: '#E5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
    marginTop: wp('1.5%'),
  },
  profileIcon: {
    width: wp('12.5%'),
    height: wp('12.5%'),
    marginTop: wp('0.5%'),
  },

  /* RIGHT ICONS (SLIGHTLY SMALLER) */
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightIconWrapper: {
    width: wp('11%'),
    height: wp('11%'),
    borderRadius: wp('4.75%'),
    backgroundColor: '#E5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp('3%'),
  },
  rightIcon: {
    width: wp('6.2%'),
    height: wp('6.2%'),
  },
  rightIcons: {
    width: wp('12.5%'),
    height: wp('12.5%'),
  },
});

export default Header;
