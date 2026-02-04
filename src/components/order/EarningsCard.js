import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

/**
 * EarningsCard Component
 * Displays the estimated earning for an order with visual emphasis
 * 
 * @param {number} amount - The earning amount in rupees
 */
const EarningsCard = ({ amount }) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.label}>💰 You'll Earn</Text>
                <Text style={styles.amount}>₹{amount?.toFixed(2) || '0.00'}</Text>
            </View>
        </View>
    );
};

export default memo(EarningsCard);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#009966',
        borderRadius: wp('4%'),
        paddingVertical: hp('2.5%'),
        paddingHorizontal: wp('5%'),
        marginBottom: hp('1.5%'),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    content: {
        alignItems: 'center',
    },
    label: {
        fontSize: wp('3.8%'),
        color: '#FFFFFF',
        fontWeight: '600',
        marginBottom: hp('0.8%'),
        opacity: 0.95,
    },
    amount: {
        fontSize: wp('10%'),
        color: '#FFFFFF',
        fontWeight: '800',
        letterSpacing: 1,
    },
});
