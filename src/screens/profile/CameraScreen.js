import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';

export default function CameraScreen({ navigation }) {
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();

  const [cameraPosition, setCameraPosition] = useState('back');
  const [flash, setFlash] = useState('off');
  const [loading, setLoading] = useState(true);

  const device = useCameraDevice(cameraPosition);

  // Permission check
  useEffect(() => {
    const checkPermission = async () => {
      const status = await Camera.getCameraPermissionStatus();
      if (status !== 'authorized') {
        Alert.alert('Camera Permission', 'Camera permission not granted', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
      setLoading(false);
    };

    checkPermission();
  }, [navigation]);

  // Take Photo
  const takePhoto = async () => {
    try {
      if (!cameraRef.current) return;

      const photo = await cameraRef.current.takePhoto({
        flash,
      });

      console.log('Photo captured:', photo.path);
    } catch (error) {
      console.log('Camera error:', error);
      Alert.alert('Error', 'Failed to capture photo');
    }
  };

  if (loading || !device) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        photo
      />

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.textBtn}
          onPress={() => setFlash(flash === 'off' ? 'on' : 'off')}
        >
          <Text style={styles.btnText}>
            Flash {flash === 'off' ? 'OFF' : 'ON'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={takePhoto}>
          <View style={styles.shutterOuter}>
            <View style={styles.shutterInner} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.textBtn}
          onPress={() =>
            setCameraPosition(cameraPosition === 'back' ? 'front' : 'back')
          }
        >
          <Text style={styles.btnText}>Flip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  controls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  shutterOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  shutterInner: {
    width: 55,
    height: 55,
    borderRadius: 27,
    backgroundColor: '#fff',
  },

  textBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  btnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
