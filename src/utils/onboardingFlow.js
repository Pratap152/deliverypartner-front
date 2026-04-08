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
  try {
    const res = await getOnboardingStatus();

    console.log('ONBOARDING STATUS:', JSON.stringify(res, null, 2));

    if (!res?.success) {
      return 'LoginEntryScreen';
    }

    const { onboardingProgress, riderType } = res;

    // Permissions
    if (!onboardingProgress.appPermissionDone) {
      return 'AppPermissionScreen';
    }

    // Rider Type (NEW STEP)
    if (!riderType) {
      return 'RiderTypeScreen';
    }

   
    //  INDIVIDUAL FLOW
   
    if (riderType === 'INDIVIDUAL_EMPLOYEE') {

      if (!onboardingProgress.citySelected) {
        return 'SelectCityScreen';
      }

      if (!onboardingProgress.vehicleSelected) {
        return 'VehicleSelectionScreen';
      }

      if (!onboardingProgress.personalInfoSubmitted) {
        return 'PersonalInfoScreen';
      }

      if (!onboardingProgress.selfieUploaded) {
        return 'FaceInstructionScreen';
      }

      if (!onboardingProgress.aadharVerified) {
        return 'AadharEntryScreen';
      }

      if (!onboardingProgress.panUploaded) {
        return 'PanUploadScreen';
      }

      if (!onboardingProgress.dlUploaded) {
        return 'LicenseUploadScreen';
      }

      if (!onboardingProgress.kycCompleted) {
        return 'ProcessingVerificationScreen';
      }

      return 'MainTabs';
    }

    
    //  COMPANY FLOW
   
    if (riderType === 'COMPANY_EMPLOYEE') {

      if (!onboardingProgress.employeeDetailsSubmitted) {
        return 'EmployeeDetailsScreen';
      }

      if (!onboardingProgress.documentsUploaded) {
        return 'DocumentDetailsScreen';
      }

      if (!onboardingProgress.kycCompleted) {
        return 'KycVerificationScreen';
      }

      return 'MainTabs';
    }

    return 'SplashScreen';

  } catch (err) {
    console.log('ONBOARDING ERROR:', err);
    return 'LoginEntryScreen';
  }
};