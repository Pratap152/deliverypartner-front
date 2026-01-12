import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { STATUS_CONFIG, DISPLAY_STATUS } from '../../../utils/constants/slotConstants';

/**
 * StatusBadge - Reusable status badge component
 * Displays status with icon and label based on configuration
 * 
 * @param {string} status - Status type (AVAILABLE, BOOKED, CANCELLED)
 * @param {object} style - Optional custom styles
 */
export default function StatusBadge({ status, style }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG[DISPLAY_STATUS.AVAILABLE];

    return (
        <View style={[styles.badge, { backgroundColor: config.backgroundColor }, style]}>
            <Ionicons name={config.icon} size={16} color={config.textColor} />
            <Text style={[styles.text, { color: config.textColor }]}>
                {config.label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 20,
        minWidth: 160,
        justifyContent: 'center',
    },
    text: {
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 6,
    },
});
