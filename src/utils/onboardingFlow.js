import { getOnboardingStatus } from '../services/onboardingApi';

export const resolveNextScreen = async () => {
  const res = await getOnboardingStatus();

  console.log('ONBOARDING STATUS:', JSON.stringify(res, null, 2));

  if (!res?.success) {
    return 'LoginEntryScreen';
  }

  const { onboardingProgress } = res;

  // 1️⃣ App permissions
  if (!onboardingProgress.appPermissionDone) {
    return 'AppPermissionScreen';
  }

  // 2️⃣ City
  if (!onboardingProgress.citySelected) {
    return 'SelectCityScreen';
  }

  // 3️⃣ Vehicle
  if (!onboardingProgress.vehicleSelected) {
    return 'VehicleSelectionScreen';
  }

  // 4️⃣ Personal info
  if (!onboardingProgress.personalInfoSubmitted) {
    return 'PersonalInfoScreen';
  }

  // 5️⃣ Face verification
  if (!onboardingProgress.selfieUploaded) {
    return 'FaceInstructionScreen';
  }

  // 6️⃣ Aadhaar
  if (!onboardingProgress.aadharVerified) {
    return 'AadharEntryScreen';
  }

  // 7️⃣ PAN
  if (!onboardingProgress.panUploaded) {
    return 'PanUploadScreen';
  }

  // 8️⃣ DL
  if (!onboardingProgress.dlUploaded) {
    return 'LicenseUploadScreen';
  }

  // ⏳ WAIT FOR ADMIN VERIFICATION
  if (!onboardingProgress.kycCompleted) {
    return 'ProcessingVerificationScreen';
  }

  // ✅ VERIFIED → HOME
  return 'MainTabs';
};
