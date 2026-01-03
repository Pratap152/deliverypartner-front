import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { startEditingAddress,assignAddress } from "../../redux/slices/addressSlice";
import KitHeader from "../../components/kit/KitHeader";
import { useKitAddress } from "../../hooks/useCreateKitAddress";

const KitPickupSelection = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const {address:globalAddress} = useSelector(state => state.address);
  const { getKitAddress, loading } = useKitAddress();
  
  
  const handleEdit = () => {
  dispatch(startEditingAddress());
  navigation.navigate("KitSelectionScreen");
};



useEffect(() => {
  async function fetchAddress() {
    try {
      const address = await getKitAddress();
      if (address) {
        dispatch(assignAddress(address));
      }
    } catch (e) {
      console.log("Failed to fetch address");
    }
  }

  fetchAddress();
}, []);
if (loading) return  (
  <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
<ActivityIndicator/>
  </View>
);
  return (
  <>
    <ScrollView style={[styles.container, { padding: width * 0.05 }]}>
      <Text style={styles.title}>Kit Selection</Text>
      <KitHeader />

      {globalAddress && (
        <TouchableOpacity style={[styles.card, styles.cardSelected]}>
          <View style={styles.row}>
            <View style={[styles.radioOuter, styles.radioOuterActive]}>
              <View style={styles.radioInner} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{globalAddress.name}</Text>
              <Text style={styles.address}>
                {globalAddress.address || globalAddress.completeAddress}, {globalAddress.pincode || globalAddress.pin}
              </Text>
            </View>

            <TouchableOpacity onPress={() => handleEdit(globalAddress)}>
              <Text style={styles.editIcon}>✎</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    </ScrollView>

    
    <View style={styles.bottomContainer}>
      <TouchableOpacity style={styles.addBtn} onPress={handleEdit}>
        <Text style={styles.addText}>Change Address</Text>
      </TouchableOpacity>

      <View style={styles.footerBtns}>
        <TouchableOpacity style={styles.payBtn}>
          <Text style={styles.payText}>Pay Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.payBtn}>
          <Text style={styles.payText}>Pay On EMI</Text>
        </TouchableOpacity>
      </View>
    </View>
  </>
);
};

export default KitPickupSelection;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 20, textAlign: "center" },

  kitBox: {
    borderWidth: 1,
    borderColor: "#00BCD4",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  kitTitle: { fontSize: 15, marginBottom: 10 },
  imagesRow: { flexDirection: "row", alignItems: "center" },
  placeholderImg: {
    width: 90,
    height: 90,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  plus: { marginHorizontal: 10, fontSize: 20 },

  card: {
    borderWidth: 1,
    borderColor: "#bdbdbd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  cardSelected: {
    borderColor: "#00BCD4",
    backgroundColor: "#E0F8FB",
  },

  row: { flexDirection: "row" },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#999",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  radioOuterActive: { borderColor: "#00BCD4" },
  radioInner: {
    width: 12,
    height: 12,
    backgroundColor: "#00BCD4",
    borderRadius: 6,
  },

  name: { fontSize: 14, fontWeight: "600" },
  address: { fontSize: 12, marginTop: 3, color: "#555" },
  editIcon: { fontSize: 18, paddingHorizontal: 5, color: "#00BCD4" },

  bottomContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  addBtn: {
    paddingVertical: 15,
    backgroundColor: "#00BCD4",
    borderRadius: 25,
    marginBottom: 25,
    alignItems: "center",
  },
  addText: { color: "#fff", fontSize: 15 },

  footerBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  payBtn: {
    backgroundColor: "#00BCD4",
    paddingVertical: 14,
    borderRadius: 25,
    width: "48%",
    alignItems: "center",
  },
  payText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
