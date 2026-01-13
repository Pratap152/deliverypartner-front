import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TABS } from '../../../utils/constants/slotConstants';

/**
 * SlotBookingHeader Component
 * Displays the header with title, support icon, and week tabs
 * 
 * @param {string} activeTab - Currently active tab (TABS.CURRENT or TABS.NEXT)
 * @param {function} onTabChange - Handler when tab is changed
 */
export default function SlotBookingHeader({ activeTab, onTabChange }) {
    return (
        <View style={styles.header}>
            {/* Header Top Row */}
            <View style={styles.headerTop}>
                <Text style={styles.headerTitle}>My Slots</Text>
                <TouchableOpacity>
                    <Ionicons name="headset" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* Tab Container */}
            <View style={styles.tabContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <TouchableOpacity
                        style={[styles.tab, activeTab === TABS.CURRENT && styles.activeTab]}
                        onPress={() => onTabChange(TABS.CURRENT)}
                    >
                        <Text style={[styles.tabText, activeTab === TABS.CURRENT && styles.activeTabText]}>
                            Current Week
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === TABS.NEXT && styles.activeTab]}
                        onPress={() => onTabChange(TABS.NEXT)}
                    >
                        <Text style={[styles.tabText, activeTab === TABS.NEXT && styles.activeTabText]}>
                            Next Week
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === TABS.UPCOMING && styles.activeTab]}
                        onPress={() => onTabChange(TABS.UPCOMING)}
                    >
                        <Text style={[styles.tabText, activeTab === TABS.UPCOMING && styles.activeTabText]}>
                            Upcoming Week
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#4C4CFF',
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFF',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
        borderRadius: 10,
        marginRight: 8,
    },
    activeTab: {
        backgroundColor: '#FFF',
    },
    tabText: {
        color: '#E0E0E0',
        fontWeight: '600',
        fontSize: 14,
    },
    activeTabText: {
        color: '#4C4CFF',
        fontWeight: '700',
    },
});
