import api from './api';

export const getOnboardingStatus = async () => {
  const response = await api.get('/api/rider/onboarding-status');
  return response.data;
};
