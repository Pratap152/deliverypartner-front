import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { orderService } from '../../services/order/OrderService';
import { ORDER_STATUS } from '../../config/orderStates';

const { width } = Dimensions.get('window');

const QRScannerScreen = ({ navigation, route }) => {
    useEffect(() => {
        // Determine the next status based on params or default logic
        const nextStatus = route.params?.nextStatus || ORDER_STATUS.AT_DROP;

        // Auto-mock scan after 2 seconds for quicker testing
        const timer = setTimeout(() => {
            handleScanSuccess(nextStatus);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    const handleScanSuccess = async (nextStatus) => {
        try {
            const { orderId } = route.params || {};
            if (!orderId) {
                console.error("No Order ID provided");
                return;
            }
            await orderService.updateOrderStatus(orderId, nextStatus);
            navigation.replace('OrderDetailsScreen', { status: nextStatus, orderId });
        } catch (error) {
            console.error("Scan failed", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cameraPreview}>
                <Text style={styles.scanText}>Scanning QR Code...</Text>
                <View style={styles.scannerFrame} />
                <Text style={styles.hintText}>Align the QR code within the frame to verify delivery location</Text>
            </View>

            <TouchableOpacity
                style={styles.manualBtn}
                onPress={() => handleScanSuccess(route.params?.nextStatus || ORDER_STATUS.AT_DROP)}
            >
                <Text style={styles.btnText}>Simulate Success</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    cameraPreview: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanText: {
        color: '#fff',
        fontSize: wp('5%'),
        marginBottom: hp('5%'),
        fontWeight: '600',
    },
    scannerFrame: {
        width: width * 0.7,
        height: width * 0.7,
        borderWidth: 2,
        borderColor: '#00FF00',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
    },
    hintText: {
        color: '#ccc',
        marginTop: hp('5%'),
        width: '80%',
        textAlign: 'center',
    },
    manualBtn: {
        position: 'absolute',
        bottom: hp('5%'),
        alignSelf: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    },
    btnText: {
        color: '#000',
        fontWeight: 'bold',
    },
});

export default QRScannerScreen;
