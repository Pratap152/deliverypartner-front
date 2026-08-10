import apiClient from './ApiClient';

/**
 * Get onboarding preview details
 */
export const getOnboardingPreview = async () => {
  try {
    const response = await apiClient.get(
      '/api/rider/onboarding-preview',
    );

    return response.data;
  } catch (error) {
    console.log(
      'ONBOARDING PREVIEW ERROR:',
      error?.response?.data || error,
    );

    throw error;
  }
};

/**
 * Confirm onboarding details before final submission
 */
export const confirmOnboardingDetails = async (
  detailsConfirmed = true,
) => {
  try {
    const response = await apiClient.post(
      '/api/rider/confirm-details',
      {
        detailsConfirmed,
      },
    );

    return response.data;
  } catch (error) {
    console.log(
      'CONFIRM DETAILS ERROR:',
      error?.response?.data || error,
    );

    throw error;
  }
};

