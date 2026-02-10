import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
// import LiveMap from '../../components/map/LiveMap';
// import { getDistance } from '../../utils/mapUtils';
import { orderService } from '../../services/order/OrderService';
import CustomerNotResponding from '../Home/CustomerNotResponding';

const OrderDetailsScreen = ({ route, navigation }) => {

  const { orderId } = route.params;
  console.log("Order Id from OderDetailScreen", orderId);

  const [status, setStatus] = useState(route?.params?.status || ORDER_STATUS.PICKUP_ASSIGNED);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [riderLocation, setRiderLocation] = useState(null);
  const [distanceToTarget, setDistanceToTarget] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const mapRef = useRef(null);
  const [deliveryResult, setDeliveryResult] = useState(null);

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
        console.log(`[OrderDetailsScreen] Fetching details for ${orderId}`);
        setLoading(true);
        const data = await orderService.getOrderDetails(orderId);
        console.log(`[OrderDetailsScreen] Fetched data:`, JSON.stringify(data));
        setOrderDetails(data);
      } catch (err) {
        console.error(`[OrderDetailsScreen] Error fetching details:`, err);
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
          } else { // All other statuses (ORDER_PICKED_UP, ON_WAY_TO_DROP, AT_DROP, etc.) target delivery
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

    // SCENARIO 1: Navigate to Map (for navigation flow)
    if (action.navigateTo === 'Map') {
      console.log("from order details screen to map screen", orderId);
      navigation.navigate('Map', {
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
        console.log(`[OrderDetailsScreen] Update status to ${action.nextStatus}`);
        const res = await orderService.updateOrderStatus(orderId, action.nextStatus);

        console.log(`[OrderDetailsScreen] API Success. Setting local status to ${action.nextStatus}`);

        // Capture delivery result for success screen
        if (action.nextStatus === ORDER_STATUS.ORDER_DELIVERED) {
          setDeliveryResult(res);
        }

        setStatus(action.nextStatus);
        navigation.setParams({ status: action.nextStatus });
      } catch (err) {
        console.error("Status update error:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to update status";
        Alert.alert("Update Failed", errorMessage);
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
      // Wait a bit or check if we have result data if needed
      // If we came from Swipe, deliveryResult should be set.
      // If we loaded screen already in DELIVERED status (unlikely flow but possible), we might not have result.
      // But usually user swipes to finish.

      const earning = deliveryResult?.earningCredited || orderDetails?.riderEarning?.totalEarning || 0;
      const cod = deliveryResult?.codCollected || 0;

      setTimeout(() => {
        navigation.replace('SuccessfullDelivered', {
          amount: earning,
          codCollected: cod
        });
      }, 500);
    }
  }, [status, deliveryResult]);

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
    console.log("[OrderDetailsScreen] Render failure:", { error, orderDetailsIsNull: !orderDetails });
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.centerText}>{error || "No order details found"}</Text>
        </View>
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
                <View style={styles.pickupCard}>
                  <View style={styles.pickupCardHeader}>
                    
                    <View style={styles.pickupTitleContainer}>
                      <Text style={styles.pickupTitle}> 🏪 PICKUP LOCATION</Text>
                    </View>

                  </View>
                  
                  <View style={styles.pickupAddressContainer}>
                    <Text style={styles.pickupStoreName}>{orderDetails.pickupAddress.name}</Text>
                    <Text style={styles.pickupAddress}>{orderDetails.pickupAddress.addressLine}</Text>
                  </View>
                
                </View>
             
              {/* Custom Drop Location Card */}
              <View style={styles.dropCard}>
                <View style={styles.dropCardHeader}>
                  
                  <View style={styles.dropTitleContainer}>
                    <Text style={styles.dropTitle}> 🏪 DROP LOCATION</Text>
                  </View>

                </View>
                
                <View style={styles.dropAddressContainer}>
                  <Text style={styles.dropStoreName}>{orderDetails.deliveryAddress.name}</Text>
                  <Text style={styles.dropAddress}>{orderDetails.deliveryAddress.addressLine}</Text>
                </View>
              
              </View>
            </>
          ) : (
            <>
            
            {/* Custom Deliver To Card */}
            <View style={styles.deliverToCard}>
              

              <View style={styles.deliverHeader}>
                <View style={styles.deliverIconContainer}>
                  <Text>👤</Text>
                </View>
                <View style={styles.deliverTitleContainer}>
                  <Text style={styles.deliverTitle}>DELIVER TO</Text>
                  <Text style={styles.deliverSubtitle}>Final Destination</Text>
                </View>
              </View>
              
            
              {/* Address Card */}
              <View style={styles.addressCard}>
                <Text style={styles.customerName}>{orderDetails.deliveryAddress.name}</Text>
                <Text style={styles.addressText}>{orderDetails.deliveryAddress.addressLine}</Text>
              </View>
              

              
              
            </View>
            </>
            
          )}

          <OrderItemsCard
            items={orderDetails.items.map(item => ({
              name: item.itemName,
              qty: item.quantity,
            }))}
          />

          <OrderEarningsCard
            pricing={orderDetails.pricing}
            items={orderDetails.items}
          />
          {/* Secondary Buttons (e.g., Customer Not Responding) */}
          {ui.secondaryButtons && ui.secondaryButtons.length > 0 && (
            <View style={{ marginTop: 10, marginBottom: 30 }}>
              {ui.secondaryButtons.map((button, index) => (
                // <TouchableOpacity
                //   key={index}
                //   style={styles.secondaryButton}
                //   onPress={() => {
                //     if (button.action === 'openModal') {
                //       setShowCustomerModal(true);
                //     }
                //   }}
                // >
                //   <Text style={styles.secondaryButtonText}>{button.label}</Text>
                //   <MaterialCommunityIcons name="chevron-right" size={20} color="#333" />
                // </TouchableOpacity>
                <TouchableOpacity
  key={index}
  style={styles.customerIssueButton}
  activeOpacity={0.85}
  onPress={() => {
    if (button.action === 'openModal') {
      setShowCustomerModal(true);
    }
  }}
>
  <View style={styles.issueLeft}>
    <View style={styles.issueIconCircle}>
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={22}
        color="#F7931E"
      />
    </View>

    <View>
      <Text style={styles.issueTitle}>Customer Not Responding</Text>
      <Text style={styles.issueSubtitle}>
        Try calling or report issue
      </Text>
    </View>
  </View>

  <MaterialCommunityIcons
    name="chevron-right"
    size={22}
    color="#999"
  />
</TouchableOpacity>

              ))}
            </View>
          )}
          {ui.bottomButtons && ui.bottomButtons.length > 0 && (
            <SwipeButton
              key={status} // Force re-render on status change to reset button state
              title={ui.bottomButtons[0].label}
              onSwipeSuccess={handleSwipeSuccess}
            />
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
              duration={10}
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
    backgroundColor: '#F9FAFF', // Softer blue tint background
  },
  centerText: { 
    textAlign: 'center', 
    marginTop: 20,
    fontSize: wp('3.8%'),
    color: '#5D6B98',
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  container: {
    flex: 1,
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('3%'),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp('2%'),
  },

  headerTextContainer: {
    flex: 1,
  },

  helpIconWrapper: {
    width: wp('13%'),
    height: wp('13%'),
    borderRadius: wp('6.5%'),
    backgroundColor: 'rgba(0, 196, 180, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    shadowColor: '#00C4B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },

  helpIcon: {
    fontSize: wp('5%'),
  },

  header: {
    fontSize: wp('5.8%'),
    fontWeight: '800',
    color: '#2D3748',
    marginTop: 10,
    fontFamily: 'System',
    letterSpacing: -0.5,
  },
  subHeader: {
    fontSize: wp('3.8%'),
    color: '#718096',
    marginBottom: hp('2%'),
    marginTop: 10,
    lineHeight: 20,
    fontFamily: 'System',
  },
  button: {
    backgroundColor: '#E5ECFF',
    paddingVertical: hp('2.2%'),
    borderRadius: wp('14%'),
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: hp('2%'),
    shadowColor: '#4C6FFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonText: {
    fontSize: wp('3.8%'),
    fontWeight: '700',
    color: '#4C6FFF',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  mapContainer: {
    marginTop: hp('3%'),
    marginBottom: hp('3%'),
  },
  mapWrapper: {
    marginBottom: hp('2%'),
  },
  mapPlaceholder: {
    height: hp('40%'),
    borderRadius: wp('6%'),
    overflow: 'hidden',
    backgroundColor: '#F0F4FF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: hp('2%'),
    shadowColor: '#A3BFFA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },

  mapImage: {
    width: '100%',
    height: '100%',
  },
  navigateBtn: {
    backgroundColor: '#00C4B4',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('2.2%'),
    borderRadius: wp('14%'),
    width: '100%',
    shadowColor: '#00C4B4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },

  navigateBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: wp('4.2%'),
    marginRight: 10,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  navigateIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigateArrow: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomStandardBtn: {
    backgroundColor: '#00C4B4',
    paddingVertical: hp('2.2%'),
    borderRadius: wp('14%'),
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: hp('3%'),
    shadowColor: '#00C4B4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  bottomStandardBtnText: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: wp('14%'),
    backgroundColor: '#FFFFFF',
    shadowColor: '#CBD5E0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  secondaryButtonText: {
    fontSize: wp('3.8%'),
    fontWeight: '600',
    color: '#4A5568',
    fontFamily: 'System',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalHeaderText: {
    fontSize: wp('4.8%'),
    fontWeight: '700',
    color: '#2D3748',
    fontFamily: 'System',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(45, 55, 72, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerModalCard: {
    width: '88%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 24,
    elevation: 12,
    shadowColor: '#2D3748',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    transform: [{ scale: 0.95 }],
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: hp('5%'),
    paddingTop: hp('3%'),
  },
  customerIssueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('2.2%'),
    paddingHorizontal: wp('4.5%'),
    borderRadius: wp('6%'),
    backgroundColor: '#FFFBF5',
    borderWidth: 2,
    borderColor: '#FFEDD5',
    marginTop: hp('1.5%'),
    marginBottom: hp('2%'),
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  issueLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  issueIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3.5%'),
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },

  issueTitle: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: '#92400E',
    fontFamily: 'System',
    letterSpacing: 0.3,
  },

  issueSubtitle: {
    marginTop: hp('0.5%'),
    fontSize: wp('3.4%'),
    color: '#D97706',
    fontFamily: 'System',
    letterSpacing: 0.2,
  },
  
  // New Animation Styles
  fadeInUp: {
    opacity: 0,
    transform: [{ translateY: 20 }],
  },
  
  cardShadow: {
    shadowColor: '#4A5568',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  
  gradientBackground: {
    borderRadius: wp('6%'),
    overflow: 'hidden',
  },
  
  pulseAnimation: {
    shadowColor: '#00C4B4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  
  // Loading Animation
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFF',
  },
  
  loadingText: {
    marginTop: 20,
    fontSize: wp('4%'),
    color: '#4C6FFF',
    fontWeight: '600',
    fontFamily: 'System',
  },
  
  // Status Indicator
  statusIndicator: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00C4B4',
    width: '60%',
    alignSelf: 'center',
    marginVertical: hp('1%'),
  },

  pickupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('7%'),
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('5%'),
    marginBottom: hp('2.5%'),
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#D1FAE5',
  },
  
  pickupCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('0%'),
  },
  
 
  pickupTitleContainer: {
    flex: 1,
  },
  
  pickupTitle: {
    fontSize: wp('4.2%'),
    fontWeight: '700',
    color: '#065F46',
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  
  pickupSubtitle: {
    fontSize: wp('3.2%'),
    color: '#10B981',
    fontWeight: '500',
    marginTop: hp('0.3%'),
    fontFamily: 'System',
  },
  
  pickupAddressContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: wp('4%'),
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    marginTop: hp('1%'),
  },
  
  pickupStoreName: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: '#047857',
    marginBottom: hp('0.8%'),
    fontFamily: 'System',
    letterSpacing: 0.2,
  },
  
  pickupAddress: {
    fontSize: wp('3.5%'),
    color: '#059669',
    lineHeight: hp('2.5%'),
    fontFamily: 'System',
  },

  // DROP LOCATION CARD - Enhanced Red Theme
  dropCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('7%'),
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    marginBottom: hp('2%'),
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },

  dropCardHeader: {
     flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },

  dropIconContainer: {
    width: wp('14%'),
    height: wp('14%'),
    borderRadius: wp('7%'),
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('4%'),
    borderWidth: 2.5,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },

  dropIcon: {
    fontSize: wp('6%'),
    color: '#EF4444',
  },

  dropTitleContainer: {
    flex: 1,
  },

  dropTitle: {
    fontSize: wp('4.2%'),
    fontWeight: '800',
    color: '#991B1B',
    fontFamily: 'System',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  dropSubtitle: {
    fontSize: wp('3.4%'),
    color: '#EF4444',
    fontWeight: '600',
    marginTop: hp('0.3%'),
    fontFamily: 'System',
    letterSpacing: 0.2,
  },

  dropAddressContainer: {
    backgroundColor: 'rgba(254, 202, 202, 0.25)',
    borderRadius: wp('5%'),
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    borderWidth: 1.5,
    borderColor: '#FECACA',
    marginBottom: hp('0%'),
    position: 'relative',
  },

dropStoreName:{
  fontSize: wp('4%'),
    fontWeight: '700',
    color: '#f85e5e',
    marginBottom: hp('0.8%'),
    fontFamily: 'System',
    letterSpacing: 0.2,
},
  dropAddress: {
    fontSize: wp('4%'),
    fontWeight: '800',
    color: '#EF4444',
    fontFamily: 'System',
    letterSpacing: -0.2,
  },

  dropAddress: {
    fontSize: wp('3.6%'),
    color: '#EF4444',
    lineHeight: hp('2.6%'),
    fontFamily: 'System',
    marginTop: hp('0%'),
    paddingLeft: wp('0%'), // Align with customer name
  },


  deliverToCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('7%'),
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('5%'),
    marginBottom: hp('2%'),
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#C7D2FE',
    position: 'relative',
    overflow: 'hidden',
  },

  deliverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },

  deliverIconContainer: {
    width: wp('14%'),
    height: wp('14%'),
    borderRadius: wp('7%'),
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('4%'),
    borderWidth: 2.5,
    borderColor: 'rgba(99, 102, 241, 0.25)',
  },

  deliverIcon: {
    fontSize: wp('6%'),
    color: '#4F46E5',
  },

  deliverTitleContainer: {
    flex: 1,
  },

  deliverTitle: {
    fontSize: wp('4.2%'),
    fontWeight: '800',
    color: '#3730A3',
    fontFamily: 'System',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  deliverSubtitle: {
    fontSize: wp('3.4%'),
    color: '#6366F1',
    fontWeight: '600',
    marginTop: hp('0.3%'),
    fontFamily: 'System',
    letterSpacing: 0.2,
  },

  customerProfileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(199, 210, 254, 0.25)',
    borderRadius: wp('5%'),
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    marginBottom: hp('2%'),
  },

  customerAvatar: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('8%'),
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('4%'),
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  customerAvatarIcon: {
    fontSize: wp('7%'),
    color: '#4F46E5',
  },

  customerInfoContainer: {
    flex: 1,
  },

  customerName: {
    fontSize: wp('4.8%'),
    fontWeight: '800',
    color: '#3730A3',
    fontFamily: 'System',
    letterSpacing: -0.2,
    marginBottom: hp('0.3%'),
  },

  addressCard: {
    backgroundColor: '#F8FAFF',
    borderRadius: wp('4.5%'),
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
  },



});