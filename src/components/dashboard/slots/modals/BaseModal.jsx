import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';

/**
 * BaseModal - Reusable modal wrapper component
 * Provides consistent modal overlay and card structure
 * 
 * @param {boolean} visible - Whether modal is visible
 * @param {function} onClose - Handler for closing modal
 * @param {ReactNode} children - Modal content
 * @param {object} cardStyle - Optional custom card styles
 * @param {string} animationType - Modal animation type
 */
export default function BaseModal({
    visible,
    onClose,
    children,
    cardStyle,
    animationType = 'fade'
}) {
    return (
        <Modal
            transparent
            visible={visible}
            animationType={animationType}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.card, cardStyle]}>
                    {children}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '90%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
    },
});
