import React, { memo } from 'react';
import {
    Modal,
    View,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import OrderQueueHeader from './OrderQueueHeader';
import ExpandedOrderCard from './ExpandedOrderCard';
import CompactOrderCard from './CompactOrderCard';

/**
 * OrderQueueModal Component (Dependency Inversion Principle)
 * Main container for multi-order queue system
 * Depends on abstractions (props), not concrete implementations
 */
const OrderQueueModal = ({
    visible,
    orderQueue = [],
    expandedOrderId,
    loading,
    onAccept,
    onReject,
    onExpand,
    onClose,
}) => {
    if (!visible || orderQueue.length === 0) return null;

    // Find expanded order and other orders
    const expandedOrder = orderQueue.find(o => o.id === expandedOrderId) || orderQueue[0];
    const otherOrders = orderQueue.filter(o => o.id !== expandedOrder?.id);

    if (!expandedOrder) {
        console.error("❌ OrderQueueModal - No expanded order found!");
        return null;
    }

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <OrderQueueHeader
                        count={orderQueue.length}
                        onClose={onClose}
                    />

                    {/* Scrollable Content */}
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        {/* Expanded Order (Always at top) */}
                        <ExpandedOrderCard
                            order={expandedOrder}
                            loading={loading}
                            onAccept={() => onAccept(expandedOrder.id)}
                            onReject={() => onReject(expandedOrder.id)}
                        />

                        {/* Other Orders (Compact Preview) */}
                        {otherOrders.length > 0 && (
                            <View style={styles.compactSection}>
                                {otherOrders.map((order) => {
                                    // Mark as "new" if received within last 3 seconds
                                    const isNew = (Date.now() - order.receivedAt) < 3000;

                                    return (
                                        <CompactOrderCard
                                            key={order.id}
                                            order={order}
                                            isNew={isNew}
                                            onPress={() => onExpand(order.id)}
                                        />
                                    );
                                })}
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default memo(OrderQueueModal);

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
        minHeight: hp('50%'),
        maxHeight: hp('90%'),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
    },
    scrollView: {
        flexGrow: 1,
    },
    scrollContent: {
        paddingHorizontal: wp('4%'),
        paddingTop: hp('2%'),
        paddingBottom: hp('3%'),
        flexGrow: 1,
    },
    compactSection: {
        marginTop: hp('1%'),
    },
});
