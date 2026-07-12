
import React, { memo } from 'react';
import { useEffect } from "react";
import {
    Modal,
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import OrderCard from './OrderCard';
import {
  playOrderSound,
  stopOrderSound,
} from "../../utils/SoundManager";
/**
 * OrderQueueModal Component
 * Handles multiple orders in a scrollable list matching reference UI.
 */
const OrderQueueModal = ({
    visible,
    orderQueue = [],
    loading,
    onAccept,
    onReject,
    onClose,
}) => {

    useEffect(() => {
        if (visible) {
            playOrderSound();
        } else {
            stopOrderSound();
        }

        return () => stopOrderSound();
    }, [visible]);

    if (!visible) {
        return null;
    }

    const renderItem = ({ item }) => {
        const { data, countdown } = item;
        console.log("address", data)
        return (
            <OrderCard
    orderId={data.orderId}
    distance={`${data.distanceKm || 0} kms`}
    price={data.estimatedEarning || 0}
    items={data.itemCount || 1}
    pickup={data.pickupLocation?.addressLine || 'Store Location'}
    drop={data.dropLocation?.addressLine}
    timeLeft={countdown}
    loading={loading}
    onAccept={() => onAccept(data.orderId)}
    onReject={() => onReject(data.orderId)}
/>
        );
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <View style={styles.handle} />
                    </View>
                    
                    {orderQueue.length > 0 ? (
                        <FlatList
                            data={orderQueue}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyTitle}>No Orders Available</Text>
                            <Text style={styles.emptySubtitle}>We'll notify you when a new order arrives.</Text>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default memo(OrderQueueModal);

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        // backgroundColor: '#f1f5f9', // Light gray background to make white cards pop
        borderTopLeftRadius: wp('8%'),
        borderTopRightRadius: wp('8%'),
        maxHeight: hp('85%'),
        paddingBottom: hp('4%'),
    },
    header: {
        alignItems: 'center',
        paddingVertical: hp('1.5%'),
    },
    handle: {
        width: wp('12%'),
        height: 5,
        backgroundColor: '#cbd5e1',
        borderRadius: 3,
    },
    listContent: {
        paddingHorizontal: wp('5%'),
        paddingBottom: hp('2%'),
    },
    emptyContainer: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: wp('5%'),
        borderRadius: wp('5%'),
        padding: wp('8%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        fontSize: wp('5%'),
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: hp('1%'),
    },
    emptySubtitle: {
        fontSize: wp('3.8%'),
        color: '#64748b',
        textAlign: 'center',
        marginBottom: hp('3%'),
    },
    closeButton: {
        backgroundColor: '#f1f5f9',
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('10%'),
        borderRadius: wp('8%'),
    },
    closeButtonText: {
        color: '#475569',
        fontWeight: '700',
        fontSize: wp('4%'),
    },
    title: {
        fontSize: wp('4%'),
        fontWeight: '700',
        color: '#64748b',
        marginBottom: hp('2%'),
        textAlign: 'center',
    },
});
