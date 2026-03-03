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
     console.log("FINAL URL:", `/api/orders/${orderId}/details`);

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
        setStatus(data.orderStatus);
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
  // Store delivery response to pass to success screen
  const [deliveryResponse, setDeliveryResponse] = useState(null);

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
        console.error('❌ Swipe failed:', error);
      }
    }
  };

  // Helper handling navigation (Button)
  const handleNavigate = () => {
    console.log('🧭 OrderDetailsScreen handleNavigate - orderId:', orderId, 'navigateTo: Map');
    const action = ui.bottomButtons.find(a => a.navigateTo);

    if (action && action.navigateTo) {
      navigation.navigate(action.navigateTo, {
        nextStatus: action.nextStatus,
        orderId,
      });
    } else {
      // Fallback map navigation
      navigation.navigate('Map', { nextStatus: status, orderId });
    }
  };

  const primaryAction = ui.bottomButtons[0];

  // Navigate to success screen on delivery
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>

          {/* Header */}
          <OrderHeader
            orderId={orderData?.orderId || orderId || 'N/A'}
            statusText={ui.headerText || "Active delivery in progress"}
            icon={ui.headerIcon}
          />

          {/* Address Logic */}
          {(status === ORDER_STATUS.PICKUP_ASSIGNED || status === ORDER_STATUS.AT_RESTAURANT) ? (
            <>
              <OrderAddressCard
                title="Pickup Location"
                name="The Pizza Palace"
                address="234 Main Street, Downtown, CA 94102"
                iconType="store"
                theme="green"
              />
              <OrderAddressCard
                title="Drop Location"
                name="John Anderson"
                address="201/D, Ananta Apts, Near Jai Bhawan, Andheri 400059"
                iconType="home"
                theme="red"
              />
            </>
          ) : (
            /* Show only Drop location (Deliver To) after pickup */
            <OrderAddressCard
              title="Deliver To"
              name="John Anderson"
              address="201/D, Ananta Apts, Near Jai Bhawan, Andheri 400059"
              iconType="user"
              theme="default"
            />
          )}

          <OrderItemsCard items={[
            {
              name: 'Margherita Pizza (Large)',
              qty: 2,
              image: require('../../assets/pizza.png'),
            },
            {
              name: 'Besan Ladoo (Large)',
              qty: 2,
              image: require('../../assets/laddu.png'),
            },
            {
              name: 'Cappuccino',
              qty: 1,
              image: require('../../assets/coffe.png'),
            },
          ]} />

          <OrderEarningsCard basePay={500} distancePay={100} bonus={45} />

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
  },
  scrollContent: {
    paddingHorizontal: wp('4%'),
    paddingTop: hp('1.5%'),
    paddingBottom: hp('2%'),
  },
  mapWrapper: {
    marginTop: hp('2%'),
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  mapImage: {
    width: '100%',
    height: hp('25%'),
    borderRadius: wp('3%'),
  },
  navigateBtn: {
    backgroundColor: '#00C4B4',
    paddingVertical: hp('2%'),
    borderRadius: wp('3%'),
    marginTop: hp('1.5%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navigateBtnText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: '700',
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