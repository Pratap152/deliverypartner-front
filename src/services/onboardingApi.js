import api from './ApiClient';

export const getOnboardingStatus = async () => {
  const res = await api.get('/api/rider/onboarding-status');
  return res.data;
};
