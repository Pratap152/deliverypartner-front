import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    responsiveFontSize,
    responsiveHeight,
} from 'react-native-responsive-dimensions';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import dayjs from 'dayjs';

const ShiftSummaryCard = ({
    bookings = [],
    selectedDate,
}) => {
    if (!bookings?.length) {
        return null;
    }

    const booking = bookings[0];
    const shift = booking.shift || {};

    const getStatusColor = status => {
        switch (status) {
            case 'ASSIGNED':
                return '#F59E0B';

            case 'COMPLETED':
                return '#22C55E';

            case 'CANCELLED':
                return '#EF4444';

            default:
                return '#64748B';
        }
    };

    const formatTime = time => {
        if (!time) {
            return '--';
        }

        return dayjs(time).format('hh:mm A');
    };

    const formatShiftTime = time => {
        if (!time) return '--';

        const [hour, minute] = time.split(':');

        const h = Number(hour);
        const period = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 || 12;

        return `${displayHour.toString().padStart(2, '0')}:${minute} ${period}`;
    };

    return (
        <View style={styles.card}>
            {/* Header */}

            <View style={styles.header}>
                <Ionicons
                    name="calendar-outline"
                    size={22}
                    color="#FFFFFF"
                />

                <View style={styles.headerText}>
                    <Text style={styles.title}>
                        Shift Details
                    </Text>

                    <Text style={styles.date}>
                        {dayjs(selectedDate).format(
                            'DD MMM YYYY',
                        )}
                    </Text>
                </View>
            </View>

            {/* Shift Type */}

            <View style={styles.row}>
                <Text style={styles.label}>
                    Shift Type
                </Text>

                <Text style={styles.value}>
                    {shift.shiftType || '--'}
                </Text>
            </View>

            {/* Shift Time */}

            <View style={styles.row}>
                <Text style={styles.label}>
                    Shift Time
                </Text>

                <Text style={styles.value}>
                    {formatShiftTime(shift.startTime)} -{' '}
                    {formatShiftTime(shift.endTime)}
                </Text>
            </View>

            {/* Status */}

            <View style={styles.row}>
                <Text style={styles.label}>
                    Status
                </Text>

                <View
                    style={[
                        styles.statusBadge,
                        {
                            backgroundColor:
                                getStatusColor(
                                    booking.status,
                                ),
                        },
                    ]}>
                    <Text style={styles.statusText}>
                        {booking.status}
                    </Text>
                </View>
            </View>

            {/* Check In */}

            <View style={styles.row}>
                <Text style={styles.label}>
                    Check In
                </Text>

                <Text style={styles.value}>
                    {formatTime(
                        booking.checkInTime,
                    )}
                </Text>
            </View>

            {/* Check Out */}

            <View style={styles.row}>
                <Text style={styles.label}>
                    Check Out
                </Text>

                <Text style={styles.value}>
                    {formatTime(
                        booking.checkOutTime,
                    )}
                </Text>
            </View>

            {/* Online Time */}

            <View style={styles.row}>
                <Text style={styles.label}>
                    Online Time
                </Text>

                <Text style={styles.value}>
                    {booking.totalOnlineMinutes ?? 0}{' '}
                    mins
                </Text>
            </View>

            {/* Slot Amount */}

            <View
                style={[
                    styles.row,
                    { marginBottom: 0 },
                ]}>
                <Text style={styles.label}>
                    Slot Amount
                </Text>

                <Text style={styles.value}>
                    ₹{booking.slotAmount ?? 0}
                </Text>
            </View>
        </View>
    );
};

export default ShiftSummaryCard;

const styles = StyleSheet.create({
    card: {
        marginHorizontal: wp(4),
        marginTop: responsiveHeight(2),
        padding: wp(4),
        borderRadius: 16,
        backgroundColor: '#3558B5',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsiveHeight(2.2),
    },

    headerText: {
        marginLeft: 10,
    },

    title: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: responsiveFontSize(2.2),
    },

    date: {
        marginTop: 3,
        color: '#DCE8FF',
        fontSize: responsiveFontSize(1.65),
    },


    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: responsiveHeight(1.5),
    },

    label: {
        color: '#E5E7EB',
        fontSize: responsiveFontSize(1.9),
    },

    value: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: responsiveFontSize(1.95),
    },

    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
    },

    statusText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: responsiveFontSize(1.55),
    },
});