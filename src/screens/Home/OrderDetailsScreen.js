// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity ,SafeAreaView, Image} from 'react-native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import DeliverToCard from '../../components/home/DeliverToCard';
// import OrderItemsCard from '../../components/home/OrderItemsCard';
// import OrderEarningsCard from '../../components/home/OrderEarningsCard';

// const OrderPickupScreen = () => {
//   return (
//     <SafeAreaView style={styles.safeArea}>
//     <View style={styles.container}>
//       <View style={styles.headerRow}>
//   <View style={styles.headerTextContainer}>
//     <Text style={styles.header}>Order#DR-2864</Text>
//     <Text style={styles.subHeader}>Active delivery in progress</Text>
//   </View>

//   <TouchableOpacity style={styles.helpIconWrapper}>
//     <Image source={require('../../assets/help.png')} />
//   </TouchableOpacity>
// </View>

//       <DeliverToCard
//         name="John Anderson"
//         address="2nd floor, Ananta Apts, Near Jai Bhawan, Andheri 400059"
//       />

//       <OrderItemsCard
//         items={[
//           {
//             name: 'Margherita Pizza (Large)',
//             qty: 2,
//             image: require('../../assets/pizza.png'),
//           },
//           {
//             name: 'Besan Ladoo (Large)',
//             qty: 2,
//             image: require('../../assets/laddu.png'),
//           },
//           {
//             name: 'Cappuccino',
//             qty: 1,
//             image: require('../../assets/coffe.png'),
//           },
//         ]}
//       />

//       <OrderEarningsCard basePay={500} distancePay={100} bonus={45} />

//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>Order Picked Up</Text>
//       </TouchableOpacity>
//     </View>
//     </SafeAreaView>
//   );
// };

// export default OrderPickupScreen;

// const styles = StyleSheet.create({
//     safeArea: {
//     flex: 1,
//     backgroundColor: '#F8F8F8',
//   },
//   container: {
//     flex: 1,
//     paddingHorizontal: wp('4%'),
//     paddingTop: hp('1%'),
//     padding:20,
//     marginTop:10
//   },
//   headerRow: {
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   alignItems: 'flex-start',
//   marginBottom: hp('1.5%'),
// },

// headerTextContainer: {
//   flex: 1,
// },

// helpIconWrapper: {
//   width: wp('13%'),
//   height: wp('13%'),
//   borderRadius: wp('5%'),
//   backgroundColor: '#E8F7F0',
//   alignItems: 'center',
//   justifyContent: 'center',
//   marginTop:5
// },

// helpIcon: {
//   fontSize: wp('5%'),
// },

//   header: {
//     fontSize: wp('5.5%'),
//     fontWeight: '700',
//     color: '#1C1C1C',
//     marginTop:10
//   },
//   subHeader: {
//     fontSize: wp('3.2%'),
//     color: '#6B6B6B',
//     marginBottom: hp('1.5%'),
//     marginTop:10
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
// });


import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { ORDER_STATUS } from '../../config/orderStates';
import { orderUIConfig } from '../../config/orderUIConfig';

import OrderHeader from '../../components/home/OrderHeader';
import DeliverToCard from '../../components/home/DeliverToCard';
import OrderItemsCard from '../../components/home/OrderItemsCard';
import OrderEarningsCard from '../../components/home/OrderEarningsCard';
import OrderActions from '../../components/home/OrderActions';

const OrderDetailsScreen = ({ route, navigation }) => {
  // const { status } = route.params;
  // const ui = orderUIConfig[status];
  const [status, setStatus] = React.useState(
    route?.params?.status ?? ORDER_STATUS.PICKUP_ASSIGNED
  );

  const ui = orderUIConfig[status];

  const handleActionPress = (action) => {
    if (action.navigateTo) {
      navigation.navigate(action.navigateTo, {
        nextStatus: action.nextStatus,
      });
      return;
    }

    if (action.nextStatus) {
      setStatus(action.nextStatus);
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <OrderHeader
          orderId="DR-2864"
          statusText="Active delivery in progress"
          icon={ui.headerIcon}
        />

        <DeliverToCard
          name="John Anderson"
          address="201/D, Ananta Apts, Near Jai Bhawan, Andheri 400059"
        />

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

        {/* <OrderActions actions={ui.bottomButtons} /> */}
        <OrderActions
        actions={ui.bottomButtons}
        onActionPress={handleActionPress}
      />
      </View>
    </SafeAreaView>
  );
};
 
export default OrderDetailsScreen;
