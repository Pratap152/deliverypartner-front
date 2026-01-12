import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * SlotInfoRow - Reusable component for displaying slot information
 * Used in BookSlotModal and CancelSlotModal
 * 
 * @param {string} icon - Ionicon name
 * @param {string} iconColor - Icon color
 * @param {string} backgroundColor - Icon box background color
 * @param {string} label - Label text (e.g., "Day", "Time")
 * @param {string|ReactNode} value - Value to display
 */
export default function SlotInfoRow({
    icon,
    iconColor,
    backgroundColor,
    label,
    value
}) {
    return (
        <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor }]}>
                <Ionicons name={icon} size={20} color={iconColor} />
            </View>
            <View>
                <Text style={styles.label}>{label}</Text>
                {typeof value === 'string' ? (
                    <Text style={styles.value}>{value}</Text>
                ) : (
                    value
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    label: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 2,
    },
    value: {
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '600',
    },
});
