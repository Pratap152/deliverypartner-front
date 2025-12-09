import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';

import { ActivityIndicator } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

export default function FaceVerificationScreen({ navigation }) {
  const { authToken } = useAuth();

  const devices = useCameraDevices();

  const isFocused = useIsFocused();

  const [nativeDevices, setNativeDevices] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const [devicePosition, setDevicePosition] = useState('front');

  const cameraRef = useRef(null);

  const [hasPermission, setHasPermission] = useState(false);

  const [loadingDevices, setLoadingDevices] = useState(false);

  const [photo, setPhoto] = useState(null);
  const [isActive, setIsActive] = useState(true);

  const [uploading, setUploading] = useState(false);

  const loadDevices = async () => {
    try {
      setLoadingDevices(true);
      const list = await Camera.getAvailableCameraDevices();
      console.log('getAvailableCameraDevices ->', list);

      const byPos = {};
      (list || []).forEach(d => {
        if (d.position) byPos[d.position] = d;
      });
      setNativeDevices(byPos);

      const sel =
        byPos[devicePosition] ||
        byPos.front ||
        byPos.back ||
        (devices && (devices.front || devices.back)
          ? devices.front || devices.back
          : undefined);

      if (sel) {
        setSelectedDevice(sel);
        setIsActive(true);
      }
    } catch (e) {
      console.warn('getAvailableCameraDevices error ->', e);
    } finally {
      setLoadingDevices(false);
    }
  };

  // FOCUS-AWARE PERMISSION + NATIVE-DEVICE EFFECT
  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!isFocused) {
        setIsActive(false);
        return;
      }

      // check current permission status
      const status = await Camera.requestCameraPermission();
      console.log('Initial camera status ->', status);
      if (!mounted) return;

      const ok = status === 'authorized' || status === 'granted';
      setHasPermission(ok);

      if (ok) {
        await loadDevices();
      }
    })();

    return () => {
      mounted = false;
      setIsActive(false);
    };
  }, [isFocused, devicePosition]);

  // compute effective device each render (prefer selectedDevice state)
  const effectiveDevice =
    selectedDevice ||
    (nativeDevices && (nativeDevices.front || nativeDevices.back)
      ? nativeDevices[devicePosition] ||
        nativeDevices.front ||
        nativeDevices.back
      : devices && (devices.front || devices.back)
      ? devices[devicePosition] || devices.front || devices.back
      : undefined);

  // CAPTURING PHOTO
  const takePhoto = async () => {
    try {
      if (!cameraRef.current) return;
      const result = await cameraRef.current.takePhoto({ flash: 'off' });
      const uri =
        Platform.OS === 'android' ? `file://${result.path}` : result.path;
      console.log('PHOTO URI:', uri);
      setIsActive(false);
      setPhoto(uri);
    } catch (e) {
      console.error('takePhoto error', e);
      Alert.alert('Error taking photo', String(e));
    }
  };

  // SWAPPING FRONT/BACK
  const flipCamera = () => {
    const next = devicePosition === 'front' ? 'back' : 'front';
    setDevicePosition(next);
    // pick device from nativeDevices or devices based on next
    if (nativeDevices && (nativeDevices.front || nativeDevices.back)) {
      setSelectedDevice(
        nativeDevices[next] || nativeDevices.front || nativeDevices.back,
      );
    } else if (devices && (devices.front || devices.back)) {
      setSelectedDevice(devices[next] || devices.front || devices.back);
    }
    setIsActive(true);
  };

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
    return { name, type: mimeMap[ext] || `image/${ext}` };
  };

  // UPLOAD SELFIE
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

      // CALLING API
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
      console.log('STATUS:', res.status);
      console.log('BODY:', json);
      if (res.ok) {
        console.log('File uploaded successfully!');
        navigation.navigate('DocumentVerifyScreen');
      } else {
        console.log('Upload failed');
      }
    } catch (err) {
      console.error('Upload exception', err);
      console.log('Error', String(err));
    } finally {
      setUploading(false);
    }
  };

  // STYLING
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          gap: 75,
          marginTop: 55,
          marginLeft: 20,
          color: 'white',
        }}
      >
        {/* BACK BUTTON */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={22} color="black" />
        </TouchableOpacity>
        {/* HEADING */}
        <Text style={{ fontSize: 20, fontWeight: 700 }}>
          Verify Your Identity
        </Text>
      </View>

      <Text style={{ marginLeft: 60, marginTop: 30, fontSize: 18 }}>
        Make sure your entire face is visible
      </Text>

      <View style={styles.preview}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.previewImage} />
        ) : hasPermission && effectiveDevice ? (
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={effectiveDevice}
            isActive={isFocused}
            photo={true}
            enableHighQualityPhotos={true}
          />
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              { alignItems: 'center', justifyContent: 'center' },
            ]}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}></Text>
          </View>
        )}

        {/* CAPTURE, SWITCH CAMERA BUTTONS */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={flipCamera} style={styles.iconBtn}>
            <Ionicons name="camera-reverse-outline" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={takePhoto} style={styles.captureBtn}>
            <View style={styles.innerCapture} />
          </TouchableOpacity>
        </View>
      </View>

      {/* UPLOAD PHOTO BUTTON */}
      <TouchableOpacity
        onPress={uploadSelfie}
        style={{
          marginTop: 70,
          alignSelf: 'center',
          marginBottom: 10,
          backgroundColor: uploading ? '#9fdfe6' : '#0CBACE',
          paddingVertical: 12,
          borderRadius: 25,
          width: '60%',
        }}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{ marginRight: 10 }}
            />
            <Text
              style={{ color: '#fff', fontWeight: '600', alignSelf: 'center' }}
            >
              Uploading...
            </Text>
          </>
        ) : (
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              color: 'white',
              fontWeight: '600',
            }}
          >
            Upload Photo
          </Text>
        )}
      </TouchableOpacity>

      {/* RETAKE PHOTO BUTTON */}
      <TouchableOpacity
        onPress={() => {
          setPhoto(null);
          setIsActive(true);
        }}
        style={{
          marginTop: 20,
          alignSelf: 'center',
          backgroundColor: 'white',
          borderColor: '#0CBACE',
          borderWidth: 1,
          paddingVertical: 12,
          borderRadius: 25,
          width: '60%',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            color: '#0CBACE',
            fontWeight: '600',
          }}
        >
          Retake Photo
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  permissionBtn: {
    marginTop: 12,
    padding: 10,
    backgroundColor: 'lightgrey',
    borderRadius: 8,
  },
  previewWrap: { marginTop: 20, alignItems: 'center' },
  preview: {
    width: '80%',
    height: 360,
    borderRadius: 180,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginTop: 50,
    alignSelf: 'center',
  },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  controls: {
    position: 'absolute',
    bottom: 18,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  iconBtn: {
    padding: 5,
    backgroundColor: '#333',
    borderRadius: 40,
    marginRight: 10,
  },
  captureBtn: {
    width: 62,
    height: 62,
    borderRadius: 33,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 40,
  },
  innerCapture: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000',
  },
});
