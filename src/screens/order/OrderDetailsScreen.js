import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  Modal,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHandler } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { orderUIConfig } from '../../config/orderUIConfig';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getDistance } from 'geolib';

import OrderHeader from '../../components/order/OrderHeader';
import OrderAddressCard from '../../components/order/OrderAddressCard';
import OrderItemsCard from '../../components/order/OrderItemsCard';
import OrderEarningsCard from '../../components/order/OrderEarningsCard';
import OrderSkeleton from '../../components/order/OrderSkeleton';
import EmptyState from '../../components/order/EmptyState';
import { orderService } from '../../services/order/OrderService';
import CustomerNotResponding from '../Home/CustomerNotResponding';
import SwipeButton from '../../components/common/SwipeButton';
import { useGPS } from '../../context/GPSContext';


const OrderDetailsScreen = ({ route, navigation }) => {

  const { orderId } = route.params;
  console.log("Order Id from OderDetailScreen", orderId);

  const [status, setStatus] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [distanceToTarget, setDistanceToTarget] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CASH'); 

  const ui = orderUIConfig[status] || {};

  const { location } = useGPS();

  console.log("check",orderDetails)

  useEffect(() => {
    // Disable Android hardware back button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true // Prevent back navigation
    );

    // Disable iOS swipe gesture
    navigation.setOptions({
      gestureEnabled: false,
    });

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    if (route.params?.status) {
      setStatus(route.params.status);
    }
  }, [route.params?.status]);

  //Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        console.log(`[OrderDetailsScreen] Fetching details for ${orderId}`);
        setLoading(true);
        setError(null);
        const data = await orderService.getOrderDetails(orderId);
        
        if (!data) {
          setError('Order information not found');
          return;
        }

        setOrderDetails(data);

        if (data.orderStatus) {
          setStatus(data.orderStatus);
        }
      } catch (err) {
        console.error(`[OrderDetailsScreen] Error fetching details:`, err);
        setError('Failed to load order details. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

 
  useEffect(() => {
    if(!location || !orderDetails){
    return;
    }
    let target;
    if(status==="ASSIGNED" || status==="EN_ROUTE_TO_PICKUP"){
      target={
      latitude:orderDetails.pickupAddress.lat,
      longitude:orderDetails.pickupAddress.lng
      };
    } else {
      target={
      latitude:orderDetails.deliveryAddress.lat,
      longitude:orderDetails.deliveryAddress.lng
    };
  }
    const distance=getDistance(location,target);
    setDistanceToTarget(distance);
    },[
      location,
      status,
      orderDetails
    ]);

  //  Button action
  const handleAction = async () => {
    const action = ui.bottomButtons?.[0];
    if (!action) return;

    try {
      setButtonLoading(true);

      // NAVIGATION
      if (action.navigateTo) {
        navigation.navigate(action.navigateTo, {
          orderId,
          status,
          orderDetails,
          type: action.action, // useful for Map screen

        });
        return;
      }

      let res = null;

      // API CALL BASED ON ACTION
      if (action.action === 'enRouteToPickup') {
        res = await orderService.markEnRouteToPickup(orderId);
      }

      if (action.action === 'pickupOrder') {
        res = await orderService.pickupOrder(orderId);
      }

      if (action.action === 'inTransit') {
        res = await orderService.markInTransit(orderId);
      }

      if (action.action === 'deliverOrder') {
        res = await orderService.deliverOrder(orderId);

        const earning =
          res?.earningCredited ||
          orderDetails?.riderEarning?.totalEarning ||
          0;

        const cod = res?.codCollected || 0;

        const isCOD = orderDetails?.payment?.method?.toUpperCase() === 'COD' ||
          orderDetails?.payment?.paymentMethod?.toUpperCase() === 'COD' ||
          orderDetails?.payment?.mode?.toUpperCase() === 'COD';

        navigation.reset({
          index: 0,
          routes: [{
            name: 'SuccessfullDelivered',
            params: {
              amount: earning,
              codCollected: cod,
              orderId,
              paymentMethod: isCOD ? paymentMethod : 'ONLINE',
            }
          }],
        });

        return;
      }

      //REFETCH ORDER (BEST PRACTICE)
      const updated = await orderService.getOrderDetails(orderId);

      setOrderDetails(updated);
      setStatus(updated.orderStatus);

      //DELIVERY SUCCESS FLOW
      if (updated.orderStatus === 'DELIVERED') {
        setDeliveryResult(res);
      }

    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setButtonLoading(false);
    }
  };

  /**
   * Navigate action (Using existing button for "Navigate ")
   */
  const handleNavigateMap = () => {
    handleStartNavigation();
    // Also open external maps if needed, but for now zooming internal map
  };


  /* ------------------ UI STATES ------------------ */

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <OrderSkeleton />
      </SafeAreaView>
    );
  }

  if (error || !orderDetails) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <EmptyState 
          title="Order Not Found"
          message={error || "We couldn't retrieve the details for this order."}
          icon="alert-circle-outline"
          onRetry={() => navigation.goBack()}
          buttonText="Go Back"
        />
      </SafeAreaView>
    );
  }

  // Determine Map Targets
  let pickupTarget = { latitude: orderDetails.pickupAddress.lat, longitude: orderDetails.pickupAddress.lng };
  let dropTarget = { latitude: orderDetails.deliveryAddress.lat, longitude: orderDetails.deliveryAddress.lng };

  const isPickupPhase =
    status === 'ASSIGNED' ||
    status === 'EN_ROUTE_TO_PICKUP';

  /* MAIN UI */
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: ui.bottomButtons && ui.bottomButtons.length > 0 ? 100 : 20 }}>
        <View style={styles.container}>

          <OrderHeader
            orderId={orderDetails.orderId}
            statusText={ui.label || "Active delivery in progress"} // Use status label
            icon={ui.headerIcon || "bike"}
          />

          {isPickupPhase ? (
            <>
              <OrderAddressCard 
                title="Pickup Location"
                name={orderDetails.pickupAddress?.name}
                address={orderDetails.pickupAddress?.addressLine}
                iconType="store"
                theme="green"
              />
              <OrderAddressCard 
                title="Drop Location"
                name={orderDetails.deliveryAddress?.name}
                address={orderDetails.deliveryAddress?.addressLine}
                iconType="marker"
                theme="red"
              />
            </>
          ) : (
            <View style={styles.deliverToCard}>
              <View style={styles.deliverHeader}>
                <View style={styles.deliverIconContainer}>
                   <Ionicons name="person-outline" size={wp('6%')} color="#4F46E5" />
                </View>
                <View style={styles.deliverTitleContainer}>
                  <Text style={styles.deliverTitle}>DELIVER TO</Text>
                  <Text style={styles.deliverSubtitle}>Final Destination</Text>
                </View>
              </View>

              <OrderAddressCard 
                title="Delivery Address"
                name={orderDetails.deliveryAddress?.name}
                address={orderDetails.deliveryAddress?.addressLine}
                iconType="user"
                theme="blue"
              />

              {(status === 'IN_TRANSIT' || status === 'RIDER_ARRIVED_AT_DROP') && (
                <TouchableOpacity
                  style={styles.chatButton}
                  onPress={() => navigation.navigate('ChatSupportScreen', { 
                    orderId: orderDetails.orderId,
                    customerName: orderDetails.deliveryAddress?.name
                  })}
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.chatButtonText}>Chat with Customer</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <OrderItemsCard
            items={(orderDetails.items || []).map(item => ({
              name: item.itemName || item.name,
              qty: item.quantity || item.qty,
            }))}
          />

          <OrderEarningsCard
            pricing={orderDetails.pricing}
            items={orderDetails.items}
          />

          {status === 'RIDER_ARRIVED_AT_DROP' && (
            orderDetails?.payment?.method?.toUpperCase() === 'COD' ||
            orderDetails?.payment?.paymentMethod?.toUpperCase() === 'COD' ||
            orderDetails?.payment?.mode?.toUpperCase() === 'COD'
          ) && (
              <View style={styles.paymentSection}>
                {/* Payment Method Selection */}
                <View style={styles.methodSection}>
                  <Text style={styles.methodTitle}>Payment Method</Text>
                  <Text style={styles.methodSubtitle}>Please select a payment method to collect payment from the customer</Text>

                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() => setPaymentMethod('CASH')}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.radioButton, paymentMethod === 'CASH' && styles.radioButtonSelected]}>
                      {paymentMethod === 'CASH' && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioText}>Collect Cash</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() => setPaymentMethod('ONLINE')}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.radioButton, paymentMethod === 'ONLINE' && styles.radioButtonSelected]}>
                      {paymentMethod === 'ONLINE' && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioText}>Online Payment</Text>
                  </TouchableOpacity>

                  {paymentMethod === 'ONLINE' && (
                    <View style={styles.qrContainer}>
                      <Image
                        source={require('../../assets/Qr.png')}
                        style={styles.qrImage}
                        resizeMode="contain"
                      />
                      <View style={styles.qrAmountBox}>
                        <Text style={styles.qrAmountLabel}>Amount to be paid</Text>
                        <Text style={styles.qrAmountValue}>₹{(orderDetails.pricing?.totalAmount || orderDetails.pricing?.total || 0).toFixed(2)}</Text>
                      </View>
                    </View>
                  )}

                  {paymentMethod === 'CASH' && (
                    <View style={styles.cashAmountBox}>
                      <Text style={styles.cashAmountLabel}>Amount to be Collected</Text>
                      <Text style={styles.cashAmountValue}>₹{(orderDetails.pricing?.totalAmount || orderDetails.pricing?.total || 0).toFixed(2)}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          {/* Secondary Buttons (Customer Not Responding) */}
          {!isPickupPhase && ui.secondaryButtons && ui.secondaryButtons.length > 0 && (
            <View style={{ marginTop: 10, marginBottom: 30 }}>
              {ui.secondaryButtons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.customerIssueButton}
                  activeOpacity={0.85}
                  onPress={async () => {
                    if (button.action === 'rejectOrder') {
                          try {
                            setButtonLoading(true);
                            await orderService.rejectOrder(orderId);
                            navigation.goBack();
                          } catch (err) {
                            Alert.alert("Error", "Failed to reject order");
                          } finally {
                            setButtonLoading(false);
                          }
                        }

                    if (button.action === 'openCancelModal') {
                      setShowCustomerModal(true);
                    }
                  }}
                >
                  <View style={styles.issueLeft}>
                    <View style={styles.issueIconCircle}>
                      <Ionicons
                        name="alert-circle-outline"
                        size={22}
                        color="#F7931E"
                      />
                    </View>

                    <View>
                      <Text style={styles.issueTitle}>{button.label}</Text>
                      <Text style={styles.issueSubtitle}>
                        Try calling or report issue
                      </Text>
                    </View>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={22}
                    color="#F7931E"
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}

        </View>
      </ScrollView>

      <SwipeButton
        ui={ui}
        buttonLoading={buttonLoading}
        handleAction={handleAction}
        status={status}
        orderDetails={orderDetails}
        paymentMethod={paymentMethod}
        distanceToTarget={distanceToTarget}
      />

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
    backgroundColor: '#F9FAFF',
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
  },

  issueSubtitle: {
    marginTop: hp('0.5%'),
    fontSize: wp('3.4%'),
    color: '#D97706',
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

  dropStoreName: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: '#f85e5e',
    marginBottom: hp('0.8%'),
    fontFamily: 'System',
    letterSpacing: 0.2,
  },
  dropAddress: {
    fontSize: wp('3.6%'),
    color: '#EF4444',
    lineHeight: hp('2.6%'),
    fontFamily: 'System',
    marginTop: hp('0%'),
    paddingLeft: wp('0%'),
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
    marginBottom: hp('1.5%'),
  },

  deliverIconContainer: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('4%'),
    borderWidth: 2,
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


  // Payment Section Styles
  paymentSection: {
    marginBottom: hp('2%'),
  },
  paymentSummaryCard: {
    backgroundColor: '#34A853', // Premium green as requested
    borderRadius: wp('5%'),
    padding: wp('5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  paymentSummaryTitle: {
    color: '#FFFFFF',
    fontSize: wp('4.5%'),
    fontWeight: '700',
    marginBottom: hp('2%'),
    opacity: 0.9,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  paymentLabel: {
    color: '#FFFFFF',
    fontSize: wp('3.8%'),
    opacity: 0.8,
  },
  paymentValue: {
    color: '#FFFFFF',
    fontSize: wp('3.8%'),
    fontWeight: '600',
  },
  paymentDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: hp('1.5%'),
  },
  paymentTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('0.5%'),
  },
  paymentTotalLabel: {
    color: '#FFFFFF',
    fontSize: wp('4.2%'),
    fontWeight: '700',
  },
  paymentTotalValue: {
    color: '#FFFFFF',
    fontSize: wp('6%'),
    fontWeight: '800',
  },
  methodSection: {
    marginTop: hp('1%'),
  },
  methodTitle: {
    fontSize: wp('5%'),
    fontWeight: '800',
    color: '#2D3748',
    marginBottom: hp('1%'),
  },
  methodSubtitle: {
    fontSize: wp('3.5%'),
    color: '#718096',
    marginBottom: hp('2.5%'),
    lineHeight: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
    paddingVertical: hp('0.5%'),
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#4A5568',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  radioButtonSelected: {
    borderColor: '#1e3a8a', // Dark blue
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1e3a8a',
  },
  radioText: {
    fontSize: wp('4.2%'),
    fontWeight: '600',
    color: '#2D3748',
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: hp('2%'),
    padding: wp('5%'),
    backgroundColor: '#FFFFFF',
    borderRadius: wp('4%'),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qrImage: {
    width: wp('60%'),
    height: wp('60%'),
    marginBottom: hp('2%'),
  },
  qrAmountBox: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp('4%'),
    backgroundColor: '#F0F4FF',
    borderRadius: wp('3%'),
  },
  qrAmountLabel: {
    fontSize: wp('3.8%'),
    color: '#4A5568',
    fontWeight: '600',
  },
  qrAmountValue: {
    fontSize: wp('4.5%'),
    color: '#1e3a8a',
    fontWeight: '800',
  },
  cashAmountBox: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp('4%'),
    backgroundColor: '#F0F4FF',
    borderRadius: wp('3%'),
    marginTop: hp('1%'),
  },
  cashAmountLabel: {
    fontSize: wp('3.8%'),
    color: '#4A5568',
    fontWeight: '600',
  },
  cashAmountValue: {
    fontSize: wp('4.5%'),
    color: '#1e3a8a',
    fontWeight: '800',
  },
  chatButton: {
    backgroundColor: '#3730A3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.5%'),
    borderRadius: wp('3%'),
    marginTop: hp('2%'),
    shadowColor: '#3730A3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  chatButtonText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: '700',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
});