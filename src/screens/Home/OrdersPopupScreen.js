import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import OrderCard from './OrderCard';
import { useNavigation } from '@react-navigation/native';
import { ORDER_STATUS } from '../../config/orderStates';
import { orderService } from '../../services/order/OrderService';

const OrdersPopupScreen = () => {
  const [timeLeft, setTimeLeft] = useState(20);
  const navigation = useNavigation();

  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAccept = async () => {
    try {
      await orderService.acceptOrder('DR-2864'); // Mock ID
      navigation.navigate('OrderDetailsScreen', {
        status: ORDER_STATUS.PICKUP_ASSIGNED,
      });
    } catch (error) {
      console.error('Failed to accept order:', error);
    }
  };

  return (
    <View style={styles.container}>
      <OrderCard
        distance="3 kms"
        price={45}
        items={2}
        pickup="Kirana Store, Kondapur"
        drop="ABC Hostel, Hafeezpet"
        timeLeft={timeLeft}
        onAccept={handleAccept} // ✅
      />
    </View>
  );
};

export default OrdersPopupScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f766e',
    padding: wp("4%"),
    justifyContent: 'center',
  },
});