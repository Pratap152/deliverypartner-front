import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { STATUS_CONFIG, DISPLAY_STATUS } from '../../../utils/constants/slotConstants';
import { Dimensions } from 'react-native';


const { width } = Dimensions.get('window');
const isTablet = width >= 768;
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
    paddingVertical: isTablet ? 14 : 8,
    paddingHorizontal: isTablet ? 36 : 24,
    borderRadius: 30,
    minWidth: isTablet ? 240 : 160,
    justifyContent: 'center',
},
    text: {
    fontSize: isTablet ? 22 : 14,
    fontWeight: '700',
    marginLeft: 8,
},
});
