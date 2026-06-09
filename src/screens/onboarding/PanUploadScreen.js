import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from 'react-native-actionsheet';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { verifyDocument } from '../../redux/slices/documentsVerificationSlice';
import apiClient from '../../services/ApiClient';
import DeviceInfo from 'react-native-device-info';

const isTablet = DeviceInfo.isTablet();

const horizontalPadding = isTablet ? 40 : 20;
const containerMaxWidth = isTablet ? 900 : '100%';

const uploadCardWidth = isTablet ? '48%' : '100%';
const uploadCardHeight = isTablet ? 320 : 240;

const previewWidth = isTablet ? 280 : 200;
const previewHeight = isTablet ? 180 : 120;

const titleFont = isTablet ? 28 : 22;
const subtitleFont = isTablet ? 18 : 14;
const inputFont = isTablet ? 18 : 16;
const buttonFont = isTablet ? 20 : 20;

const PanUploadScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [panNumber, setPanNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [panError, setPanError] = useState('');

  const actionSheetRef = useRef();
  const dispatch = useDispatch();

  const openOptions = () => actionSheetRef.current.show();

  const takePhoto = () => {
    launchCamera(
      { mediaType: 'photo', quality: 1, cameraType: 'back' },
      res => {
        if (res.didCancel || res.errorCode) return;
        setImage(res.assets[0]);
      },
    );
  };

  const chooseFromGallery = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, res => {
      if (res.didCancel || res.errorCode) return;
      setImage(res.assets[0]);
    });
  };

  const validatePAN = num => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(num);

  const handleSubmit = async () => {
    if (!image) {
      Alert.alert('Upload Required', 'Please upload a PAN card image.');
      return;
    }

    if (!panNumber.trim()) {
      Alert.alert('Missing PAN Number', 'Please enter your PAN Number.');
      return;
    }

    if (!validatePAN(panNumber)) {
      setPanError('Invalid PAN format');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('panNumber', panNumber);
      formData.append('pan', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName || 'pan.jpg',
      });

      const response = await apiClient.post('/api/rider/pan', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      dispatch(verifyDocument('pan'));

      Alert.alert('Success', 'PAN submitted for verification.', [
        {
          text: 'Next',
          onPress: () => navigation.replace('SplashScreen'),
        },
      ]);
    } catch (err) {
      console.log('PAN upload error:', err);
      Alert.alert('Upload Error', 'Unable to upload PAN. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.screenWrapper}>
        <View style={styles.container}>
          <View style={styles.headerRow}>

          <Text style={styles.headerTitle}>PAN card details</Text>
        </View>

        <View style={{ flex: 1, marginTop: 20 }}>
          <Text style={styles.subtitle}>
            Upload clear photo & enter your PAN number.
          </Text>

          <TextInput
            placeholder="Enter PAN Number"
            value={panNumber}
            onChangeText={text => {
              const value = text.toUpperCase();
              setPanNumber(value);

              // Validate only when length = 10
              if (value.length === 10 && !validatePAN(value)) {
                setPanError('Invalid PAN format');
              } else {
                setPanError('');
              }
            }}
            autoCapitalize="characters"
            maxLength={10}
            style={styles.input}
          />
          {panError ? (
            <Text style={styles.errorText}>{panError}</Text>
          ) : null}
          <Text>PAN format: ABCDE1234F</Text>

          <View style={[isTablet && { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }]}>
            <TouchableOpacity style={styles.uploadBox} onPress={openOptions}>
            {image ? (
              <>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.previewImage}
                />
                <View style={styles.row}>
                  <View style={styles.uploadedTag}>
                    <Text style={styles.uploadedText}>Uploaded ✔</Text>
                  </View>
                  <TouchableOpacity
                    onPress={openOptions}
                    style={styles.reuploadBtn}
                  >
                    <Text style={styles.reuploadText}>Re-upload</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Image
                  style={styles.placeholderImg}
                  source={{
                    uri: 'https://www.pancardapp.com/blog/wp-content/uploads/2019/04/sample-pan-card.jpg',
                  }}
                />
                <Text style={styles.placeholderText}>
                  Front side photo of your PAN card with your clear name and
                  photo
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.instructionsBox}>
            <Text style={styles.instructionTitle}>
              Make sure your upload is:
            </Text>
            <Text style={styles.instruction}>• Clear and readable</Text>
            <Text style={styles.instruction}>
              • Shows your full name + photo
            </Text>
            <Text style={styles.instruction}>• Not blurred or cropped</Text>
              <Text style={styles.instruction}>• Taken in good lighting</Text>
            </View>
          </View>

          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <TouchableOpacity
              style={[
                styles.submitBtn,
                (!image || !panNumber || loading) && { opacity: 0.5 },
              ]}
              disabled={!image || !panNumber || loading}
              onPress={handleSubmit}
            >
              <Text style={styles.submitText}>
                {loading ? 'Submitting...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>

          <ActionSheet
            ref={actionSheetRef}
            title={'Upload PAN Card'}
            options={['Capture from Camera', 'Choose from Files', 'Cancel']}
            cancelButtonIndex={2}
            onPress={i => {
              if (i === 0) takePhoto();
              else if (i === 1) chooseFromGallery();
            }}
          />
        </View>
      </View>
      </View>
    </SafeAreaView>
  );
};

export default PanUploadScreen;


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
    backgroundColor: '#fff',
    paddingHorizontal: horizontalPadding,
    paddingBottom: 20,
  },
  title: { fontSize: titleFont, fontWeight: '700', color: '#000' },
  subtitle: { fontSize: subtitleFont, color: '#777', marginTop: 4 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    flex:1,
    fontSize: isTablet ? 34 : 26,
    fontWeight: '700',
    textAlign:'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: isTablet ? 18 : 10,
    fontSize: inputFont,
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  uploadBox: {
    width: uploadCardWidth,
    height: uploadCardHeight,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 14,
    borderColor: '#9f9f9f',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    padding: 10,
  },

  placeholderImg: {
    width: previewWidth,
    height: previewHeight,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  placeholderText: {
    color: '#666',
    width: '85%',
    textAlign: 'center',
    fontSize: isTablet ? 16 : 14,
  },

  previewImage: {
    width: previewWidth,
    height: previewHeight,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 10,
  },

  uploadedTag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#e8ffe8',
    borderRadius: 20,
  },

  uploadedText: {
    color: '#1e9e38',
    fontWeight: '600',
  },

  instructionsBox: {
    marginTop: 25,
    width: isTablet ? uploadCardWidth : '100%',
    ...(isTablet && { marginTop: 30 }),
  },

  instructionTitle: {
    fontSize: isTablet ? 22 : 16,
    color: '#000',
    marginBottom: 5,
    fontWeight: '700',
  },

  instruction: {
    fontSize: isTablet ? 20 : 15,
    color: '#555',
    marginVertical: 1,
  },

  submitBtn: {
    backgroundColor: '#00B5CC',
    paddingVertical: isTablet ? 20 : 15,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  submitText: {
    color: '#FFFFFF',
    fontSize: buttonFont,
    fontWeight: '900',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },

  reuploadBtn: {
    borderWidth: 1,
    borderColor: '#0CBACE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  reuploadText: {
    color: '#0CBACE',
    fontWeight: '700',
  },
});
