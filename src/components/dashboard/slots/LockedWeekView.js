import React from 'react';
import { View, Text, StyleSheet,Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function LockedWeekView({ message = 'Upcoming Week Slots will be Unlocked Soon!' }) {
    return (
        <View style={styles.lockedContainer}>
            <View style={styles.lockIconWrapper}>
                <Ionicons 
                    name="lock-closed" 
                    size={isTablet ? 90 : 60} 
                    color="#6B7280" 
                    />
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
    width: isTablet ? 180 : 120,
    height: isTablet ? 180 : 120,
    borderRadius: isTablet ? 90 : 60,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isTablet ? 36 : 24,
},
    lockedText: {
    fontSize: isTablet ? 28 : 16,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: isTablet ? 40 : 24,
},
});
