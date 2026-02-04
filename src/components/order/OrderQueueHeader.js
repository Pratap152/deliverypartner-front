import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

/**
 * OrderQueueHeader Component (Single Responsibility)
 * Displays order count and close button
 * 
 * @param {number} count - Number of orders in queue
 * @param {function} onClose - Callback when close button pressed
 */
const OrderQueueHeader = ({ count, onClose }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
                <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>

            <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    {count} {count === 1 ? 'New Order' : 'New Orders'}
                </Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
        </View>
    );
};

export default memo(OrderQueueHeader);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        paddingVertical: hp('1.8%'),
        paddingHorizontal: wp('5%'),
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        width: wp('10%'),
        alignItems: 'flex-start',
    },
    backIcon: {
        fontSize: wp('6%'),
        color: '#1C1C1C',
        fontWeight: '600',
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: wp('4.5%'),
        fontWeight: '700',
        color: '#1C1C1C',
    },
    closeButton: {
        width: wp('10%'),
        alignItems: 'flex-end',
    },
    closeIcon: {
        fontSize: wp('5.5%'),
        color: '#6B6B6B',
        fontWeight: '600',
    },
});
