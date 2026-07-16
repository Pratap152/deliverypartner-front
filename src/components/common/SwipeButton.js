import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const SwipeButton = ({
    ui,
    buttonLoading,
    handleAction,
    status,
    orderDetails,
    paymentMethod,
    paymentCollected,
    distanceToTarget
}) => {
    // If there are no bottom buttons, don't render anything
    if (!ui?.bottomButtons || ui.bottomButtons.length === 0) {
        return null;
    }

    return (
        <View style={styles.stickyButtonContainer}>
            <TouchableOpacity
                style={[styles.actionButton, buttonLoading && styles.actionButtonDisabled]}
                onPress={handleAction}
                disabled={buttonLoading}
                activeOpacity={0.8}
            >
                {buttonLoading ? (
                    <>
                        <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 10 }} />
                        <Text style={styles.actionButtonText}>Loading...</Text>
                    </>
                ) : (
                    <Text style={styles.actionButtonText}>
                        {status === 'RIDER_ARRIVED_AT_DROP' && (
                            orderDetails?.payment?.method?.toUpperCase() === 'COD' ||
                            orderDetails?.payment?.paymentMethod?.toUpperCase() === 'COD' ||
                            orderDetails?.payment?.mode?.toUpperCase() === 'COD'
                        )
                            ? (
                                paymentCollected
                                    ? 'Deliver Order'
                                    : (paymentMethod === 'CASH'
                                        ? 'Collect Cash'
                                        : 'Confirm Online Payment')
                            )
                            : ui.bottomButtons?.[0]?.label}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    stickyButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: wp('4%'),
        paddingTop: hp('2%'),
        paddingBottom: hp('3%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    actionButton: {
        backgroundColor: '#1F3365',
        paddingVertical: hp('2.2%'),
        borderRadius: wp('14%'),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: '#1F3365',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    actionButtonDisabled: {
        backgroundColor: '#94A3B8',
        opacity: 0.7,
    },
    actionButtonText: {
        fontSize: wp('4.2%'),
        fontWeight: '700',
        color: '#FFFFFF',
        fontFamily: 'System',
        letterSpacing: 0.6,
    },
});

export default SwipeButton;
