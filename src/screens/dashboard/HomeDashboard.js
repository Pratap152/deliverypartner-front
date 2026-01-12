// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
// } from "react-native";
// import { useState,useEffect } from "react";
// // import IncentiveDetails from "../Home/IncentiveDetails";
// // import SwipeOnlineOffline from '../Home/SwipeOnlineOffline';
// // import SwipeOnlineToggle from "../../screens/Home/SwipeOnlineToggle";
// // import { checkLocationPermission } from "../../utils/locationPermissions";
// export default function HomeDashboard({navigation}) {
 

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.userName}>Rajesh</Text>
//         <Text style={styles.icon}>📍 🔔</Text>
//       </View>

     
//       {/* <SwipeOnlineOffline isOnline={isOnline} setIsOnline={setIsOnline} /> */}
 
//       {/* Add Bank Details */}
//       <View style={styles.bankCard}>
//         <Text style={styles.bankTitle}>Add Bank Details</Text>
//         <Text style={styles.bankDesc}>
//           Complete your profile to receive instant payouts
//         </Text>
//         <TouchableOpacity style={styles.primaryBtn} onPress={()=>{navigation.navigate('AddBankDetails')}}>
//           <Text style={styles.btnText}>Complete Now →</Text>
//         </TouchableOpacity>
//       </View>
 
//       {/* Today's Progress */}
//       <Text style={styles.sectionTitle}>Today's Progress</Text>
//       <View style={styles.progressRow}>
//         <ProgressCard title="Earnings" value="₹842" />
//         <ProgressCard title="Online" value="4h 23m" />
//         <ProgressCard title="Orders" value="12" />
//       </View>
//       {/* Refer & Earn */}
//        <View style={styles.banner}>
//           <TouchableOpacity onPress={()=>{navigation.navigate("ReferEarn")}}>
//             <Text>Navigate to Refer Earn Screen</Text>
//       </TouchableOpacity>
//        </View>
//        <View style={styles.banner}>
//           <TouchableOpacity onPress={()=>{navigation.navigate('HelpCenterList')}}>
//             <Text>Navigate to Help & Support </Text>
//       </TouchableOpacity>
//        </View>
//         <View style={styles.banner}>
//           <TouchableOpacity onPress={()=>{navigation.navigate('LiveTracking')}}>
//             <Text>Navigate to Maps </Text>
//       </TouchableOpacity>
//        </View>

//        <View style={styles.banner} >
//         <TouchableOpacity onPress={()=>{navigation.navigate('ReportIssue')}}>
//           <Text>Navigate to Report Issue Screen</Text>
//         </TouchableOpacity>
//        </View>
//         {/* <View style={styles.banner} >
//         <TouchableOpacity onPress={()=>{navigation.navigate('CustomerNotResponding')}}>
//           <Text>Navigate to Customer Not Responding</Text>
//         </TouchableOpacity>
//        </View> */}
//        SuccessfullDelivered 
//  {/* <View style={styles.banner} >
//         <TouchableOpacity onPress={()=>{navigation.navigate('SuccessfullDelivered')}}>
//           <Text>Navigate to SuccessfullDelivered</Text>
//         </TouchableOpacity>
//        </View> */}
//       {/* Active Shift */}
//       <View style={styles.shiftCard}>
//         <Text style={styles.shiftTitle}>Active Shift</Text>
//         <Text style={styles.shiftTime}>Evening Peak • 6:00 PM - 11:00 PM</Text>
//         <TouchableOpacity style={styles.whiteBtn}>
//           <Text style={styles.darkText}>Book Now and Go Online</Text>
//         </TouchableOpacity>
//       </View>
 
//       {/* Peak Hour Bonus */}
//        {/* <View style={styles.banner}>
//           <TouchableOpacity onPress={()=>{navigation.navigate("IncentiveDetails")}}>
//             <Text>Navigate to IncentiveDetails Screen</Text>
//       </TouchableOpacity>
//        </View> */}
//      {/* <View style={styles.banner}>
//           <TouchableOpacity onPress={()=>{navigation.navigate("OrderDetailsScreen")}}>
//             <Text>Navigate to OrderDetailsScreen</Text>
//       </TouchableOpacity>
//        </View> */}
//        <View style={styles.banner}>
//           <TouchableOpacity onPress={()=>{navigation.navigate("OrderPopupScreen")}}>
//             <Text>Navigate to OrderPopupScreen</Text>
//       </TouchableOpacity>
//        </View>
//       {/* Weekly Summary */}
//       <View style={styles.weekCard}>
//         <Text style={styles.weekTitle}>This Week</Text>
//         <Text>Total Earnings: ₹6,420</Text>
//         <Text>Orders Delivered: 48</Text>
//         <Text>Online Hours: 32h 15m</Text>
//       </View>
//     </ScrollView>
//   );
// }
 
