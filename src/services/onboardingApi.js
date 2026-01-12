import api from './ApiClient';

export const getOnboardingStatus = async () => {
  const res = await api.get('/api/rider/onboarding-status');
  console.log('ONBOARDING STATUS RESPONSE:', res.data);
  return res.data;
};
