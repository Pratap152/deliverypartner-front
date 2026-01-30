import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ProgressBar from './ProgressBar';
import MultiLevelProgressBar from './MultiLevelProgressBar';


export default function IncentiveCard({ item }) {
 
  const isDaily = item.type === 'daily';
  const isWeekly = item.type === 'weekly';
  const isPeak = item.type === 'peak';

  // weekly progress
  const completedDays = item.completedOrders ?? 0;
  const requiredDays = item.requiredOrders ?? 0;

  // daily slot progress
  const peakCompleted = item.peakCompleted ?? 0;
  const peakRequired = item.peakRequired ?? 0;
  const normalCompleted = item.normalCompleted ?? 0;
  const normalRequired = item.normalRequired ?? 0;


  const progressColor =
    item.type === 'peak' ? '#F54900' : item.type === 'weekly' ? '#155DFC' : '#9810FA';

  const Incentive_logo = {
      peak: {
        label: 'Peak',
        icon: require('../../../assets/peak.png'),
        color: '#F54900',
      },
      weekly: {
        label: 'Weekly',
        icon: require('../../../assets/weekly.png'),
        color: '#155DFC',
      },
      daily: {
        label: 'Daily',
        icon: require('../../../assets/daily.png'),
        color: '#9810FA',
      },
      surge:{
        label:'Surge',
        icon:require('../../../assets/surge.png'),
        color:'#F13926'
      },
    };  
 const meta = Incentive_logo[item.type] ?? Incentive_logo.daily;

 const peakSlabs = Array.isArray(item.slabs) ? item.slabs : item.data?.slabs ?? [];

 

  return (
    <View style={[styles.card, { backgroundColor: item.accentColor }]}>
      <View style={styles.logo_row}>
        <Text style={[styles.logo_text, { color: meta.color }]}>{meta.label}</Text>
        <Image source={meta.icon} style={styles.logo} resizeMode="contain" />
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>

      {/* PEAK INCENTIVE */}
        {isPeak && peakSlabs.length > 0 && (
          <MultiLevelProgressBar
            slabs={peakSlabs}
            height={hp(1.6)}
            fillColor={progressColor}
          />
        )}

        {/* DAILY INCENTIVE  */}
        {isDaily && (
          <>
            {/* Peak slots */}
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
              <Text style={styles.progressText}>
                Peak Slots
              </Text>
              <Text style={styles.progressText}>
                {peakCompleted}/{peakRequired}
              </Text>
            </View>
            
            <ProgressBar
              progress={
                peakRequired > 0
                  ? (peakCompleted / peakRequired) * 100
                  : 0
              }
              accentColor="#F54900"
            />

            {/* Normal slots */}
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
              <Text style={styles.progressText}>
              Normal Slots 
            </Text>
            <Text style={styles.progressText}>
              {normalCompleted}/{normalRequired}
            </Text>
            </View>
            <ProgressBar
              progress={
                normalRequired > 0
                  ? (normalCompleted / normalRequired) * 100
                  : 0
              }
              accentColor="#9810FA"
            />
          </>
        )}

        {/* WEEKLY INCENTIVE  */}
        {isWeekly && requiredDays > 0 && (
          <ProgressBar
            progress={(completedDays / requiredDays) * 100}
            accentColor="#155DFC"
          />
        )}
            
      <Text style={styles.reward}>
        {item.value ?? item.rewardText ?? ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: wp(95),
    alignSelf: 'center',
    borderRadius: wp(4),
    padding: wp(3),
    marginBottom: wp(3),
  },
  title: { fontSize: wp(4.5), fontWeight:'500' },
  subtitle: { fontSize: wp(3.5), color: '#6B7280', marginTop: 4 },
  progressRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: hp(1) },
  progressText: { fontSize: wp(4),fontWeight:'500',marginTop:hp(1) },
  reward: { marginTop: 10, fontSize: wp(4), fontWeight: '700', color: '#111', alignSelf: 'flex-end' },
  logo_row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: hp(1) },
  logo: { height: hp('2.5'), width: wp('5.5') },
  logo_text: { backgroundColor: '#FFFFFF', paddingHorizontal: wp(2), borderRadius: wp(1), fontWeight: '600' },
});


