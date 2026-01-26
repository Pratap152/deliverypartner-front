import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import Geolocation from "@react-native-community/geolocation";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
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
import LiveMap from '../../components/map/LiveMap';
import { getDistance } from '../../utils/mapUtils';
import { orderService } from '../../services/order/OrderService';
import CustomerNotResponding from '../Home/CustomerNotResponding';

const OrderDetailsScreen = ({ route, navigation }) => {

  const { orderId } = route.params;

  const [status, setStatus] = useState(route?.params?.status || ORDER_STATUS.PICKUP_ASSIGNED);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [riderLocation, setRiderLocation] = useState(null);
  const [distanceToTarget, setDistanceToTarget] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const mapRef = useRef(null);

  const ui = orderUIConfig[status] || {};

  useEffect(() => {
    if (route.params?.status) {
      setStatus(route.params.status);
    }
  }, [route.params?.status]);

  /**
   * Fetch order details
   */
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const data = await orderService.getOrderDetails(orderId);
        setOrderDetails(data);
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  /**
   * Track Rider Location
   */
  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setRiderLocation({ latitude, longitude });

        // Calculate Distance logic
        if (orderDetails) {
          let target = null;
          if (status === ORDER_STATUS.PICKUP_ASSIGNED || status === ORDER_STATUS.AT_RESTAURANT) {
            target = { latitude: orderDetails.pickupAddress.lat, longitude: orderDetails.pickupAddress.lng };
          } else if (status === ORDER_STATUS.PICKUP_COMPLETED || status === ORDER_STATUS.OUT_FOR_DELIVERY) {
            target = { latitude: orderDetails.deliveryAddress.lat, longitude: orderDetails.deliveryAddress.lng };
          }

          if (target) {
            const dist = getDistance(
              { latitude, longitude },
              target
            );
            setDistanceToTarget(dist); // in meters
          }
        }
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, distanceFilter: 10 }
    );
    return () => Geolocation.clearWatch(watchId);
  }, [orderDetails, status]);

  /**
   * Map Logic
   */
  const handleStartNavigation = () => {
    if (!riderLocation || !orderDetails) return;

    let target = null;
    if (status === ORDER_STATUS.PICKUP_ASSIGNED || status === ORDER_STATUS.AT_RESTAURANT) {
      target = { latitude: orderDetails.pickupAddress.lat, longitude: orderDetails.pickupAddress.lng };
    } else {
      target = { latitude: orderDetails.deliveryAddress.lat, longitude: orderDetails.deliveryAddress.lng };
    }

    if (mapRef.current && target) {
      mapRef.current.fitToCoordinates([riderLocation, target]);
    }
  };

  /**
   * Swipe action
   */
  const handleSwipeSuccess = async () => {
    const action = ui.bottomButtons && ui.bottomButtons[0];
    if (!action) return;

    // SCENARIO 1: Navigate to MapScreen
    if (action.navigateTo === 'MapScreen') {
      navigation.navigate('MapScreen', {
        orderId: orderId,
        nextStatus: action.nextStatus,
        orderDetails: orderDetails, // Pass full order details
      });
      return;
    }

    // SCENARIO 2: Navigate to other screens (e.g., QR Scanner)
    if (action.navigateTo) {
      navigation.navigate(action.navigateTo, {
        orderId: orderId,
        nextStatus: action.nextStatus
      });
      return;
    }

    // Distance check for "Reached" buttons (only if not navigating to MapScreen)
    const MAX_DISTANCE = 150000; // TODO: Change to 10/20 for prod
    if (distanceToTarget !== null && distanceToTarget > MAX_DISTANCE) {
      Alert.alert("Too Far", `You are ${(distanceToTarget).toFixed(0)}m away. Reach within 10m.`);
      return;
    }

    // SCENARIO 3: Direct Status Update (for buttons like "Order Picked up", "Arrived at Drop Location")
    if (action.nextStatus) {
      try {
        await orderService.updateOrderStatus(orderId, action.nextStatus);
        setStatus(action.nextStatus);
        navigation.setParams({ status: action.nextStatus });
      } catch (err) {
        Alert.alert("Error", "Failed to update status");
      }
    }
  };

  /**
   * Navigate action (Using existing button for "Navigate 📍")
   */
  const handleNavigateMap = () => {
    handleStartNavigation();
    // Also open external maps if needed, but for now zooming internal map
  };

  /**
   * Delivery completed
   */
  useEffect(() => {
    if (status === ORDER_STATUS.ORDER_DELIVERED) {
      setTimeout(() => {
        navigation.replace('SuccessfullDelivered');
      }, 500);
    }
  }, [status]);

  /* ------------------ UI STATES ------------------ */

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#00C4B4" />
          <Text style={styles.centerText}>Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !orderDetails) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.centerText}>{error}</Text>
      </SafeAreaView>
    );
  }

  // Determine Map Targets
  let pickupTarget = { latitude: orderDetails.pickupAddress.lat, longitude: orderDetails.pickupAddress.lng };
  let dropTarget = { latitude: orderDetails.deliveryAddress.lat, longitude: orderDetails.deliveryAddress.lng };

  const isPickupPhase = (status === ORDER_STATUS.PICKUP_ASSIGNED || status === ORDER_STATUS.AT_RESTAURANT);

  /* ------------------ MAIN UI ------------------ */

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>

          <OrderHeader
            orderId={orderDetails.orderId}
            statusText={ui.label || "Active delivery in progress"} // Use status label
            icon={ui.headerIcon || "bike"}
          />

          {(status === ORDER_STATUS.PICKUP_ASSIGNED) ? (
            <>
              <OrderAddressCard
                title="Pickup Location"
                name={orderDetails.pickupAddress.name}
                address={orderDetails.pickupAddress.addressLine}
                iconType="store"
                theme="green"
              />
              <OrderAddressCard
                title="Drop Location"
                name={orderDetails.deliveryAddress.name}
                address={orderDetails.deliveryAddress.addressLine}
                iconType="home"
                theme="red"
              />
            </>
          ) : (
            /* Show only Drop location (Deliver To) after pickup or AT_RESTAURANT (as requested) */
            <OrderAddressCard
              title="Deliver To"
              name={orderDetails.deliveryAddress.name}
              address={orderDetails.deliveryAddress.addressLine}
              iconType="user"
              theme="default"
            />
          )}

          <OrderItemsCard
            items={orderDetails.items.map(item => ({
              name: item.itemName,
              qty: item.quantity,
            }))}
          />

          <OrderEarningsCard
            basePay={orderDetails.pricing.itemTotal}
            distancePay={orderDetails.pricing.deliveryFee}
            bonus={orderDetails.pricing.platformCommission}
          />


          {ui.bottomButtons && ui.bottomButtons.length > 0 && (
            <SwipeButton
              title={ui.bottomButtons[0].label}
              onSwipeSuccess={handleSwipeSuccess}
            />
          )}

          {/* Secondary Buttons (e.g., Customer Not Responding) */}
          {ui.secondaryButtons && ui.secondaryButtons.length > 0 && (
            <View style={{ marginTop: 10 }}>
              {ui.secondaryButtons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.secondaryButton}
                  onPress={() => {
                    if (button.action === 'openModal') {
                      setShowCustomerModal(true);
                    }
                  }}
                >
                  <Text style={styles.secondaryButtonText}>{button.label}</Text>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#333" />
                </TouchableOpacity>
              ))}
            </View>
          )}

        </View>
      </ScrollView>

      {/* Customer Not Responding Modal */}
       <Modal
  visible={showCustomerModal}
  transparent
  animationType="fade"
  onRequestClose={() => setShowCustomerModal(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.centerModalCard}>
      <CustomerNotResponding
        duration={120}
        onCallPress={() => {
          Alert.alert("Call", "Calling customer...");
        }}
        onMarkIssuePress={() => {
          setShowCustomerModal(false);
          navigation.navigate('ReportIssue', { orderId });
        }}
      />
    </View>
  </View>
</Modal>


    </SafeAreaView>
  );
};

export default OrderDetailsScreen;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  centerText: { textAlign: 'center', marginTop: 20 },
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
    height: hp('35%'), // Increased height for better map view
    borderRadius: wp('4%'),
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    marginBottom: hp('1.5%'),
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
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1.8%'),
    paddingHorizontal: wp('4%'),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: wp('12%'),
    backgroundColor: '#FFF',
  },
  secondaryButtonText: {
    fontSize: wp('3.6%'),
    fontWeight: '600',
    color: '#333',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalHeaderText: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#333',
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.45)',
  justifyContent: 'center',
  alignItems: 'center',
},
centerModalCard: {
  width: '88%',           // LEFT & RIGHT SPACE ✅
  backgroundColor: '#fff',
  borderRadius: 16,
  paddingVertical: 24,
  paddingHorizontal: 20,
  elevation: 8,           // Android shadow
  shadowColor: '#000',    // iOS shadow
  shadowOpacity: 0.2,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
},
modalCard: {
  backgroundColor: '#fff',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingBottom: hp('4%'),
  paddingTop: hp('2%'),
},

});