import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import apiClient from '../../services/ApiClient';


export default function FaceVerificationScreen({ navigation, route }) {
  const initialUri = route?.params?.photoUri ?? null;
  const [photo, setPhoto] = useState(initialUri);
  const [uploading, setUploading] = useState(false);

  /* ================= CAMERA OPTIONS ================= */

  const cameraOptions = {
    mediaType: 'photo',
    cameraType: 'front',
    quality: 0.8,
    saveToPhotos: false,
  };

  /* ================= RETAKE PHOTO ================= */

  const retake = () => {
    launchCamera(cameraOptions, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.log('Camera error:', response.errorMessage);
        return;
      }

      const asset = response.assets && response.assets[0];
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

      const response = await apiClient.post('/api/rider/selfie', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        navigation.navigate('DocumentVerifyScreen');
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
    <View style={{ flex: 1 }}>
      {/* HEADING */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: hp('5%'),
        }}
      >
        <Text style={{ fontSize: wp('5%'), fontWeight: '700' }}>
          Verify Your Identity
        </Text>
      </View>

      <Text
        style={{
          marginLeft: wp('16%'),
          marginTop: hp('3.7%'),
          fontSize: wp('4.5%'),
        }}
      >
        Make sure your entire face is visible
      </Text>

      {/* CAMERA PREVIEW */}
      <View style={styles.preview}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.previewImage} />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>
              No photo selected
            </Text>
          </View>
        )}
      </View>

      {/* UPLOAD BUTTON */}
      <TouchableOpacity
        onPress={uploadSelfie}
        style={styles.uploadBtn}
        disabled={uploading}>
        {uploading ? (
          <>
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{ marginRight: wp('2.6%') }}
            />
            <Text style={{ color: '#fff', fontWeight: '600' }}>
              Uploading...
            </Text>
          </>
        ) : (
          <Text
            style={{
              textAlign: 'center',
              fontSize: wp('5%'),
              color: 'white',
              fontWeight: '600',
            }}>
            Upload Photo
          </Text>
        )}
      </TouchableOpacity>

      {/* RETAKE BUTTON */}
      <TouchableOpacity onPress={retake} style={styles.retakeBtn}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: wp('5%'),
            color: '#0CBACE',
            fontWeight: '600',
          }}>
          Retake Photo
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  preview: {
    width: wp('90%'),
    height: hp('40%'),
    borderRadius: hp('10%'),
    overflow: 'hidden',
    backgroundColor: '#000',
    marginTop: hp('6%'),
    alignSelf: 'center',
  },

  previewImage: {
    width: wp('90%'),
    height: hp('40%'),
    resizeMode: 'contain',
    backgroundColor: 'white',
  },

  uploadBtn: {
    alignSelf: 'center',
    marginBottom: hp('1.2%'),
    backgroundColor: '#00B5CC',
    paddingVertical: hp('1.5%'),
    borderRadius: wp('8%'),
    width: wp('80%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('10%'),
  },

  retakeBtn: {
    marginTop: hp('2.4%'),
    alignSelf: 'center',
    backgroundColor: 'white',
    borderColor: '#00B5CC',
    borderWidth: 1,
    paddingVertical: hp('1.5%'),
    borderRadius: wp('8%'),
    width: wp('80%'),
  },
});
