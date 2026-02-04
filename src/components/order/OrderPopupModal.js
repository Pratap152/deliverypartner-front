import React, { memo } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Animated,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import EarningsCard from './EarningsCard';
import RouteInfoCard from './RouteInfoCard';
import CountdownTimer from './CountdownTimer';

/**
 * OrderPopupModal Component
 * Main modal for displaying new order details and accepting/rejecting orders
 * 
 * Follows Single Responsibility Principle - only handles modal presentation and user actions
 * Uses composition with specialized sub-components
 * 
 * @param {boolean} visible - Whether the modal is visible
 * @param {object} order - Order data from WebSocket
 * @param {number} countdown - Remaining seconds
 * @param {boolean} loading - Loading state during accept/reject
 * @param {function} onAccept - Callback when accept button is pressed
 * @param {function} onReject - Callback when reject button is pressed
 */
const OrderPopupModal = ({
    visible,
    order,
    countdown,
    loading,
    onAccept,
    onReject,
}) => {
    if (!order) return null;

    const {
        orderId,
        vendorShopName,
        pickupLocation,
        dropLocation,
        distanceKm,
        etaMinutes,
        estimatedEarning,
    } = order;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={onReject}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>🚚 New Order Available</Text>
                        <Text style={styles.orderId}>#{orderId}</Text>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        {/* Earnings - Most Prominent */}
                        <EarningsCard amount={estimatedEarning} />

                        {/* Route Information */}
                        <RouteInfoCard
                            vendorName={vendorShopName}
                            customerName={dropLocation?.name}
                            distanceKm={distanceKm}
                            etaMinutes={etaMinutes}
                        />

                        {/* Countdown Timer */}
                        <CountdownTimer seconds={countdown} totalSeconds={20} />

                        {/* Action Buttons */}
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#00C4B4" />
                                <Text style={styles.loadingText}>Processing...</Text>
                            </View>
                        ) : (
                            <View style={styles.actions}>
                                <TouchableOpacity
                                    style={styles.acceptButton}
                                    onPress={onAccept}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.acceptButtonText}>ACCEPT ORDER</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.rejectButton}
                                    onPress={onReject}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.rejectButtonText}>Reject</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default memo(OrderPopupModal);

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#F8F9FA',
        borderTopLeftRadius: wp('6%'),
        borderTopRightRadius: wp('6%'),
        paddingBottom: hp('3%'),
        maxHeight: hp('85%'),
    },
    header: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: wp('6%'),
        borderTopRightRadius: wp('6%'),
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('5%'),
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: wp('5%'),
        fontWeight: '700',
        color: '#1C1C1C',
        marginBottom: hp('0.5%'),
    },
    orderId: {
        fontSize: wp('3.2%'),
        color: '#6B6B6B',
        fontWeight: '600',
    },
    content: {
        paddingHorizontal: wp('5%'),
        paddingTop: hp('2%'),
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: hp('3%'),
    },
    loadingText: {
        marginTop: hp('1%'),
        fontSize: wp('3.5%'),
        color: '#6B6B6B',
        fontWeight: '600',
    },
    actions: {
        gap: hp('1.2%'),
    },
    acceptButton: {
        backgroundColor: '#00C4B4',
        paddingVertical: hp('2%'),
        borderRadius: wp('3%'),
        alignItems: 'center',
        shadowColor: '#00C4B4',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    acceptButtonText: {
        color: '#FFFFFF',
        fontSize: wp('4.5%'),
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    rejectButton: {
        backgroundColor: 'transparent',
        paddingVertical: hp('1.5%'),
        borderRadius: wp('3%'),
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FF4B4B',
    },
    rejectButtonText: {
        color: '#FF4B4B',
        fontSize: wp('3.8%'),
        fontWeight: '600',
    },
});