// const ProgressCard = ({ title, value }) => (
//   <View style={styles.progressCard}>
//     <Text style={styles.progressValue}>{value}</Text>
//     <Text style={styles.progressTitle}>{title}</Text>
//   </View>
// );
 
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F6FEFF",
//     padding: 16,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 16,
//   },
//   userName: {
//     fontSize: 20,
//     fontWeight: "700",
//   },
//   icon: {
//     fontSize: 18,
//   },
//   swipeBox: {
//     backgroundColor: "#EAEAEA",
//     padding: 18,
//     borderRadius: 30,
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   swipeText: {
//     color: "#999",
//     fontWeight: "600",
//   },
//   bankCard: {
//     backgroundColor: "#FFE8C8",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 20,
//   },
//   bankTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//   },
//   bankDesc: {
//     marginVertical: 6,
//     color: "#555",
//   },
//   primaryBtn: {
//     backgroundColor: "#FF8C1A",
//     padding: 10,
//     borderRadius: 10,
//     alignSelf: "flex-start",
//     marginTop: 10,
//   },
//   btnText: {
//     color: "#fff",
//     fontWeight: "600",
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginBottom: 12,
//   },
//   progressRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   progressCard: {
//     backgroundColor: "#fff",
//     width: "30%",
//     padding: 12,
//     borderRadius: 14,
//     alignItems: "center",
//   },
//   progressValue: {
//     fontSize: 18,
//     fontWeight: "700",
//   },
//   progressTitle: {
//     color: "#777",
//     marginTop: 4,
//   },
//   banner: {
//     backgroundColor: "#4CC9C0",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//   },
//   bannerTitle: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "700",
//   },
//   bannerSub: {
//     color: "#EFFFFD",
//     marginTop: 4,
//   },
//   shiftCard: {
//     backgroundColor: "#6C63FF",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//   },
//   shiftTitle: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "700",
//   },
//   shiftTime: {
//     color: "#EDEBFF",
//     marginVertical: 8,
//   },
//   whiteBtn: {
//     backgroundColor: "#fff",
//     padding: 10,
//     borderRadius: 10,
//     marginTop: 8,
//   },
//   darkText: {
//     fontWeight: "600",
//     textAlign: "center",
//   },
//   weekCard: {
//     backgroundColor: "#DFFFEA",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 30,
//   },
//   weekTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     marginBottom: 8,
//   },
// });
 
// import React, { useState } from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import BannerCarousel from '../../components/home/BannerCarousel';
// import SwipeAction from '../../components/home/SwipeAction';
// import StatsCard from '../../components/home/StatsCard';
// import { banners, todayStats, weeklyStats } from '../../components/home/data/home.mock';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const HomeDashboard = () => {
//   const [isOnline, setIsOnline] = useState(false);

//   return (
                               
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {!isOnline && (
//         <>
//           <SwipeAction
//             label="Swipe For Online"
//             backgroundColor="#2ECC71"
//             onSwipeSuccess={() => setIsOnline(true)}
//           />

//           <View style={styles.carouselWrapper}>
//             <BannerCarousel data={banners} />
//           </View>
//         </>
//       )}

//       {isOnline && (
//         <SwipeAction
//           label="Swipe For Offline"
//           backgroundColor="#636E72"
//           onSwipeSuccess={() => setIsOnline(false)}
//         />
//       )}

//       <Text style={styles.sectionTitle}>Today's Progress</Text>
//       <View style={styles.statsRow}>
//         {todayStats.map(item => (
//           <StatsCard key={item.id} {...item} />
//         ))}
//       </View>

//       <View style={styles.weekCard}>
//         <Text style={styles.weekTitle}>This Week</Text>
//         <Text>Earnings: {weeklyStats.earnings}</Text>
//         <Text>Orders: {weeklyStats.orders}</Text>
//         <Text>Online Hours: {weeklyStats.hours}</Text>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F6FBFF',
//     paddingHorizontal: wp('5%'),
//   },
//   carouselWrapper: {
//     marginTop: hp('2%'),
//   },
//   sectionTitle: {
//     marginTop: hp('3%'),
//     fontSize: wp('4.5%'),
//     fontWeight: '700',
//   },
//   statsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: hp('2%'),
//   },
//   weekCard: {
//     backgroundColor: '#E9FFF3',
//     borderRadius: wp('4%'),
//     padding: wp('4%'),
//     marginTop: hp('3%'),
//   },
//   weekTitle: {
//     fontSize: wp('4.2%'),
//     fontWeight: '700',
//     marginBottom: hp('1%'),
//   },
// });

// export default HomeDashboard;
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/home/Header';
import SwipeAction from '../../components/home/SwipeAction';
import BannerCarousel from '../../components/home/BannerCarousel';
import StatsCard from '../../components/home/StatsCard';
import ActiveShiftBanner from '../../components/home/ActiveShiftBanner';
import PeakHoursBanner from '../../components/home/PeakHoursBanner';
import WeeklyStatsCard from '../../components/home/WeeklyStatsCard';
import { banners, todayStats, weeklyStats } from '../../components/home/data/home.mock';

const HomeDashboard = () => {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        {!isOnline ? (
          <>
            <SwipeAction
              label="Swipe For Online"
              backgroundColor="#22C55E"
              onSwipeSuccess={() => setIsOnline(true)}
            />

            <View style={styles.carouselWrapper}>
              <BannerCarousel data={banners} />
            </View>
          </>
        ) : (
          <SwipeAction
            label="Swipe For Offline"
            backgroundColor="#6B7280"
            onSwipeSuccess={() => setIsOnline(false)}
          />
        )}

        <Text style={styles.sectionTitle}>Today's Progress</Text>

        <View style={styles.statsRow}>
          {todayStats.map(item => (
            <StatsCard key={item.id} {...item} />
          ))}
        </View>

        <ActiveShiftBanner />
        <PeakHoursBanner />

       <WeeklyStatsCard/>  
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F6FBFF',
  },
  container: {
    paddingHorizontal: wp('5%'),
  },
  carouselWrapper: {
    marginTop: hp('2%'),
  },
  sectionTitle: {
    marginTop: hp('3%'),
    fontSize: wp('4.5%'),
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
  },
  weekCard: {
    backgroundColor: '#E9FFF3',
    borderRadius: wp('4%'),
    padding: wp('4%'),
    marginTop: hp('3%'),
    marginBottom: hp('4%'),
  },
  weekTitle: {
    fontSize: wp('4.2%'),
    fontWeight: '700',
    marginBottom: hp('1%'),
  },
});

export default HomeDashboard;
