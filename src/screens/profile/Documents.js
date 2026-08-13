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
  Image,
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
import { getAllDocuments } from '../../services/getAllDocuments';
import { getProfileDocuments, updateDocuments } from '../../services/profile/profileApiService';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

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

      const [documentsResult, imagesResult] =
        await Promise.allSettled([
          getProfileDocuments(),
          getAllDocuments(),
        ]);

      // -----------------------------------------
      // DOCUMENT DETAILS + STATUS
      // /api/rider/profile/documents
      // -----------------------------------------
      if (documentsResult.status === 'fulfilled') {
        const response = documentsResult.value;

        console.log(
          'PROFILE DOCUMENTS RESPONSE:',
          JSON.stringify(response, null, 2),
        );

        if (response?.data?.success) {
          setDocuments(response.data.data || {});
        } else {
          console.log(
            'Profile Documents API response failed:',
            response?.data,
          );
        }
      } else {
        console.log(
          'Profile Documents API failed:',
          documentsResult.reason,
        );
      }

      // -----------------------------------------
      // IMAGES
      // /api/rider/documents/all
      // -----------------------------------------
      if (imagesResult.status === 'fulfilled') {
        const response = imagesResult.value;

        console.log(
          'ALL DOCUMENTS RESPONSE:',
          JSON.stringify(response, null, 2),
        );

        if (response?.success) {
          setDocumentImages(response.data || {});
        } else {
          console.log(
            'All Documents API response failed:',
            response,
          );
        }
      } else {
        console.log(
          'All Documents API failed:',
          imagesResult.reason,
        );
      }
    } catch (error) {
      console.log(
        'FETCH DOCUMENTS ERROR:',
        error?.response?.data || error,
      );

      Alert.alert(
        'Error',
        'Unable to fetch documents',
      );
    } finally {
      setLoading(false);
    }
  };

  const docsArray = [
    {
      key: 'pan',
      title: 'PAN Card',
      data: documents?.pan || {},
      number: documents?.pan?.number,
    },

    {
      key: 'drivingLicense',
      title: 'Driving License',
      data: documents?.drivingLicense || {},
      number: documents?.drivingLicense?.number,
    },
  ];


  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#192A51" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {docsArray.map(item => {
          const isApproved =
            item.data?.status?.toLowerCase() === 'approved';

          return (
            <View
              key={item.key}
              style={styles.docCard}
            >
              {/* =========================
          DOCUMENT HEADER
      ========================== */}
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

                {/* STATUS */}
                {/* STATUS */}
                <View style={styles.row}>
                  <Ionicons
                    name={
                      isApproved
                        ? 'checkmark-circle'
                        : 'time-outline'
                    }
                    size={rf(2)}
                    color={
                      isApproved
                        ? '#12B76A'
                        : '#F79009'
                    }
                  />

                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: isApproved
                          ? '#12B76A'
                          : '#F79009',
                      },
                    ]}
                  >
                    {isApproved ? 'Verified' : 'Pending'}
                  </Text>
                </View>

              </View>


              {/* DRIVING LICENSE */}
              {item.key === 'drivingLicense' ? (
                <>
                  <View style={styles.dlImagesContainer}>

                    {/* ==========================================
          FRONT
      ========================================== */}
                    <View style={styles.dlImageItem}>

                      <Text style={styles.imageLabel}>
                        Front
                      </Text>

                      {documentImages?.dlFront ? (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            const images = [];

                            if (documentImages?.dlFront) {
                              images.push({
                                url: documentImages.dlFront,
                              });
                            }

                            if (documentImages?.dlBack) {
                              images.push({
                                url: documentImages.dlBack,
                              });
                            }

                            setPreviewImages(images);
                          }}
                        >
                          <View style={styles.imagePreviewBox}>
                            <Image
                              source={{
                                uri: documentImages.dlFront,
                              }}
                              style={styles.documentPreviewImage}
                              resizeMode="cover"
                            />

                            {/* VIEW ICON */}
                            <View style={styles.viewOverlay}>
                              <Ionicons
                                name="eye-outline"
                                size={rf(2)}
                                color="#FFFFFF"
                              />
                            </View>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.noDlImageContainer}>
                          <Ionicons
                            name="image-outline"
                            size={rf(3)}
                            color="#98A2B3"
                          />

                          <Text style={styles.noImageText}>
                            Front image not available
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* ==========================================
          BACK
      ========================================== */}
                    <View
                      style={[
                        styles.dlImageItem,
                        { marginRight: 0 },
                      ]}
                    >

                      <Text style={styles.imageLabel}>
                        Back
                      </Text>

                      {documentImages?.dlBack ? (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            const images = [];

                            if (documentImages?.dlFront) {
                              images.push({
                                url: documentImages.dlFront,
                              });
                            }

                            if (documentImages?.dlBack) {
                              images.push({
                                url: documentImages.dlBack,
                              });
                            }

                            setPreviewImages(images);
                          }}
                        >
                          <View style={styles.imagePreviewBox}>
                            <Image
                              source={{
                                uri: documentImages.dlBack,
                              }}
                              style={styles.documentPreviewImage}
                              resizeMode="cover"
                            />

                            {/* VIEW ICON */}
                            <View style={styles.viewOverlay}>
                              <Ionicons
                                name="eye-outline"
                                size={rf(2)}
                                color="#FFFFFF"
                              />
                            </View>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.noDlImageContainer}>
                          <Ionicons
                            name="image-outline"
                            size={rf(3)}
                            color="#98A2B3"
                          />

                          <Text style={styles.noImageText}>
                            Back image not available
                          </Text>
                        </View>
                      )}
                    </View>

                  </View>
                </>
              ) : (
                <>
                  {documentImages?.pan ? (
                    <TouchableOpacity
                      style={styles.panImageContainer}
                      activeOpacity={0.8}
                      onPress={() => {
                        setPreviewImages([
                          {
                            url: documentImages.pan,
                          },
                        ]);
                      }}
                    >
                      <Text style={styles.imageLabel}>
                        PAN Card
                      </Text>

                      <View style={styles.panImagePreviewBox}>
                        <Image
                          source={{
                            uri: documentImages.pan,
                          }}
                          style={styles.documentPreviewImage}
                          resizeMode="cover"
                        />

                        <View style={styles.viewOverlay}>
                          <Ionicons
                            name="eye-outline"
                            size={rf(2)}
                            color="#FFFFFF"
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.noImageContainer}>
                      <Text style={styles.noImageText}>
                        PAN image not available
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          );
        })}

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
  scrollContent: {
    paddingTop: rh(2),
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

  panUpdateBtn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#192A51',
    borderRadius: rw(6),
    paddingVertical: rh(1.2),
    marginTop: rh(1),
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
  dlImagesContainer: {
    flexDirection: 'row',
    marginTop: rh(2),
    marginBottom: rh(2),
  },

  dlImageItem: {
    flex: 1,
    marginRight: rw(2),
  },

  imageLabel: {
    fontSize: rf(1.6),
    fontWeight: '600',
    color: '#344054',
    marginBottom: rh(0.8),
  },

  imagePreviewBox: {
    height: rh(12),
    borderRadius: rw(2),
    overflow: 'hidden',
    backgroundColor: '#F2F4F7',
    position: 'relative',
  },

  documentPreviewImage: {
    width: '100%',
    height: '100%',
  },

  viewOverlay: {
    position: 'absolute',
    right: rw(2),
    bottom: rh(1),
    width: rw(8),
    height: rw(8),
    borderRadius: rw(4),
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panImageContainer: {
    marginTop: rh(2),
    marginBottom: rh(1),
  },

  panImagePreviewBox: {
    height: rh(12),
    borderRadius: rw(2),
    overflow: 'hidden',
    backgroundColor: '#F2F4F7',
    position: 'relative',
  },

  noImageContainer: {
    marginTop: rh(2),
    paddingVertical: rh(3),
    borderRadius: rw(2),
    backgroundColor: '#F2F4F7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  noImageText: {
    fontSize: rf(1.5),
    color: '#667085',
  },
  dlSideUpdateBtn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#192A51',
    borderRadius: rw(5),
    paddingVertical: rh(1),
    marginTop: rh(1),
  },

  noDlImageContainer: {
    height: rh(12),
    borderRadius: rw(2),
    backgroundColor: '#F2F4F7',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: rw(2),
  },
});

