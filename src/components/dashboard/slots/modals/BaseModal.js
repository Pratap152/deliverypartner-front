import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';


const { width } = Dimensions.get('window');
const isTablet = width >= 768;

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
    width: isTablet ? '70%' : '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: isTablet ? 28 : 16,
    padding: isTablet ? 32 : 20,
},
});
