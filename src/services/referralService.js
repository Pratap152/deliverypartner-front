import apiClient from './ApiClient';

export const getReferralsList = async () => {
  const response = await apiClient.get("/api/rider/referral/referrer/list");
  return response;
};

export const shareRefer = async (payload) => {
  const response = await apiClient.post("/api/rider/refer/share", payload);
  return response;
};

export const referRider = async (payload) => {
  const response = await apiClient.post('/api/rider/refer/rider/refer', payload);
  return response;
};