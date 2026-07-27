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
  resubmitKyc,
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

      let response;

      if (isRejectedFlow) {
        response = await resubmitKyc();
      } else {
        response = await confirmOnboardingDetails(true);
      }
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

  const screenStatus = preview?.screen; // PENDING | REJECTED | APPROVED
  const isRejectedFlow = screenStatus === 'REJECTED';
  const isApprovedFlow = screenStatus === 'APPROVED';
  const isReviewFlow = screenStatus === "REVIEW";

  const canEditSection = section => {
    if (isReviewFlow) {
      return true; // before submit
    }

    return section?.editable === true;
  };

  const sections = preview?.sections || [];

  const getSection = key =>
    sections.find(item => item.key === key);

  const panSection = getSection('PAN_UPLOAD');
  const dlSection = getSection('DL_UPLOAD');
  const aadhaarSection = getSection('AADHAAR');
  const selfieSection = getSection('SELFIE');
  const documentSection = getSection('DOCUMENT_DETAILS');

  const canEdit = status => {
    // Initial onboarding
    if (!isRejectedFlow && !isApprovedFlow) {
      return true;
    }

    // Rejected flow
    if (isRejectedFlow) {
      return status?.toLowerCase() === 'rejected';
    }

    // Approved flow
    return false;
  };

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
                status="Completed"
                onEdit={
                  !isRejectedFlow && !isApprovedFlow
                    ? () => navigation.navigate('SelectCityScreen')
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
                  !isRejectedFlow && !isApprovedFlow
                    ? () => navigation.navigate('VehicleSelectionScreen')
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
                status="Completed"
                onEdit={
                  canEdit(kyc?.personalInfoStatus)
                    ? () => navigation.navigate('PersonalInfoScreen')
                    : undefined
                }
              >
                {kyc?.personalInfoStatus === 'rejected' && (
                  <Text style={styles.error}>
                    Rejected Reason : {kyc?.personalInfoRejectedReason}
                  </Text>
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
                status={kyc?.selfieStatus}
                onEdit={
                  canEdit(kyc?.selfieStatus)
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
                {kyc?.selfieStatus === 'rejected' && (
                  <Text style={styles.error}>
                    Rejected Reason : {kyc?.selfieRejectedReason}
                  </Text>
                )}
              </PreviewCard>
            )}

            {/* AADHAAR

            {kyc && (
              <PreviewCard
                title="Aadhaar"
                icon="card-outline"
                status={kyc?.aadharStatus}
              >
                <Text style={styles.value}>
                  <Text style={styles.label}>Status : </Text>
                  {aadhaarSection?.status || kyc.aadharStatus}
                </Text>

                {kyc?.aadharRejectedReason && (
                  <Text style={styles.error}>
                    Rejected Reason : {aadhaarSection.reason}
                  </Text>
                )}
              </PreviewCard>
            )} */}

            {/* PAN */}

            {kyc && (
              <PreviewCard
                title="PAN Card"
                icon="document-text-outline"
                status={kyc?.panStatus}
                onEdit={
                  canEdit(kyc?.panStatus)
                    ? () => navigation.navigate('PanUploadScreen')
                    : undefined
                }
              >
                <Text style={styles.value}>
                  <Text style={styles.label}>PAN Number : </Text>
                  {kyc.panNumber}
                </Text>

                {kyc?.panRejectedReason && (
                  <Text style={styles.error}>
                    Rejected Reason : {panSection.reason}
                  </Text>
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
                status={kyc?.dlStatus}
                onEdit={
                  canEdit(kyc?.dlStatus)
                    ? () => navigation.navigate('LicenseUploadScreen')
                    : undefined
                }
              >
                <Text style={styles.value}>
                  <Text style={styles.label}>DL Number : </Text>
                  {kyc.dlNumber}
                </Text>

                {kyc?.dlRejectedReason && (
                  <Text style={styles.error}>
                    Rejected Reason : {dlSection.reason}
                  </Text>
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
                  !isRejectedFlow && !isApprovedFlow
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
                  canEditSection(documentSection)
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
});