import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import KitHeader from "../../components/kit/KitHeader";
import { useKitAddress } from "../../hooks/useCreateKitAddress";

const KitSelectionScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  
  // Delivery mode state
  const [deliveryMode, setDeliveryMode] = useState("online"); // "online" or "offline"
  
  // Online delivery form states
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [errors, setErrors] = useState({});
  
  // Offline pickup states
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [zonesLoading, setZonesLoading] = useState(false);
  const [zonesError, setZonesError] = useState(null);
  
  const { createKitAddress, getKitAddress, loading } = useKitAddress();

  // Fetch zones when switching to offline mode
  useEffect(() => {
    if (deliveryMode === "offline") {
      fetchZones();
    }
  }, [deliveryMode]);



  // Fetch pickup zones for offline mode
  const fetchZones = async () => {
    setZonesLoading(true);
    setZonesError(null);
    try {
      const response = await getKitAddress();
      // Assuming the response contains zones array
      // Adjust based on actual API response structure
      if (response && Array.isArray(response)) {
        setZones(response);
      } else if (response && response.zones) {
        setZones(response.zones);
      } else {
        setZones([]);
      }
    } catch (error) {
      console.log("Error fetching zones:", error);
      setZonesError(error.message || "Failed to fetch zones");
      setZones([]);
    } finally {
      setZonesLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!name || name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!address || address.length < 8) {
      newErrors.address = "Address is required";
    }

    if (!/^\d{6}$/.test(pincode)) {
      newErrors.pincode = "Pincode must be exactly 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (deliveryMode === "online") {
      // Online delivery: validate and submit address
      if (!validate()) return;
      
      try {
        // API throws error on failure, returns data on success
        await createKitAddress(name, address, pincode);
        
        // Navigate on success
        navigation.navigate("KitPickupSelection", {
          deliveryMode: "online",
          addressData: {
            name,
            address,
            pincode
          }
        });
      } catch (error) {
        // API failed - show error to user
        console.log("Error saving address:", error);
        alert(error?.response?.data?.message || "Failed to save address. Please try again.");
      }
    } else {
      // Offline pickup: ensure zone is selected
      if (!selectedZone) {
        alert("Please select a pickup zone");
        return;
      }
      
      // Navigate with selected zone
      navigation.navigate("KitPickupSelection", { 
        selectedZone,
        deliveryMode: "offline" 
      });
    }
  };

  // Determine button text and disabled state
  const getButtonConfig = () => {
    if (deliveryMode === "online") {
      return {
        text: loading ? "Submitting..." : "Submit Address & Continue",
        disabled: loading
      };
    } else {
      return {
        text: zonesLoading ? "Loading..." : "Continue with Selected Zone",
        disabled: zonesLoading || !selectedZone
      };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <ScrollView style={[styles.container, { padding: width * 0.05 }]}>
      <Text style={styles.title}>Kit Selection</Text>
      <KitHeader />

      {/* Segmented Control for Delivery Mode */}
      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            styles.segmentLeft,
            deliveryMode === "online" && styles.segmentActive
          ]}
          onPress={() => setDeliveryMode("online")}
        >
          <Text
            style={[
              styles.segmentText,
              deliveryMode === "online" && styles.segmentTextActive
            ]}
          >
            Online Delivery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentButton,
            styles.segmentRight,
            deliveryMode === "offline" && styles.segmentActive
          ]}
          onPress={() => setDeliveryMode("offline")}
        >
          <Text
            style={[
              styles.segmentText,
              deliveryMode === "offline" && styles.segmentTextActive
            ]}
          >
            Offline Pickup
          </Text>
        </TouchableOpacity>
      </View>

      {/* Online Delivery Mode - Address Form */}
      {deliveryMode === "online" && (
        <View style={styles.contentContainer}>
            <Text style={styles.text}>
              Enter Your Address To Deliver This Kit
            </Text>
          <Text style={styles.text}>Name:</Text>
          <TextInput
            placeholder="Please enter first name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}

          <Text style={styles.text}>Address:</Text>
          <TextInput
            placeholder="Please enter Address"
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            multiline
          />
          {errors.address && <Text style={styles.error}>{errors.address}</Text>}

          <Text style={styles.text}>Pincode:</Text>
          <TextInput
            placeholder="Pincode"
            style={styles.input}
            keyboardType="numeric"
            value={pincode}
            onChangeText={setPincode}
          />
          {errors.pincode && <Text style={styles.error}>{errors.pincode}</Text>}
        </View>
      )}

      {/* Offline Pickup Mode - Zone Selection */}
      {deliveryMode === "offline" && (
        <View style={styles.contentContainer}>
          <View style={{ marginVertical: 10 }}>
            <Text style={styles.text}>
              Select a Pickup Zone Near You
            </Text>
          </View>

          {zonesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00BCD4" />
              <Text style={styles.loadingText}>Loading available zones...</Text>
            </View>
          ) : zones.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📍</Text>
              <Text style={styles.emptyText}>
                Currently there are no zones around you.{"\n"}
                Come back later!
              </Text>
            </View>
          ) : (
            zones.map((zone, index) => (
              <TouchableOpacity
                key={zone.id || index}
                style={[
                  styles.zoneCard,
                  selectedZone?.id === zone.id && styles.zoneCardSelected
                ]}
                onPress={() => setSelectedZone(zone)}
              >
                <View style={styles.zoneRow}>
                  <View
                    style={[
                      styles.radioOuter,
                      selectedZone?.id === zone.id && styles.radioOuterActive
                    ]}
                  >
                    {selectedZone?.id === zone.id && (
                      <View style={styles.radioInner} />
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.zoneName}>
                      {zone.name || zone.zoneName || `Zone ${index + 1}`}
                    </Text>
                    <Text style={styles.zoneAddress}>
                      {zone.address || zone.completeAddress || "Address not available"}
                      {zone.pincode || zone.pin ? `, ${zone.pincode || zone.pin}` : ""}
                    </Text>
                    {zone.distance && (
                      <Text style={styles.zoneDistance}>📏 {zone.distance}</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}

          {zonesError && (
            <Text style={styles.error}>
              Error loading zones: {zonesError}
            </Text>
          )}
        </View>
      )}

      {/* Continue Button */}
      <TouchableOpacity
        disabled={buttonConfig.disabled}
        style={[
          styles.continueBtn,
          buttonConfig.disabled && styles.continueBtnDisabled
        ]}
        onPress={handleSave}
      >
        <Text style={styles.continueText}>{buttonConfig.text}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default KitSelectionScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8FAFC" // Light gray background
  },
  
  title: { 
    fontSize: 28, 
    fontWeight: "700", 
    marginBottom: 8,
    marginTop: 10,
    textAlign: "center",
    color: "#1E293B",
    letterSpacing: 0.5,
  },

  // Segmented Control Styles - Modern iOS Style
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 14,
    padding: 3,
    marginVertical: 4,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    marginHorizontal: 2,
  },
  segmentLeft: {
    marginLeft: 0,
  },
  segmentRight: {
    marginRight: 0,
  },
  segmentActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  segmentText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
    letterSpacing: 0.3,
  },
  segmentTextActive: {
    color: "#0EA5E9",
    fontWeight: "700",
  },

  // Content Container
  contentContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
  },

  // Text and Input Styles - Enhanced
  text: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: 16,
    marginBottom: 6,
    fontSize: 15,
    backgroundColor: "#FFFFFF",
    color: "#1E293B",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  error: {
    color: "#EF4444",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 12,
    marginLeft: 4,
    fontWeight: "500",
  },

  // Zone Card Styles - Modern Design
  zoneCard: {
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  zoneCardSelected: {
    borderColor: "#0EA5E9",
    backgroundColor: "#F0F9FF",
    borderWidth: 2.5,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  zoneRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: "#CBD5E1",
    marginRight: 14,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
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
  zoneName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  zoneAddress: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  zoneDistance: {
    fontSize: 13,
    color: "#0EA5E9",
    marginTop: 8,
    fontWeight: "600",
    letterSpacing: 0.2,
  },

  // Loading State - Enhanced
  loadingContainer: {
    paddingVertical: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  loadingText: {
    marginTop: 18,
    fontSize: 15,
    color: "#64748B",
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  // Empty State - Beautiful Design
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

  // Continue Button - Gradient Style
  continueBtn: {
    backgroundColor: "#0EA5E9",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 28,
    marginBottom: 24,
    marginHorizontal: 4,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  continueBtnDisabled: {
    backgroundColor: "#94A3B8",
    opacity: 0.7,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  continueText: { 
    color: "#FFFFFF", 
    fontSize: 17, 
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
