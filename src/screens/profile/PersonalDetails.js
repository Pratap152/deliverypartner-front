import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
import apiClient from "../../services/ApiClient";
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";

const PersonalDetailsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageModal, setImageModal] = useState(false);

  const fetchedOnce = useRef(false);

  const fetchProfile = useCallback(async () => {
  try {
    if (!fetchedOnce.current) setLoading(true);

    const res = await apiClient.get("/api/profile/rider/profile");
    const data = res.data?.data;

    if (!data) {
      Alert.alert("Error", "Profile data is missing");
      return;
    } 

    setProfile(data);

    setForm({
      fullName: data.personalInfo?.fullName || "",
      email: data.personalInfo?.email || "",
      dob: data.personalInfo?.dob || "",
      phoneNumber: data.phone?.number || "",
      countryCode: data.phone?.countryCode || "+91",
      streetAddress: data.location?.streetAddress || "",
      area: data.location?.area || "",
      city: data.location?.city || "",
      state: data.location?.state || "",
      pincode: data.location?.pincode || "",
      selfie: data.selfie || null,
    });

    fetchedOnce.current = true;
  } catch (e) {
    Alert.alert("Error", "Failed to fetch profile");
  } finally {
    setLoading(false);
  }
}, []);


  useFocusEffect(
  useCallback(() => {
    if (!fetchedOnce.current) {
      fetchProfile();
    }
  }, [fetchProfile])
);


  /* ---------------- HELPERS ---------------- */
  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const pickImage = async () => {
    console.log("FINAL SELFIE URI 👉", getSelfieUri(form.selfie));

    const res = await launchImageLibrary({ mediaType: "photo", quality: 0.7 });
    if (!res.didCancel && res.assets?.length > 0) {
      handleChange("selfie", res.assets[0].uri);
    }
  };

  const handleSave = async () => {

  try {

    setLoading(true);

    const formData = new FormData();
 
    formData.append("personalInfo[fullName]", form.fullName);

    formData.append("personalInfo[email]", form.email);

    formData.append("personalInfo[dob]", form.dob);
 
    formData.append("phone[number]", form.phoneNumber);

    formData.append("phone[countryCode]", form.countryCode);
 
    formData.append("location[streetAddress]", form.streetAddress);

    formData.append("location[area]", form.area);

    formData.append("location[city]", form.city);

    formData.append("location[state]", form.state);

    formData.append("location[pincode]", form.pincode);
 
    if (form.selfie?.startsWith("file://")) {

      formData.append("selfie", {

        uri: form.selfie,

        name: "selfie.jpg",

        type: "image/jpeg",

      });

    }
 
    const res = await apiClient.put(

      "/api/profile/update",

      formData,

      { headers: { "Content-Type": "multipart/form-data" } }

    );
 
    Alert.alert("Success", "Profile updated successfully");

    setIsEditing(false);

    fetchProfile();

  } catch (e) {

    Alert.alert("Error", "Update failed");

  } finally {

    setLoading(false);

  }

};

 

  if (loading && !profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00B2C9" />
      </View>
    );
  }

  if (!profile || !form) return null;

  const getSelfieUri = (selfie) => {
  if (!selfie) return null;

  // backend string URL
  if (typeof selfie === "string") return selfie;

  // backend object { url: "..." }
  if (typeof selfie === "object" && selfie.url) return selfie.url;

  // image picker object { uri: "file://..." }
  if (typeof selfie === "object" && selfie.uri) return selfie.uri;

  return null;
};

const selfieUri = getSelfieUri(form.selfie);


  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={rf(2.5)} color="#101828" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Personal Information</Text>

        <TouchableOpacity
          onPress={() => {
            if (isEditing) fetchProfile();
            setIsEditing(!isEditing);
          }}
        >
          <Text style={styles.editText}>
            {isEditing ? "Cancel" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <TouchableOpacity
            onPress={() =>
              isEditing ? pickImage() : form.selfie && setImageModal(true)
            }
            activeOpacity={0.8}
          >
            <View style={styles.avatarOuterWrapper}>
             <View style={styles.avatarWrapper}>
  {selfieUri ? (
    <Image source={{ uri: selfieUri }} style={styles.avatar} />
  ) : (
    <View style={styles.placeholder}>
      <Ionicons name="person" size={rf(6)} color="#98A2B3" />
    </View>
  )}
</View>


              {isEditing && (
                <View style={styles.addIcon}>
                  <Ionicons name="camera" size={rf(2)} color="#FFF" />
                </View>
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>{form.fullName}</Text>
            <Text style={styles.driverId}>Driver ID: DRV123456</Text>
          </View>
        </View>

        {/* BASIC INFORMATION */}
        <Section title="Basic Information">
          <Label iconName="person-outline" text="Full Name" />
          <Field editable={isEditing} value={form.fullName}
            onChangeText={(v) => handleChange("fullName", v)} />

          <Label iconName="mail-outline" text="Email" />
          <Field editable={isEditing} value={form.email}
            onChangeText={(v) => handleChange("email", v)} />

          <Label iconName="call-outline" text="Phone Number" />
          <Field editable={isEditing} value={form.phoneNumber}
            keyboardType="phone-pad"
            onChangeText={(v) => handleChange("phoneNumber", v)} />

          <Label iconName="calendar-outline" text="Date of Birth" />
          <Field editable={isEditing} value={form.dob}
            onChangeText={(v) => handleChange("dob", v)} />
        </Section>

        {/* ADDRESS */}
        <Section title="Address" iconName="location-outline">
          <Label text="Street Address" />
          <Field editable={isEditing} value={form.streetAddress}
            onChangeText={(v) => handleChange("streetAddress", v)} />

          <View style={styles.row}>
            <View style={styles.rowInput}>
              <Label text="Area" />
              <Field editable={isEditing} value={form.area}
                onChangeText={(v) => handleChange("area", v)} />
            </View>

            <View style={styles.rowInput}>
              <Label text="City" />
              <Field editable={isEditing} value={form.city}
                onChangeText={(v) => handleChange("city", v)} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.rowInput}>
              <Label text="State" />
              <Field editable={isEditing} value={form.state}
                onChangeText={(v) => handleChange("state", v)} />
            </View>

            <View style={styles.rowInput}>
              <Label text="Pincode" />
              <Field editable={isEditing} value={form.pincode}
                keyboardType="number-pad"
                onChangeText={(v) => handleChange("pincode", v)} />
            </View>
          </View>
        </Section>

        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: rh(4) }} />
      </ScrollView>

      {/* IMAGE MODAL */}
      <Modal
        visible={imageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setImageModal(false)}
      >
        <View style={styles.modal}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setImageModal(false)}
          >
            <Ionicons name="close" size={rf(3)} color="#FFF" />
          </TouchableOpacity>

        {selfieUri && (
  <Image
    source={{ uri: selfieUri }}
    style={styles.fullImage}
    resizeMode="contain"
  />
)}

        </View>
      </Modal>
    </View>
  );
};

