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
  KeyboardAvoidingView,
} from "react-native";
import KitHeader from "../../components/kit/KitHeader";
import { useKitAddress } from '../../hooks/useCreateKitAddress';
import { BackHandler } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { setKitFlowStep } from '../../redux/slices/kitSlice';




const KitSelectionScreen = ({ navigation }) => {  
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = getStyles(isTablet);
  // Delivery mode state
  const [deliveryMode, setDeliveryMode] = useState("online"); 
  
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

  const goToHomeTab = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'MainTabs',
          params: {
            screen: 'Home',
          },
        },
      ],
    });
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      goToHomeTab();
      return true;
    });

    return () => subscription.remove();
  }, [navigation]);

  const riderKitData = useSelector(state =>
    currentRiderId ? state.kit?.riders?.[currentRiderId] ?? null : null
  );

  useEffect(() => {
    if (!riderKitData) return;

    if (riderKitData?.deliveryMode) {
      setDeliveryMode(riderKitData.deliveryMode);
    }

    if (riderKitData?.addressData) {
      setName(riderKitData.addressData.name ?? "");
      setAddress(riderKitData.addressData.address ?? "");
      setPincode(riderKitData.addressData.pincode ?? "");
    }

    if (riderKitData?.selectedZone) {
      setSelectedZone(riderKitData.selectedZone);
    }
  }, [riderKitData]);

  const dispatch = useDispatch();
  const currentRiderId = useSelector(state => state.profile?.data?._id ?? null);

  useEffect(() => {
    if (!currentRiderId) return;

    dispatch(setKitFlowStep({
      riderId: currentRiderId,
      currentStep: 'KitSelectionScreen',
      deliveryMode,
    }));
  }, [dispatch, currentRiderId, deliveryMode]);

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
      setZones(response || []); 
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
    if (!validate()) return;

    const payload = {
      name,
      address,
      pincode,
    };

    dispatch(setKitFlowStep({
      riderId: currentRiderId,
      currentStep: 'KitPickupSelection',
      deliveryMode: 'online',
      addressData: payload,
      selectedZone: null,
    }));

    navigation.replace("KitPickupSelection", {
      deliveryMode: "online",
      addressData: payload,
    });
  } else {
    if (!selectedZone) {
      alert("Please select a pickup zone");
      return;
    }

    dispatch(setKitFlowStep({
      riderId: currentRiderId,
      currentStep: 'KitPickupSelection',
      deliveryMode: 'offline',
      addressData: null,
      selectedZone,
    }));

    navigation.replace("KitPickupSelection", {
      deliveryMode: "offline",
      selectedZone,
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
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: isTablet ? width * 0.12 : width * 0.05,
          alignSelf: 'center',
          width: '100%',
          maxWidth: isTablet ? 850 : '100%',
        },
      ]}
    >
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
      <KeyboardAvoidingView style={{ flex: 1 ,}} behavior="height">
        <ScrollView 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }} 
                  keyboardShouldPersistTaps="handled">
       
          {deliveryMode === "online" && (
            <View style={styles.contentContainer}>
                <Text style={styles.text}>
                  Enter Your Address To Deliver This Kit
                </Text>
              <Text style={styles.text}>Name:</Text>
              <TextInput
                placeholder="Please enter your Name"
                placeholderTextColor='darkgrey'
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
              {errors.name && <Text style={styles.error}>{errors.name}</Text>}

              <Text style={styles.text}>Address:</Text>
              <TextInput
                placeholder="Please enter your Address"
                placeholderTextColor='darkgrey'
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                multiline
              />
              {errors.address && <Text style={styles.error}>{errors.address}</Text>}

              <Text style={styles.text}>Pincode:</Text>
              <TextInput
                placeholder="Please enter your Pincode"
                placeholderTextColor='darkgrey'
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
                zones.map((zone, index) => {
                  const isSelected = selectedZone?.id === zone.id;
                  
                  return (
                    <TouchableOpacity
                      key={zone.id || index}
                      style={[
                        styles.zoneCard,
                        isSelected && styles.zoneCardSelected
                      ]}
                      onPress={() => setSelectedZone(zone)}
                    >
                      <View style={styles.zoneRow}>
                        <View
                          style={[
                            styles.radioOuter,
                            isSelected && styles.radioOuterActive
                          ]}
                        >
                          {isSelected && (
                            <View style={styles.radioInner} />
                          )}
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text style={styles.zoneName}>
                              {zone.zone?.name || zone.name}
                            </Text>
                            <Text style={styles.zoneAddress}>
                              {zone.addressLine1} 
                              {zone.addressLine2 ? `, ${zone.addressLine2}` : ''}
                              {`, ${zone.city}, ${zone.state} - ${zone.pincode}`}
                            </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
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
    </KeyboardAvoidingView>
  </View>
  );
};

export default KitSelectionScreen;

const getStyles = (isTablet) =>
  StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8FAFC"
  }, 
  title: { 
    fontSize: isTablet ? 42 : 28,
    fontWeight: "700", 
    marginBottom: 8,
    marginTop: 10,
    textAlign: "center",
    color: "#1E293B",
    letterSpacing: 0.5,
  },
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
    paddingVertical: isTablet ? 22 : 14,
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
    fontSize: isTablet ? 20 : 15,
    fontWeight: "600",
    color: "#64748B",
    letterSpacing: 0.3,
  },
  segmentTextActive: {
    color: "#0EA5E9",
    fontWeight: "700",
  },
  contentContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  text: {
    fontSize: isTablet ? 22 : 15,
    fontWeight: "600",
    color: "#334155",
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    paddingVertical: isTablet ? 22 : 16,
    paddingHorizontal: isTablet ? 24 : 16,
    fontSize: isTablet ? 20 : 15,
    borderRadius: isTablet ? 18 : 12,
    marginBottom: 6,
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
  zoneCard: {
    borderWidth: 2,
    borderColor: "#E2E8F0",
    padding: isTablet ? 30 : 18,
    borderRadius: isTablet ? 22 : 16,
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
    fontSize: isTablet ? 26 : 17,
    color: "#1E293B",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  zoneAddress: {
    fontSize: isTablet ? 18 : 14,
    lineHeight: isTablet ? 28 : 20,
    color: "#64748B",
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight:'700'
  },
  zoneDistance: {
    fontSize: 13,
    color: "#0EA5E9",
    marginTop: 8,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
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
  continueBtn: {
    backgroundColor: "#0EA5E9",
    paddingVertical: isTablet ? 24 : 18,
    borderRadius: isTablet ? 22 : 16,
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
    fontSize: isTablet ? 22 : 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  });

