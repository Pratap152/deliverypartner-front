import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';



const { height: SCREEN_HEIGHT, width } = Dimensions.get('window');
const isTablet = width >= 768;

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
    loading = false
}) {
    if (!visible) return null;

    return (
        <View style={styles.modalOverlay} pointerEvents="box-none">
            <View style={styles.modalContainer}>

                {/*HEADER*/}
                <View style={[styles.header, { backgroundColor: headerColor }]}>
                    <Text style={styles.headerTitle}>{title}</Text>
                    {!loading && (
                        <TouchableOpacity onPress={onClose} disabled={loading}>
                            <Ionicons name="close" size={24} color="#FFF" />
                        </TouchableOpacity>
                    )}
                </View>

                {/*SCROLLABLE CONTENT*/}
                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </ScrollView>

                {/*FOOTER BUTTONS*/}
                {loading ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={primaryButtonColor} />
                    </View>
                ) : (
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={onSecondaryPress || onClose}
                            disabled={loading}
                        >
                            <Text style={styles.secondaryText}>{secondaryButtonText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.primaryButton, { backgroundColor: primaryButtonColor }, loading && styles.disabledPrimaryButton]}
                            onPress={onPrimaryPress}
                            disabled={loading}
                        >
                            <Text style={styles.primaryText}>{primaryButtonText}</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
        borderRadius: isTablet ? 32 : 24,
        width: isTablet ? '75%' : '100%',
        maxHeight: SCREEN_HEIGHT * 0.85,
        overflow: 'hidden',
    },
    header: {
        padding: isTablet ? 30 : 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#FFF',
        fontSize: isTablet ? 30 : 18,
        fontWeight: '700',
    },
    // Scroll Area
    scrollContainer: {
        maxHeight: '70%',
    },
    scrollContent: {
        padding: 20,
    },
    footer: {
        padding: isTablet ? 28 : 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    secondaryButton: {
        flex: 1,
        paddingVertical: isTablet ? 20 : 14,
        borderRadius: isTablet ? 18 : 12,
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
        fontSize: isTablet ? 22 : 16,
    },
    primaryButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledPrimaryButton: {
        backgroundColor: '#CCCCCC',
    },
    primaryText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: isTablet ? 22 : 16,
    },
});
