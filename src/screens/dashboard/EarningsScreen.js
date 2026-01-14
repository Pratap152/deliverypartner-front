import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {
  WeeklyEarningsBarChart,
  weeklyData,
} from '../../components/dashboard/earnings/Charts';
import IncentiveCard from '../../components/dashboard/earnings/IncentiveCard';

export default function EarningsScreen() {

  // Card & chart sizing 
  const cardWidth = wp(90);
  const cardPadding = wp(4);
  const chartHeight = Math.min(
                          hp(28),
                          Math.max(hp(16), cardWidth * 0.45)
                        );
  const yAxisWidth = wp(15);


  const incentiveData = [
  {
    id: '1',
    title: 'Peak Hour Bonus',
    value: '₹50 extra / order',
    subtitle: '7:00 PM – 10:00 PM',
    accentColor: '#FFF7ED',
    badgeText: 'Active',
  },
  {
    id: '2',
    title: 'Daily Guarantee',
    value: 'Earn at least ₹900',
    subtitle: 'Complete 10 orders',
    accentColor: '#EFF6FF',
  },
  {
    id: '3',
    title: 'Weekend Special',
    value: '₹200 bonus',
    subtitle: 'Saturday & Sunday',
    accentColor: '#FAF5FF',
  },
];

  const renderHeader = () => (
      <View style={styles.container}>

      {/* HEADER */}
      <LinearGradient
        colors={['#00A63E', '#009966']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      > 
      <View style={styles.heading}>
        <Text style={styles.title}>Earnings</Text>
        <TouchableOpacity onPress={()=>console.log('Chat is clicked')}>
                            <Image 
                            source={require('../../assets/chat.png')}
                            style={styles.chat_icon} />
          </TouchableOpacity> 
      </View>
        
        <TouchableOpacity style={styles.daily_summary}>
            
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around',gap:wp(10)}}>
              <View>
                <Text style={styles.daily_text}>Today's Earnings</Text>
                <View style={[styles.daily_details_container,{marginTop:wp(2),}]}>
                  <Text style={styles.daily_details}>Orders</Text>
                  <Text style={styles.daily_details}>Tips </Text>
                  <Text style={styles.daily_details}>Bonus</Text>
                </View>
                <View style={[styles.daily_details_container]}>
                  <Text style={styles.daily_details}>10</Text>
                  <Text style={[styles.daily_details,{marginLeft:wp(5)}]}>₹50</Text>
                  <Text style={[styles.daily_details,{marginRight:wp(2)}]}>₹100</Text>
                </View>
              </View>
              <View>
                <Text style={{fontSize:wp(6),color:'#FFFFFF',fontWeight:'600'}}> ₹500</Text>
              </View>
            </View>
        </TouchableOpacity>
      </LinearGradient>


      {/* CHART CARD */}
      <View style={[styles.card, { width: cardWidth, padding: cardPadding }]}>

        {/* CARD HEADER */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>This Week</Text>
          <Text style={styles.cardValue}>₹8050</Text>
        </View>

        {/* CHART */}
        <View style={{ height: chartHeight }}>
          <WeeklyEarningsBarChart
            width={cardWidth - (cardPadding * 2 )- yAxisWidth}
            height={chartHeight}
            data={weeklyData}
          />
        </View>
      </View>

      {/* WALLET */}
      <TouchableOpacity
        onPress={()=>console.log('wallet is pressed')}>
        <LinearGradient
            colors={['#4F39F6', '#155DFC']}
            style={styles.wallet}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            >
            <View style={styles.wallet_heading}>
              <Ionicons name='wallet-outline' size={20} color='#FFFFFF' />
              <Text style={{color:'#FFFFFF',fontSize:wp(4)}}>Wallet Balance</Text>
            </View>
            <View style={styles.amount_withdraw}>
              <Text style={{color:'#FFFFFF',fontSize:wp(5),fontWeight:'600'}}>₹2,500</Text>
              <TouchableOpacity style={styles.withdraw_button}
                                onPress={()=> console.log('withdraw is pressed')}>
                <Text style={{color:'#4F39F6',alignSelf:'center',fontSize:wp(4)}}>Withdraw</Text>
              </TouchableOpacity>
            </View>
            <Text style={{color:'#FFFFFF',marginLeft:wp(8)}}>Available for withdrawal</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* INCENTIVES */}
      <View>
        <Text style={{fontSize:wp(4),fontWeight:'600',marginLeft:wp(5),marginTop:hp(3),paddingBottom:hp(1)}}>
          Extra Earnings Offers
        </Text>
      </View>
      

      
    </View>
  );

  const renderFooter = () => (
          <TouchableOpacity
              onPress={()=> console.log('monthly earnings is pressed')}>
                <Text>This Month</Text>

      </TouchableOpacity>
  );

  return (
      
      <FlatList
          data={incentiveData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <IncentiveCard item={item} />}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingBottom: hp(4) }}
          showsVerticalScrollIndicator={false}
        />

    
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },

  header: {
    paddingVertical:hp(4),
    paddingHorizontal: wp(5),
  },
  heading:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  title: {
    color: '#FFFFFF',
    fontSize: wp(6),
    fontWeight: '500',
  },
  chat_icon:{
            width:wp(6),
            height:wp(5),
            
  },
  daily_summary: {
    marginTop: hp(2),
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: wp(3),
    paddingVertical: hp(1.5),
    width:wp('90'),
    alignSelf:'center',
    
    
  },
  daily_text: {
    color: '#FFFFFF',
    fontSize: wp(4),
    fontWeight:'500'
  },
  daily_details_container:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
      width:wp(40)
      
  },
  daily_details:{
    color:'#FFFFFF',
    
  },
  card: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    marginTop: hp(2),
    borderRadius: wp(4),
    elevation: 4,
    paddingBottom:hp(5)
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.5),
  },
  cardTitle: {
    fontSize: wp(4),
    color: '#666',
  },
  cardValue: {
    fontSize: wp(4),
    fontWeight: '600',
    color: '#000',
  },
  wallet:{
    paddingVertical:hp(2),
    width:wp(90),
    alignSelf:'center',
    marginTop:hp(2),
    borderRadius:wp(5)
  },
  wallet_heading:{
    flexDirection:'row',
    alignItems:'center',
    marginLeft:wp(5),
    gap:wp(2),
    

  },

  amount_withdraw:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-around',
    gap:wp(15),
    marginTop:hp(1)
  },
  withdraw_button:{
      backgroundColor:'#FFFFFF',
      borderRadius:wp(2),
      width:wp(25),
      paddingVertical:hp(1)
  }
  

});
