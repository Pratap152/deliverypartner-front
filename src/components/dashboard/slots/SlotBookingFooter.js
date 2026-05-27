import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';



const { width } = Dimensions.get('window');
const isTablet = width >= 768;
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
    bottom: isTablet ? 30 : 20,
    left: isTablet ? 40 : 20,
    right: isTablet ? 40 : 20,
    backgroundColor: '#FFF',
    padding: isTablet ? 24 : 16,
    borderRadius: isTablet ? 24 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
},
    selectedText: {
    fontSize: isTablet ? 22 : 16,
    fontWeight:'600'
},
   bookButton: {
    backgroundColor: '#4C4CFF',

    paddingVertical: isTablet ? 16 : 12,

    paddingHorizontal: isTablet ? 30 : 24,

    borderRadius: isTablet ? 16 : 12,

    minWidth: isTablet ? 170 : undefined,

    alignItems: 'center',
    justifyContent: 'center',
},
    bookButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: isTablet ? 18 : 14,
},
});
