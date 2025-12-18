import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
 
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
 
import { useAuth } from '../../hooks/useAuth';
 
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
 
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
  return(
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <View
        style={{
          flexDirection: 'row',
          alignItems:'center',
          gap: wp('20%'),          
          marginTop: hp('5%'),  
          marginLeft: wp('4%'),  
          color: 'white',
          position:'relative'
        }}
      >
        {/* BACK BUTTON */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={22} color="black" />
        </TouchableOpacity>
        {/* HEADING */}
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
 
      {/* CAMERA */}
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
          marginTop: hp('8.6%'),    
          alignSelf: 'center',
          marginBottom: hp('1.2%'),
          backgroundColor: uploading ? '#9fdfe6' : '#0CBACE',
          paddingVertical: hp('1.5%'),
          borderRadius: wp('6%'),
          width: wp('60%'),
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{ marginRight: wp('2.6%') }}
            />
            <Text
              style={{ color: '#fff', fontWeight: '600', textAlign: 'center' }}
            >
              Uploading...
            </Text>
          </>
        ) : (
          <Text
            style={{
              textAlign: 'center',
              fontSize: wp('4.5%'),
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
          marginTop: hp('2.4%'),
          alignSelf: 'center',
          backgroundColor: 'white',
          borderColor: '#0CBACE',
          borderWidth: 1,
          paddingVertical: hp('1.5%'),
          borderRadius: wp('6%'),
          width: wp('60%'),
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: wp('4.5%'),
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
    marginTop: hp('1.5%'),      
    padding: hp('1.2%'),        
    backgroundColor: 'lightgrey',
    borderRadius: wp('2%'),
  },
  previewWrap: {
    marginTop: hp('2.4%'),      
    alignItems: 'center',
  },
  preview: {
    width: wp('90%'),
    height: hp('40%'),          
    borderRadius: hp('22.5%'),  
    overflow: 'hidden',
    backgroundColor: '#000',
    marginTop: hp('6%'),        
    alignSelf: 'center',
  },
  previewImage: { width: wp('100%'), height: hp('100%'), resizeMode: 'cover' },
  controls: {
    position: 'absolute',
    bottom: hp('2.3%'),        
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('4.2%'),
  },
  iconBtn: {
    padding: hp('0.6%'),        
    backgroundColor: '#333',
    borderRadius: wp('10%'),
    marginRight: wp('2.6%'),    
  },
  captureBtn: {
    width: hp('7.5%'),          
    height: hp('7.5%'),
    borderRadius: hp('4%'),    
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('10.5%'),  
  },
  innerCapture: {
    width: hp('6.8%'),          
    height: hp('6.8%'),
    borderRadius: hp('3.6%'),  
    backgroundColor: '#000',
  },
});