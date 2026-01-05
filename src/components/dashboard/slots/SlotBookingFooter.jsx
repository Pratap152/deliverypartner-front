import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * SlotBookingFooter Component
 * Floating footer showing selection count and book button
 * 
 * @param {number} selectedCount - Number of selected slots
 * @param {function} onBook - Handler when book button is pressed
 * @param {boolean} visible - Whether footer should be visible
 */
export default function SlotBookingFooter({ selectedCount, onBook, visible = true }) {
    if (!visible || selectedCount === 0) {
        return null;
    }

    return (
        <View style={styles.footerContainer}>
            <Text style={styles.selectedText}>
                {selectedCount} {selectedCount === 1 ? 'Slot' : 'Slots'} Selected
            </Text>
            <TouchableOpacity style={styles.bookButton} onPress={onBook}>
                <Text style={styles.bookButtonText}>Book Selection</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    footerContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    selectedText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    bookButton: {
        backgroundColor: '#4C4CFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    bookButtonText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 14,
    },
});
