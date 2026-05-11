import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function MultiLevelProgressBar({
  slabs = [],
  completedOrders = 0,
  height = hp(1),
  segmentSpacing = wp(2),
  trackColor = '#E5E7EB',
  fillColor = '#F97316',
}) {
  if (!Array.isArray(slabs) || slabs.length === 0) {
    return null;
  }

  console.log("ESWA", slabs);

  // normalize slabs: ensure ascending and numeric
  const normalized = slabs
    .map(s => ({ orders: Number(s.orders ?? s?.orders ?? 0), rewardAmount: Number(s.rewardAmount ?? s?.rewardAmount ?? 0) }))
    .filter(s => s.orders > 0)
    .sort((a, b) => a.orders - b.orders);

  if (normalized.length === 0) return null;

  // compute segment spans (difference from previous slab)
  const segments = normalized.map((s, i) => {
    const prev = i === 0 ? 0 : normalized[i - 1].orders;
    const span = s.orders - prev;
    return {
      ...s,
      span,
      prev,
    };
  });

  // total span = last slab orders
  const totalSpan = normalized[normalized.length - 1].orders || 1;

  return (
    <View style={{ width: '100%' }}>
      <View style={[styles.trackRow, { height }]}>
        {segments.map((seg, i) => {
          // width percent for this segment relative to total
          const widthPercent = (seg.span / totalSpan) * 100;
          // how much of this segment is filled based on completedOrders
          const completedInThis = Math.max(0, Math.min(seg.span, completedOrders - seg.prev));
          const fillPercent = seg.span <= 0 ? 0 : (completedInThis / seg.span) * 100;

          return (
            <View
              key={`seg-${i}`}
              style={{
                width: `${widthPercent}%`,
                paddingHorizontal: i === 0 ? 0 : segmentSpacing / 2,
              }}
            >
              <View style={[styles.segmentTrack, {
                backgroundColor: trackColor, height,
                borderRadius: height / 2,
              }]}>
                <View
                  style={{
                    width: `${fillPercent}%`,
                    height: '100%',
                    backgroundColor: fillColor,
                    borderTopLeftRadius: height / 2,
                    borderBottomLeftRadius: height / 2,
                    borderTopRightRadius: fillPercent === 100 ? height / 2 : 0,
                    borderBottomRightRadius: fillPercent === 100 ? height / 2 : 0,

                  }}
                />
              </View>
            </View>
          );
        })}
      </View>

      {/* Labels row: show orders and reward per slab */}
      <View style={styles.labelsRow}>
        {segments.map((seg, i) => {
          const widthPercent = (seg.span / totalSpan) * 100;
          return (
            <View key={`lbl-${i}`} style={{ width: `${widthPercent}%`, paddingHorizontal: i === 0 ? 0 : segmentSpacing / 2 }}>
              <View style={styles.labelCell}>
                <Text style={styles.orderText}>{seg.orders} orders</Text>
                <Text style={styles.rewardText}>₹{seg.rewardAmount}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  segmentTrack: {
    width: '100%',
    borderRadius: 6,
    overflow: 'hidden',
  },
  labelsRow: {
    flexDirection: 'row',
    marginTop: hp(1),
    alignItems: 'center',
    width: '100%',
  },
  labelCell: {
    alignItems: 'center',
  },
  orderText: {
    fontSize: wp(3.2),
    color: '#374151',
  },
  rewardText: {
    fontSize: wp(3.2),
    color: '#111827',
    fontWeight: '600',
    marginTop: hp(0.3),
  },
});
