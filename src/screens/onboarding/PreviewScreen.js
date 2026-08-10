import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  View,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PreviewCard from '../../components/onboarding/AppPermissions/PreviewCard';
import {
  getOnboardingPreview,
  confirmOnboardingDetails,
} from '../../services/onboardingPreviewApi';
import { getAllDocuments } from '../../services/getAllDocuments';

const PreviewScreen = () => {
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [documents, setDocuments] = useState({});

  const navigation = useNavigation();

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

        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  useEffect(() => {
    fetchPreview();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchPreview();
    }, [])
  );

  const fetchPreview = async () => {
    try {
      setLoading(true);

      const [previewResult, documentsResult] =
        await Promise.allSettled([
          getOnboardingPreview(),
          getAllDocuments(),
        ]);

      if (previewResult.status === 'fulfilled') {
        setPreview(previewResult.value);
      }
      if (documentsResult.status === 'fulfilled') {
        setDocuments(documentsResult.value.data || {});
      }
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async () => {
    if (!confirmed) {
      Alert.alert(
        'Confirmation Required',
        'Please confirm all details before submitting.',
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await confirmOnboardingDetails(true);

      if (response.success) {
        navigation.replace('ProcessingVerificationScreen');
      }
    } catch (error) {
      console.log(error);

      Alert.alert(
        'Error',
        'Unable to submit application.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color='#1F3365' />
      </SafeAreaView>
    );
  }

  const rider = preview?.rider;
  const profile = rider?.profile;
  const location = rider?.location;
  const vehicle = rider?.vehicle;
  const selfie = rider?.selfie;
  const kyc = rider?.kyc;
  const onboarding = rider?.onboarding;

  const isRejectedFlow =
    onboarding?.detailsConfirmed === false &&
    (
      rider?.onboardingStage === 'KYC_REJECTED' ||
      rider?.onboardingStage === 'KYC_UNDER_REVIEW'
    );

  const canEdit = (key) => {
    // Before first submit -> allow editing everything
    if (!onboarding?.detailsConfirmed) {
      return true;
    }

    // After rejection -> allow only rejected/editable sections
    return getSection(key)?.editable === true;
  };

  const canEditSection = section => {
    return section?.editable === true;
  };

  const sections = preview?.sections || [];

  const getSection = key =>
    sections.find(item => item.key === key);

  const locationSection = getSection('LOCATION');
  const personalInfoSection = getSection('PERSONAL_INFO');
  const panSection = getSection('PAN_UPLOAD');
  const dlSection = getSection('DL_UPLOAD');
  const selfieSection = getSection('SELFIE');
  const documentSection = getSection('DOCUMENT_DETAILS');
  const employeeSection = getSection('EMPLOYEE_DETAILS');

  const isCompanyEmployee =
    rider?.riderType === 'COMPANY_EMPLOYEE';


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <Text style={styles.heading}>
          {isRejectedFlow
            ? 'KYC Review Required'
            : 'Review Profile'}
        </Text>

        <Text style={styles.subHeading}>
          {isRejectedFlow
            ? 'Please update the rejected details and resubmit your KYC.'
            : 'Review all your onboarding details before submitting.'}
        </Text>

        {isRejectedFlow && (
          <View style={styles.rejectionBanner}>
            <View style={styles.rejectionIconContainer}>
              <Ionicons
                name="alert-circle"
                size={24}
                color="#DC2626"
              />
            </View>

            <View style={styles.rejectionContent}>
              <Text style={styles.rejectionTitle}>
                Action Required
              </Text>

              <Text style={styles.rejectionMessage}>
                Some of your submitted details were rejected. Please review the
                highlighted sections below, make the required corrections, and
                resubmit your application.
              </Text>
            </View>
          </View>
        )}

        {/* PHONE */}

        <PreviewCard
          title="Phone Number"
          icon="call-outline"
          status={rider?.phoneIsVerified ? 'Verified' : 'Pending'}
        >
          <Text style={styles.value}>
            <Text style={styles.label}>Phone Number : </Text>
            {rider?.countryCode} {rider?.phoneNumber}
          </Text>
        </PreviewCard>


        {/* RIDER TYPE */}

        <PreviewCard
          title="Rider Type"
          icon="person-outline"
          status="Completed"
        >
          <Text style={styles.value}>
            <Text style={styles.label}>Type : </Text>
            {rider?.riderType?.replaceAll('_', ' ')}
          </Text>
        </PreviewCard>

        {!isCompanyEmployee ? (
          <>

            {/* LOCATION */}

            {location && (
              <PreviewCard
                title="Location"
                icon="location-outline"
                status={locationSection?.status || 'Completed'}
                onEdit={
                  canEdit('LOCATION')
                    ? () =>
                      navigation.navigate('AreaSelectionScreen', {
                        city: location?.city,
                        fromPreview: true,
                      })
                    : undefined
                }
              >
                <Text style={styles.value}>
                  <Text style={styles.label}>City : </Text>
                  {location.city}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Area : </Text>
                  {location.area}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>State : </Text>
                  {location.state}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Pincode : </Text>
                  {location.pincode}
                </Text>
              </PreviewCard>
            )}


            {/* VEHICLE */}

            {vehicle && (
              <PreviewCard
                title="Vehicle Details"
                icon="bicycle-outline"
                status={vehicle.status}
                onEdit={
                  canEdit('VEHICLE')
                    ? () =>
                      navigation.navigate('VehicleSelectionScreen', {
                        fromPreview: true,
                      })
                    : undefined
                }
              >
                <Text style={styles.value}>
                  <Text style={styles.label}>Vehicle Type : </Text>
                  {vehicle.type}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Vehicle Source : </Text>
                  {vehicle.vehicleSource}
                </Text>

                {vehicle.ownershipType && (
                  <Text style={styles.value}>
                    <Text style={styles.label}>Ownership Type : </Text>
                    {vehicle.ownershipType}
                  </Text>
                )}
              </PreviewCard>
            )}

            {/* PERSONAL INFO */}

            {profile && (
              <PreviewCard
                title="Personal Information"
                icon="person-circle-outline"
                status={personalInfoSection?.status}
                onEdit={
                  canEdit('PERSONAL_INFO')
                    ? () => navigation.navigate('PersonalInfoScreen', {
                      fromPreview: true,
                    })
                    : undefined
                }
              >
                {personalInfoSection?.reason && (
                  <View style={styles.rejectedReasonBox}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={18}
                      color="#DC2626"
                    />

                    <View style={styles.rejectedReasonContent}>
                      <Text style={styles.rejectedReasonTitle}>
                        Rejected
                      </Text>

                      <Text style={styles.rejectedReasonText}>
                        {personalInfoSection.reason}
                      </Text>
                    </View>
                  </View>
                )}

                <Text style={styles.value}>
                  <Text style={styles.label}>Full Name : </Text>
                  {profile.fullName}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Date of Birth : </Text>
                  {profile.dob}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Gender : </Text>
                  {profile.gender}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Email : </Text>
                  {profile.email}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Primary Phone : </Text>
                  {profile.primaryPhone}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Secondary Phone : </Text>
                  {profile.secondaryPhone}
                </Text>
              </PreviewCard>
            )}

            {/* SELFIE */}

            {selfie && (
              <PreviewCard
                title="Selfie"
                icon="camera-outline"
                status={selfieSection?.status}
                onEdit={
                  canEdit('SELFIE')
                    ? () =>
                      navigation.navigate('FaceVerificationScreen', {
                        fromPreview: true,
                      })
                    : undefined
                }
              >
                <Image
                  source={{
                    uri: documents.selfie || selfie.url,
                  }}
                  style={styles.image}
                />
                {selfieSection?.reason && (
                  <View style={styles.rejectedReasonBox}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={18}
                      color="#DC2626"
                    />

                    <View style={styles.rejectedReasonContent}>
                      <Text style={styles.rejectedReasonTitle}>
                        Rejected
                      </Text>

                      <Text style={styles.rejectedReasonText}>
                        {selfieSection.reason}
                      </Text>
                    </View>
                  </View>
                )}
              </PreviewCard>
            )}

            {/* PAN */}

            {kyc && (
              <PreviewCard
                title="PAN Card"
                icon="document-text-outline"
                status={panSection?.status}
                onEdit={
                  canEdit('PAN_UPLOAD')
                    ? () =>
                      navigation.navigate('PanUploadScreen', {
                        fromPreview: true,
                      })
                    : undefined
                }
              >
                <Text style={styles.value}>
                  <Text style={styles.label}>PAN Number : </Text>
                  {kyc.panNumber}
                </Text>

                {panSection?.reason && (
                  <View style={styles.rejectedReasonBox}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={18}
                      color="#DC2626"
                    />

                    <View style={styles.rejectedReasonContent}>
                      <Text style={styles.rejectedReasonTitle}>
                        Rejected
                      </Text>

                      <Text style={styles.rejectedReasonText}>
                        {panSection.reason}
                      </Text>
                    </View>
                  </View>
                )}

                {(documents.pan || kyc.panImage) && (
                  <Image
                    source={{
                      uri: documents.pan || kyc.panImage,
                    }}
                    style={styles.image}
                  />
                )}
              </PreviewCard>
            )}

            {/* DRIVING LICENSE */}

            {kyc && (
              <PreviewCard
                title="Driving License"
                icon="car-outline"
                status={dlSection?.status}
                onEdit={
                  canEdit('DL_UPLOAD')
                    ? () => navigation.navigate('LicenseUploadScreen', {
                      fromPreview: true,
                    })
                    : undefined
                }
              >
                <Text style={styles.value}>
                  <Text style={styles.label}>DL Number : </Text>
                  {kyc.dlNumber}
                </Text>

                {dlSection?.reason && (
                  <View style={styles.rejectedReasonBox}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={18}
                      color="#DC2626"
                    />

                    <View style={styles.rejectedReasonContent}>
                      <Text style={styles.rejectedReasonTitle}>
                        Rejected
                      </Text>

                      <Text style={styles.rejectedReasonText}>
                        {dlSection.reason}
                      </Text>
                    </View>
                  </View>
                )}

                {(documents.dlFront || kyc.dlFrontImage) && (
                  <>
                    <Text style={styles.imageTitle}>Front Image</Text>
                    <Image
                      source={{
                        uri: documents.dlFront || kyc.dlFrontImage,
                      }}
                      style={styles.image}
                    />
                  </>
                )}

                {(documents.dlBack || kyc.dlBackImage) && (
                  <>
                    <Text style={[styles.imageTitle, { marginTop: 15 }]}>
                      Back Image
                    </Text>

                    <Image
                      source={{
                        uri: documents.dlBack || kyc.dlBackImage,
                      }}
                      style={styles.image}
                    />
                  </>
                )}
              </PreviewCard>
            )}
          </>
        ) : (
          <>
            {/* EMPLOYEE DETAILS */}

            {profile && (
              <PreviewCard
                title="Employee Details"
                icon="person-circle-outline"
                status="Completed"
                onEdit={
                  canEditSection(employeeSection)
                    ? () => navigation.navigate('EmployeeDetailsScreen')
                    : undefined
                }
              >
                <Text style={styles.value}>
                  <Text style={styles.label}>Company Name : </Text>
                  {rider?.companyName || '-'}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Employee ID : </Text>
                  {rider?.empId || '-'}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Full Name : </Text>
                  {profile?.fullName}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Date of Birth : </Text>
                  {profile?.dob}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Gender : </Text>
                  {profile?.gender}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Email : </Text>
                  {profile?.email}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Secondary Phone : </Text>
                  {profile?.secondaryPhone}
                </Text>
              </PreviewCard>
            )}

            {/* selfie */}
            {selfie && (
              <PreviewCard
                title="Selfie"
                icon="camera-outline"
                status={selfieSection?.status || "Pending"}
                onEdit={
                  canEditSection(selfieSection)
                    ? () =>
                      navigation.navigate("DocumentDetailsScreen", {
                        fromRejectedFlow: true,
                      })
                    : undefined
                }
              >
                {selfieSection?.reason && (
                  <Text style={styles.error}>
                    Rejected Reason : {selfieSection.reason}
                  </Text>
                )}

                <Image
                  source={{
                    uri: documents.selfie || selfie.url,
                  }}
                  style={styles.image}
                />
              </PreviewCard>
            )}

            {/* DOCUMENT DETAILS */}

            {kyc && (
              <PreviewCard
                title="Document Details"
                icon="document-text-outline"
                status={documentSection?.status || "Completed"}
                onEdit={
                  canEdit('DOCUMENT_DETAILS')
                    ? () =>
                      navigation.navigate("DocumentDetailsScreen", {
                        fromRejectedFlow: true,
                      })
                    : undefined
                }
              >
                {documentSection?.reason && (
                  <Text style={styles.error}>
                    Rejected Reason : {documentSection.reason}
                  </Text>
                )}
                {vehicle && (
                  <Text style={styles.value}>
                    <Text style={styles.label}>Vehicle Type : </Text>
                    {vehicle.type}
                  </Text>
                )}

                <Text style={styles.value}>
                  <Text style={styles.label}>PAN Number : </Text>
                  {kyc.panNumber || '-'}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>DL Number : </Text>
                  {kyc.dlNumber || '-'}
                </Text>
              </PreviewCard>
            )}
          </>
        )}
      </ScrollView>


      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.checkboxRow}
          activeOpacity={0.8}
          onPress={() => setConfirmed(!confirmed)}
        >
          <Ionicons
            name={confirmed ? 'checkbox' : 'square-outline'}
            size={24}
            color="#1F3365"
          />

          <Text style={styles.checkboxText}>
            I confirm all details.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            !confirmed && styles.disabledButton,
          ]}
          disabled={!confirmed || submitting}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>
            {submitting
              ? (isRejectedFlow
                ? 'Resubmitting...'
                : 'Submitting...')
              : (isRejectedFlow
                ? 'Resubmit Application'
                : 'Submit Application')}
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

export default PreviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6FBFF',
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },

  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },

  subHeading: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 22,
  },

  label: {
    fontWeight: '700',
    color: '#111827',
  },

  value: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 22,
  },

  error: {
    color: '#DC2626',
    fontWeight: '600',
    marginTop: 6,
  },

  imageTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 10,
    marginBottom: 8,
  },

  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  checkboxText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#111827',
  },

  submitButton: {
    backgroundColor: '#1F3365',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledButton: {
    backgroundColor: '#C7C7C7',
  },

  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bottomContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  rejectionBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',

    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderLeftWidth: 5,
    borderLeftColor: '#DC2626',

    borderRadius: 14,
    padding: 15,
    marginBottom: 20,
  },

  rejectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  rejectionContent: {
    flex: 1,
  },

  rejectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B91C1C',
    marginBottom: 5,
  },

  rejectionMessage: {
    fontSize: 14,
    lineHeight: 21,
    color: '#7F1D1D',
  },
  rejectedReasonBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECACA',

    padding: 12,
    marginTop: 8,
    marginBottom: 12,
  },

  rejectedReasonContent: {
    flex: 1,
    marginLeft: 8,
  },

  rejectedReasonTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B91C1C',
    marginBottom: 2,
  },

  rejectedReasonText: {
    fontSize: 14,
    color: '#7F1D1D',
    lineHeight: 20,
  },
});