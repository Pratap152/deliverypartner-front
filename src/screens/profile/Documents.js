import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Dimensions,
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
import { SafeAreaView } from 'react-native-safe-area-context';

import apiClient from '../../services/ApiClient';
import { getAllDocuments } from '../../services/getAllDocuments';
import { getProfileDocuments, updateDocuments } from '../../services/profile/profileApiService';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

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

const DocumentsScreen = ({ navigation }) => {
  const [documents, setDocuments] = useState({});
  const [documentImages, setDocumentImages] = useState({});

  const [loading, setLoading] = useState(true);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadingKey, setUploadingKey] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
  try {
    setLoading(true);

    const [documentsResult, imagesResult] = await Promise.allSettled([
      getProfileDocuments(),
      getAllDocuments(),
    ]);

    // Documents API
    if (
      documentsResult.status === 'fulfilled' &&
      documentsResult.value?.data?.success
    ) {
      setDocuments(documentsResult.value.data.data);
    } else {
      console.log(
        'Documents API failed:',
        documentsResult.reason ||
          documentsResult.value?.data,
      );
    }

    // Images API
    if (imagesResult.status === 'fulfilled') {
      setDocumentImages(imagesResult.value.data || {});
    } else {
      console.log(
        'Images API failed:',
        imagesResult.reason,
      );
    }
  } catch (error) {
    console.log(error);
    Alert.alert('Error', 'Unable to fetch documents');
  } finally {
    setLoading(false);
  }
};
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

  const compressImage = async uri => {
    const resized = await ImageResizer.createResizedImage(
      uri,
      1024,
      1024,
      'JPEG',
      60,
    );

    return {
      uri: resized.uri,
      type: 'image/jpeg',
      name: resized.name || `image_${Date.now()}.jpg`,
    };
  };

  const uploadDocument = async (docKey, images) => {
    try {
      setUploadingKey(docKey);

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

      const res = await updateDocuments(formData);

      if (res.data?.success) {
        Alert.alert(
          'Success',
          'Document uploaded successfully.',
        );

        fetchDocuments();
      } else {
        Alert.alert('Upload Failed');
      }
    } catch (e) {
      Alert.alert(
        'Upload Failed',
        e?.response?.data?.message || 'Something went wrong',
      );
    } finally {
      setUploadingKey(null);
    }
  };

  const isVerified = status => status === 'approved';

  const docsArray = [
    {
      key: 'pan',
      title: 'PAN Card',
      data: documents?.pan,
      number: documents?.pan?.number,
      images: documentImages?.pan
        ? [{ url: documentImages.pan }]
        : [],
    },
    {
      key: 'drivingLicense',
      title: 'Driving License',
      data: documents?.drivingLicense,
      number: documents?.drivingLicense?.number,
      images: [
        ...(documentImages?.dlFront
          ? [{ url: documentImages.dlFront }]
          : []),
        ...(documentImages?.dlBack
          ? [{ url: documentImages.dlBack }]
          : []),
      ],
    },
  ];

  const verifiedCount = docsArray.filter(item =>
    isVerified(item.data?.status),
  ).length;

  const pendingCount = docsArray.length - verifiedCount;

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#192A51" />
      </View>
    );
  }

  return (
  <SafeAreaView style={styles.container}>
    {/* HEADER */}
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={rf(2.6)} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Documents</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('HelpCenterList')}
      >
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={isTablet ? 34 : 24}
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
            <Text style={styles.summaryCount}>
              {verifiedCount}
            </Text>
            <Text style={styles.summaryLabel}>
              Verified
            </Text>
          </View>

          <View style={[styles.summaryBox, styles.pendingBox]}>
            <Text style={styles.summaryCount}>
              {pendingCount}
            </Text>
            <Text style={styles.summaryLabel}>
              Pending
            </Text>
          </View>
        </View>
      </View>

      {docsArray.map(item => (
        <View
          key={item.key}
          style={styles.docCard}
        >
          <View style={styles.docHeader}>
            <View style={styles.row}>
              <View style={styles.docIcon}>
                <Ionicons
                  name="document-text-outline"
                  size={rf(2.2)}
                  color="#12B76A"
                />
              </View>

              <View>
                <Text style={styles.docTitle}>
                  {item.title}
                </Text>

                {item.number ? (
                  <Text style={styles.numberText}>
                    {item.number}
                  </Text>
                ) : null}
              </View>
            </View>

            <View style={styles.row}>
              <Ionicons
                name={
                  item.data?.status === 'approved'
                    ? 'checkmark-circle'
                    : 'time-outline'
                }
                size={rf(2)}
                color={
                  item.data?.status === 'approved'
                    ? '#12B76A'
                    : '#F79009'
                }
              />

              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      item.data?.status === 'approved'
                        ? '#12B76A'
                        : '#F79009',
                  },
                ]}
              >
                {item.data?.status === 'approved'
                  ? 'Verified'
                  : 'Pending'}
              </Text>
            </View>
          </View>

          {!!DOCUMENT_UPLOAD_CONFIG[item.key]?.hint && (
            <Text style={styles.hintText}>
              {DOCUMENT_UPLOAD_CONFIG[item.key].hint}
            </Text>
          )}

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.viewBtn}
              onPress={() => {
                if (item.images.length > 0) {
                  setPreviewImages(item.images);
                } else {
                  Alert.alert(
                    'No Image',
                    'Document image not available',
                  );
                }
              }}
            >
              <Ionicons
                name="eye-outline"
                size={rf(2)}
              />
              <Text style={styles.viewText}>
                View
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.updateBtn}
              disabled={uploadingKey === item.key}
              onPress={async () => {
                try {
                  const imgs = await openGallery(
                    DOCUMENT_UPLOAD_CONFIG[item.key]
                      .images,
                  );

                  await uploadDocument(
                    item.key,
                    imgs,
                  );
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

                  <Text style={styles.updateText}>
                    Re-upload
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <View style={{ height: rh(3) }} />
    </ScrollView>

    <Modal
      visible={previewImages.length > 0}
      transparent={false}
      animationType="fade"
      onRequestClose={() =>
        setPreviewImages([])
      }
    >
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
        }}
      >
        <ImageViewer
          imageUrls={previewImages}
          backgroundColor="#fff"
          enableSwipeDown
          useNativeDriver
          onSwipeDown={() =>
            setPreviewImages([])
          }
          loadingRender={() => (
            <ActivityIndicator
              size="large"
              color="#192A51"
            />
          )}
        />

        <TouchableOpacity
          style={styles.modalClose}
          onPress={() =>
            setPreviewImages([])
          }
        >
          <Ionicons
            name="close"
            size={rf(3)}
            color="#000"
          />
        </TouchableOpacity>
      </View>
    </Modal>
  </SafeAreaView>
);

};

