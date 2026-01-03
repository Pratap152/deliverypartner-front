// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet } from 'react-native';
// import OrderCard from './OrderCard';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";

// const OrdersScreen = () => {
//   const [timeLeft, setTimeLeft] = useState(20);

//   useEffect(() => {
//     if (timeLeft === 0) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   return (
//     <View style={styles.container}>
//       <OrderCard
//         distance="3 kms"
//         price={45}
//         items={2}
//         pickup="Kirana Store, Kondapur"
//         drop="ABC Hostel, Hafeezpet"
//         timeLeft={timeLeft}
//       />
//     </View>
//   );
// };

// export default OrdersScreen;
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0f766e',
//     padding: wp("4%"),
//     justifyContent: 'center',
//   },
// });
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import OrderCard from './OrderCard';
import { useNavigation } from '@react-navigation/native';
import { ORDER_STATUS } from '../../config/orderStates';

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

  const handleAccept = () => {
    navigation.navigate('OrderDetails', {
      status: ORDER_STATUS.PICKUP_ASSIGNED,
    });
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
