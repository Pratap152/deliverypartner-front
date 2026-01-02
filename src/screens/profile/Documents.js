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
import axios from 'axios';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WEBSITE_URL from '../../utils/host';
import { tokenService } from '../../services/TokenService';
import ImageViewer from 'react-native-image-zoom-viewer';

const formatTitle = key => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};
const DocumentsScreen = ({ navigation }) => {
  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const access = await tokenService.getAccessToken();

      if (!access) {
        Alert.alert('Auth Error', 'Token not found. Please login again.');
        return;
      }
      console.log('Using access token:', access);

      const res = await axios.get(`${WEBSITE_URL}/api/profile/documents`, {
        headers: { Authorization: `Bearer ${access}` },
      });

      if (res.data?.success) {
        setDocuments(res.data.data);
      } else {
        Alert.alert('Error', res.data?.message || 'Failed to fetch documents');
      }
    } catch (err) {
      Alert.alert('Error', 'Unable to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const isVerified = status => status === 'approved';

  const getImageUrls = doc => {
    if (!doc) return [];
    const images = [];
    if (doc.frontImage) images.push(doc.frontImage);
    if (doc.backImage) images.push(doc.backImage);
    if (doc.image) images.push(doc.image);
    return images;
  };
  const zoomImages = previewImages.map(img => ({
    url: img,
  }));

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00B2C9" />
      </View>
    );
  }

  const HIDDEN_DOC_KEYS = ['aadhar'];

  const docsArray = documents
    ? Object.entries(documents)
        .filter(([key]) => !HIDDEN_DOC_KEYS.includes(key))
        .map(([key, value]) => ({
          key,
          title: formatTitle(key),
          data: value,
          number: value?.number,
        }))
    : [];

  const verifiedCount = docsArray.filter(d => isVerified(d.data.status)).length;
  const pendingCount = docsArray.length - verifiedCount;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={rf(2.6)} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Documents</Text>
        <TouchableOpacity
          onPress={() => Alert.alert('Help', 'Contact support for assistance')}
        >
          <Image
            source={require('../../assets/profile/HelpcenterIcon.png')}
            style={styles.robotIcon}
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
        {docsArray.map(item => (
          <View key={item.title} style={styles.docCard}>
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

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.viewBtn}
                onPress={() => {
                  const urls = getImageUrls(item.data);
                  if (urls.length > 0) setPreviewImages(urls);
                  else Alert.alert('No Image', 'Images not available');
                }}
              >
                <Ionicons name="eye-outline" size={rf(2)} />
                <Text style={styles.viewText}>View</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.updateBtn}
                onPress={() =>
                  Alert.alert(
                    'Coming Soon',
                    'Document update will be enabled later.',
                  )
                }
              >
                <Ionicons
                  name="cloud-upload-outline"
                  size={rf(2)}
                  color="#fff"
                />
                <Text style={styles.updateText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={{ height: rh(3) }} />
      </ScrollView>

      {/* IMAGE PREVIEW MODAL */}
      {/* IMAGE PREVIEW MODAL */}
      <Modal
        visible={previewImages.length > 0}
        animationType="fade"
        statusBarTranslucent={false}
        onRequestClose={() => setPreviewImages([])}
      >
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <ImageViewer
            imageUrls={previewImages.map(img => ({ url: img }))}
            backgroundColor="#FFFFFF"
            enableSwipeDown
            useNativeDriver={false}
            onSwipeDown={() => setPreviewImages([])}
          />

          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setPreviewImages([])}
          >
            <Ionicons name="close" size={rf(3)} color="#000" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default DocumentsScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },

  header: {
    height: rh(8),
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rw(4),
    elevation: 2,
  },

  headerTitle: {
    fontSize: rf(2.3),
    fontWeight: '600',
  },

  robotIcon: {
    width: rw(12),
    height: rw(11),
    resizeMode: 'contain',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  summaryCard: {
    backgroundColor: '#fff',
    margin: rw(4),
    borderRadius: rw(3),
    padding: rw(4),
    elevation: 2,
  },

  summaryTitle: {
    fontSize: rf(2),
    fontWeight: '600',
    marginBottom: rh(2),
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

  verifiedBox: { backgroundColor: '#ECFDF3' },
  pendingBox: { backgroundColor: '#FFFAEB' },

  summaryCount: {
    fontSize: rf(3),
    fontWeight: '700',
  },

  summaryLabel: {
    fontSize: rf(1.6),
    color: '#475467',
  },

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

  docTitle: {
    fontSize: rf(2),
    fontWeight: '600',
  },

  statusText: {
    marginLeft: rw(1),
    fontSize: rf(1.6),
    fontWeight: '500',
  },

  numberText: {
    marginTop: rh(1),
    fontSize: rf(1.7),
    color: '#667085',
  },

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

  viewText: {
    marginLeft: rw(1),
    fontSize: rf(1.7),
  },

  updateBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00B2C9',
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

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  previewImage: {
    width: rw(100),
    height: rh(70),
  },

  modalClose: {
    position: 'absolute',
    top: rh(5),
    right: rw(5),
    zIndex: 10,
  },
});
