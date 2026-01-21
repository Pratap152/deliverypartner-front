import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SummaryItem from './SummaryItem';

export default function MonthlySummaryCard({summary}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>This Month</Text>

        <View style={styles.grid}>
            <SummaryItem label="Total Orders"/> 
            <SummaryItem value={summary.orders} />
        </View>
        <View style={styles.grid}>
            <SummaryItem label="Earnings" />
            <SummaryItem value={`₹${summary.earnings}`} />
        </View>
        {/* <View style={styles.grid}>
            <SummaryItem label="Incentives"/>
            <SummaryItem value="₹2,100" />
        </View>
        <View style={styles.grid}>
            <SummaryItem label="Tips"/>
            <SummaryItem value="₹500" />
        </View> */}
        <View style={[styles.grid,{marginTop:hp(1),borderTopWidth:wp(0.5),borderColor:'#E2E8F0'}]}>
           <SummaryItem label="Total Earnings" />
           <SummaryItem value={`₹${summary.earnings}`} />
        </View>
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    width: wp(90),
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: wp(4),
    padding: wp(5),
    marginTop: wp(3),
    borderColor: 'rgba(0,0,0,0.06)',
    marginBottom:hp(5)

    
  },
  title: {
    fontSize: wp(4),
    fontWeight: '500',
    marginBottom: wp(2),
  },
  grid: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'space-around',
    paddingVertical: hp(1)
  },
})
