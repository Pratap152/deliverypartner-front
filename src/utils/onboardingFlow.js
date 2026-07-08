import { getOnboardingStatus } from '../services/onboardingApi';

export const resolveNextScreen = async () => {
  const res = await getOnboardingStatus();

  console.log('ONBOARDING STATUS:', JSON.stringify(res, null, 2));

  if (!res?.success) return 'LoginEntryScreen';

  const p = res?.onboardingProgress;

  if (!p) return 'LoginEntryScreen';

  const isFalse = (val) => val === false;

  // Phone
  if (isFalse(p.phoneVerified)) {
    return 'OtpVerificationScreen';
  }

  // App Permission
  if (isFalse(p.appPermissionDone)) {
    return 'AppPermissionScreen';
  }

  // Rider Type
  if ('riderType' in p && isFalse(p.riderType)) {
    return 'RiderTypeScreen';
  }

  // Individual / ZestBot Flow

  // City
  if ('citySelected' in p && isFalse(p.citySelected)) {
    return 'SelectCityScreen';
  }

  // Vehicle
  if ('vehicleSelected' in p && isFalse(p.vehicleSelected)) {
    return 'VehicleSelectionScreen';
  }

  // Personal Info
  if ('personalInfoSubmitted' in p && isFalse(p.personalInfoSubmitted)) {
    return 'PersonalInfoScreen';
  }

  // Selfie
  if ('selfieUploaded' in p && isFalse(p.selfieUploaded)) {
    return 'FaceInstructionScreen';
  }

  // Aadhaar
  if ('aadharVerified' in p && isFalse(p.aadharVerified)) {
    return 'AadharEntryScreen';
  }

  // PAN
  if ('panUploaded' in p && isFalse(p.panUploaded)) {
    return 'PanUploadScreen';
  }

  // Driving License
  if ('dlUploaded' in p && isFalse(p.dlUploaded)) {
    return 'LicenseUploadScreen';
  }

  // Company Employee Flow

  // Employee Details
  if (
    'employeeDetailsSubmitted' in p &&
    isFalse(p.employeeDetailsSubmitted)
  ) {
    return 'EmployeeDetailsScreen';
  }

  // Document Details
  if (
    'documentDetailsSubmitted' in p &&
    isFalse(p.documentDetailsSubmitted)
  ) {
    return 'DocumentDetailsScreen';
  }

  // Preview Screen (Common for all rider types)
  if (
    'detailsConfirmed' in p &&
    isFalse(p.detailsConfirmed)
  ) {
    return 'PreviewScreen';
  }

  // Processing Verification
  if (isFalse(p.kycCompleted) || !res.isFullyRegistered) {
    return 'ProcessingVerificationScreen';
  }

  // All onboarding & verification completed
  return 'MainTabs';
};