import { getOnboardingStatus } from '../services/onboardingApi';

export const resolveNextScreen = async () => {
  const res = await getOnboardingStatus();
  const stage = res.onboardingStage;

  switch (stage) {
    case 'APP_PERMISSION':
    case 'APP_PERMISSIONS':
      return 'AppPermissionScreen';

    case 'SELECT_LOCATION':
      return 'SelectCityScreen';

    case 'SELECT_VEHICLE':
      return 'VehicleSelectionScreen';

    case 'PERSONAL_INFO':
      return 'PersonalInfoScreen';

    case 'SELFIE':
      return 'FaceInstructionScreen';

    case 'FACE_VERIFICATION':
      return 'FaceVerificationScreen';

    case 'PAN_UPLOAD':
      return 'PanUploadScreen';

    case 'DL_UPLOAD':
      return 'LicenseUploadScreen';

    case 'KYC_APPROVAL_PENDING':
    case 'PENDING_VERIFICATION':
      return 'ProcessingVerificationScreen';

    case 'COMPLETED':
      return 'MainTabs';

    default:
      console.warn('Unknown onboarding stage:', stage);
      return 'LoginEntryScreen';
  }
};
