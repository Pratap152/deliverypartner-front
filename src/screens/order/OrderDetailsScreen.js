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
              {/* <OrderAddressCard
                title="Pickup Location"
                name={orderDetails.pickupAddress.name}
                address={orderDetails.pickupAddress.addressLine}
                iconType="store"
                theme="green"
                customStyle={styles.pickupCard} // Pass custom style
              /> */}
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
              {/* <OrderAddressCard
                title="Drop Location"
                name={orderDetails.deliveryAddress.name}
                address={orderDetails.deliveryAddress.addressLine}
                iconType="home"
                theme="red"
              /> */}
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
{/* <View style={styles.dropLocationCard}>
 

  <View style={styles.dropCardHeader}>
    <View style={styles.dropTitleContainer}>
      
      <Text style={styles.dropTitle}>🏠 DROP LOCATION</Text>
    </View>
  </View>
  
  <View style={styles.dropAddressContainer}>
    <View style={styles.customerInfoHeader}>
      <Text style={styles.customerName}>{orderDetails.deliveryAddress.name}</Text>
    </View>
    <Text style={styles.dropAddress}>{orderDetails.deliveryAddress.addressLine}</Text>
  </View>
  
</View> */}
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
// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#F8F8F8',
//   },
//   centerText: { textAlign: 'center', marginTop: 20 },
//   container: {
//     flex: 1,
//     paddingHorizontal: wp('4%'),
//     paddingTop: hp('1%'),
//     padding: 20,
//     marginTop: 10
//   },
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: hp('1.5%'),
//   },

//   headerTextContainer: {
//     flex: 1,
//   },

//   helpIconWrapper: {
//     width: wp('13%'),
//     height: wp('13%'),
//     borderRadius: wp('5%'),
//     backgroundColor: '#E8F7F0',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 5
//   },

//   helpIcon: {
//     fontSize: wp('5%'),
//   },

//   header: {
//     fontSize: wp('5.5%'),
//     fontWeight: '700',
//     color: '#1C1C1C',
//     marginTop: 10
//   },
//   subHeader: {
//     fontSize: wp('3.2%'),
//     color: '#6B6B6B',
//     marginBottom: hp('1.5%'),
//     marginTop: 10
//   },
//   button: {
//     backgroundColor: '#E5ECFF',
//     paddingVertical: hp('1.8%'),
//     borderRadius: wp('12%'),
//     alignItems: 'center',
//     marginTop: 'auto',
//     marginBottom: hp('1%'),
//   },
//   buttonText: {
//     fontSize: wp('3.6%'),
//     fontWeight: '600',
//     color: '#1C1C1C',
//   },
//   mapContainer: {
//     marginTop: hp('2%'),
//     marginBottom: hp('2%'),
//   },
//   mapWrapper: {
//     marginBottom: hp('2%'),
//   },
//   mapPlaceholder: {
//     height: hp('35%'), // Increased height for better map view
//     borderRadius: wp('4%'),
//     overflow: 'hidden',
//     backgroundColor: '#E5E7EB',
//     borderWidth: 1,
//     borderColor: '#E6E6E6',
//     marginBottom: hp('1.5%'),
//   },

//   mapImage: {
//     width: '100%',
//     height: '100%',
//   },
//   navigateBtn: {
//     backgroundColor: '#00C4B4',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: hp('1.8%'),
//     borderRadius: wp('12%'),
//     width: '100%',
//   },

