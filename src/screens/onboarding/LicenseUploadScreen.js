import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import ActionSheet from "react-native-actionsheet";
import { useDispatch } from "react-redux";
import Header from '../../components/common/Header';
import WEBSITE_URL from "../../utils/host";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { verifyDocument } from "../../redux/slices/documentsVerificationSlice";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/ApiClient';
import axios from "axios";
import { tokenService } from "../../services/TokenService";

const LicenseUploadScreen = ({ navigation }) => {
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  const [dlNumber, setDlNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const { authToken } = useAuth();
  const actionSheetRef = useRef();
  const selectedBox = useRef(null);
  const dispatch = useDispatch();


  const openSheet = (box) => {
    selectedBox.current = box;
    actionSheetRef.current?.show();
  };

  const validateImage = (image) => {
    if (!image) throw new Error("Image not found");
    const sizeMB = image.fileSize ? image.fileSize / 1024 / 1024 : 0;
    if (sizeMB > 5) throw new Error("File too large (Max 5MB allowed)");
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(image.type))
      throw new Error("Invalid file format — only JPG or PNG allowed");
  };

  const validateDL = (dl) => {
    if (!dl) return false;
    const normalized = dl.replace(/\s+/g, "").toUpperCase();
    const regex = /^[A-Z]{2}[0-9]{2,3}[0-9]{4}[0-9]{7}$/;
    return regex.test(normalized);
  };


  const handlePick = (response) => {
    if (!response) return;
    if (response.didCancel) return;
    if (response.errorMessage) {
      Alert.alert("Error", response.errorMessage);
      return;
    }

    try {
      const img = response.assets && response.assets[0];
      if (!img) throw new Error("No image returned");
      validateImage(img);

      if (selectedBox.current === "front") setFront(img);
      else if (selectedBox.current === "back") setBack(img);
    } catch (err) {
      Alert.alert("Invalid Image", err.message);
    }
  };


  const pickCamera = () => {
    launchCamera({ mediaType: "photo", quality: 1 }, handlePick);
  };

  const pickGallery = () => {
    launchImageLibrary({ mediaType: "photo", quality: 1 }, handlePick);
  };


  const uploadLicense = async () => {

    if (!dlNumber.trim()) {
      Alert.alert("DL Number Required", "Please enter Driving License Number");
      return;
    }
    const normalizedDL = dlNumber.replace(/\s+/g, "").toUpperCase();
    if (!validateDL(normalizedDL)) {
      Alert.alert(
        "Invalid DL Number",
        "Enter valid DL format: e.g., TS00920180001234"
      );
      return;
    }
    if (!front || !back) {
      Alert.alert("Upload Required", "Upload both front & back images.");
      return;
    }

    try {
      setLoading(true);
      const access = await tokenService.getAccessToken();
      console.log("access token....", access);

      // const authToken = await AsyncStorage.getItem("AUTH_TOKEN") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyaWRlcklkIjoiNjkzNDBkODE4YjdhZjNjMTg0ZGM4MmYwIiwicGhvbmUiOiI5ODc5ODc5ODc5IiwiaWF0IjoxNzY1MDE5MDQxLCJleHAiOjE3NjU2MjM4NDF9.lVY-cLPFwcp4CvKzWEIjX8LYxHRD_fDZyPSaisVCf1Q";
      if (!access) {
        Alert.alert("Authorization Missing", "Please login again.");
        return;
      }

      const formData = new FormData();
      formData.append("dlNumber", normalizedDL);
      formData.append("front", {
        uri: front.uri,
        name: front.fileName || `front_${Date.now()}.jpg`,
        type: front.type || "image/jpeg",
      });
      formData.append("back", {
        uri: back.uri,
        name: back.fileName || `back_${Date.now()}.jpg`,
        type: back.type || "image/jpeg",
      });
      formData.append("documentType", "DL");


      console.log("FORM DATA CHECK: ", formData);
      fetch(`${WEBSITE_URL}/api/rider/dl`)
        .then(res => console.log(" API OK"))
        .catch(err => console.log(" RN blocked:", err.message));

      const response = await axios.post(
        `${WEBSITE_URL}/api/rider/dl`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${access}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          timeout: 20000,

        }
      );


     console.log("DL upload response:", response.data);
     
           dispatch(verifyDocument("dl"));
     
           Alert.alert("Success", "Driving License submitted for verification.", [
             { text: "Next", onPress: () => navigation.navigate("DocumentVerifyScreen") },
           ]);
     
         } catch (err) {
           Alert.alert("Upload Error", "Unable to upload Driving License. Try again.");
           console.log("DL upload error:", err);
         } finally {
           setLoading(false);
         }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <View style={styles.container}>
        <Header />
        <View style={{ flex: 1, marginTop: 20 }}>
          <ScrollView showsVerticalScrollIndicator={false}>

            <Text style={styles.title}>Driving Licence details</Text>
            <Text style={styles.subtitle}>
              Upload focused photo of your Driving Licence for faster verification
            </Text>


            <TextInput
              placeholder="Enter Driving License Number"
              placeholderTextColor="#888"
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 12,
                marginTop: 15,
                fontSize: 16,
              }}
              value={dlNumber}
              onChangeText={(t) => setDlNumber(t.toUpperCase())}
              autoCapitalize="characters"
            />
            <Text>DL format: AP00720249992221</Text>
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={() => openSheet("front")}
            >
              {front ? (
                <>
                  <Image source={{ uri: front.uri }} style={styles.preview} />

                  <View style={styles.row}>
                    <View style={styles.uploadedBadge}>
                      <Text style={styles.uploadedText}>Uploaded ✔</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.reuploadBtn}
                      onPress={() => openSheet("front")}
                    >
                      <Text style={styles.reuploadText}>Re-upload</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Image
                    source={{
                      uri: "https://dummyimage.com/300x200/cccccc/000000&text=Front+Side",
                    }}
                    style={styles.placeholder}
                  />
                  <Text style={styles.placeholderText}>
                    Front side photo of your Licence with your clear name and photo
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadBox}
              onPress={() => openSheet("back")}
            >
              {back ? (
                <>
                  <Image source={{ uri: back.uri }} style={styles.preview} />

                  <View style={styles.row}>
                    <View style={styles.uploadedBadge}>
                      <Text style={styles.uploadedText}>Uploaded ✔</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.reuploadBtn}
                      onPress={() => openSheet("back")}
                    >
                      <Text style={styles.reuploadText}>Re-upload</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Image
                    source={{
                      uri: "https://dummyimage.com/300x200/cccccc/000000&text=back+Side",
                    }}
                    style={styles.placeholder}
                  />
                  <Text style={styles.placeholderText}>
                    back side photo of your Licence with your clear details
                  </Text>
                </>
              )}
            </TouchableOpacity>

          </ScrollView>
        </View>
        <View style={{ justifyContent: 'flex-end' }}>
          <TouchableOpacity
            style={[styles.submitBtn, !(front && back && dlNumber) && { opacity: 0.5 }]}
            disabled={!(front && back && dlNumber) || loading}
            onPress={uploadLicense}
          >
            <Text style={styles.submitText}>{loading ? "Submitting..." : "Submit"}</Text>
          </TouchableOpacity>
        </View>


        <ActionSheet
          ref={actionSheetRef}
          title={"Upload Driving Licence"}
          options={["Capture from Camera", "Choose from Files", "Cancel"]}
          cancelButtonIndex={2}
          useNativeDriver={true}
          onPress={(index) => {
            if (index === 0) pickCamera();
            else if (index === 1) pickGallery();

          }}
        />


      </View>
    </SafeAreaView>
  );
};

export default LicenseUploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },

  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },

  uploadBox: {
    height: 230,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#bfbfbf',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    padding: 10,
  },

  placeholder: {
    width: 200,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  placeholderText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    width: '85%',
  },

  preview: {
    width: 200,
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 10,
  },

  uploadedBadge: {
    backgroundColor: '#e8ffe8',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  uploadedText: {
    color: '#1ea93e',
    fontWeight: '600',
  },

  submitBtn: {
    backgroundColor: '#0CBACE',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 7,
    alignItems: 'center',
  },

  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },

  reuploadBtn: {
    borderWidth: 1,
    borderColor: "#0CBACE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  reuploadText: {
    color: "#0CBACE",
    fontWeight: "700",
  },

});
