import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import PremiumPressable from '../../common/PremiumPressable';
import IncentiveCard from './IncentiveCard';

 const IncentivesCards = ({
  item,
  onPress,
  weeklyCompletedOrders,
  dailyCompletedOrders,
  peakCompletedOrders,
  peakProgressPercentage = 0,
  weeklyProgressPercentage = 0,
  loading
}) => {
  if (!item) {
    return null;
  }
    if (loading) {
    return (
        <View style={styles.loadingCard}>
        <ActivityIndicator
            size="small"
            color="#4F46E5"
        />

        <Text style={styles.loadingText}>
            Loading incentives...
        </Text>
        </View>
    );
    }
  if (!item.emptyData) {
    return (
      <PremiumPressable onPress={() => onPress(item)}>
        <IncentiveCard
            item={item}
            weeklyCompletedOrders={weeklyCompletedOrders}
            dailyCompletedOrders={dailyCompletedOrders}
            peakCompletedOrders={peakCompletedOrders}
            peakProgressPercentage={peakProgressPercentage}
            weeklyProgressPercentage={weeklyProgressPercentage}
            />
      </PremiumPressable>
    );
  }

  const title =
    item.type === 'daily'
      ? 'Daily Incentives Not Available'
      : item.type === 'peak'
        ? 'Peak Incentives Not Available'
        : 'Weekly Incentives Not Available';

  return (
    <View style={styles.emptyCard}>
      <Text style={styles.emptyTitle}>{title}</Text>

      <Text style={styles.emptySubtitle}>
        Complete more orders to unlock exciting incentives.
      </Text>
    </View>
  );
};

export default IncentivesCards;

const styles = StyleSheet.create({
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(2),
    paddingVertical: 32,
    paddingHorizontal: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginHorizontal: 16,
    marginBottom: wp(3),
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },

  loadingCard: {
  backgroundColor: '#FFFFFF',
  borderRadius: wp(4),
  paddingVertical: 28,
  marginHorizontal: 16,
  marginBottom: 12,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: '#E5E7EB',
},

loadingText: {
  marginTop: 8,
  fontSize: 14,
  color: '#6B7280',
  fontWeight: '500',
},
});