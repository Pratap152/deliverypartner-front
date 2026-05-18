import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default function InfoRow({ label, value, style }) {
    return (
        <View style={[styles.row, style]}>
            <Text style={styles.label}>{label}</Text>
            {typeof value === 'string' ? (
                <Text style={styles.value}>{value}</Text>
            ) : (
                value
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 6,
    },
    label: {
        fontSize: 13,
        color: '#8E8E93',
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
});
