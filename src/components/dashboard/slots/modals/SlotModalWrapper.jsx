import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * SlotModalWrapper - Reusable modal structure for slot-related modals
 * Provides consistent layout: header, scrollable content, footer with buttons
 * 
 * @param {boolean} visible - Whether modal is visible
 * @param {string} title - Modal header title
 * @param {string} headerColor - Header background color
 * @param {function} onClose - Close handler
 * @param {ReactNode} children - Modal content
 * @param {string} primaryButtonText - Primary button label
 * @param {string} primaryButtonColor - Primary button background color
 * @param {function} onPrimaryPress - Primary button handler
 * @param {string} secondaryButtonText - Secondary button label
 * @param {function} onSecondaryPress - Secondary button handler
 */
export default function SlotModalWrapper({
    visible,
    title,
    headerColor = '#4C4CFF',
    onClose,
    children,
    primaryButtonText = 'Confirm',
    primaryButtonColor = '#4C4CFF',
    onPrimaryPress,
    secondaryButtonText = 'Cancel',
    onSecondaryPress,
}) {
    if (!visible) return null;

    return (
        <View style={styles.modalOverlay} pointerEvents="box-none">
            <View style={styles.modalContainer}>

                {/* --- HEADER --- */}
                <View style={[styles.header, { backgroundColor: headerColor }]}>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* --- SCROLLABLE CONTENT --- */}
                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </ScrollView>

                {/* --- FOOTER BUTTONS --- */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={onSecondaryPress || onClose}
                    >
                        <Text style={styles.secondaryText}>{secondaryButtonText}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.primaryButton, { backgroundColor: primaryButtonColor }]}
                        onPress={onPrimaryPress}
                    >
                        <Text style={styles.primaryText}>{primaryButtonText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        width: '100%',
        maxHeight: SCREEN_HEIGHT * 0.85,
        overflow: 'hidden',
    },

    // Header
    header: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },

    // Scroll Area
    scrollContainer: {
        maxHeight: '70%',
    },
    scrollContent: {
        padding: 20,
    },

    // Footer
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    secondaryButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB',
    },
    secondaryText: {
        color: '#4B5563',
        fontWeight: '600',
        fontSize: 16,
    },
    primaryButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
    },
});
