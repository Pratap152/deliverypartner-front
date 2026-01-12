import React from 'react';
import { Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { launchCamera } from 'react-native-image-picker';

export default function FaceInstructionScreen({ navigation }) {
  const openCamera = async () => {
    const options = {
      mediaType: 'photo',
      cameraType: 'front',
      quality: 0.8,
      saveToPhotos: false,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('Camera cancelled');
        return;
      }

      if (response.errorCode) {
        console.log('Camera error:', response.errorMessage);
        return;
      }

      const asset = response.assets && response.assets[0];

      if (asset?.uri) {
        navigation.navigate('FaceVerificationScreen', {
          photoUri: asset.uri,
        });
      } else {
        console.log('No image returned');
      }
    });
  };

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
          Take a Selfie
        </Text>
      </View>

      {/* INSTRUCTIONS */}
      <View
        style={{
          marginLeft: wp('8%'),
          marginTop: hp('5%'),
        }}
      >
        <Text
          style={{
            fontWeight: '500',
            fontSize: wp('5%'),
            marginLeft: wp('5%'),
          }}
        >
          Do This
        </Text>

        {/* GUIDELINES */}
        <View
          style={{
            marginLeft: wp('5%'),
            marginTop: hp('2%'),
          }}
        >
          {[
            'Show full face clearly',
            'Use good lighting',
            'Hold camera at eye level',
            'Look straight',
          ].map((text, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                marginBottom: hp('0.8%'),
              }}
            >
              <Ionicons name="caret-forward-outline" size={18} color="black" />
              <Text style={{ fontSize: wp('4%') }}> {text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* IMAGE */}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          marginTop: hp('6%'),
        }}
      >
        <Image
          source={require('../../../src/assets/selfie.png')}
          style={{
            height: hp('30%'),
            width: wp('60%'),
            marginTop: hp('2.5%'),
            resizeMode: 'contain',
          }}
        />
      </View>

      {/* SELFIE BUTTON */}
      <TouchableOpacity
        onPress={openCamera}
        style={{
          marginBottom: hp('12%'),
          alignSelf: 'center',
          backgroundColor: '#0CBACE',
          paddingVertical: hp('1.5%'),
          borderRadius: wp('8%'),
          width: wp('80%'),
        }}
      >
        <Text
          style={{
            alignSelf: 'center',
            fontSize: wp('5%'),
            color: 'white',
            fontWeight: '600',
          }}
        >
          Click a Selfie
        </Text>
      </TouchableOpacity>
    </View>
  );
}
