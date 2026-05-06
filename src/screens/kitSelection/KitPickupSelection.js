import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import KitHeader from "../../components/kit/KitHeader";


const KitPickupSelection = ({ navigation, route }) => {
  const { width } = useWindowDimensions();

  // Get data from navigation params
  const { deliveryMode, addressData, selectedZone, apiResponse } = route?.params || {};
  const isFree = deliveryMode === "online" 
    ? (apiResponse?.data?.[0]?.isFree ?? true)
    : false
  const responseMessage = apiResponse?.message;
  
  // Handle Submit button - navigate to bottom tab navigator (home)
  const handleSubmit = () => {
    navigation.replace("MainTabs"); // Navigate to BottomTabNavigator (registered as "MainTabs")
  };

  // Determine display data based on mode
  const displayData = deliveryMode === "online" ? addressData : selectedZone;

  return (
    <ScrollView style={[styles.container, { padding: width * 0.05 }]}>
      <Text style={styles.title}>Kit Selection</Text>
      <KitHeader />

      {/* Selected Address/Zone Card*/}
      {displayData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {deliveryMode === "online" ? "📍 Delivery Address" : "📍 Pickup Location"}
          </Text>
          
          <TouchableOpacity style={[styles.card, styles.cardSelected]}>
            <View style={styles.row}>
              <View style={[styles.radioOuter, styles.radioOuterActive]}>
                <View style={styles.radioInner} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>
                  {displayData.zone?.name || displayData.name || displayData.storeName}
                </Text>
                <Text style={styles.address}>
                  {deliveryMode === "online"
                    ? `${displayData.address}, ${displayData.pincode}`
                    : `${displayData.addressLine1}${displayData.addressLine2 ? `, ${displayData.addressLine2}` : ''}, ${displayData.city}, ${displayData.state} - ${displayData.pincode}`
                  }
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Mode-specific Message */}
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>
              {deliveryMode === "online" ? "🚚" : "🏪"}
            </Text>
            <Text style={styles.infoText}>
              {deliveryMode === "online"
                ? "We will deliver your kit as soon as possible to the selected address."
                : "You can pick your kit from the selected zone by providing related user details."}
            </Text>
          </View>
        </View>
      )}

      {/* Free Kit and Paid Kit Promotional Card */}
      <View style={styles.promoCard}>
        <View style={styles.promoIconContainer}>
          <Text style={styles.promoIcon}>{isFree ? "🎁" : "🛒"}</Text>
        </View>

    
        <Text style={styles.promoTitle}>
          {(isFree ? "Congratulations!" : (responseMessage || "Kit Selected!"))}
        </Text>

        <Text style={styles.promoSubtitle}>
          {isFree ? "You're eligible for a FREE Kit" : "Your kit is ready to order"}
        </Text>

        <Text style={styles.promoDescription}>
          {isFree
            ? "Limited to first 100 users. Get your exclusive delivery partner kit at no cost!"
            : "Complete your purchase to receive your delivery partner kit."}
        </Text>

        <View style={[styles.promoBadge, !isFree && { backgroundColor: "#F59E0B" }]}>
          <Text style={styles.promoBadgeText}>
            {isFree ? "100% FREE" : "PAID KIT"}
          </Text>
        </View>
      </View>

      {/* Empty state if no data */}
      {!displayData && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyText}>
            No delivery information available.{"\n"}
            Please go back and select your delivery method.
          </Text>
        </View>
      )}

      {/* Submit Button */}
      {isFree ? (
        <TouchableOpacity
          style={[styles.submitBtn, !displayData && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!displayData}
        >
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.payBtn, !displayData && styles.submitBtnDisabled]}
          onPress={() => navigation.navigate("PaymentsScreen", { apiResponse })}
          disabled={!displayData}
        >
          <Text style={styles.submitText}>Proceed to Payment</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8FAFC" 
  },
  title: { 
    fontSize: 28, 
    fontWeight: "700", 
    marginBottom: 16,
    marginTop: 10,
    textAlign: "center",
    color: "#1E293B",
    letterSpacing: 0.5,
  },

  // Free Kit Promotional Card - Premium Design
  promoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 28,
    marginBottom: 24,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0EA5E9",
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  promoIconContainer: {
    marginBottom: 16,
  },
  promoIcon: {
    fontSize: 72,
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
    letterSpacing: 0.5,
    textAlign:'center'
  },
  promoSubtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0EA5E9",
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  promoDescription: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 10,
    letterSpacing: 0.2,
  },
  promoBadge: {
    backgroundColor: "#0EA5E9",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  promoBadgeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 14,
    letterSpacing: 0.3,
  },

  // Info Card - Mode specific message
  infoCard: {
    backgroundColor: "#F0F9FF",
    borderRadius: 16,
    padding: 18,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#BAE6FD",
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  infoIcon: {
    fontSize: 32,
    marginRight: 14,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: "#0C4A6E",
    lineHeight: 22,
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  // Empty State
  emptyContainer: {
    paddingVertical: 80,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  kitBox: {
    borderWidth: 2,
    borderColor: "#0EA5E9",
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  kitTitle: { 
    fontSize: 16, 
    fontWeight: "600",
    marginBottom: 12,
    color: "#334155",
    letterSpacing: 0.2,
  },
  imagesRow: { flexDirection: "row", alignItems: "center" },
  placeholderImg: {
    width: 90,
    height: 90,
    backgroundColor: "#E2E8F0",
    borderRadius: 12,
  },
  plus: { 
    marginHorizontal: 12, 
    fontSize: 24,
    color: "#64748B",
  },

  // Address Card - Enhanced Design
  card: {
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 18,
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardSelected: {
    borderColor: "#0EA5E9",
    backgroundColor: "#F0F9FF",
    borderWidth: 2.5,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },

  row: { flexDirection: "row" },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: "#CBD5E1",
    marginRight: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    backgroundColor: "#FFFFFF",
  },
  radioOuterActive: { 
    borderColor: "#0EA5E9",
    borderWidth: 3,
  },
  radioInner: {
    width: 12,
    height: 12,
    backgroundColor: "#0EA5E9",
    borderRadius: 6,
  },

  name: { 
    fontSize: 17, 
    fontWeight: "700",
    color: "#1E293B",
    letterSpacing: 0.2,
  },
  address: { 
    fontSize: 14, 
    marginTop: 6, 
    color: "#64748B",
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  
  // Submit Button - Inside ScrollView
  submitBtn: {
    backgroundColor: "#0EA5E9",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 30,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitBtnDisabled: {
    backgroundColor: "#94A3B8",
    opacity: 0.6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  submitText: { 
    color: "#FFFFFF", 
    fontSize: 18, 
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  payBtn: {
    backgroundColor: "#F59E0B",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 30,
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default KitPickupSelection;