const Section = ({ title, iconName, children }) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      {iconName && (
        <Ionicons
          name={iconName}
          size={rf(2.2)}
          color="#101828"
          style={{ marginRight: rw(2) }}
        />
      )}
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

const Label = ({ iconName, text }) => (
  <View style={styles.labelRow}>
    {iconName && (
      <Ionicons
        name={iconName}
        size={rf(1.8)}
        color="#667085"
        style={{ marginRight: rw(1.5) }}
      />
    )}
    <Text style={styles.labelText}>{text}</Text>
  </View>
);

const Field = ({ editable, style, ...props }) => (
  <TextInput
    {...props}
    editable={editable}
    style={[styles.input, !editable && styles.disabledInput, style]}
  />
);

export default PersonalDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    height: rh(8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: rw(4),
    backgroundColor: "#FFFFFF",
  },

  headerTitle: {
    fontSize: rf(2.3),
    fontWeight: "600",
    color: "#101828",
  },

  editText: {
    fontSize: rf(2),
    fontWeight: "600",
    color: "#00B2C9",
  },

  profileCard: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    padding: rw(4),
    marginHorizontal: rw(4),
    marginTop: rh(1.5),
    borderRadius: rw(3),
    elevation: 2,
  },

  avatar: {
    width: rw(20),
    height: rw(20),
    borderRadius: rw(10),
  },

  profileInfo: { marginLeft: rw(4) },

  name: {
    fontSize: rf(2.2),
    fontWeight: "600",
    color: "#101828",
  },

  driverId: {
    fontSize: rf(1.7),
    color: "#667085",
    marginTop: rh(0.6),
  },

  sectionCard: {
    backgroundColor: "#FFF",
    marginHorizontal: rw(4),
    marginTop: rh(1.8),
    borderRadius: rw(3),
    padding: rw(4),
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: rh(1.4),
  },

  sectionTitle: {
    fontSize: rf(2),
    fontWeight: "600",
    color: "#101828",
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: rh(0.6),
  },

  labelText: {
    fontSize: rf(1.7),
    color: "#667085",
    fontWeight: "500",
  },

  input: {
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: rw(2),
    paddingHorizontal: rw(3.5),
    paddingVertical: rh(1.5),
    fontSize: rf(1.9),
    marginBottom: rh(1.8),
    backgroundColor: "#FFF",
    color: "#101828",
  },

  disabledInput: { backgroundColor: "#F9FAFB" },

  row: { flexDirection: "row", justifyContent: "space-between" },
  rowInput: { width: "48%" },

  saveButton: {
    backgroundColor: "#00B2C9",
    marginHorizontal: rw(4),
    marginTop: rh(2.5),
    paddingVertical: rh(1.8),
    borderRadius: rw(2),
    alignItems: "center",
  },

  saveText: {
    color: "#FFF",
    fontSize: rf(2.1),
    fontWeight: "600",
  },

  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },

  fullImage: { width: "100%", height: "100%" },

  placeholder: {
    width: rw(20),
    height: rw(20),
    borderRadius: rw(10),
    backgroundColor: "#F2F4F7",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarOuterWrapper: {
    width: rw(20),
    height: rw(20),
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarWrapper: {
    width: "100%",
    height: "100%",
    borderRadius: rw(10),
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  addIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#00B2C9",
    width: rw(6),
    height: rw(6),
    borderRadius: rw(3),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },

  closeButton: {
    position: "absolute",
    top: rh(5),
    right: rw(4),
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: rw(10),
    height: rw(10),
    borderRadius: rw(5),
    justifyContent: "center",
    alignItems: "center",
  },
});
 