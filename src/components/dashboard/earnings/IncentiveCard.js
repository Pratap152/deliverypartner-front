import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ProgressBar from './ProgressBar';
import MultiLevelProgressBar from './MultiLevelProgressBar';


export default function IncentiveCard({ item }) {
 
  const completed = Number(item.completedOrders ?? item.ordersCompleted ?? 0);
  const required = Number(item.requiredOrders ?? 0);
  const progressColor =
    item.type === 'peak' ? '#F54900' : item.type === 'weekly' ? '#155DFC' : '#9810FA';

  // peak-specific data
  const isPeak = item.type === 'peak';
  const peakSlabs = Array.isArray(item.slabs) ? item.slabs : item.data?.slabs ?? [];

  const meta = {
    peak: { label: 'Peak', icon: require('../../../assets/peak.png'), color: '#F54900' },
    weekly: { label: 'Weekly', icon: require('../../../assets/weekly.png'), color: '#155DFC' },
    daily: { label: 'Daily', icon: require('../../../assets/daily.png'), color: '#9810FA' },
    surge: { label: 'Surge', icon: require('../../../assets/surge.png'), color: '#F13926' },
  }[item.type] ?? { label: 'Other', icon: require('../../../assets/daily.png'), color: '#9810FA' };

  return (
    <View style={[styles.card, { backgroundColor: item.accentColor }]}>
      <View style={styles.logo_row}>
        <Text style={[styles.logo_text, { color: meta.color }]}>{meta.label}</Text>
        <Image source={meta.icon} style={styles.logo} resizeMode="contain" />
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>

      {/* Peak: use multi level bar */}
      {isPeak && peakSlabs && peakSlabs.length > 0 ? (
        <>
          {/* Optional small label showing completed orders */}
          <View style={{ marginTop: hp(1), marginBottom: hp(0.5) }}>
            <Text style={{ color: '#374151', fontSize: wp(3.2) }}>
              {completed}/{peakSlabs[peakSlabs.length - 1].orders} Orders
            </Text>
          </View>

          <MultiLevelProgressBar
            slabs={peakSlabs}
            completedOrders={completed}
            height={hp(1.6)}
            fillColor={progressColor}
          />
        </>
      ) : (
        // Non-peak: show single-segment progress if requiredOrders present
        required > 0 && (
          <>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>{completed}/{required} orders</Text>
            </View>

            <ProgressBar progress={(required > 0 ? (completed / required) * 100 : 0)} accentColor={progressColor} />
          </>
        )
      )}

      <Text style={styles.reward}>{item.value ?? item.rewardText ?? ''}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: wp(90),
    alignSelf: 'center',
    borderRadius: wp(4),
    padding: wp(3),
    marginBottom: wp(3),
  },
  title: { fontSize: wp(4), fontWeight: '500', color: '#111' },
  subtitle: { fontSize: wp(3.5), color: '#6B7280', marginTop: 4 },
  progressRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: hp(1) },
  progressText: { fontSize: wp(3.2), color: '#374151' },
  reward: { marginTop: 10, fontSize: wp(4), fontWeight: '700', color: '#111', alignSelf: 'flex-end' },
  logo_row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: hp(1) },
  logo: { height: hp('2.5'), width: wp('5.5') },
  logo_text: { backgroundColor: '#FFFFFF', paddingHorizontal: wp(2), borderRadius: wp(1), fontWeight: '600' },
});


// import React from 'react';
// import { View, Text, StyleSheet,Image } from 'react-native';
// import { widthPercentageToDP as wp,heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import ProgressBar from './ProgressBar';

// export default function IncentiveCard({ item }) {
// const isPeak = item.type === 'peak';

// const completed = Number(
//   item.ordersCompleted ??
//   item.progress?.totalOrders ??
//   0
// );

// const required = Number(
//   item.requiredOrders ??
//   item.progress?.totalDaysRequired ??
//   0
// );

// const progress =
//   !isPeak && required > 0
//     ? Math.min((completed / required) * 100, 100)
//     : 0;

//   const progressColor =
//     item.type === 'peak'
//       ? '#F54900'
//       : item.type === 'weekly'
//       ? '#155DFC'
//       : '#9810FA';

//   const Incentive_logo = {
//       peak: {
//         label: 'Peak',
//         icon: require('../../../assets/peak.png'),
//         color: '#F54900',
//       },
//       weekly: {
//         label: 'Weekly',
//         icon: require('../../../assets/weekly.png'),
//         color: '#155DFC',
//       },
//       daily: {
//         label: 'Daily',
//         icon: require('../../../assets/daily.png'),
//         color: '#9810FA',
//       },
//       surge:{
//         label:'Surge',
//         icon:require('../../../assets/surge.png'),
//         color:'#F13926'
//       },

//     };
// const meta = Incentive_logo[item.type] ?? Incentive_logo.daily;


//   return (
//     <View style={[styles.card, { backgroundColor: item.accentColor }]}>
//       <View style={styles.logo_row}>
//         <Text
//           style={[
//             styles.logo_text,
//             { color: meta.color },
//           ]}
//         >
//           {meta.label}
//         </Text>

//         <Image
//           source={meta.icon}
//           style={styles.logo}
//           resizeMode="contain"
//         />
//       </View>

//       <Text style={styles.title}>{item.title}</Text>
//       <Text style={styles.subtitle}>{item.subtitle}</Text>
//       {/* PEAK SLABS */}
//       {item.type === 'peak' && Array.isArray(item.slabs) && (
//         <View style={{ marginTop: hp(1) }}>
//           {item.slabs.map((slab, index) => (
//             <View key={index} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
//               <Text  style={styles.slabText}>
//                 Complete {slab.orders} Orders                           
//               </Text>
//               <Text style={styles.reward}>
//                 Earn ₹{slab.rewardAmount}
//               </Text>
//             </View>
//           ))}
//         </View>
//       )}
    
//       {/* Progress Row */}
//       {required > 0 && (
//         <>
//           {/* <View style={styles.progressRow}>
//             <Text style={styles.progressText}>
//               {completed}/{required} orders
//             </Text>
//           </View> */}

//           <ProgressBar
//             progress={progress}
//             progressColor={progressColor}/>
//         </>
//       )}

//       <Text style={styles.reward}>{item.value}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     width: wp(90),
//     alignSelf: 'center',
//     borderRadius: wp(4),
//     padding: wp(3),
//     marginBottom: wp(3),
//   },
//   title: {
//     fontSize: wp(4),
//     fontWeight: '500',
//     color: '#111',
//   },
//   subtitle: {
//     fontSize: wp(3.5),
//     color: '#6B7280',
//     marginTop: 4,
//   },
//   progressRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: hp(1),
//   },
//   progressText: {
//     fontSize: wp(3.2),
//     color: '#374151',
//   },
//   reward: {
//     marginTop: 10,
//     fontSize: wp(4),
//     fontWeight: '700',
//     color: '#111',
//     alignSelf: 'flex-end',
//   },
//   logo_row:{
//     flexDirection:'row',
//     alignItems:'center',
//     justifyContent:'space-between',
//     marginBottom:hp(1)
//   },
//   logo:{
//     height:hp('2.5'),
//     width:wp('5.5'),
    
//   },
//   logo_text:{
//     color:'#F54900',
//     backgroundColor:'#FFFFFF',
//     paddingHorizontal:wp(2),
//     borderRadius:wp(1)
//   }
// });
