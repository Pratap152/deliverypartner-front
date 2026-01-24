import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

export default function IncentiveCard({ item }) {
const isPeak = item.type === 'peak';

const completed = Number(
  item.ordersCompleted ??
  item.progress?.totalOrders ??
  0
);

const required = Number(
  item.requiredOrders ??
  item.progress?.totalDaysRequired ??
  0
);

const progress =
  !isPeak && required > 0
    ? Math.min((completed / required) * 100, 100)
    : 0;

  const progressColor =
    item.type === 'peak'
      ? '#F54900'
      : item.type === 'weekly'
      ? '#155DFC'
      : '#9810FA';

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


  return (
    <View style={[styles.card, { backgroundColor: item.accentColor }]}>
      <View style={styles.logo_row}>
        <Text
          style={[
            styles.logo_text,
            { color: meta.color },
          ]}
        >
          {meta.label}
        </Text>

        <Image
          source={meta.icon}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
      {/* PEAK SLABS */}
      {item.type === 'peak' && Array.isArray(item.slabs) && (
        <View style={{ marginTop: hp(1) }}>
          {item.slabs.map((slab, index) => (
            <View key={index} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <Text  style={styles.slabText}>
                Complete {slab.orders} Orders                           
              </Text>
              <Text style={styles.reward}>
                Earn ₹{slab.rewardAmount}
              </Text>
            </View>
          ))}
        </View>
      )}
    
      {/* Progress Row */}
      {required > 0 && (
        <>
          {/* <View style={styles.progressRow}>
            <Text style={styles.progressText}>
              {completed}/{required} orders
            </Text>
          </View> */}

          <ProgressBar
            progress={progress}
            progressColor={progressColor}/>
        </>
      )}

      <Text style={styles.reward}>{item.value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: wp(4),
    padding: wp(5),
    marginBottom: wp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width:wp(90),
    alignSelf:'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    
  },
  title: {
    fontSize: wp(4),
    fontWeight: '600',
    color: '#111',
  },
  subtitle: {
    fontSize: wp(3.4),
    color: '#666',
    marginTop: wp(1),
  },
  value: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#111',
  },
});
