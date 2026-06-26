import React from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, useWindowDimensions, BackHandler, Alert, PermissionsAndroid, Platform } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import { launchCamera } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function FaceInstructionScreen({ navigation }) {

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

  const { width, height } = useWindowDimensions();
  const isTablet = DeviceInfo.isTablet();
  const styles = createStyles(isTablet, width, height);

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') return true;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'App needs camera permission to take photos.',
        buttonPositive: 'OK',
      },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();

    if (!hasPermission) {
      return;
    }

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

  const instructions = [
    'Show full face clearly',
    'Use good lighting',
    'Hold camera at eye level',
    'Look straight',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        {/* HEADING */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>
            Take a Selfie
          </Text>

          <Text style={styles.subTitle}>
            Follow the instructions below for a
            successful verification
          </Text>
        </View>

        <View style={styles.mainContent}>
          {/* INSTRUCTIONS */}
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>
              Do This
            </Text>

            {/* GUIDELINES */}
            <View style={styles.instructionsList}>
              {instructions.map((text, index) => (
                <View
                  key={index}
                  style={styles.instructionRow}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={isTablet ? 28 : 20}
                    color="#00B5CC"
                  />
                  <Text style={styles.instructionText}> {text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* IMAGE */}
          <View style={styles.imageContainer}>
            <Image
              source={require('../../../src/assets/selfie.jpg')}
              style={styles.selfieImage}
            />
          </View>
        </View>

        {/* SELFIE BUTTON */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={openCamera}
            style={styles.button}
          >
            <Ionicons
              name="camera-outline"
              size={isTablet ? 28 : 22}
              color="#fff"
            />
            <Text style={styles.buttonText}>
              Click a Selfie
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const createStyles = (isTablet, width, height) => {
  const contentWidth = isTablet
    ? width > 1000
      ? '60%'
      : '75%'
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
      paddingBottom: isTablet ? 30 : 20,
    },

    headerContainer: {
      alignItems: 'center',
      marginBottom: isTablet ? 40 : 28,
    },

    headerTitle: {
      fontSize: isTablet ? 34 : 26,
      fontWeight: '700',
      color: '#111827',
    },

    subTitle: {
      marginTop: 10,
      fontSize: isTablet ? 18 : 14,
      color: '#6B7280',
      textAlign: 'center',
      lineHeight: isTablet ? 28 : 20,
    },

    mainContent: {
      flex: 1,
      justifyContent: 'space-between',
    },

    instructionsCard: {
      backgroundColor: '#fff',
      borderRadius: isTablet ? 24 : 18,
      padding: isTablet ? 28 : 20,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },

    instructionsTitle: {
      fontSize: isTablet ? 26 : 20,
      fontWeight: '700',
      color: '#111827',
      marginBottom: isTablet ? 22 : 16,
    },

    instructionsList: {
      gap: isTablet ? 18 : 12,
    },

    instructionRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    instructionText: {
      marginLeft: isTablet ? 14 : 10,
      fontSize: isTablet ? 20 : 15,
      color: '#374151',
      fontWeight: '500',
    },

    imageContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: isTablet ? 30 : 20,
    },

    selfieImage: {
      height: isTablet ? height * 0.32 : height * 0.28,
      width: isTablet ? width * 0.32 : width * 0.62,
      resizeMode: 'contain',
    },

    buttonContainer: {
      marginTop: isTablet ? 30 : 20,
    },

    button: {
      backgroundColor: '#00B5CC',
      borderRadius: isTablet ? 22 : 18,
      paddingVertical: isTablet ? 20 : 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },

    buttonText: {
      marginLeft: 10,
      fontSize: isTablet ? 22 : 17,
      color: '#fff',
      fontWeight: '700',
    },
  });
};