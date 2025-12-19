import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  addAdress,
  updateAddress,
  clearEditingAddress,
  addAddress,
} from "../../redux/slices/addressSlice";
import KitHeader from "../../components/kit/KitHeader";
import apiClient from "../../api/ApiClient";
const KitSelectionScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();

  const editingAddress = useSelector(
    state => state.address.editingAddress
  );

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingAddress) {
      setName(editingAddress.name);
      setAddress(editingAddress.address);
      setPincode(editingAddress.pincode);
    }
  }, [editingAddress]);

  const validate = () => {
    const newErrors = {};

    if (!name || name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!address) {
      newErrors.address = "Address is required";
    }

    if (!/^\d{6}$/.test(pincode)) {
      newErrors.pincode = "Pincode must be exactly 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave =async () => {
    if (!validate()) return;

    if (editingAddress) {
      dispatch(
        updateAddress({
          id: editingAddress.id,
          name,
          address,
          pincode,
        })
      );
      dispatch(clearEditingAddress());
    } else {
      dispatch(
        addAddress({
          id: Date.now(),
          name,
          address,
          pincode,
        })
      );
    }
try {
  const response = await apiClient.post("/api/rider/kit-address", {
    name,
    completeAddress: address,
    pincode,
  });

  console.log(response.data);
  navigation.navigate("KitPickupSelection");
} catch (error) {
  console.log("❌ API failed:", error.response?.data || error.message);
}
navigation.navigate("KitPickupSelection");

  };

  return (
    <ScrollView style={[styles.container, { padding: width * 0.05 }]}>
        
      <Text style={styles.title}>Kit Selection</Text>
      <KitHeader/>
      <View style={{marginVertical:10}}>

      <Text style={styles.text}>
        Enter Your Address To Deliver This Kit
      </Text>
      </View>

      <Text style={styles.text}>
        Name:
      </Text>

      <TextInput
        placeholder="Please enter first name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      {errors.name && <Text style={styles.error}>{errors.name}</Text>}
      <Text style={styles.text}>
        Address:
      </Text>

      <TextInput
        placeholder="Please enter Address"
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        multiline
      />
      {errors.address && <Text style={styles.error}>{errors.address}</Text>}
      <Text style={styles.text}>
        Pincode:
      </Text>

      <TextInput
        placeholder="Pincode"
        style={styles.input}
        keyboardType="numeric"
        value={pincode}
        onChangeText={setPincode}
      />
      {errors.pincode && <Text style={styles.error}>{errors.pincode}</Text>}

      <TouchableOpacity style={styles.continueBtn} onPress={handleSave}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default KitSelectionScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 20, textAlign: "center" },

  input: {
    borderWidth: 1,
    borderColor: "#bdbdbd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 5,
  },
  error: {
    color: "#D32F2F",
    fontSize: 12,
    marginBottom: 10,
  },
   text: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
  },

  continueBtn: {
    backgroundColor: "#00BCD4",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  continueText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