//   navigateBtnText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: wp('4%'),
//     marginRight: 10,
//   },
//   navigateIconCircle: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   navigateArrow: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   bottomStandardBtn: {
//     backgroundColor: '#00C4B4', // Updated to Teal
//     paddingVertical: hp('1.8%'),
//     borderRadius: wp('12%'),
//     alignItems: 'center',
//     marginTop: 'auto',
//     marginBottom: hp('2%'),
//   },
//   bottomStandardBtnText: {
//     fontSize: wp('3.6%'),
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
//   secondaryButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: hp('1.8%'),
//     paddingHorizontal: wp('4%'),
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: wp('12%'),
//     backgroundColor: '#FFF',
//   },
//   secondaryButtonText: {
//     fontSize: wp('3.6%'),
//     fontWeight: '600',
//     color: '#333',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: wp('4%'),
//     paddingVertical: hp('2%'),
//     borderBottomWidth: 1,
//     borderBottomColor: '#E0E0E0',
//   },
//   modalHeaderText: {
//     fontSize: wp('4.5%'),
//     fontWeight: '600',
//     color: '#333',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.45)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   centerModalCard: {
//     width: '88%',           // LEFT & RIGHT SPACE ✅
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     paddingVertical: 24,
//     paddingHorizontal: 20,
//     elevation: 8,           // Android shadow
//     shadowColor: '#000',    // iOS shadow
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 4 },
//   },
//   modalCard: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     paddingBottom: hp('4%'),
//     paddingTop: hp('2%'),
//   },
// customerIssueButton: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   paddingVertical: hp('2%'),
//   paddingHorizontal: wp('4%'),
//   borderRadius: wp('4%'),
//   backgroundColor: '#FFF7EC',
//   borderWidth: 1,
//   borderColor: '#FAD7A0',
// },

// issueLeft: {
//   flexDirection: 'row',
//   alignItems: 'center',
// },

// issueIconCircle: {
//   width: 40,
//   height: 40,
//   borderRadius: 20,
//   backgroundColor: '#FFF1DC',
//   alignItems: 'center',
//   justifyContent: 'center',
//   marginRight: wp('3%'),
// },

// issueTitle: {
//   fontSize: wp('3.8%'),
//   fontWeight: '700',
//   color: '#8A4B08',
// },

// issueSubtitle: {
//   marginTop: hp('0.3%'),
//   fontSize: wp('3.2%'),
//   color: '#B9770E',
// },

