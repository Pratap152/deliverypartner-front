import React, { useEffect } from 'react';
import { View, SafeAreaView, StyleSheet,ScrollView, Image, TouchableOpacity, Text } from 'react-native';
import { ORDER_STATUS } from '../../config/orderStates';
import { orderUIConfig } from '../../config/orderUIConfig';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import OrderHeader from '../../components/home/OrderHeader';
import OrderAddressCard from '../../components/home/OrderAddressCard'; 
import OrderItemsCard from '../../components/home/OrderItemsCard';
import OrderEarningsCard from '../../components/home/OrderEarningsCard';
import SwipeButton from '../../components/common/SwipeButton';
import { orderService } from '../../services/order/OrderService';

const OrderDetailsScreen = ({ route, navigation }) => {
  const [status, setStatus] = React.useState(
    route?.params?.status ?? ORDER_STATUS.PICKUP_ASSIGNED
  );

  const ui = orderUIConfig[status];

  // Helper to handle completion (Swipe)
  const handleSwipeSuccess = async () => {
    const action = ui.bottomButtons[0]; // Assuming primary action is first
    if (action && action.nextStatus) {
      try {
        await orderService.updateOrderStatus('DR-2864', action.nextStatus);
        setStatus(action.nextStatus);
      } catch (error) {
        console.error('Failed to update status:', error);
      }
    }
  };

  // Helper handling navigation (Button)
  const handleNavigate = () => {
    const action = ui.bottomButtons.find(a => a.navigateTo);
    // Or default to map if current status implies navigation
    if (action && action.navigateTo) {
      navigation.navigate(action.navigateTo, {
        nextStatus: action.nextStatus,
      });
    } else {
      // Fallback or specific logic if needed
      navigation.navigate('Map', { nextStatus: status }); // Just view map
    }
  };

  const primaryAction = ui.bottomButtons[0];
  const isNavigationAction = primaryAction?.navigateTo;

  // Effect to handle navigation to Success Screen if Delivered
  useEffect(() => {
    if (status === ORDER_STATUS.ORDER_DELIVERED) {
      // Short delay to show the change, then navigate
      setTimeout(() => {
        navigation.replace('SuccessfullDelivered');
      }, 500);
    }
  }, [status]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          <OrderHeader
            orderId="DR-2864"
            statusText="Active delivery in progress"
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
      <Text style={styles.navigateBtnText}>Navigate 📍</Text>
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
});