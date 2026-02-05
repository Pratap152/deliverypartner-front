import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const SkeletonItem = ({ style }) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();

        return () => pulse.stop();
    }, []);

    return (
        <Animated.View style={[styles.skeletonBase, style, { opacity }]} />
    );
};

const OrderSkeleton = () => {
    return (
        <View style={styles.container}>
            {/* Header Skeleton */}
            <View style={styles.header}>
                <SkeletonItem style={styles.headerIcon} />
                <View style={styles.headerText}>
                    <SkeletonItem style={styles.headerTitle} />
                    <SkeletonItem style={styles.headerSubtitle} />
                </View>
            </View>

            {/* Status Banner Skeleton */}
            <SkeletonItem style={styles.statusBanner} />

            {/* Address Cards Skeleton */}
            <View style={styles.card}>
                <View style={styles.row}>
                    <SkeletonItem style={styles.iconCircle} />
                    <View style={styles.addressText}>
                        <SkeletonItem style={styles.lineLarge} />
                        <SkeletonItem style={styles.lineSmall} />
                    </View>
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.row}>
                    <SkeletonItem style={styles.iconCircle} />
                    <View style={styles.addressText}>
                        <SkeletonItem style={styles.lineLarge} />
                        <SkeletonItem style={styles.lineSmall} />
                    </View>
                </View>
            </View>

            {/* Items Skeleton */}
            <View style={styles.card}>
                <SkeletonItem style={styles.sectionTitle} />
                {[1, 2].map((i) => (
                    <View key={i} style={styles.itemRow}>
                        <SkeletonItem style={styles.itemImage} />
                        <View style={{ flex: 1 }}>
                            <SkeletonItem style={styles.lineLarge} />
                        </View>
                        <SkeletonItem style={styles.qtyBadge} />
                    </View>
                ))}
            </View>

            {/* Earnings Skeleton */}
            <SkeletonItem style={styles.earningsCard} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    skeletonBase: {
        backgroundColor: '#E1E9EE',
        borderRadius: 4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('2%'),
    },
    headerIcon: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('6%'),
        marginRight: wp('3%'),
    },
    headerText: {
        flex: 1,
        gap: 8,
    },
    headerTitle: {
        width: '60%',
        height: 20,
        borderRadius: 4,
    },
    headerSubtitle: {
        width: '40%',
        height: 14,
        borderRadius: 4,
    },
    statusBanner: {
        width: '100%',
        height: hp('8%'),
        borderRadius: wp('4%'),
        marginBottom: hp('2%'),
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: wp('4%'),
        padding: wp('4%'),
        marginBottom: hp('1.5%'),
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: wp('10%'),
        height: wp('10%'),
        borderRadius: wp('5%'),
        marginRight: wp('3%'),
    },
    addressText: {
        flex: 1,
        gap: 6,
    },
    lineLarge: {
        width: '70%',
        height: 16,
        borderRadius: 4,
    },
    lineSmall: {
        width: '90%',
        height: 12,
        borderRadius: 4,
    },
    sectionTitle: {
        width: '40%',
        height: 18,
        marginBottom: 12,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 10,
    },
    itemImage: {
        width: 40,
        height: 40,
        borderRadius: 8,
    },
    qtyBadge: {
        width: 30,
        height: 20,
        borderRadius: 10,
    },
    earningsCard: {
        width: '100%',
        height: hp('20%'),
        borderRadius: wp('4%'),
        marginBottom: hp('2%'),
    },
});

export default OrderSkeleton;