// });

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
    paddingVertical: hp('2.5%'),
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
    marginBottom: hp('1.5%'),
  },
  
  pickupIconContainer: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3.5%'),
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  
  pickupIcon: {
    fontSize: wp('5.5%'),
    color: '#10B981',
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
  
  pickupMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
    paddingTop: hp('2%'),
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(16, 185, 129, 0.15)',
  },
  
  pickupDistanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  distanceIcon: {
    fontSize: wp('4.5%'),
    color: '#10B981',
    marginRight: wp('2%'),
  },
  
  distanceText: {
    fontSize: wp('3.8%'),
    color: '#065F46',
    fontWeight: '600',
    fontFamily: 'System',
  },
  
  pickupTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('3%'),
  },
  
  timeIcon: {
    fontSize: wp('4%'),
    color: '#10B981',
    marginRight: wp('1.5%'),
  },
  
  timeText: {
    fontSize: wp('3.5%'),
    color: '#065F46',
    fontWeight: '600',
    fontFamily: 'System',
  },
  
  // Progress indicator for pickup
  pickupProgressContainer: {
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
  },
  
  progressBar: {
    height: hp('0.8%'),
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: wp('1%'),
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: wp('1%'),
    width: '60%', // This would be dynamic based on progress
  },
  
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('0.8%'),
  },
  
  progressLabel: {
    fontSize: wp('3%'),
    color: '#059669',
    fontFamily: 'System',
  },
  
  // Floating action button for pickup navigation
  pickupActionButton: {
    position: 'absolute',
    right: wp('5%'),
    top: hp('2.5%'),
    width: wp('14%'),
    height: wp('14%'),
    borderRadius: wp('7%'),
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  
  actionButtonIcon: {
    fontSize: wp('5.5%'),
    color: '#FFFFFF',
  },
  
  // Pulse animation for pickup card
  pulseEffect: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  
  // New pickup card variation for when at restaurant
  pickupCardActive: {
    backgroundColor: '#F0FDF9',
    borderColor: '#34D399',
    shadowColor: '#34D399',
    shadowOpacity: 0.15,
  },
  
  // Instructions bubble
  instructionsBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('5%'),
    paddingVertical: hp('1.8%'),
    paddingHorizontal: wp('4%'),
    marginTop: hp('1.5%'),
    borderWidth: 1.5,
    borderColor: '#D1FAE5',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  
  instructionsTitle: {
    fontSize: wp('3.5%'),
    fontWeight: '700',
    color: '#065F46',
    marginBottom: hp('0.5%'),
    fontFamily: 'System',
  },
  
  instructionsText: {
    fontSize: wp('3.2%'),
    color: '#059669',
    lineHeight: hp('2.3%'),
    fontFamily: 'System',
  },

  // DROP LOCATION CARD - Enhanced Red Theme
  dropCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('7%'),
    paddingVertical: hp('2.5%'),
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
    marginBottom: hp('2%'),
    position: 'relative',
  },

  customerInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },

  customerIcon: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('2.5%'),
  },

  customerName: {
    fontSize: wp('4%'),
    fontWeight: '800',
    color: '#991B1B',
    fontFamily: 'System',
    letterSpacing: -0.2,
  },

  dropAddress: {
    fontSize: wp('3.6%'),
    color: '#DC2626',
    lineHeight: hp('2.6%'),
    fontFamily: 'System',
    marginTop: hp('0%'),
    paddingLeft: wp('0%'), // Align with customer name
  },

  // Contact Information
  contactSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(254, 226, 226, 0.4)',
    borderRadius: wp('4%'),
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('3.5%'),
    marginTop: hp('1.5%'),
    marginBottom: hp('2%'),
  },

  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  contactIcon: {
    fontSize: wp('4.5%'),
    color: '#EF4444',
    marginRight: wp('2%'),
  },

  contactText: {
    fontSize: wp('3.4%'),
    color: '#991B1B',
    fontWeight: '600',
    fontFamily: 'System',
  },

  // Delivery Instructions
  instructionsCard: {
    backgroundColor: 'rgba(254, 242, 242, 0.8)',
    borderRadius: wp('5%'),
    paddingVertical: hp('1.8%'),
    paddingHorizontal: wp('4%'),
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderLeftWidth: 5,
    borderLeftColor: '#EF4444',
    marginBottom: hp('2%'),
  },

  instructionsTitle: {
    fontSize: wp('3.8%'),
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: hp('0.5%'),
    fontFamily: 'System',
  },

  instructionsText: {
    fontSize: wp('3.4%'),
    color: '#DC2626',
    lineHeight: hp('2.4%'),
    fontFamily: 'System',
    fontStyle: 'italic',
  },

  // Delivery Progress
  deliveryProgress: {
    marginBottom: hp('2.5%'),
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },

  progressTitle: {
    fontSize: wp('3.8%'),
    fontWeight: '700',
    color: '#991B1B',
    fontFamily: 'System',
  },

  progressPercentage: {
    fontSize: wp('4%'),
    fontWeight: '800',
    color: '#EF4444',
    fontFamily: 'System',
  },

  progressBarContainer: {
    height: hp('1.2%'),
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: wp('1.5%'),
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#EF4444',
    borderRadius: wp('1.5%'),
    width: '40%', // Dynamic based on progress
  },

  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('0.8%'),
  },

  progressStep: {
    alignItems: 'center',
    flex: 1,
  },

  stepDot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    backgroundColor: '#FECACA',
    marginBottom: hp('0.5%'),
  },

  stepDotActive: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },

  stepText: {
    fontSize: wp('2.8%'),
    color: '#DC2626',
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'System',
  },

  // Action Buttons
  dropActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1%'),
  },

  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('6%'),
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    flex: 1,
    marginRight: wp('2%'),
  },

  callButtonText: {
    fontSize: wp('3.5%'),
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: wp('2%'),
    fontFamily: 'System',
  },

  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: hp('1.8%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('6%'),
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    flex: 1,
  },

  navigateButtonText: {
    fontSize: wp('3.8%'),
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: wp('2%'),
    fontFamily: 'System',
  },

  // Decorative Elements
  cornerDecoration: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: wp('25%'),
    height: wp('25%'),
    backgroundColor: 'rgba(239, 68, 68, 0.03)',
    borderBottomLeftRadius: wp('7%'),
    overflow: 'hidden',
  },

  patternDots: {
    position: 'absolute',
    top: '30%',
    right: '30%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: wp('8%'),
  },

  patternDot: {
    width: wp('0.8%'),
    height: wp('0.8%'),
    borderRadius: wp('0.4%'),
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    margin: wp('0.4%'),
  },
  deliverToCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('7%'),
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('5%'),
    marginBottom: hp('2.5%'),
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
    width: wp('16%'),
    height: wp('16%'),
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

  customerTag: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.3%'),
    borderRadius: wp('2%'),
    alignSelf: 'flex-start',
    marginBottom: hp('0.8%'),
  },

  customerTagText: {
    fontSize: wp('2.8%'),
    fontWeight: '700',
    color: '#4F46E5',
    fontFamily: 'System',
  },

  customerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ratingStars: {
    flexDirection: 'row',
    marginRight: wp('2%'),
  },

  starIcon: {
    fontSize: wp('3.2%'),
    color: '#FFD700',
    marginRight: wp('0.5%'),
  },

  ratingText: {
    fontSize: wp('3%'),
    color: '#6B7280',
    fontWeight: '600',
    fontFamily: 'System',
  },

  addressCard: {
    backgroundColor: '#F8FAFF',
    borderRadius: wp('4.5%'),
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    marginBottom: hp('2%'),
  },

  addressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },

  addressIcon: {
    fontSize: wp('4%'),
    color: '#4F46E5',
    marginRight: wp('2%'),
  },

  addressTitle: {
    fontSize: wp('3.6%'),
    fontWeight: '700',
    color: '#4F46E5',
    fontFamily: 'System',
  },

  addressText: {
    fontSize: wp('3.6%'),
    color: '#4B5563',
    lineHeight: hp('2.6%'),
    fontFamily: 'System',
    marginLeft: wp('0%'), // Align with address icon
  },

  // Delivery Details Grid
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: hp('2%'),
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderRadius: wp('4%'),
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('3.5%'),
    marginRight: wp('2%'),
    marginBottom: hp('1%'),
  },

  detailIcon: {
    fontSize: wp('3.5%'),
    color: '#4F46E5',
    marginRight: wp('1.5%'),
  },

  detailText: {
    fontSize: wp('3.2%'),
    color: '#4B5563',
    fontWeight: '600',
    fontFamily: 'System',
  },

  // Action Section
  actionSection: {
    backgroundColor: 'rgba(238, 242, 255, 0.6)',
    borderRadius: wp('5%'),
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    marginBottom: hp('2%'),
  },

  actionTitle: {
    fontSize: wp('3.8%'),
    fontWeight: '700',
    color: '#3730A3',
    marginBottom: hp('1.5%'),
    fontFamily: 'System',
    textAlign: 'center',
  },

  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: wp('5%'),
    paddingVertical: hp('1.5%'),
    flex: 1,
    marginHorizontal: wp('1%'),
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  actionButtonPrimary: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },

  actionButtonIcon: {
    fontSize: wp('4%'),
    marginRight: wp('2%'),
  },

  actionButtonIconPrimary: {
    color: '#FFFFFF',
  },

  actionButtonIconDefault: {
    color: '#4F46E5',
  },

  actionButtonText: {
    fontSize: wp('3.4%'),
    fontWeight: '600',
    fontFamily: 'System',
  },

  actionButtonTextPrimary: {
    color: '#FFFFFF',
  },

  actionButtonTextDefault: {
    color: '#4F46E5',
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
  },

  quickAction: {
    alignItems: 'center',
    flex: 1,
  },

  quickActionCircle: {
    width: wp('14%'),
    height: wp('14%'),
    borderRadius: wp('7%'),
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('1%'),
    borderWidth: 2,
    borderColor: '#C7D2FE',
  },

  quickActionIcon: {
    fontSize: wp('5%'),
    color: '#4F46E5',
  },

  quickActionText: {
    fontSize: wp('2.8%'),
    color: '#4B5563',
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'System',
  },

  // Background Pattern
  patternBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },

  patternLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#4F46E5',
  },
});