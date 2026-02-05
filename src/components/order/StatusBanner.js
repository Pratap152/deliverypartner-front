import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ORDER_STATUS } from '../../config/orderStates';

const StatusBanner = ({ status, etaMinutes }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();

        return () => pulse.stop();
    }, []);

    const getConfig = () => {
        switch (status) {
            case ORDER_STATUS.PICKUP_ASSIGNED:
                return {
                    colors: ['#FFA000', '#FFCA28'], // Amber/Gold
                    text: 'Heading to Pickup',
                    icon: '🛵'
                };
            case ORDER_STATUS.AT_RESTAURANT:
            case ORDER_STATUS.ORDER_PICKED_UP:
                return {
                    colors: ['#00Bfa5', '#64FFDA'], // Teal/Mint
                    text: status === ORDER_STATUS.AT_RESTAURANT ? 'At Restaurant' : 'Order Picked Up',
                    icon: '🍲'
                };
            case ORDER_STATUS.AT_DROP:
                return {
                    colors: ['#2979FF', '#448AFF'], // Blue
                    text: 'Arrived at Drop Location',
                    icon: '📍'
                };
            case ORDER_STATUS.ORDER_DELIVERED:
                return {
                    colors: ['#43A047', '#66BB6A'], // Green
                    text: 'Delivered Successfully',
                    icon: '🎉'
                };
            default:
                return {
                    colors: ['#424242', '#757575'], // Grey
                    text: 'Processing Order',
                    icon: '⏳'
                };
        }
    };

    const config = getConfig();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={config.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    <View style={styles.left}>
                        <Animated.View style={[styles.dot, { transform: [{ scale: pulseAnim }] }]} />
                        <Text style={styles.statusText}>{config.icon} {config.text}</Text>
                    </View>

                    {etaMinutes && (
                        <View style={styles.right}>
                            <Text style={styles.etaLabel}>ETA</Text>
                            <Text style={styles.etaValue}>{etaMinutes} min</Text>
                        </View>
                    )}
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: wp('4%'),
        marginBottom: hp('2%'),
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        overflow: 'hidden',
    },
    gradient: {
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('4%'),
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('2%'),
    },
    dot: {
        width: wp('2.5%'),
        height: wp('2.5%'),
        borderRadius: wp('1.25%'),
        backgroundColor: '#FFFFFF',
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: wp('4%'),
        fontWeight: '700',
        marginLeft: wp('2%'),
    },
    right: {
        alignItems: 'flex-end',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('0.5%'),
        borderRadius: wp('2%'),
    },
    etaLabel: {
        color: '#FFFFFF',
        fontSize: wp('2.5%'),
        fontWeight: '600',
        opacity: 0.9,
    },
    etaValue: {
        color: '#FFFFFF',
        fontSize: wp('3.5%'),
        fontWeight: '800',
    },
});

export default StatusBanner;
