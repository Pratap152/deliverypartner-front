import React, { useEffect, useState} from 'react';
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
import {getAllDocuments} from '../../services/getAllDocuments';

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

      console.log(response);

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

  const data = preview?.data;
  const isCompanyEmployee =
    preview?.riderType === 'COMPANY_EMPLOYEE';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <Text style={styles.heading}>Review Profile</Text>

        <Text style={styles.subHeading}>
          Review all your onboarding details before submitting.
        </Text>

        {/* PHONE */}

        <PreviewCard
          title="Phone Number"
          icon="call-outline"
          status={data?.phone?.verified ? 'Verified' : 'Pending'}
        >

          <Text style={styles.value}>
            <Text style={styles.label}>Phone Number : </Text>
            {data?.phone?.phoneNumber}
          </Text>
        </PreviewCard>

        {/* PERMISSIONS */}

        <PreviewCard
          title="Permissions"
          icon="shield-checkmark-outline"
          status="Completed"
        >
          <Text style={styles.value}>
            <Text style={styles.label}>Camera : </Text>
            {data?.permissions?.camera ? 'Granted' : 'Denied'}
          </Text>

          <Text style={styles.value}>
            <Text style={styles.label}>Foreground Location : </Text>
            {data?.permissions?.foregroundLocation
              ? 'Granted'
              : 'Denied'}
          </Text>

          <Text style={styles.value}>
            <Text style={styles.label}>Background Location : </Text>
            {data?.permissions?.backgroundLocation
              ? 'Granted'
              : 'Denied'}
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
            {preview?.riderType?.replaceAll('_', ' ')}
          </Text>
        </PreviewCard>

        {!isCompanyEmployee ? (
          <>

            {/* LOCATION */}

            {data?.location && (
              <PreviewCard
                title="Location"
                icon="location-outline"
                status="Completed"
                onEdit={() =>
                  navigation.navigate('SelectCityScreen')
                }
              >

                <Text style={styles.value}>
                  <Text style={styles.label}>City : </Text>
                  {data.location.city}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Pincode : </Text>
                  {data.location.pincode}
                </Text>

              </PreviewCard>
            )}

            {/* VEHICLE */}

            {data?.vehicle && (
              <PreviewCard
                title="Vehicle Details"
                icon="bicycle-outline"
                status={data.vehicle.status}
                onEdit={() =>
                  navigation.navigate('VehicleSelectionScreen')
                }
              >
                <Text style={styles.value}>
                  <Text style={styles.label}>Vehicle Type : </Text>
                  {data.vehicle.type}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Vehicle Source : </Text>
                  {data.vehicle.vehicleSource}
                </Text>

                {data.vehicle.ownershipType && (
                  <Text style={styles.value}>
                    <Text style={styles.label}>Ownership Type : </Text>
                    {data.vehicle.ownershipType}
                  </Text>
                )}
              </PreviewCard>
            )}

            {/* PERSONAL INFO */}

            {data?.personalInfo && (
              <PreviewCard
                title="Personal Information"
                icon="person-circle-outline"
                status="Completed"
                onEdit={() =>
                  navigation.navigate('PersonalInfoScreen')
                }
              >
                <Text style={styles.value}>
                  <Text style={styles.label}>Full Name : </Text>
                  {data.personalInfo.fullName}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Date of Birth : </Text>
                  {data.personalInfo.dob}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Gender : </Text>
                  {data.personalInfo.gender}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Email : </Text>
                  {data.personalInfo.email}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Primary Phone : </Text>
                  {data.personalInfo.primaryPhone}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Secondary Phone : </Text>
                  {data.personalInfo.secondaryPhone}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Area : </Text>
                  {data.personalInfo.area}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>State : </Text>
                  {data.personalInfo.state}
                </Text>

                {data.personalInfo.employeeId && (
                  <Text style={styles.value}>
                    <Text style={styles.label}>Employee ID : </Text>
                    {data.personalInfo.employeeId}
                  </Text>
                )}
              </PreviewCard>
            )}

            {/* SELFIE */}

            {data?.selfie && (
              <PreviewCard
                title="Selfie"
                icon="camera-outline"
                status="Verified"
                onEdit={() =>
                  navigation.navigate('FaceVerificationScreen', {
                    fromPreview: true,
                  })
                }
              >
                <Image
                  source={{
                    uri: documents.selfie || data?.selfie?.url,
                  }}
                  style={styles.image}
                />
              </PreviewCard>
            )}

            {/* AADHAAR */}

            {data?.kyc && (
              <PreviewCard
                title="Aadhaar"
                icon="card-outline"
                status={data.kyc.aadharStatus}
              >
                <Text style={styles.value}>
                  <Text style={styles.label}>Verification Status : </Text>
                  {data.kyc.aadharStatus}
                </Text>

                {data.kyc.aadharRejectedReason && (
                  <Text style={styles.error}>
                    Rejected Reason : {data.kyc.aadharRejectedReason}
                  </Text>
                )}
              </PreviewCard>
            )}

            {/* PAN */}

            {data?.kyc && (
              <PreviewCard
                title="PAN Card"
                icon="document-text-outline"
                status={data.kyc.panStatus}
                onEdit={() =>
                  navigation.navigate('PanUploadScreen')
                }
              >
                <Text style={styles.value}>
                  <Text style={styles.label}>PAN Number : </Text>
                  {data.kyc.panNumber}
                </Text>

                {data.kyc.panRejectedReason && (
                  <Text style={styles.error}>
                    Rejected Reason : {data.kyc.panRejectedReason}
                  </Text>
                )}

               {(documents.pan || data?.kyc?.panImage) && (
                <Image
                  source={{
                    uri: documents.pan || data.kyc.panImage,
                  }}
                  style={styles.image}
                />
              )}
              </PreviewCard>
            )}

            {/* DRIVING LICENSE */}

            {data?.kyc && (
              <PreviewCard
                title="Driving License"
                icon="car-outline"
                status={data.kyc.dlStatus}
                onEdit={() =>
                  navigation.navigate('LicenseUploadScreen')
                }
              >
                <Text style={styles.value}>
                  <Text style={styles.label}>DL Number : </Text>
                  {data.kyc.dlNumber}
                </Text>


                {data.kyc.dlRejectedReason && (
                  <Text style={styles.error}>
                    Rejected Reason : {data.kyc.dlRejectedReason}
                  </Text>
                )}

                {(documents.dlFront || data?.kyc?.dlFrontImage) && (
                    <>
                      <Text style={styles.imageTitle}>Front Image</Text>
                      <Image
                        source={{
                          uri: documents.dlFront || data.kyc.dlFrontImage,
                        }}
                        style={styles.image}
                      />
                    </>
                  )}

                {(documents.dlBack || data?.kyc?.dlBackImage) && (
                    <>
                      <Text style={[styles.imageTitle, { marginTop: 15 }]}>
                        Back Image
                      </Text>

                      <Image
                        source={{
                          uri: documents.dlBack || data.kyc.dlBackImage,
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

            {data?.personalInfo && (
              <PreviewCard
                title="Employee Details"
                icon="person-circle-outline"
                status="Completed"
                onEdit={() =>
                  navigation.navigate('EmployeeDetailsScreen')
                }
              >
                <Text style={styles.value}>
                  <Text style={styles.label}>Company Name : </Text>
                  {data.personalInfo.companyName || '-'}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Employee ID : </Text>
                  {data.personalInfo.employeeId}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Full Name : </Text>
                  {data.personalInfo.fullName}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Date of Birth : </Text>
                  {data.personalInfo.dob}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Gender : </Text>
                  {data.personalInfo.gender}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Email : </Text>
                  {data.personalInfo.email}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>Secondary Phone : </Text>
                  {data.personalInfo.secondaryPhone}
                </Text>
              </PreviewCard>
            )}

            {/* DOCUMENT DETAILS */}

            {data?.kyc && (
              <PreviewCard
                title="Document Details"
                icon="document-text-outline"
                status="Pending"
                onEdit={() =>
                  navigation.navigate('DocumentDetailsScreen')
                }
              >
                <Text style={styles.value}>
                  <Text style={styles.label}>PAN Number : </Text>
                  {data.kyc.panNumber}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>PAN Status : </Text>
                  {data.kyc.panStatus}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>DL Number : </Text>
                  {data.kyc.dlNumber}
                </Text>

                <Text style={styles.value}>
                  <Text style={styles.label}>DL Status : </Text>
                  {data.kyc.dlStatus}
                </Text>

                {data?.selfie?.url && (
                  <>
                    <Text style={styles.imageTitle}>
                      Selfie
                    </Text>

                   <Image
                    source={{
                      uri: documents.selfie || data?.selfie?.url,
                    }}
                    style={styles.image}
                  />
                  </>
                )}
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
              ? 'Submitting...'
              : 'Submit Application'}
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
    paddingBottom: 180,
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