export default DocumentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },

  header: {
    height: rh(8),
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rw(4),
    elevation: 2,
  },

  headerTitle: {
    fontSize: rf(2.3),
    fontWeight: '600',
    color: '#111827',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    margin: rw(4),
    borderRadius: rw(3),
    padding: rw(4),
    elevation: 2,
  },

  summaryTitle: {
    fontSize: rf(2),
    fontWeight: '600',
    marginBottom: rh(2),
    color: '#111827',
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  summaryBox: {
    flex: 1,
    marginHorizontal: rw(1),
    borderRadius: rw(3),
    alignItems: 'center',
    paddingVertical: rh(2),
  },

  verifiedBox: {
    backgroundColor: '#ECFDF3',
  },

  pendingBox: {
    backgroundColor: '#FFFAEB',
  },

  summaryCount: {
    fontSize: rf(3),
    fontWeight: '700',
    color: '#111827',
  },

  summaryLabel: {
    fontSize: rf(1.7),
    color: '#475467',
    marginTop: 4,
  },

  docCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: rw(4),
    marginBottom: rh(2),
    borderRadius: rw(3),
    padding: rw(4),
    elevation: 2,
  },

  docHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  row: {
    flexDirection: 'row',
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

  docTitle: {
    fontSize: rf(2),
    fontWeight: '600',
    color: '#111827',
  },

  numberText: {
    marginTop: 4,
    fontSize: rf(1.6),
    color: '#667085',
  },

  statusText: {
    marginLeft: rw(1),
    fontSize: rf(1.6),
    fontWeight: '600',
  },

  hintText: {
    marginTop: rh(1.5),
    fontSize: rf(1.5),
    color: '#667085',
  },

  actionsRow: {
    flexDirection: 'row',
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
    paddingVertical: rh(1.2),
    marginRight: rw(2),
    backgroundColor: '#FFFFFF',
  },

  viewText: {
    marginLeft: rw(1),
    fontSize: rf(1.7),
    color: '#111827',
    fontWeight: '500',
  },

  updateBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#192A51',
    borderRadius: rw(6),
    paddingVertical: rh(1.2),
    marginLeft: rw(2),
  },

  updateText: {
    marginLeft: rw(1),
    fontSize: rf(1.7),
    color: '#FFFFFF',
    fontWeight: '600',
  },

  modalClose: {
    position: 'absolute',
    top: rh(5),
    right: rw(5),
    width: rw(10),
    height: rw(10),
    borderRadius: rw(5),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

