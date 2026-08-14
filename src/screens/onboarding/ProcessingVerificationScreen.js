import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import DeviceInfo from 'react-native-device-info';
import {
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';

import { getOnboardingStatus } from '../../services/onboardingApi';

import {
  getOnboardingPreview,
} from '../../services/onboardingPreviewApi';

const isTablet = DeviceInfo.isTablet();
const containerMaxWidth = isTablet ? 900 : '100%';

const POLL_INTERVAL = 8000;

const ProcessingVerificationScreen = () => {
  const navigation = useNavigation();

  const intervalRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit the app?',
          [
            {
              text: 'No',
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => BackHandler.exitApp(),
            },
          ],
        );

        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  const loadPreview = async () => {
    try {
      const res = await getOnboardingPreview();

      if (res?.success) {
        setSections(res.sections || []);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    try {
      const res = await getOnboardingStatus();

      if (
        res?.success &&
        res?.onboardingProgress?.detailsConfirmed === false
      ) {
        clearInterval(intervalRef.current);
        navigation.replace('PreviewScreen');
        return;
      }

      if (
        res?.success &&
        res?.onboardingProgress?.kycCompleted &&
        res?.isFullyRegistered
      ) {
        clearInterval(intervalRef.current);
        navigation.replace('SplashScreen');
        return;
      }

      loadPreview();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkStatus();

    intervalRef.current = setInterval(
      checkStatus,
      POLL_INTERVAL,
    );

    return () => clearInterval(intervalRef.current);
  }, []);

  const getStatus = status => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return {
          text: 'Approved',
          color: '#22C55E',
        };

      case 'rejected':
        return {
          text: 'Rejected',
          color: '#EF4444',
        };

      case 'pending':
        return {
          text: 'Pending',
          color: '#F59E0B',
        };

      default:
        return {
          text: status || 'Pending',
          color: '#F59E0B',
        };
    }
  };

  const renderItem = (title, key) => {
    const item = sections.find(section => section.key === key);

    const status = getStatus(item?.status);

    return (
      <View style={styles.row} key={key}>
        <Text style={styles.rowTitle}>{title}</Text>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: `${status.color}20`,
            },
          ]}>
          <Text
            style={[
              styles.status,
              {
                color: status.color,
              },
            ]}>
            {status.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>

          {/* Illustration */}

          <Image
            source={require('../../assets/Notify.png')}
            style={styles.image}
            resizeMode="contain"
          />

          {/* Heading */}

          <Text style={styles.heading}>
            Verification In Progress
          </Text>

          <Text style={styles.subHeading}>
            Your onboarding details have been submitted successfully.
          </Text>

          <Text style={styles.description}>
            Our verification team is currently reviewing your information.
            This process usually takes 24–48 hours. Once verification is
            completed, we'll notify you and automatically activate your
            delivery partner account.
          </Text>

          {/* Status Card */}

          <View style={styles.card}>

            <Text style={styles.cardTitle}>
              Verification Status
            </Text>

            {loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator
                  size="large"
                  color="#1F3365"
                />

                <Text style={styles.loadingText}>
                  Fetching latest status...
                </Text>
              </View>
            ) : (
              <>
                {renderItem(
                  'Personal Information',
                  'PERSONAL_INFO',
                )}

                {renderItem(
                  'Selfie',
                  'SELFIE',
                )}

                {renderItem(
                  'PAN Card',
                  'PAN_UPLOAD',
                )}

                {renderItem(
                  'Driving License',
                  'DL_UPLOAD',
                )}
              </>
            )}

          </View>

          {/* Information Box */}

          <View style={styles.infoBox}>

            <Text style={styles.infoTitle}>
              What happens next?
            </Text>

            <Text style={styles.infoText}>
              • Our team verifies your submitted documents.
            </Text>

            <Text style={styles.infoText}>
              • If any document requires correction, you'll receive a notification.
            </Text>

            <Text style={styles.infoText}>
              • Once everything is approved, your account will become active automatically.
            </Text>

          </View>

          {/* Footer */}

          <View style={styles.footer}>

            <Text style={styles.footerText}>
              Need assistance?
            </Text>

            <Text style={styles.supportText}>
              Contact Support
            </Text>

          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProcessingVerificationScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: responsiveHeight(4),
  },

  container: {
    width: '100%',
    maxWidth: containerMaxWidth,
    alignSelf: 'center',
    paddingHorizontal: responsiveWidth(6),
    alignItems: 'center',
  },

  image: {
    width: responsiveWidth(60),
    height: responsiveHeight(26),
    marginBottom: 20,
  },

  heading: {
    fontSize: responsiveFontSize(3),
    fontWeight: '700',
    color: '#1F3365',
    textAlign: 'center',
  },

  subHeading: {
    marginTop: 10,
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },

  description: {
    marginTop: 14,
    fontSize: responsiveFontSize(1.9),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 10,
  },

  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginTop: 32,
    padding: 20,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 5,
  },

  cardTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '700',
    color: '#1F3365',
    marginBottom: 10,
  },

  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },

  loadingText: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: responsiveFontSize(1.8),
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingVertical: 16,

    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  rowTitle: {
    fontSize: responsiveFontSize(1.95),
    color: '#111827',
    fontWeight: '600',
  },

  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 30,
  },

  status: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: '700',
  },

  infoBox: {
    width: '100%',
    marginTop: 28,
    backgroundColor: '#EEF4FF',
    borderRadius: 16,
    padding: 18,

    borderLeftWidth: 5,
    borderLeftColor: '#1F3365',
  },

  infoTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    color: '#1F3365',
    marginBottom: 10,
  },

  infoText: {
    fontSize: responsiveFontSize(1.8),
    color: '#475569',
    lineHeight: 24,
    marginBottom: 8,
  },

  footer: {
    marginTop: 35,
    marginBottom: 20,
    alignItems: 'center',
  },

  footerText: {
    fontSize: responsiveFontSize(1.8),
    color: '#6B7280',
  },

  supportText: {
    marginTop: 8,
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    color: '#1F3365',
  },
});