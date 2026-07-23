import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import PremiumPressable from '../../common/PremiumPressable';
import IncentiveCard from './IncentiveCard';

const IncentivesCards = ({
    item,
    onPress,
    weeklyCompletedOrders,
    dailyCompletedOrders,
    peakCompletedOrders,
    weeklyProgressPercentage,
}) => {
    return (
        <View>
            {!item?.emptyData ? (
                <PremiumPressable onPress={() => onPress(item)}>
                    <IncentiveCard
                        item={item}
                        weeklyCompletedOrders={weeklyCompletedOrders}
                        dailyCompletedOrders={dailyCompletedOrders}
                        peakCompletedOrders={peakCompletedOrders}
                        weeklyProgressPercentage={weeklyProgressPercentage}
                    />
                </PremiumPressable>
            ) : (
                <View style={styles.emptyCard}>
                    {item?.type === 'daily' && (
                        <Text style={styles.emptyTitle}>
                            Daily Incentives Not Available
                        </Text>
                    )}

                    {item?.type === 'peak' && (
                        <Text style={styles.emptyTitle}>
                            Peak Incentives Not Available
                        </Text>
                    )}

                    {item?.type === 'weekly' && (
                        <Text style={styles.emptyTitle}>
                            Weekly Incentives Not Available
                        </Text>
                    )}

                    <Text style={styles.emptySubtitle}>
                        Complete more orders to unlock exciting incentives.
                    </Text>
                </View>
            )}
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
})