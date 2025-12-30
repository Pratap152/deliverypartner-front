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
import Ionicons from 'react-native-vector-icons/Ionicons';

import { launchCamera } from 'react-native-image-picker';
import { useAuth } from '../../hooks/useAuth';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function FaceVerificationScreen({ navigation, route }) {
  const { authToken } = useAuth();

  const initialUri = route?.params?.photoUri ?? null;
  const [photo, setPhoto] = useState(initialUri);
  const [uploading, setUploading] = useState(false);

  // 📸 TAKE / RETAKE PHOTO
  const retake = async () => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'front',
        quality: 0.8,
        saveToPhotos: false,
      },
      response => {
        if (response.didCancel) return;

        if (response.errorCode) {
          Alert.alert('Camera Error', response.errorMessage || 'Failed');
          return;
        }

        const asset = response.assets?.[0];
        if (asset?.uri) {
          setPhoto(asset.uri);
        }
      },
    );
  };

  const getFileInfo = uri => {
    const name = uri.split('/').pop() || 'photo.jpg';
    const ext = name.split('.').pop()?.toLowerCase() || 'jpg';

    const typeMap = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
    };

    return { name, type: typeMap[ext] || 'image/jpeg' };
  };

  // ⬆️ UPLOAD SELFIE
  const uploadSelfie = async () => {
    if (!photo) {
      Alert.alert('No photo', 'Take a selfie first');
      return;
    }

    try {
      setUploading(true);

      const { name, type } = getFileInfo(photo);
      const fd = new FormData();

      fd.append('selfie', {
        uri: photo,
        name,
        type,
      });

      const res = await fetch(
        'https://delivarypartner.onrender.com/api/rider/selfie',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          body: fd,
        },
      );

      const json = await res.json().catch(() => ({}));
      console.log('STATUS:', res.status, json);

      if (res.ok) {
        navigation.navigate('DocumentVerifyScreen');
      } else {
        Alert.alert('Upload Failed', json.message || 'Try again');
      }
    } catch (err) {
      Alert.alert('Error', 'Upload failed');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* TITLE */}
      <Text style={styles.title}>Verify Your Identity</Text>
      <Text style={styles.subtitle}>Make sure your entire face is visible</Text>

      {/* PREVIEW */}
      <View style={styles.preview}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.previewImage} />
        ) : (
          <Text style={{ color: '#fff' }}>No photo selected</Text>
        )}
      </View>

      {/* UPLOAD */}
      <TouchableOpacity
        onPress={uploadSelfie}
        style={styles.uploadBtn}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <ActivityIndicator color="#fff" />
            <Text style={styles.uploadText}>Uploading...</Text>
          </>
        ) : (
          <Text style={styles.uploadText}>Upload Photo</Text>
        )}
      </TouchableOpacity>

      {/* RETAKE */}
      <TouchableOpacity onPress={retake} style={styles.retakeBtn}>
        <Text style={styles.retakeText}>Retake Photo</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    marginTop: hp('5%'),
    textAlign: 'center',
    fontSize: wp('5%'),
    fontWeight: '700',
  },

  subtitle: {
    marginTop: hp('3%'),
    marginLeft: wp('10%'),
    fontSize: wp('4.2%'),
  },

  preview: {
    width: wp('90%'),
    height: hp('40%'),
    borderRadius: hp('10%'),
    backgroundColor: '#000',
    marginTop: hp('6%'),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    backgroundColor: '#fff',
  },

  uploadBtn: {
    marginTop: hp('10%'),
    alignSelf: 'center',
    backgroundColor: '#0CBACE',
    paddingVertical: hp('1.5%'),
    borderRadius: wp('8%'),
    width: wp('80%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  uploadText: {
    color: '#fff',
    fontSize: wp('5%'),
    fontWeight: '600',
    marginLeft: wp('2%'),
  },

  retakeBtn: {
    marginTop: hp('2.5%'),
    alignSelf: 'center',
    borderColor: '#0CBACE',
    borderWidth: 1,
    paddingVertical: hp('1.5%'),
    borderRadius: wp('8%'),
    width: wp('80%'),
  },

  retakeText: {
    textAlign: 'center',
    fontSize: wp('5%'),
    color: '#0CBACE',
    fontWeight: '600',
  },
});
