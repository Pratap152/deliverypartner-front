import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

/**
 * RouteInfoCard Component
 * Displays pickup and drop location with distance and ETA
 * 
 * @param {string} vendorName - Name of the pickup location/vendor
 * @param {string} customerName - Name of the drop location/customer
 * @param {number} distanceKm - Distance in kilometers
 * @param {number} etaMinutes - Estimated time in minutes
 */
const RouteInfoCard = ({ vendorName, customerName, distanceKm, etaMinutes }) => {
    return (
        <View style={styles.container}>
            {/* Route */}
            <View style={styles.routeRow}>
                <View style={styles.locationContainer}>
                    <Text style={styles.locationIcon}>🏪</Text>
                    <Text style={styles.locationText} numberOfLines={1}>
                        {vendorName || 'Pickup Location'}
                    </Text>
                </View>

                <Text style={styles.arrow}>→</Text>

                <View style={styles.locationContainer}>
                    <Text style={styles.locationIcon}>🏠</Text>
                    <Text style={styles.locationText} numberOfLines={1}>
                        {customerName || 'Customer'}
                    </Text>
                </View>
            </View>

            {/* Distance & Time */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statText}>{distanceKm?.toFixed(1) || '0'} km</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.statItem}>
                    <Text style={styles.statText}>{etaMinutes || '0'} min</Text>
                </View>
            </View>
        </View>
    );
};

export default memo(RouteInfoCard);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: wp('4%'),
        padding: wp('4%'),
        marginBottom: hp('1.5%'),
        borderWidth: 1,
        borderColor: '#E6E6E6',
    },
    routeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp('1.5%'),
    },
    locationContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIcon: {
        fontSize: wp('5%'),
        marginRight: wp('2%'),
    },
    locationText: {
        fontSize: wp('3.5%'),
        fontWeight: '600',
        color: '#1C1C1C',
        flex: 1,
    },
    arrow: {
        fontSize: wp('5%'),
        marginHorizontal: wp('2%'),
        color: '#00B26F',
        fontWeight: 'bold',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#F8F9FA',
        borderRadius: wp('3%'),
        paddingVertical: hp('1%'),
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    statIcon: {
        fontSize: wp('4%'),
        marginRight: wp('1.5%'),
    },
    statText: {
        fontSize: wp('3.5%'),
        fontWeight: '600',
        color: '#4A4A4A',
    },
    divider: {
        width: 1,
        height: hp('2%'),
        backgroundColor: '#D1D5DB',
    },
});
