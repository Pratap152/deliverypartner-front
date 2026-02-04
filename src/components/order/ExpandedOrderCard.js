import React, { memo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import EarningsCard from './EarningsCard';
import RouteInfoCard from './RouteInfoCard';
import CountdownTimer from './CountdownTimer';

/**
 * ExpandedOrderCard Component (Open/Closed Principle)
 * Displays full order details with all information
 * Slide + Fade animation when switching orders
 */
const ExpandedOrderCard = ({ order, loading, onAccept, onReject }) => {
    // Animation values
    const slideAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const prevOrderIdRef = useRef(null);

    if (!order || !order.data) return null;

    const { data, countdown = 60 } = order;
    const {
        orderId,
        vendorShopName,
        dropLocation,
        distanceKm,
        etaMinutes,
        estimatedEarning,
    } = data;

    // Trigger animation when order changes
    useEffect(() => {
        // Only animate if order ID changed (not first render)
        if (prevOrderIdRef.current && prevOrderIdRef.current !== orderId) {
            // Phase 1: Slide out to left + Fade out (old card)
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -100, // Slide left
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0, // Fade out
                    duration: 200,
                    useNativeDriver: false,
                }),
            ]).start(() => {
                // Phase 2: Reset position to right + invisible
                slideAnim.setValue(100); // Start from right
                fadeAnim.setValue(0);

                // Phase 3: Slide in from right + Fade in (new card)
                Animated.parallel([
                    Animated.spring(slideAnim, {
                        toValue: 0, // Center
                        tension: 60,
                        friction: 8,
                        useNativeDriver: false,
                    }),
                    Animated.timing(fadeAnim, {
                        toValue: 1, // Fully visible
                        duration: 300,
                        useNativeDriver: false,
                    }),
                ]).start();
            });
        } else {
            // First render - no animation
            slideAnim.setValue(0);
            fadeAnim.setValue(1);
        }

        prevOrderIdRef.current = orderId;
    }, [orderId]);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateX: slideAnim }],
                    opacity: fadeAnim,
                }
            ]}
        >
            {/* Order ID */}
            <View style={styles.orderIdContainer}>
                <Text style={styles.orderIdLabel}>Order</Text>
                <Text style={styles.orderId}>#{orderId}</Text>
            </View>

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
            <CountdownTimer seconds={countdown} totalSeconds={60} />

            {/* Action Buttons - SIDE BY SIDE */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00C4B4" />
                    <Text style={styles.loadingText}>Processing...</Text>
                </View>
            ) : (
                <View style={styles.actionsRow}>
                    {/* Accept Button - Left */}
                    <TouchableOpacity
                        style={[styles.button, styles.acceptButton]}
                        onPress={onAccept}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.acceptButtonText}>✓ ACCEPT</Text>
                    </TouchableOpacity>

                    {/* Reject Button - Right */}
                    <TouchableOpacity
                        style={[styles.button, styles.rejectButton]}
                        onPress={onReject}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.rejectButtonText}>✕ REJECT</Text>
                    </TouchableOpacity>
                </View>
            )}
        </Animated.View>
    );
};

export default memo(ExpandedOrderCard);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: wp('4%'),
        padding: wp('4%'),
        marginBottom: hp('1.2%'),
        borderWidth: 2,
        borderColor: '#00B26F',
        shadowColor: '#00B26F',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 8,
    },
    orderIdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp('1.5%'),
    },
    orderIdLabel: {
        fontSize: wp('3.5%'),
        color: '#6B6B6B',
        fontWeight: '600',
        marginRight: wp('1.5%'),
    },
    orderId: {
        fontSize: wp('3.5%'),
        color: '#1C1C1C',
        fontWeight: '700',
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: hp('2%'),
    },
    loadingText: {
        marginTop: hp('1%'),
        fontSize: wp('3.5%'),
        color: '#6B6B6B',
        fontWeight: '600',
    },
    actionsRow: {
        flexDirection: 'row',
        marginTop: hp('1%'),
    },
    button: {
        flex: 1,
        paddingVertical: hp('1.8%'),
        borderRadius: wp('3%'),
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: wp('1.5%'),
    },
    acceptButton: {
        backgroundColor: '#00C4B4',
        shadowColor: '#00C4B4',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    acceptButtonText: {
        color: '#FFFFFF',
        fontSize: wp('4%'),
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    rejectButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#FF4B4B',
    },
    rejectButtonText: {
        color: '#FF4B4B',
        fontSize: wp('4%'),
        fontWeight: '700',
    },
});
