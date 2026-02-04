import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

/**
 * CompactOrderCard Component (Single Responsibility)
 * Displays condensed order preview with key information
 * Tappable to expand the full order
 * 
 * @param {object} order - Order data
 * @param {boolean} isNew - Whether this is a newly received order
 * @param {function} onPress - Callback when card is tapped
 */
const CompactOrderCard = ({ order, isNew, onPress }) => {
    const { data, countdown } = order;
    const { estimatedEarning, distanceKm, vendorShopName } = data;

    const getCountdownColor = () => {
        if (countdown > 10) return '#00B26F';
        if (countdown > 5) return '#FFA500';
        return '#FF4B4B';
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                isNew && styles.newOrderGlow
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.content}>
                {/* Left: Earnings & Vendor */}
                <View style={styles.leftSection}>
                    <View style={styles.earningsRow}>
                        <Text style={styles.earningsLabel}>💰</Text>
                        <Text style={styles.earningsAmount}>₹{estimatedEarning?.toFixed(0)}</Text>
                        {isNew && <View style={styles.newBadge}><Text style={styles.newText}>NEW</Text></View>}
                    </View>
                    <Text style={styles.vendorName} numberOfLines={1}>{vendorShopName}</Text>
                </View>

                {/* Right: Distance & Countdown */}
                <View style={styles.rightSection}>
                    <Text style={styles.distance}>📏 {distanceKm?.toFixed(1)} km</Text>
                    <View style={[styles.countdownBadge, { backgroundColor: getCountdownColor() + '20' }]}>
                        <Text style={[styles.countdownText, { color: getCountdownColor() }]}>
                            ⏱️ {countdown}s
                        </Text>
                    </View>
                </View>
            </View>

            {/* Tap indicator */}
            <Text style={styles.tapHint}>Tap to view details ›</Text>
        </TouchableOpacity>
    );
};

export default memo(CompactOrderCard);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: wp('3%'),
        padding: wp('3.5%'),
        marginBottom: hp('1%'),
        borderWidth: 1,
        borderColor: '#E6E6E6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    newOrderGlow: {
        borderColor: '#00B26F',
        borderWidth: 2,
        shadowColor: '#00B26F',
        shadowOpacity: 0.3,
        elevation: 4,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp('0.5%'),
    },
    leftSection: {
        flex: 1,
        marginRight: wp('3%'),
    },
    earningsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('0.5%'),
    },
    earningsLabel: {
        fontSize: wp('4%'),
        marginRight: wp('1%'),
    },
    earningsAmount: {
        fontSize: wp('4.5%'),
        fontWeight: '800',
        color: '#009966',
    },
    newBadge: {
        backgroundColor: '#00B26F',
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('0.2%'),
        borderRadius: wp('1%'),
        marginLeft: wp('2%'),
    },
    newText: {
        fontSize: wp('2.5%'),
        fontWeight: '700',
        color: '#FFFFFF',
    },
    vendorName: {
        fontSize: wp('3.2%'),
        color: '#6B6B6B',
        fontWeight: '500',
    },
    rightSection: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    distance: {
        fontSize: wp('3%'),
        color: '#6B6B6B',
        marginBottom: hp('0.5%'),
    },
    countdownBadge: {
        paddingHorizontal: wp('2.5%'),
        paddingVertical: hp('0.4%'),
        borderRadius: wp('2%'),
    },
    countdownText: {
        fontSize: wp('3%'),
        fontWeight: '700',
    },
    tapHint: {
        fontSize: wp('2.8%'),
        color: '#9CA3AF',
        fontStyle: 'italic',
        textAlign: 'right',
    },
});
