import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  BackHandler
} from 'react-native';
import { useFocusEffect } from "@react-navigation/native";

import DeviceInfo from 'react-native-device-info';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { launchCamera } from 'react-native-image-picker';

import apiClient from '../../services/ApiClient';
import { SafeAreaView } from 'react-native-safe-area-context';

import {PermissionsAndroid, Platform} from 'react-native';
import { verifyFace } from '../../services/onboardingApi';


export default function FaceVerificationScreen({ navigation, route }) {

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Exit App",
          "Are you sure you want to exit the app?",
          [
            {
              text: "No",
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: () => BackHandler.exitApp(),
            },
          ]
        );

        return true; // Prevent default behavior
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  const initialUri = route?.params?.photoUri ?? null;
  const [photo, setPhoto] = useState(initialUri);
  const [uploading, setUploading] = useState(false);

  const { width, height } = useWindowDimensions();
  const isTablet = DeviceInfo.isTablet();
  const styles = createStyles(isTablet, width, height);

  const fromPreview = route?.params?.fromPreview ?? false;

  /* ================= CAMERA OPTIONS ================= */

  const cameraOptions = {
    mediaType: 'photo',
    cameraType: 'front',
    quality: 0.8,
    saveToPhotos: false,
  };

  /* ================= RETAKE PHOTO ================= */

  const requestCameraPermission = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
    {
      title: 'Camera Permission',
      message: 'App needs camera permission to capture your selfie.',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    },
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

  const retake = async () => {
  const hasPermission = await requestCameraPermission();

  if (!hasPermission) {
    Alert.alert('Permission Required', 'Camera permission is required.');
    return;
  }

  launchCamera(cameraOptions, response => {
    if (response.didCancel) return;

    if (response.errorCode) {
      console.log('Camera error:', response.errorMessage);
      return;
    }

    const asset = response.assets?.[0];

    if (asset?.uri) {
      setPhoto(asset.uri);
    }
  });
};
  /* ================= FILE INFO ================= */

  const getFileInfo = uri => {
    if (!uri || typeof uri !== 'string') {
      return { name: 'photo.jpg', type: 'image/jpeg' };
    }

    const parts = uri.split('/');
    const name = parts[parts.length - 1] || 'photo.jpg';
    const extMatch = name.match(/\.(\w+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';

    const mimeMap = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
    };

    return { name, type: mimeMap[ext] || 'image/jpeg' };
  };

  /* ================= UPLOAD SELFIE ================= */

  const uploadSelfie = async () => {
    if (!photo) {
      Alert.alert('No photo', 'Take a selfie first');
      return;
    }

    try {
      setUploading(true);

      const { name, type } = getFileInfo(photo);

      const formData = new FormData();
      formData.append('selfie', {
        uri: photo,
        name,
        type,
      });

      const response = await verifyFace(formData);

      if (response.status === 200) {
        if (fromPreview) {
          navigation.goBack(); // Returns to PreviewScreen
        } else {
          navigation.navigate('DocumentVerifyScreen');
        }
      } else {
        Alert.alert('Upload failed', response.data?.message || 'Try again');
      }
    } catch (err) {
      console.error('Upload exception', err);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        {/* HEADING */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>
            Verify Your Identity
          </Text>

          <Text style={styles.subTitle}>
            Make sure your entire face is visible
          </Text>
        </View>

        {/* CAMERA PREVIEW */}
        <View style={styles.previewCard}>
          <View style={styles.preview}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.previewImage} />
            ) : (
              <View style={styles.emptyPreview}>
                <Ionicons
                  name="camera-outline"
                  size={isTablet ? 60 : 42}
                  color="#9CA3AF"
                />

                <Text style={styles.emptyText}>
                  No photo selected
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          {/* UPLOAD BUTTON */}
          <TouchableOpacity
            onPress={uploadSelfie}
            style={styles.uploadBtn}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <ActivityIndicator
                  size="small"
                  color="#fff"
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.uploadText}>
                  Uploading...
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="cloud-upload-outline"
                  size={isTablet ? 28 : 22}
                  color="#fff"
                />

                <Text
                  style={styles.uploadText}>
                  Upload Photo
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* RETAKE BUTTON */}
          <TouchableOpacity
            onPress={retake}
            style={styles.retakeBtn}
          >
            <Ionicons
              name="camera-reverse-outline"
              size={isTablet ? 28 : 22}
              color='#1F3365'
            />

            <Text
              style={styles.retakeText}>
              Retake Photo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const createStyles = (
  isTablet,
  width,
  height,
) => {
  const contentWidth = isTablet
    ? width > 1000
      ? '58%'
      : '74%'
    : '100%';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8FAFC',
      alignItems: 'center',
    },

    contentWrapper: {
      flex: 1,
      width: contentWidth,
      paddingHorizontal: isTablet ? 30 : 24,
      paddingBottom: isTablet ? 24 : 18,
    },

    headerContainer: {
      alignItems: 'center',
      marginBottom: isTablet ? 36 : 26,
    },

    headerTitle: {
      fontSize: isTablet ? 34 : 26,
      fontWeight: '700',
      color: '#111827',
    },

    subTitle: {
      marginTop: 10,
      fontSize: isTablet ? 18 : 15,
      color: '#6B7280',
      textAlign: 'center',
      lineHeight: isTablet ? 28 : 22,
    },

    previewCard: {
      backgroundColor: '#fff',
      borderRadius: isTablet ? 28 : 20,
      padding: isTablet ? 20 : 14,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },

    preview: {
      width: '100%',
      height: isTablet
        ? height * 0.46
        : height * 0.42,
      borderRadius: isTablet ? 24 : 18,
      overflow: 'hidden',
      backgroundColor: '#111827',
      alignSelf: 'center',
    },

    previewImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
      backgroundColor: '#fff',
    },

    emptyPreview: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    emptyText: {
      marginTop: 12,
      color: '#D1D5DB',
      fontSize: isTablet ? 20 : 15,
      fontWeight: '500',
    },

    buttonsContainer: {
      marginTop: isTablet ? 34 : 26,
    },

    uploadBtn: {
      backgroundColor: '#1F3365',
      paddingVertical: isTablet ? 20 : 16,
      borderRadius: isTablet ? 20 : 16,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },

    uploadText: {
      marginLeft: 10,
      fontSize: isTablet ? 22 : 17,
      color: '#fff',
      fontWeight: '700',
    },

    retakeBtn: {
      marginTop: isTablet ? 18 : 14,
      backgroundColor: '#fff',
      borderColor: '#1F3365',
      borderWidth: 1.5,
      paddingVertical: isTablet ? 20 : 16,
      borderRadius: isTablet ? 20 : 16,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },

    retakeText: {
      marginLeft: 10,
      fontSize: isTablet ? 22 : 17,
      color: '#1F3365',
      fontWeight: '700',
    },
  });
};