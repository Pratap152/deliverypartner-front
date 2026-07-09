import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SummaryItem from './SummaryItem'; 
import { formatMoney } from '../../../utils/formatMoney';

export default function MonthlySummaryCard({ summary, onPress, riderType }) {
  return (
    <TouchableOpacity activeOpacity={0.95} onPress={onPress} style={styles.wrapper}>
      <LinearGradient colors={['#047D4D', '#23B484']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.card}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>{riderType === 'INDIVIDUAL_EMPLOYEE' ? "This Month" : "Today"}</Text>
            <Text style={styles.headerSub}>Summary </Text>
          </View>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{formatMoney(summary.total)}</Text>
          </View>
        </View>

        <View style={styles.metrics}>
          <View style={styles.metricRow}>
            <SummaryItem label="Orders" value={summary.orders ?? 0} />
            <SummaryItem label="Base Earnings" value={`₹${formatMoney(summary.baseEarnings)}`} />
          </View>

          <View style={[styles.metricRow, { marginTop: hp(1) }]}>
            <SummaryItem label="Tips" value={`₹${formatMoney(summary.tips)}`} />
            <SummaryItem label="Incentives" value={`₹${formatMoney(summary.incentives)}`} />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: wp(95), alignSelf: 'center', marginTop: hp(2) },
  card: {
    borderRadius: wp(4),
    padding: wp(4),
    ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 18, shadowOffset: { width: 0, height: 10 } }, android: { elevation: 8 } }),
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: wp(5), fontWeight: '700' },
  headerSub: { color: '#E6F5FF', fontSize: wp(4), marginTop: hp(0.4) },

  totalBox: { backgroundColor: 'rgba(255,255,255,0.15)', padding: wp(3), borderRadius: wp(2), alignItems: 'flex-start' },
  totalLabel: { color: '#E8FDFB', fontSize: wp(4),fontWeight:'500' },
  totalValue: { color: '#fff', fontSize: wp(5), fontWeight: '800' },

  metrics: { marginTop: hp(2) },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

