import { getOnboardingStatus } from '../services/onboardingApi';

export const resolveNextScreen = async () => {
  const res = await getOnboardingStatus();

  console.log(
    'ONBOARDING STATUS:',
    JSON.stringify(res, null, 2),
  );

  if (!res?.success) {
    return 'LoginEntryScreen';
  }

  const p = res?.onboardingProgress;

  if (!p) {
    return 'LoginEntryScreen';
  }

  const isFalse = value => value === false;

  /* -------------------------------------------------------
     COMPLETED
  -------------------------------------------------------- */

  if (
    res.isFullyRegistered &&
    p.kycCompleted &&
    res.onboardingStage === 'COMPLETED'
  ) {
    return 'MainTabs';
  }

  /* -------------------------------------------------------
     BASIC ONBOARDING
  -------------------------------------------------------- */

  if (isFalse(p.phoneVerified)) {
    return 'LoginVerifyScreen';
  }

  if (isFalse(p.appPermissionDone)) {
    return 'AppPermissionScreen';
  }

  if ('riderType' in p && isFalse(p.riderType)) {
    return 'RiderTypeScreen';
  }

  if ('citySelected' in p && isFalse(p.citySelected)) {
    return 'SelectCityScreen';
  }

  if ('vehicleSelected' in p && isFalse(p.vehicleSelected)) {
    return 'VehicleSelectionScreen';
  }

  if (
    'personalInfoSubmitted' in p && isFalse(p.personalInfoSubmitted)
  ) {
    return 'PersonalInfoScreen';
  }

  if (
    'selfieUploaded' in p && isFalse(p.selfieUploaded)
  ) {
    return 'FaceInstructionScreen';
  }

  if (
    'aadharVerified' in p && isFalse(p.aadharVerified)
  ) {
    return 'AadharEntryScreen';
  }

  if (
    'panUploaded' in p && isFalse(p.panUploaded)
  ) {
    return 'PanUploadScreen';
  }

  if (
    'dlUploaded' in p && isFalse(p.dlUploaded)
  ) {
    return 'LicenseUploadScreen';
  }

  /* -------------------------------------------------------
     COMPANY EMPLOYEE FLOW
  -------------------------------------------------------- */

  if (
    'employeeDetailsSubmitted' in p && isFalse(p.employeeDetailsSubmitted)
  ) {
    return 'EmployeeDetailsScreen';
  }

  if (
    'documentDetailsSubmitted' in p && isFalse(p.documentDetailsSubmitted)
  ) {
    return 'DocumentDetailsScreen';
  }

  /* -------------------------------------------------------
     PREVIEW
     Rider has not submitted or needs resubmission
  -------------------------------------------------------- */

  if (
    'detailsConfirmed' in p && isFalse(p.detailsConfirmed)
  ) {
    return 'PreviewScreen';
  }

  /* -------------------------------------------------------
     WAITING FOR ADMIN REVIEW
     Rider has submitted.
  -------------------------------------------------------- */

  if (
    p.detailsConfirmed && !p.underReview
  ) {
    return 'ProcessingVerificationScreen';
  }

  return 'MainTabs';
};