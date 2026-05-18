import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FILTERS } from '../../../utils/constants/slotConstants';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function EmptySlotState({ filter }) {
    const getEmptyStateConfig = () => {
        switch (filter) {
            case FILTERS.AVAILABLE:
                return {
                    icon: 'calendar-outline',
                    iconColor: '#4C4CFF',
                    backgroundColor: '#EBF5FF',
                    message: 'No slots available for this day. Try another date.',
                };
            case FILTERS.BOOKED:
                return {
                    icon: 'checkmark-circle-outline',
                    iconColor: '#34C759',
                    backgroundColor: '#DCFCE7',
                    message: "You haven't booked any slots yet.",
                };
            case FILTERS.CANCELLED:
                return {
                    icon: 'close-circle-outline',
                    iconColor: '#FF6A00',
                    backgroundColor: '#FEE2E2',
                    message: 'No cancelled slots found.',
                };
            case FILTERS.ALL:
            default:
                return {
                    icon: 'calendar-outline',
                    iconColor: '#6B7280',
                    backgroundColor: '#F3F4F6',
                    message: 'No slots available for this day.',
                };
        }
    };

    const config = getEmptyStateConfig();

    return (
        <View style={styles.container}>
            <View style={[styles.iconWrapper, { backgroundColor: config.backgroundColor }]}>
                <Ionicons
                    name={config.icon}
                    size={isTablet ? 82 : 48}
                    color={config.iconColor}
                    />
            </View>
            <Text style={styles.message}>{config.message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 60,
    },
    iconWrapper: {
    width: isTablet ? 180 : 100,
    height: isTablet ? 180 : 100,
    borderRadius: isTablet ? 90 : 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isTablet ? 32 : 20,
},
    message: {
    fontSize: isTablet ? 28 : 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: isTablet ? 42 : 24,
    fontWeight: '500',
},
});
