import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { orderService } from '../../services/order/OrderService';

const { width } = Dimensions.get('window');

const QRScannerScreen = ({ navigation, route }) => {
    const orderId = route.params?.orderId;

    console.log('📱 QRScannerScreen - orderId:', orderId);

    useEffect(() => {
        // backend decides next state via API, NOT frontend constants
        const timer = setTimeout(() => {
            handleScanSuccess();
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    const handleScanSuccess = async () => {
        try {
            console.log('📱 Scanning complete for order:', orderId);

            // 👉 Decide action based on flow type passed from previous screen
            const type = route.params?.type;

            let res;

            if (type === 'pickupOrder') {
                res = await orderService.pickupOrder(orderId);
            } 
            else if (type === 'deliverOrder') {
                res = await orderService.deliverOrder(orderId);
            }
            else {
                throw new Error('Unknown scan type');
            }

            console.log('📱 API response:', res);

            // 🔥 Always fetch latest order (single source of truth)
            const updated = await orderService.getOrderDetails(orderId);

            navigation.replace('OrderDetailsScreen', {
                orderId,
                status: updated.orderStatus, // backend status only
            });

        } catch (error) {
            console.error("❌ QR scan failed:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cameraPreview}>
                <Text style={styles.scanText}>Scanning QR Code...</Text>
                <View style={styles.scannerFrame} />
                <Text style={styles.hintText}>
                    Align QR code inside frame
                </Text>
            </View>

            <TouchableOpacity
                style={styles.manualBtn}
                onPress={handleScanSuccess}
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
