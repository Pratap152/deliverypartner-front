import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView, Image, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { ORDER_STATUS } from '../../config/orderStates';
import { orderUIConfig } from '../../config/orderUIConfig';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import OrderHeader from '../../components/order/OrderHeader';
import OrderAddressCard from '../../components/order/OrderAddressCard';
import OrderItemsCard from '../../components/order/OrderItemsCard';
import OrderEarningsCard from '../../components/order/OrderEarningsCard';
import SwipeButton from '../../components/common/SwipeButton';
import { orderService } from '../../services/order/OrderService';

const OrderDetailsScreen = ({ route, navigation }) => {
  const [status, setStatus] = useState(
    route?.params?.status ?? ORDER_STATUS.PICKUP_ASSIGNED
  );

  // State for API data
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract orderId from route params
  const orderId = route?.params?.orderId;
  console.log('📦 OrderDetailsScreen - orderId:', orderId, 'status:', status);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        console.error('❌ OrderDetailsScreen - No orderId provided');
        setError('Order ID is missing');
        setLoading(false);
        return;
      }

      try {
        console.log('🔄 OrderDetailsScreen - Fetching order details for:', orderId);
        setLoading(true);
        setError(null);

        const data = await orderService.getOrderDetails(orderId);
        console.log('✅ OrderDetailsScreen - Order data received:', JSON.stringify(data));

        setOrderData(data);
        setLoading(false);
      } catch (err) {
        console.error('❌ OrderDetailsScreen - Fetch failed:', err);
        setError(err.message || 'Failed to load order details');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const ui = orderUIConfig[status];

  // Helper to handle completion (Swipe)
  const handleSwipeSuccess = async () => {
    const action = ui.bottomButtons[0]; // Assuming primary action is first
    if (action && action.nextStatus) {
      try {
        console.log('👆 OrderDetailsScreen handleSwipeSuccess - orderId:', orderId, 'nextStatus:', action.nextStatus);
        const response = await orderService.updateOrderStatus(orderId, action.nextStatus);
        console.log('✅ OrderDetailsScreen - updateOrderStatus response:', JSON.stringify(response));

        setStatus(action.nextStatus);
        console.log('✅ Status updated successfully to:', action.nextStatus);

        // If delivered, capture earnings for success screen
        if (action.nextStatus === ORDER_STATUS.ORDER_DELIVERED && response) {
          console.log('💰 OrderDetailsScreen - Capturing earnings:', {
            earningCredited: response.earningCredited,
            codCollected: response.codCollected
          });
          setDeliveryResponse(response);
        }
      } catch (error) {
        console.error('❌ OrderDetailsScreen handleSwipeSuccess failed:', error);
      }
    }
  };

  // Helper handling navigation (Button)
  const handleNavigate = () => {
    const action = ui.bottomButtons.find(a => a.navigateTo);
    console.log('🧭 OrderDetailsScreen handleNavigate - orderId:', orderId, 'navigateTo:', action?.navigateTo);
    // Or default to map if current status implies navigation
    if (action && action.navigateTo) {
      navigation.navigate(action.navigateTo, {
        nextStatus: action.nextStatus,
        orderId, // Pass orderId to next screen
      });
    } else {
      // Fallback or specific logic if needed
      navigation.navigate('Map', { nextStatus: status, orderId }); // Just view map
    }
  };

  const primaryAction = ui.bottomButtons[0];
  const isNavigationAction = primaryAction?.navigateTo;

  // Store delivery response to pass to success screen
  const [deliveryResponse, setDeliveryResponse] = useState(null);

  // Effect to handle navigation to Success Screen if Delivered
  useEffect(() => {
    if (status === ORDER_STATUS.ORDER_DELIVERED && deliveryResponse) {
      // Short delay to show the change, then navigate
      setTimeout(() => {
        console.log('🎉 Navigating to SuccessfulDelivered with:', {
          amount: deliveryResponse.earningCredited,
          codCollected: deliveryResponse.codCollected
        });
        navigation.replace('SuccessfullDelivered', {
          amount: deliveryResponse.earningCredited || 0,
          codCollected: deliveryResponse.codCollected || 0,
          orderId: orderId
        });
      }, 500);
    }
  }, [status, deliveryResponse, navigation, orderId]);

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color="#00C4B4" />
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !orderData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.centerContent]}>
          <Text style={styles.errorText}>⚠️ {error || 'No order data'}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              setError(null);
              // Re-trigger fetch by navigating back and forth
              navigation.goBack();
            }}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          <OrderHeader
            orderId={orderData.orderId || orderId || 'N/A'}
            statusText={ui.headerText || "Active delivery in progress"}
            icon={ui.headerIcon}
          />

          {/* Address Logic - Dynamic from API */}
          {(status === ORDER_STATUS.PICKUP_ASSIGNED || status === ORDER_STATUS.AT_RESTAURANT) ? (
            <>
              <OrderAddressCard
                title="Pickup Location"
                name={orderData.pickupAddress?.name || orderData.vendorShopName || "Pickup Location"}
                address={orderData.pickupAddress?.addressLine || "Address not available"}
                iconType="store"
                theme="green"
              />
              <OrderAddressCard
                title="Drop Location"
                name={orderData.deliveryAddress?.name || "Customer"}
                address={orderData.deliveryAddress?.addressLine || "Address not available"}
                iconType="home"
                theme="red"
              />
            </>
          ) : (
            /* Show only Drop location (Deliver To) after pickup */
            <OrderAddressCard
              title="Deliver To"
              name={orderData.deliveryAddress?.name || "Customer"}
              address={orderData.deliveryAddress?.addressLine || "Address not available"}
              iconType="user"
              theme={status === ORDER_STATUS.AT_DROP ? "green" : "default"}
            />
          )}

          {/* Items from API */}
          <OrderItemsCard items={orderData.items || []} />

          {/* Earnings from API - show pricing (customer bill) */}
          <OrderEarningsCard pricing={orderData.pricing || {}} />

          {/* Map Placeholder: Visible only if config says showMap: true */}
          {/* Map Placeholder: Visible only if config says showMap: true */}
          {ui.showMap && (
            <View style={styles.mapWrapper}>
              <View style={styles.mapPlaceholder}>
                <Image
                  source={require('../../assets/map.png')}
                  style={styles.mapImage}
                  resizeMode="cover"
                />
              </View>

              {/* Navigate button BELOW the map */}
              <TouchableOpacity
                style={styles.navigateBtn}
                onPress={handleNavigate}
                activeOpacity={0.8}
              >
                <Text style={styles.navigateBtnText}>{primaryAction?.label || 'Navigate'} 📍</Text>
              </TouchableOpacity>
            </View>
          )}


          {!ui.showMap && ui.bottomButtons.length > 0 && (
            <SwipeButton
              title={primaryAction?.label || 'Swipe to Confirm'}
              onSwipeSuccess={handleSwipeSuccess}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetailsScreen;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container: {
    flex: 1,
    paddingHorizontal: wp('4%'),
    paddingTop: hp('1%'),
    padding: 20,
    marginTop: 10
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp('1.5%'),
  },

  headerTextContainer: {
    flex: 1,
  },

  helpIconWrapper: {
    width: wp('13%'),
    height: wp('13%'),
    borderRadius: wp('5%'),
    backgroundColor: '#E8F7F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5
  },

  helpIcon: {
    fontSize: wp('5%'),
  },

  header: {
    fontSize: wp('5.5%'),
    fontWeight: '700',
    color: '#1C1C1C',
    marginTop: 10
  },
  subHeader: {
    fontSize: wp('3.2%'),
    color: '#6B6B6B',
    marginBottom: hp('1.5%'),
    marginTop: 10
  },
  button: {
    backgroundColor: '#E5ECFF',
    paddingVertical: hp('1.8%'),
    borderRadius: wp('12%'),
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: hp('1%'),
  },
  buttonText: {
    fontSize: wp('3.6%'),
    fontWeight: '600',
    color: '#1C1C1C',
  },
  mapContainer: {
    marginTop: hp('2%'),
    marginBottom: hp('2%'),
  },
  mapWrapper: {
    marginBottom: hp('2%'),
  },
  mapPlaceholder: {
    height: hp('15%'),
    borderRadius: wp('4%'),
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    marginBottom: hp('1.5%'), // space between map & button
  },

  mapImage: {
    width: '100%',
    height: '100%',
  },
  navigateBtn: {
    backgroundColor: '#00C4B4',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('1.8%'),
    borderRadius: wp('12%'),
    width: '100%',
  },

  navigateBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: wp('4%'),
    marginRight: 10,
  },
  navigateIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigateArrow: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bottomStandardBtn: {
    backgroundColor: '#00C4B4', // Updated to Teal
    paddingVertical: hp('1.8%'),
    borderRadius: wp('12%'),
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: hp('2%'),
  },
  bottomStandardBtnText: {
    fontSize: wp('3.6%'),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('5%'),
  },
  loadingText: {
    marginTop: hp('2%'),
    fontSize: wp('4%'),
    color: '#6B6B6B',
    fontWeight: '500',
  },
  errorText: {
    fontSize: wp('4%'),
    color: '#FF4B4B',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  retryButton: {
    backgroundColor: '#00C4B4',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('8%'),
    borderRadius: wp('3%'),
    marginTop: hp('1%'),
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
});