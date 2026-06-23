import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const LocationBlocker = ({ visible, onEnable }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <MaterialIcons
                        name="location-off"
                        size={60}
                        color="#FF6B35"
                    />

                    <Text style={styles.title}>
                        Location Required
                    </Text>

                    <Text style={styles.description}>
                        To receive orders and track deliveries,
                        please enable Location Permission,
                        Allow All The Time Access and GPS.
                    </Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={onEnable}>
                        <Text style={styles.buttonText}>
                            Enable Location
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default LocationBlocker;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    card: {
        width: '90%',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        elevation: 10,
    },

    title: {
        marginTop: 15,
        fontSize: 22,
        fontWeight: '700',
        color: '#1F2937',
    },

    description: {
        marginTop: 10,
        textAlign: 'center',
        color: '#6B7280',
        lineHeight: 22,
        fontSize: 15,
    },

    button: {
        marginTop: 25,
        backgroundColor: '#2563EB',
        width: '100%',
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});