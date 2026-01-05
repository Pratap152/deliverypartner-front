import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from 'react-native-actionsheet';
import { useDispatch } from 'react-redux';
import Header from '../../components/common/Header';
import WEBSITE_URL from "../../utils/host";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { verifyDocument } from '../../redux/slices/documentsVerificationSlice';
import apiClient from '../../api/ApiClient';
import axios, { Axios } from 'axios';
import { tokenService } from '../../services/TokenService';

const PanUploadScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [panNumber, setPanNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const actionSheetRef = useRef();
  const dispatch = useDispatch();
  const { authToken } = useAuth();

  const openOptions = () => actionSheetRef.current.show();

  const takePhoto = () => {
    launchCamera({ mediaType: 'photo', quality: 1, cameraType: 'back' }, res => {
      if (res.didCancel || res.errorCode) return;
      setImage(res.assets[0]);
    });
  };

  const chooseFromGallery = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, res => {
      if (res.didCancel || res.errorCode) return;
      setImage(res.assets[0]);
    });
  };

  const validatePAN = (num) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(num);

  const handleSubmit = async () => {
    if (!image) {
      Alert.alert("Upload Required", "Please upload a PAN card image.");
      return;
    }

    if (!panNumber.trim()) {
      Alert.alert("Missing PAN Number", "Please enter your PAN Number.");
      return;
    }

    if (!validatePAN(panNumber)) {
      Alert.alert("Invalid PAN", "Enter a valid PAN format (ABCDE1234F)");
      return;
    }

    try {
      setLoading(true);
      const access = await tokenService.getAccessToken();
      console.log("access token....", access);
      // const authToken = await AsyncStorage.getItem("AUTH_TOKEN") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyaWRlcklkIjoiNjkzNDBkODE4YjdhZjNjMTg0ZGM4MmYwIiwicGhvbmUiOiI5ODc5ODc5ODc5IiwiaWF0IjoxNzY1MDE5MDQxLCJleHAiOjE3NjU2MjM4NDF9.lVY-cLPFwcp4CvKzWEIjX8LYxHRD_fDZyPSaisVCf1Q";
      if (!access) {
        Alert.alert("Session Expired", "Please login again");
        return;
      }

      const formData = new FormData();

      formData.append("panNumber", panNumber);
      formData.append("pan", {
        uri: image.uri,
        type: image.type || "image/jpeg",
        name: image.fileName || "pan.jpg",
      });

      console.log("Submitting PAN with data:", formData);
      fetch(`${WEBSITE_URL}/api/rider/pan`)
        .then(res => console.log("API OK"))
        .catch(err => console.log("RN blocked:", err.message));

      const response = await axios.post(
        `${WEBSITE_URL}/api/rider/pan`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${access}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          timeout: 20000,
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );

      console.log("PAN upload response:", response.data);

      dispatch(verifyDocument("pan"));

      Alert.alert("Success", "PAN submitted for verification.", [
        { text: "Next", onPress: () => navigation.replace("DocumentVerifyScreen", {
  documentType: "PAN",
  status: response.data.status,
  serverData: response.data,
})
 },
      ]);

    } catch (err) {
      Alert.alert("Upload Error", "Unable to upload PAN. Try again.");
      console.log("PAN upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header />
        <View style={{ flex: 1, marginTop: 20 }}>
          <Text style={styles.title}>PAN card details</Text>
          <Text style={styles.subtitle}>Upload clear photo & enter your PAN number.</Text>

          <TextInput
            placeholder="Enter PAN Number"
            value={panNumber}
            onChangeText={text => setPanNumber(text.toUpperCase())}
            autoCapitalize="characters"
            maxLength={10}
            style={{
              borderWidth: 1,
              borderColor: "#999",
              borderRadius: 8,
              padding: 10,
              marginTop: 20,
            }}
          />
          <Text>PAN format: ABCDE1234F</Text>
          <TouchableOpacity style={styles.uploadBox} onPress={openOptions}>
            {image ? (
              <>
                <Image source={{ uri: image.uri }} style={styles.previewImage} />
                <View style={styles.row}>
                  <View style={styles.uploadedTag}>
                    <Text style={styles.uploadedText}>Uploaded ✔</Text>
                  </View>
                  <TouchableOpacity onPress={openOptions} style={styles.reuploadBtn}>
                    <Text style={styles.reuploadText}>Re-upload</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Image
                  style={styles.placeholderImg}
                  source={{
                    uri: 'https://www.pancardapp.com/blog/wp-content/uploads/2019/04/sample-pan-card.jpg',
                  }}
                />
                <Text style={styles.placeholderText}>
                  Front side photo of your PAN card with your clear name and photo
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.instructionsBox}>
            <Text style={styles.instructionTitle}>Make sure your upload is:</Text>
            <Text style={styles.instruction}>• Clear and readable</Text>
            <Text style={styles.instruction}>• Shows your full name + photo</Text>
            <Text style={styles.instruction}>• Not blurred or cropped</Text>
            <Text style={styles.instruction}>• Taken in good lighting</Text>
          </View>



          <View style={{ flex: 1, justifyContent: 'flex-end' }}>

            <TouchableOpacity
              style={[styles.submitBtn, (!image || !panNumber) && { opacity: 0.5 }]}
              disabled={!image || !panNumber || loading}
              onPress={handleSubmit}
            >
              <Text style={styles.submitText}>{loading ? "Submitting..." : "Submit"}</Text>
            </TouchableOpacity>
          </View>

          <ActionSheet
            ref={actionSheetRef}
            title={'Upload PAN Card'}
            options={['Capture from Camera', 'Choose from Files', 'Cancel']}
            cancelButtonIndex={2}
            useNativeDriver={true}
            onPress={i => {
              if (i === 0) takePhoto();
              else if (i === 1) chooseFromGallery();
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PanUploadScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#000' },
  subtitle: { fontSize: 14, color: '#777', marginTop: 4 },

  uploadBox: {
    width: '100%',
    height: 240,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 14,
    borderColor: '#9f9f9f',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    padding: 10,
  },

  placeholderImg: {
    width: 200,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  placeholderText: {
    color: '#666',
    width: '85%',
    textAlign: 'center',
    fontSize: 14,
  },

  previewImage: {
    width: 200,
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 10,
  },

  uploadedTag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#e8ffe8',
    borderRadius: 20,
  },

  uploadedText: {
    color: '#1e9e38',
    fontWeight: '600',
  },

  instructionsBox: {
    marginTop: 25,
  },

  instructionTitle: {
    fontSize: 15,
    color: '#000',
    marginBottom: 5,
    fontWeight: '600',
  },

  instruction: {
    fontSize: 14,
    color: '#555',
    marginVertical: 1,
  },

  submitBtn: {
    backgroundColor: '#0CBACE',
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  submitText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
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
