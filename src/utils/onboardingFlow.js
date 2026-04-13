// import { getOnboardingStatus } from '../services/onboardingApi';

// export const resolveNextScreen = async () => {
//   const res = await getOnboardingStatus();

//   console.log('ONBOARDING STATUS:', JSON.stringify(res, null, 2));

//   if (!res?.success) {
//     return 'LoginEntryScreen';
//   }

//   const { onboardingProgress } = res;

//   // 1️⃣ App permissions 
//   if (!onboardingProgress.appPermissionDone) {
//     return 'AppPermissionScreen';
//   }

//   // 2️⃣ City
//   if (!onboardingProgress.citySelected) {
//     return 'SelectCityScreen';
//   }

//   // 3️⃣ Vehicle
//   if (!onboardingProgress.vehicleSelected) {
//     return 'VehicleSelectionScreen';
//   }

//   // 4️⃣ Personal info
//   if (!onboardingProgress.personalInfoSubmitted) {
//     return 'PersonalInfoScreen';
//   }

//   // 5️⃣ Face verification
//   if (!onboardingProgress.selfieUploaded) {
//     return 'FaceInstructionScreen';
//   }

//   // 6️⃣ Aadhaar
//   if (!onboardingProgress.aadharVerified) {
//     return 'AadharEntryScreen';
//   }

//   // 7️⃣ PAN
//   if (!onboardingProgress.panUploaded) {
//     return 'PanUploadScreen';
//   }

//   // 8️⃣ DL
//   if (!onboardingProgress.dlUploaded) {
//     return 'LicenseUploadScreen';
//   }

//   // ⏳ WAIT FOR ADMIN VERIFICATION
//   if (!onboardingProgress.kycCompleted) {
//     return 'ProcessingVerificationScreen';
//   }

//   // ✅ VERIFIED → HOME
//   return 'MainTabs';
// };
import { getOnboardingStatus } from '../services/onboardingApi';

export const resolveNextScreen = async () => {

  const res = await getOnboardingStatus();
 
  console.log('ONBOARDING STATUS:', JSON.stringify(res, null, 2));
 
  if (!res?.success) return 'LoginEntryScreen';
 
  const p = res?.onboardingProgress;
 
  if (!p) return 'LoginEntryScreen';

  const isFalse = (val) => val === false;
 
  // Phone

  if (isFalse(p.phoneVerified)) return 'OtpVerificationScreen';
 
  // App Permission

  if (isFalse(p.appPermissionDone)) return 'AppPermissionScreen';
 
  // City (only if exists)

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
 
  // Docs

  if ('aadharVerified' in p && isFalse(p.aadharVerified)) {

    return 'AadharEntryScreen';

  }
 
  if ('panUploaded' in p && isFalse(p.panUploaded)) {

    return 'PanUploadScreen';

  }
 
  if ('dlUploaded' in p && isFalse(p.dlUploaded)) {

    return 'LicenseUploadScreen';

  }

   //  Employee Details

  if ('employeeDetailsSubmitted' in p && isFalse(p.employeeDetailsSubmitted)) {

    return 'EmployeeDetailsScreen';

  }
 
 
  //  Document Details

  if ('documentDetailsSubmitted' in p && isFalse(p.documentDetailsSubmitted)) {

    return 'DocumentDetailsScreen';

  }
 
 
  //  Employee KYC

  if ('employeeKycVerified' in p && isFalse(p.employeeKycVerified)) {

    return 'ProcessingVerificationScreen';

  }
 
  //  Final

  if (isFalse(p.kycCompleted)) {

    return 'ProcessingVerificationScreen';

  }
 
  return 'MainTabs';

};

 