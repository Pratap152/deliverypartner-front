import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  ScrollView,
  Dimensions,
  BackHandler
} from 'react-native';
import { useFocusEffect } from "@react-navigation/native";

import ActionSheet from 'react-native-actionsheet';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentScanner from 'react-native-document-scanner-plugin';
import { SafeAreaView } from 'react-native-safe-area-context';

import DeviceInfo from 'react-native-device-info';

import apiClient from '../../services/ApiClient';
import { verifyDocument } from '../../redux/slices/documentsVerificationSlice';

const { width } = Dimensions.get('window');

const isTablet = DeviceInfo.isTablet();

const horizontalPadding = isTablet ? 40 : 20;
const containerMaxWidth = isTablet ? 900 : '100%';

const uploadCardWidth = isTablet ? '48%' : '100%';
const uploadCardHeight = isTablet ? 320 : 230;

const previewWidth = isTablet ? 280 : 200;
const previewHeight = isTablet ? 180 : 120;

const titleFont = isTablet ? 34 : 26;
const subtitleFont = isTablet ? 20 : 16;
const inputFont = isTablet ? 18 : 16;
const buttonFont = isTablet ? 20 : 18;

const LicenseUploadScreen = ({ navigation }) => {

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

  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  const [dlNumber, setDlNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [dlError, setDlError] = useState('');

  const actionSheetRef = useRef();
  const selectedBox = useRef(null);

  const dispatch = useDispatch();

  // ---------------- OPEN ACTION SHEET ----------------

  const openSheet = box => {
    selectedBox.current = box;
    actionSheetRef.current?.show();
  };

  // ---------------- VALIDATIONS ----------------

  const validateImage = image => {
    if (!image) {
      throw new Error('Image not found');
    }

    const sizeMB = image.fileSize
      ? image.fileSize / 1024 / 1024
      : 0;

    if (sizeMB > 5) {
      throw new Error('File too large (Max 5MB allowed)');
    }

    const allowed = [
      'image/jpeg',
      'image/png',
      'image/jpg',
    ];

    if (!allowed.includes(image.type)) {
      throw new Error(
        'Invalid file format — only JPG or PNG allowed',
      );
    }
  };

  const validateDL = dl => {
    if (!dl) return false;

    const normalized = dl
      .replace(/\s+/g, '')
      .toUpperCase();

    const regex =
      /^[A-Z]{2}[0-9]{2,3}[0-9]{4}[0-9]{7}$/;

    return regex.test(normalized);
  };

  // ---------------- DL INPUT ----------------

  const handleDLChange = text => {
    const value = text.toUpperCase();

    setDlNumber(value);

    const normalized = value.replace(/\s+/g, '');

    if (!normalized) {
      setDlError('DL Number is required');
    } else if (!validateDL(normalized)) {
      setDlError('Invalid DL format');
    } else {
      setDlError('');
    }
  };

  // ---------------- IMAGE PICK ----------------

  const handlePick = response => {
    if (!response || response.didCancel) {
      return;
    }

    if (response.errorMessage) {
      Alert.alert('Error', response.errorMessage);
      return;
    }

    try {
      const img =
        response.assets && response.assets[0];

      if (!img) {
        throw new Error('No image returned');
      }

      validateImage(img);

      if (selectedBox.current === 'front') {
        setFront(img);
      } else if (selectedBox.current === 'back') {
        setBack(img);
      }
    } catch (err) {
      Alert.alert('Invalid Image', err.message);
    }
  };

  const pickCamera = async () => {
  try {
    const { scannedImages } =
      await DocumentScanner.scanDocument({
        maxNumDocuments: 1,
        responseType: 'imageFilePath',
      });

    if (
      !scannedImages ||
      scannedImages.length === 0
    ) {
      return;
    }

    const image = {
      uri: scannedImages[0],
      fileName: `dl_${Date.now()}.jpg`,
      type: 'image/jpeg',
      fileSize: 1024,
    };

    if (selectedBox.current === 'front') {
      setFront(image);
    } else if (selectedBox.current === 'back') {
      setBack(image);
    }
  } catch (error) {
    console.log(
      'Document scan error:',
      error,
    );
  }
};

  const pickGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      handlePick,
    );
  };

  // ---------------- UPLOAD LICENSE ----------------

  const uploadLicense = async () => {
    if (!dlNumber.trim()) {
      Alert.alert(
        'DL Number Required',
        'Please enter Driving License Number',
      );
      return;
    }

    const normalizedDL = dlNumber
      .replace(/\s+/g, '')
      .toUpperCase();

    if (!validateDL(normalizedDL)) {
      Alert.alert(
        'Invalid DL Number',
        'Enter valid DL format',
      );
      return;
    }

    if (!front || !back) {
      Alert.alert(
        'Upload Required',
        'Upload both front & back images.',
      );
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append('dlNumber', normalizedDL);

      formData.append('front', {
        uri: front.uri,
        name:
          front.fileName ||
          `front_${Date.now()}.jpg`,
        type: front.type || 'image/jpeg',
      });

      formData.append('back', {
        uri: back.uri,
        name:
          back.fileName ||
          `back_${Date.now()}.jpg`,
        type: back.type || 'image/jpeg',
      });

      formData.append('documentType', 'DL');

      await apiClient.post(
        '/api/rider/dl',
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        },
      );

      dispatch(verifyDocument('dl'));

      Alert.alert(
        'Success',
        'Driving License submitted for verification.',
        [
          {
            text: 'Next',
            onPress: () =>
              navigation.replace(
                'SplashScreen',
              ),
          },
        ],
      );
    } catch (err) {
      console.log('DL upload error:', err);

      Alert.alert(
        'Upload Error',
        'Unable to upload Driving License. Try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RENDER UPLOAD CARD ----------------

  const renderUploadCard = (
    type,
    image,
    placeholderText,
    placeholderImage,
  ) => (
    <TouchableOpacity
      style={styles.uploadBox}
      onPress={() => openSheet(type)}
    >
      {image ? (
        <>
          <Image
            source={{ uri: image.uri }}
            style={styles.preview}
          />

          <View style={styles.row}>
            <View style={styles.uploadedBadge}>
              <Text style={styles.uploadedText}>
                Uploaded ✔
              </Text>
            </View>

            <TouchableOpacity
              style={styles.reuploadBtn}
              onPress={() => openSheet(type)}
            >
              <Text style={styles.reuploadText}>
                Re-upload
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Image
            source={{
              uri: placeholderImage,
            }}
            style={styles.placeholder}
          />

          <Text style={styles.placeholderText}>
            {placeholderText}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );

  // ---------------- UI ----------------

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}
    >
      <View style={styles.screenWrapper}>
        <View style={styles.container}>

          {/* HEADER */}

          <View style={styles.headerRow}>

            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>
                Driving Licence Details
              </Text>
            </View>
          </View>

          {/* BODY */}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 40,
            }}
          >
            <Text style={styles.subtitle}>
              Upload focused photo of your
              Driving Licence for faster
              verification
            </Text>

            <TextInput
              placeholder="Enter Driving License Number"
              placeholderTextColor="#888"
              style={styles.input}
              value={dlNumber}
              onChangeText={handleDLChange}
              autoCapitalize="characters"
              maxLength={15}
            />

            {dlError ? (
              <Text style={styles.errorText}>
                {dlError}
              </Text>
            ) : null}

            <Text style={styles.helperText}>
              DL format: AP00720249992221
            </Text>

            {/* UPLOAD SECTION */}

            <View style={styles.uploadContainer}>
              {renderUploadCard(
                'front',
                front,
                'Front side photo of your Licence with your clear name and photo',
                'https://dummyimage.com/300x200/cccccc/000000&text=Front+Side',
              )}

              {renderUploadCard(
                'back',
                back,
                'Back side photo of your Licence with your clear details',
                'https://dummyimage.com/300x200/cccccc/000000&text=Back+Side',
              )}
            </View>
          </ScrollView>

          {/* SUBMIT BUTTON */}

          <TouchableOpacity
            style={[
              styles.submitBtn,
              !(front && back && dlNumber) && {
                opacity: 0.5,
              },
            ]}
            disabled={
              !(front && back && dlNumber) ||
              loading
            }
            onPress={uploadLicense}
          >
            <Text style={styles.submitText}>
              {loading
                ? 'Submitting...'
                : 'Submit'}
            </Text>
          </TouchableOpacity>

          {/* ACTION SHEET */}

          <ActionSheet
            ref={actionSheetRef}
            title={'Upload Driving Licence'}
            options={[
              'Capture from Camera',
              'Choose from Files',
              'Cancel',
            ]}
            cancelButtonIndex={2}
            onPress={index => {
              if (index === 0) {
                pickCamera();
              } else if (index === 1) {
                pickGallery();
              }
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LicenseUploadScreen;

// ---------------- STYLES ----------------

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  container: {
    flex: 1,
    width: '100%',
    maxWidth: containerMaxWidth,
    paddingHorizontal: horizontalPadding,
    backgroundColor: '#fff',
  },

  headerRow: {
    justifyContent: 'center',
    marginBottom: 10,
  },

  titleContainer: {
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: titleFont,
    fontWeight: '700',
  },

  subtitle: {
    fontSize: subtitleFont,
    marginTop: 10,
    lineHeight: isTablet ? 28 : 22,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: isTablet ? 18 : 14,
    marginTop: 20,
    fontSize: inputFont,
    color: '#000',
  },

  errorText: {
    color: 'red',
    marginTop: 6,
    fontSize: 14,
  },

  helperText: {
    marginTop: 8,
    color: '#777',
    fontSize: isTablet ? 15 : 13,
  },

  uploadContainer: {
    flexDirection: isTablet
      ? 'row'
      : 'column',
    justifyContent: 'space-between',
    gap: 20,
    marginTop: 20,
  },

  uploadBox: {
    width: uploadCardWidth,
    height: uploadCardHeight,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#bfbfbf',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  placeholder: {
    width: previewWidth,
    height: previewHeight,
    resizeMode: 'contain',
    marginBottom: 14,
  },

  preview: {
    width: previewWidth,
    height: previewHeight,
    borderRadius: 12,
    resizeMode: 'cover',
    marginBottom: 14,
  },

  placeholderText: {
    fontSize: isTablet ? 16 : 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: isTablet ? 24 : 20,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  uploadedBadge: {
    backgroundColor: '#e8ffe8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  uploadedText: {
    color: '#097c24c8',
    fontWeight: '700',
    fontSize: isTablet ? 15 : 13,
  },

  reuploadBtn: {
    borderWidth: 1,
    borderColor: '#1F3365',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  reuploadText: {
    color: '#1F3365',
    fontWeight: '700',
    fontSize: isTablet ? 15 : 13,
  },

  submitBtn: {
    backgroundColor:'#1F3365',
    paddingVertical: isTablet ? 20 : 16,
    borderRadius: 40,
    marginVertical: 15,
    alignItems: 'center',
  },

  submitText: {
    color: '#fff',
    fontSize: buttonFont,
    fontWeight: '700',
  },
});