import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * LockedWeekView Component
 * Displays when next week slots are locked
 * 
 * @param {string} message - Optional custom lock message
 */
export default function LockedWeekView({ message = 'Slots will be unlocked next 2 hours' }) {
    return (
        <View style={styles.lockedContainer}>
            <View style={styles.lockIconWrapper}>
                <Ionicons name="lock-closed" size={60} color="#6B7280" />
            </View>
            <Text style={styles.lockedText}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    lockedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    lockIconWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    lockedText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        fontWeight: '500',
    },
});
