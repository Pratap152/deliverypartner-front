import React, { memo } from 'react';
import {
    Modal,
    View,
    StyleSheet,
    FlatList,
    Text,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import OrderCard from './OrderCard';

/**
 * OrderQueueModal Component
 * Handles multiple orders in a scrollable list matching reference UI.
 */
const OrderQueueModal = ({
    visible,
    orderQueue = [],
    loading,
    onAccept,
    onClose,
}) => {
    if (!visible || orderQueue.length === 0) return null;

    const renderItem = ({ item }) => {
        const { data, countdown } = item;
        return (
            <OrderCard
                distance={`${data.distanceKm || 0} kms`}
                price={data.estimatedEarning || 0}
                items={data.itemCount || 1}
                pickup={data.vendorShopName || 'Store Location'}
                drop={data.dropLocation?.address || data.dropAddress || 'Customer Location'}
                timeLeft={countdown}
                loading={loading}
                onAccept={() => onAccept(data.orderId)}
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
                    
                    <FlatList
                        data={orderQueue}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
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
    title: {
        fontSize: wp('4%'),
        fontWeight: '700',
        color: '#64748b',
        marginBottom: hp('2%'),
        textAlign: 'center',
    },
});
