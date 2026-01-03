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

import ImagePicker from 'react-native-image-crop-picker';
 
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
  
  
  // RETAKE PHOTO
  const retake = async () => {
    try {
      const image = await ImagePicker.openCamera({
        cropping: true,
        width: 1024,
        height: 1024,
        compressImageQuality: 0.8,
      });
      if (image && image.path) {
        setPhoto(image.path);
      }
    } catch (e) {
      console.log('retake cancelled', e?.message || e);
    }
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
      {/* HEADING */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent:'center',
          marginTop: hp('5%'),
        }}>
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
        ) : (
          <View style={{flex:1,justifyContent:'center'}}>
            <Text style={{ color: '#fff', textAlign: 'center',}}>
              No photo selected
            </Text>
          </View>
        )}
      </View>

     
      
 
      {/* UPLOAD PHOTO BUTTON */}
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
            <Text
              style={{ color: '#fff', fontWeight: '600', textAlign: 'center' }}>
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
 
      {/* RETAKE PHOTO BUTTON */}
      <TouchableOpacity
        onPress={retake}
        style={styles.retakeBtn}
      >
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

    previewImage: { width: wp('90%'), height: hp('40%'),resizeMode:'contain',backgroundColor:'white' },
  
    uploadBtn:{
            marginTop: hp('8.6%'),    
            alignSelf: 'center',
            marginBottom: hp('1.2%'),
            backgroundColor: '#0CBACE',
            paddingVertical: hp('1.5%'),
            borderRadius: wp('8%'),
            width: wp('80%'),
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop:hp('10%')
    },
    retakeBtn:{
            marginTop: hp('2.4%'),
            alignSelf: 'center',
            backgroundColor: 'white',
            borderColor: '#0CBACE',
            borderWidth: 1,
            paddingVertical: hp('1.5%'),
            borderRadius: wp('8%'),
            width: wp('80%'),
    }
});