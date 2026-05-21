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
    distanceToTarget
}) => {
    // If there are no bottom buttons, don't render anything
    if (!ui?.bottomButtons || ui.bottomButtons.length === 0) {
        return null;
    }

    // ─── Button enable/disable logic ─────────────────────────────────────────
    //
    // Flow:
    //  ASSIGNED          → "Navigate to Pickup"    → navigation, always enabled
    //  EN_ROUTE_TO_PICKUP → "Reached Restaurant"   → 5m check vs pickup location
    //  PICKED_UP         → "Navigate to Drop"      → navigation, always enabled
    //  EN_ROUTE_TO_DROP  → "Order Delivered"       → 5m check vs drop location
    //  EN_ROUTE_TO_DROP (COD) → "Collect Cash" /
    //                      "Confirm Online Payment" → always enabled (payment step)
    //
    // NOTE: Set FORCE_PRODUCTION_TEST = true to test the 5m restriction in dev
    //       using your fake GPS app. Set back to false before committing.
    const FORCE_PRODUCTION_TEST = true;

    const isDevMode = (typeof __DEV__ !== 'undefined' ? __DEV__ : true) && !FORCE_PRODUCTION_TEST;

    // Navigation buttons (Navigate to Pickup / Navigate to Drop) are always enabled.
    const isNavigationAction = !!ui.bottomButtons?.[0]?.navigateTo;

    // COD payment buttons are always enabled — rider is already at drop by this stage.
    const isCOD = status === 'EN_ROUTE_TO_DROP' && (
        orderDetails?.payment?.method?.toUpperCase() === 'COD' ||
        orderDetails?.payment?.paymentMethod?.toUpperCase() === 'COD' ||
        orderDetails?.payment?.mode?.toUpperCase() === 'COD'
    );

    // Only "Reached Restaurant" and "Order Delivered" buttons respect the 5m gate.
    // distanceToTarget is automatically pointed at the correct address by OrderDetailsScreen:
    //   ASSIGNED / EN_ROUTE_TO_PICKUP → distance to pickup address
    //   all other statuses            → distance to drop address
    const isDistanceBlocked = !isDevMode && !isNavigationAction && !isCOD && (
        distanceToTarget === null ||
        distanceToTarget === undefined ||
        distanceToTarget > 5
    );

    // 🔍 DEBUG — remove after testing
    console.log('[SwipeButton]', {
        status,
        distanceToTarget,
        isDevMode,
        isNavigationAction,
        isCOD,
        isDistanceBlocked,
        FORCE_PRODUCTION_TEST,
    });

    const buttonText = isCOD
        ? (paymentMethod === 'CASH' ? 'Collect Cash' : 'Confirm Online Payment')
        : ui.bottomButtons?.[0]?.label;

    return (
        <View style={styles.stickyButtonContainer}>
            <TouchableOpacity
                style={[
                    styles.actionButton,
                    (buttonLoading || isDistanceBlocked) && styles.actionButtonDisabled
                ]}
                onPress={handleAction}
                disabled={buttonLoading || isDistanceBlocked}
                activeOpacity={0.8}
            >
                {buttonLoading ? (
                    <>
                        <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 10 }} />
                        <Text style={styles.actionButtonText}>Loading...</Text>
                    </>
                ) : (
                    <Text style={styles.actionButtonText}>
                        {buttonText}
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
        backgroundColor: '#00C4B4',
        paddingVertical: hp('2.2%'),
        borderRadius: wp('14%'),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: '#00C4B4',
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
