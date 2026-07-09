import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSlots } from '../../hooks/useSlots';

const ZestbotSlotsDetails = () => {

    const {
        zestbotSlotsLoading,
        fetchZestbotSlotsDetails,
    } = useSlots();

    const [response, setResponse] = useState(null);

    useEffect(() => {
        const fetchZestbotSlots = async () => {
            try {
                const res = await fetchZestbotSlotsDetails();
                setResponse(res);
            } catch (error) {
                console.error("Error fetching Zestbot slots:", error);
            }
        };

        fetchZestbotSlots();
    }, []);

    const [selectedShift, setSelectedShift] = useState(null);

    const shifts = response?.data?.shifts || [];

    useEffect(() => {
        if (shifts.length === 0) return;

        const today = new Date().toISOString().split('T')[0];

        const currentShift =
            shifts.find(item => item.date === today) || shifts[0];

        setSelectedShift(currentShift);
    }, [response]);

    const formatShiftType = type => {
        switch (type) {
            case 'MORNING':
                return 'Morning Shift';
            case 'GENERAL':
                return 'General Shift';
            case 'EVENING':
                return 'Evening Shift';
            case 'NIGHT':
                return 'Night Shift';
            default:
                return type;
        }
    };

    const formatTime = time => {
        if (!time) return '--';

        const [hour, minute] = time.split(':');
        const h = parseInt(hour, 10);

        return `${h % 12 || 12}:${minute} ${h >= 12 ? 'PM' : 'AM'}`;
    };

    const formatStatus = status => {
        switch (status) {
            case 'ASSIGNED':
                return 'Upcoming';
            case 'STARTED':
                return 'Active';
            case 'COMPLETED':
                return 'Completed';
            default:
                return status;
        }
    };

    if (zestbotSlotsLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4C4CFF" />
            </View>
        );
    };

    if (!response) {
        return (
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <StatusBar
                    backgroundColor="#192A51"
                    barStyle="light-content"
                />
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>My Slots</Text>
                        <Text style={styles.headerSubtitle}>
                            View and manage your assigned shifts
                        </Text>
                    </View>
                    <View style={styles.loadingContainer}>
                        <Text style={{ fontSize: 16, color: '#64748B' }}>No data available</Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
            <StatusBar
                backgroundColor="#192A51"
                barStyle="light-content"
            />
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Slots</Text>
                    <Text style={styles.headerSubtitle}>
                        View and manage your assigned shifts
                    </Text>
                </View>
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Week Days */}
                    <View style={styles.weekContainer}>
                        {shifts.map((item, index) => {
                            const selected = selectedShift?.bookingId === item.bookingId;
                            const date = new Date(item.date);

                            return (
                                <React.Fragment key={item.bookingId}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => setSelectedShift(item)}
                                        style={styles.dayItem}>

                                        <Text
                                            style={[
                                                styles.dayName,
                                                selected && styles.selectedDayName,
                                            ]}>
                                            {date.toLocaleDateString('en-US', {
                                                weekday: 'short',
                                            })}
                                        </Text>

                                        <View
                                            style={[
                                                styles.dateCircle,
                                                selected && styles.selectedDateCircle,
                                            ]}>
                                            <Text
                                                style={[
                                                    styles.dayDate,
                                                    selected && styles.selectedDayDate,
                                                ]}>
                                                {date.getDate()}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                    {index !== shifts.length - 1 && (
                                        <View style={styles.verticalDivider} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </View>

                    {/* Shift Card */}
                    {selectedShift && (
                        <View style={styles.card}>
                            <Text style={styles.title}>Today's Shift</Text>

                            <Text style={styles.shiftName}>
                                {formatShiftType(selectedShift.shiftType)}
                            </Text>

                            <Text style={styles.shiftTime}>
                                {formatTime(selectedShift.startTime)} -{' '}
                                {formatTime(selectedShift.endTime)}
                            </Text>

                            <View style={styles.divider} />

                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Status</Text>

                                <View style={styles.statusChip}>
                                    <Text style={styles.statusText}>
                                        {selectedShift.shiftState}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Date</Text>
                                <Text style={styles.value}>{selectedShift.date}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Assigned Zone</Text>
                                <Text style={styles.value}>{selectedShift.pincode}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Area</Text>
                                <Text style={styles.value}>{selectedShift.area}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.label}>City</Text>
                                <Text style={styles.value}>{selectedShift.city}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Lunch Break</Text>
                                <Text style={styles.value}>30 minutes</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Other Breaks</Text>
                                <Text style={styles.value}>30 minutes</Text>
                            </View>

                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default ZestbotSlotsDetails;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#4C4CFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
    header: {
        backgroundColor: '#4C4CFF',
        paddingHorizontal: wp('5%'),
        paddingTop: hp('1%'),
        paddingBottom: hp('3%'),
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: wp('6%'),
        fontWeight: '700',
    },
    headerSubtitle: {
        marginTop: hp('0.5%'),
        color: '#D7DDEA',
        fontSize: wp('3.6%'),
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingBottom: hp('4%'),
    },
    weekContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: wp('4%'),
        marginTop: hp('1.5%'),
        borderRadius: 18,
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('2%'),
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    dayItem: {
        flex: 1,
        alignItems: 'center',
    },
    dayName: {
        fontSize: wp('3.2%'),
        color: '#94A3B8',
        fontWeight: '600',
        marginBottom: hp('0.8%'),
    },
    selectedDayName: {
        color: '#2563EB',
    },
    dateCircle: {
        width: wp('10%'),
        height: wp('10%'),
        borderRadius: wp('5%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedDateCircle: {
        backgroundColor: '#2563EB',
        borderRadius: wp('5%'),
    },
    dayDate: {
        fontSize: wp('4.2%'),
        color: '#1E293B',
        fontWeight: '700',
    },
    selectedDayDate: {
        color: '#FFFFFF',
    },
    verticalDivider: {
        width: 1,
        height: hp('5%'),
        backgroundColor: '#CCCCCC',
        alignSelf: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: wp('4%'),
        marginTop: hp('2%'),
        borderRadius: 20,
        padding: wp('5%'),
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 3,
        },
    },
    title: {
        fontSize: wp('4.4%'),
        fontWeight: '600',
        color: '#64748B',
    },
    shiftName: {
        fontSize: wp('6%'),
        fontWeight: '700',
        color: '#0F172A',
        marginTop: hp('1.2%'),
    },
    shiftTime: {
        fontSize: wp('4%'),
        color: '#2563EB',
        marginTop: hp('0.5%'),
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: hp('2.2%'),
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: hp('1.4%'),
    },
    label: {
        fontSize: wp('3.8%'),
        color: '#64748B',
        fontWeight: '500',
    },
    value: {
        fontSize: wp('3.9%'),
        color: '#0F172A',
        fontWeight: '600',
        maxWidth: '55%',
        textAlign: 'right',
    },
    statusChip: {
        backgroundColor: '#DBEAFE',
        borderRadius: 50,
        paddingHorizontal: wp('3.5%'),
        paddingVertical: hp('0.6%'),
    },
    statusText: {
        color: '#2563EB',
        fontSize: wp('3.3%'),
        fontWeight: '700',
    },
});