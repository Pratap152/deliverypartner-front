import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
} from 'react-native';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageViewer from 'react-native-image-zoom-viewer';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';

import apiClient from '../../services/ApiClient';
import { SafeAreaView } from 'react-native-safe-area-context';

/*  HELPERS  */
const formatTitle = key =>
  key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());

const DOCUMENT_UPLOAD_CONFIG = {
  pan: {
    images: 1,
    hint: 'Upload PAN card image',
  },
  drivingLicense: {
    images: 2,
    hint: 'Upload FRONT image first, then BACK image',
  },
};

/*  COMPONENT  */
const DocumentsScreen = ({ navigation }) => {
  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadingKey, setUploadingKey] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  /*  FETCH DOCUMENTS  */
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/profile/documents');

      if (res.data?.success) {
        setDocuments(res.data.data);
      } else {
        Alert.alert('Error', 'Failed to fetch documents');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  /*  GALLERY PICKER  */
  const openGallery = count =>
    new Promise((resolve, reject) => {
      launchImageLibrary(
        {
          mediaType: 'photo',
          selectionLimit: count,
        },
        res => {
          if (res.didCancel) return reject();
          if (res.errorCode) return reject(res.errorMessage);
          resolve(res.assets);
        },
      );
    });

  /*  IMAGE COMPRESSION (FASTER)  */
  const compressImage = async uri => {
    const resized = await ImageResizer.createResizedImage(
      uri,
      1024, // smaller size
      1024,
      'JPEG',
      60, // faster upload, no visible quality loss
    );

    return {
      uri: resized.uri,
      type: 'image/jpeg',
      name: resized.name || `image_${Date.now()}.jpg`,
    };
  };

  /*  UPLOAD DOCUMENT  */
  const uploadDocument = async (docKey, images) => {
    try {
      setUploadingKey(docKey); // start loader

      const formData = new FormData();

      if (docKey === 'pan') {
        const pan = await compressImage(images[0].uri);
        formData.append('panImage', pan);
      }

      if (docKey === 'drivingLicense') {
        const front = await compressImage(images[0].uri);
        const back = await compressImage(images[1].uri);

        formData.append('dlFrontImage', front);
        formData.append('dlBackImage', back);
      }

      const res = await apiClient.put(
        '/api/profile/documents/update',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // prevent hanging
        },
      );

      if (res.data?.success) {
        Alert.alert(
          'Upload Successful',
          docKey === 'pan'
            ? 'Your PAN card has been uploaded successfully. It will be verified shortly.'
            : 'Your Driving License has been uploaded successfully. It will be verified shortly.',
        );
        fetchDocuments();
      } else {
        Alert.alert('Upload failed', 'Please try again');
      }
    } catch (error) {
      Alert.alert(
        'Upload failed',
        error?.response?.data?.message || 'Something went wrong',
      );
    } finally {
      setUploadingKey(null); // stop loader
    }
  };

  /*  UI HELPERS  */
  const isVerified = status => status === 'approved';
  const getImageUrls = doc => {
    if (!doc) return [];
    const urls = [];
    if (doc.frontImage) urls.push({ url: doc.frontImage });
    if (doc.backImage) urls.push({ url: doc.backImage });
    if (doc.image) urls.push({ url: doc.image });
    return urls;
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#192A51" />
      </View>
    );
  }

  const docsArray = documents
    ? Object.entries(documents)
        .filter(([key]) => key !== 'aadhar')
        .map(([key, value]) => ({
          key,
          title: formatTitle(key),
          data: value,
          number: value?.number,
        }))
    : [];

  const verifiedCount = docsArray.filter(d => isVerified(d.data.status)).length;
  const pendingCount = docsArray.length - verifiedCount;

  /*  RENDER  */
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={rf(2.6)} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Documents</Text>

        <TouchableOpacity
                            style={styles.rightIconWrapper}
                            onPress={() => navigation.navigate('HelpCenterList')}
                          >
                            <Ionicons
                              name="chatbubble-ellipses-outline"
                              size={24}
                              color="#192A51"
                            />
                          </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* SUMMARY */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Document Status</Text>

          <View style={styles.summaryRow}>
            <View style={[styles.summaryBox, styles.verifiedBox]}>
              <Text style={styles.summaryCount}>{verifiedCount}</Text>
              <Text style={styles.summaryLabel}>Verified</Text>
            </View>

            <View style={[styles.summaryBox, styles.pendingBox]}>
              <Text style={styles.summaryCount}>{pendingCount}</Text>
              <Text style={styles.summaryLabel}>Pending</Text>
            </View>
          </View>
        </View>

        {/* DOCUMENT CARDS */}
        {docsArray.map(item => {
          const uploadMeta = DOCUMENT_UPLOAD_CONFIG[item.key];

          return (
            <View key={item.key} style={styles.docCard}>
              <View style={styles.docHeader}>
                <View style={styles.row}>
                  <View style={styles.docIcon}>
                    <Ionicons
                      name="document-text-outline"
                      size={rf(2.2)}
                      color="#12B76A"
                    />
                  </View>
                  <Text style={styles.docTitle}>{item.title}</Text>
                </View>

                <View style={styles.row}>
                  <Ionicons
                    name={
                      isVerified(item.data.status)
                        ? 'checkmark-circle'
                        : 'time-outline'
                    }
                    size={rf(2)}
                    color={isVerified(item.data.status) ? '#12B76A' : '#F79009'}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: isVerified(item.data.status)
                          ? '#12B76A'
                          : '#F79009',
                      },
                    ]}
                  >
                    {isVerified(item.data.status) ? 'Verified' : 'Pending'}
                  </Text>
                </View>
              </View>

              {item.number && (
                <Text style={styles.numberText}>{item.number}</Text>
              )}

              {uploadMeta?.hint && (
                <Text style={styles.hintText}>{uploadMeta.hint}</Text>
              )}

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.viewBtn}
                  onPress={() => {
                    const imgs = getImageUrls(item.data);
                    if (imgs.length) setPreviewImages(imgs);
                    else Alert.alert('No Image', 'Images not available');
                  }}
                >
                  <Ionicons name="eye-outline" size={rf(2)} />
                  <Text style={styles.viewText}>View</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.updateBtn}
                  disabled={uploadingKey === item.key}
                  onPress={async () => {
                    if (!uploadMeta) {
                      Alert.alert('Info', 'Upload not supported');
                      return;
                    }
                    try {
                      const imgs = await openGallery(uploadMeta.images);
                      await uploadDocument(item.key, imgs);
                    } catch {}
                  }}
                >
                  {uploadingKey === item.key ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Ionicons
                        name="cloud-upload-outline"
                        size={rf(2)}
                        color="#fff"
                      />
                      <Text style={styles.updateText}>Update</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        <View style={{ height: rh(3) }} />
      </ScrollView>

      {/* IMAGE PREVIEW MODAL */}
      <Modal
        visible={previewImages.length > 0}
        animationType="fade"
        onRequestClose={() => setPreviewImages([])}
      >
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <ImageViewer
            imageUrls={previewImages}
            backgroundColor="#FFFFFF"
            enableSwipeDown
            enablePreload
            useNativeDriver
            onSwipeDown={() => setPreviewImages([])}
            loadingRender={() => (
              <ActivityIndicator size="large" color="#192A51" />
            )}
          />

          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setPreviewImages([])}
          >
            <Ionicons name="close" size={rf(3)} color="#000" />
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DocumentsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  header: {
    height: rh(8),
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rw(4),
    elevation: 2,
  },
  headerTitle: { fontSize: rf(2.3), fontWeight: '600' },
  robotIcon: { width: rw(12), height: rw(11), resizeMode: 'contain' },
  row: { flexDirection: 'row', alignItems: 'center' },
  summaryCard: {
    backgroundColor: '#fff',
    margin: rw(4),
    borderRadius: rw(3),
    padding: rw(4),
    elevation: 2,
  },
  summaryTitle: { fontSize: rf(2), fontWeight: '600', marginBottom: rh(2) },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryBox: {
    flex: 1,
    marginHorizontal: rw(1),
    borderRadius: rw(3),
    alignItems: 'center',
    paddingVertical: rh(2),
  },
  verifiedBox: { backgroundColor: '#ECFDF3' },
  pendingBox: { backgroundColor: '#FFFAEB' },
  summaryCount: { fontSize: rf(3), fontWeight: '700' },
  summaryLabel: { fontSize: rf(1.6), color: '#475467' },
  docCard: {
    backgroundColor: '#fff',
    marginHorizontal: rw(4),
    marginBottom: rh(2),
    borderRadius: rw(3),
    padding: rw(4),
    elevation: 2,
  },
  docHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  docIcon: {
    width: rw(8),
    height: rw(8),
    borderRadius: rw(2),
    backgroundColor: '#ECFDF3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rw(2),
  },
  docTitle: { fontSize: rf(2), fontWeight: '600' },
  statusText: { marginLeft: rw(1), fontSize: rf(1.6), fontWeight: '500' },
  numberText: { marginTop: rh(1), fontSize: rf(1.7), color: '#667085' },
  hintText: { marginTop: rh(1), fontSize: rf(1.5), color: '#475467' },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: rh(2),
  },
  viewBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: rw(6),
    paddingVertical: rh(1),
    marginRight: rw(2),
  },
  viewText: { marginLeft: rw(1), fontSize: rf(1.7) },
  updateBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#192A51',
    borderRadius: rw(6),
    paddingVertical: rh(1),
    marginLeft: rw(2),
  },
  updateText: {
    marginLeft: rw(1),
    fontSize: rf(1.7),
    color: '#fff',
    fontWeight: '500',
  },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalClose: {
    position: 'absolute',
    top: rh(5),
    right: rw(5),
    zIndex: 10,
  },
});
