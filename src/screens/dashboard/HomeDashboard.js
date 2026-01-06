import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useState,useEffect } from "react";
// import IncentiveDetails from "../Home/IncentiveDetails";
// import SwipeOnlineOffline from '../Home/SwipeOnlineOffline';
// import SwipeOnlineToggle from "../../screens/Home/SwipeOnlineToggle";
// import { checkLocationPermission } from "../../utils/locationPermissions";
export default function HomeDashboard({navigation}) {
 

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.userName}>Rajesh</Text>
        <Text style={styles.icon}>📍 🔔</Text>
      </View>

     
      {/* <SwipeOnlineOffline isOnline={isOnline} setIsOnline={setIsOnline} /> */}
 
      {/* Add Bank Details */}
      <View style={styles.bankCard}>
        <Text style={styles.bankTitle}>Add Bank Details</Text>
        <Text style={styles.bankDesc}>
          Complete your profile to receive instant payouts
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={()=>{navigation.navigate('AddBankDetails')}}>
          <Text style={styles.btnText}>Complete Now →</Text>
        </TouchableOpacity>
      </View>
 
      {/* Today's Progress */}
      <Text style={styles.sectionTitle}>Today's Progress</Text>
      <View style={styles.progressRow}>
        <ProgressCard title="Earnings" value="₹842" />
        <ProgressCard title="Online" value="4h 23m" />
        <ProgressCard title="Orders" value="12" />
      </View>
      {/* Refer & Earn */}
       <View style={styles.banner}>
          <TouchableOpacity onPress={()=>{navigation.navigate("ReferEarn")}}>
            <Text>Navigate to Refer Earn Screen</Text>
      </TouchableOpacity>
       </View>
       <View style={styles.banner}>
          <TouchableOpacity onPress={()=>{navigation.navigate('HelpCenterList')}}>
            <Text>Navigate to Help & Support </Text>
      </TouchableOpacity>
       </View>
        <View style={styles.banner}>
          <TouchableOpacity onPress={()=>{navigation.navigate('LiveTracking')}}>
            <Text>Navigate to Maps </Text>
      </TouchableOpacity>
       </View>

       <View style={styles.banner} >
        <TouchableOpacity onPress={()=>{navigation.navigate('ReportIssue')}}>
          <Text>Navigate to Report Issue Screen</Text>
        </TouchableOpacity>
       </View>
        <View style={styles.banner} >
        <TouchableOpacity onPress={()=>{navigation.navigate('CustomerNotResponding')}}>
          <Text>Navigate to Customer Not Responding</Text>
        </TouchableOpacity>
       </View>
       SuccessfullDelivered 
 <View style={styles.banner} >
        <TouchableOpacity onPress={()=>{navigation.navigate('SuccessfullDelivered')}}>
          <Text>Navigate to SuccessfullDelivered</Text>
        </TouchableOpacity>
       </View>
      {/* Active Shift */}
      <View style={styles.shiftCard}>
        <Text style={styles.shiftTitle}>Active Shift</Text>
        <Text style={styles.shiftTime}>Evening Peak • 6:00 PM - 11:00 PM</Text>
        <TouchableOpacity style={styles.whiteBtn}>
          <Text style={styles.darkText}>Book Now and Go Online</Text>
        </TouchableOpacity>
      </View>
 
      {/* Peak Hour Bonus */}
       <View style={styles.banner}>
          <TouchableOpacity onPress={()=>{navigation.navigate("IncentiveDetails")}}>
            <Text>Navigate to IncentiveDetails Screen</Text>
      </TouchableOpacity>
       </View>
     <View style={styles.banner}>
          <TouchableOpacity onPress={()=>{navigation.navigate("OrderDetailsScreen")}}>
            <Text>Navigate to OrderDetailsScreen</Text>
      </TouchableOpacity>
       </View>
       <View style={styles.banner}>
          <TouchableOpacity onPress={()=>{navigation.navigate("OrderPopupScreen")}}>
            <Text>Navigate to OrderPopupScreen</Text>
      </TouchableOpacity>
       </View>
      {/* Weekly Summary */}
      <View style={styles.weekCard}>
        <Text style={styles.weekTitle}>This Week</Text>
        <Text>Total Earnings: ₹6,420</Text>
        <Text>Orders Delivered: 48</Text>
        <Text>Online Hours: 32h 15m</Text>
      </View>
    </ScrollView>
  );
}
 
const ProgressCard = ({ title, value }) => (
  <View style={styles.progressCard}>
    <Text style={styles.progressValue}>{value}</Text>
    <Text style={styles.progressTitle}>{title}</Text>
  </View>
);
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6FEFF",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
  },
  icon: {
    fontSize: 18,
  },
  swipeBox: {
    backgroundColor: "#EAEAEA",
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 16,
  },
  swipeText: {
    color: "#999",
    fontWeight: "600",
  },
  bankCard: {
    backgroundColor: "#FFE8C8",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  bankTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  bankDesc: {
    marginVertical: 6,
    color: "#555",
  },
  primaryBtn: {
    backgroundColor: "#FF8C1A",
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  progressCard: {
    backgroundColor: "#fff",
    width: "30%",
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  progressValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  progressTitle: {
    color: "#777",
    marginTop: 4,
  },
  banner: {
    backgroundColor: "#4CC9C0",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  bannerSub: {
    color: "#EFFFFD",
    marginTop: 4,
  },
  shiftCard: {
    backgroundColor: "#6C63FF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  shiftTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  shiftTime: {
    color: "#EDEBFF",
    marginVertical: 8,
  },
  whiteBtn: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  darkText: {
    fontWeight: "600",
    textAlign: "center",
  },
  weekCard: {
    backgroundColor: "#DFFFEA",
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
});
 
 