import apiClient from './ApiClient';
import api from './ApiClient';


export const getOnboardingStatus = async () => {
  const res = await api.get('/api/rider/onboarding-status');
  // console.log('ONBOARDING STATUS RESPONSE:', res.data);
  return res.data;
};

export const onboardingAppPermissions = async () => {
  const response = await apiClient.post(
    '/api/rider/app-permissions',
    { camera: true, foregroundLocation: true, backgroundLocation: true },
    { headers: { 'x-client': 'mobile' } },
  );
  return response.data;
};

export const getPincodes = async (city) => {
  const response = await apiClient.get(
    `/api/rider/location/areas?city=${city}`,
  );
  return response.data;
};

export const savePincode = async (payload) => {
  const response = await apiClient.post('/api/rider/location', payload,
    {
      headers: { 'x-client': 'mobile' },
    }
  );
  return response.data;
};

export const saveDocumentDetails = async (formData, headers) => {
  const response = await apiClient.post(
    "/api/rider/company/rider/document", formData, headers
  );
  return response.data;
};

export const verifyFace = async (formData) => {
  const response = await apiClient.post('/api/rider/selfie', formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  return response;
};

export const saveDrivingLicense = async (formData) => {
  await apiClient.post('/api/rider/dl', formData,
    {
      headers: {
        'Content-Type':
          'multipart/form-data',
      },
    }
  );
};

export const uploadPan = async (formData) => {
  const response = await apiClient.post('/api/rider/pan', formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const personalInfo = async (payload) => {
  const response = await apiClient.post('/api/rider/personal-info', payload);
  return response;
};

export const riderType = async (payload) => {
  await apiClient.post('/api/rider/company/rider/type', payload);
};

export const getCities = async () => {
  const response = await apiClient.get('/api/rider/location/cities');
  return response;
};

export const vehicleSelection = async (payload) => {
  const response = await apiClient.post('/api/rider/vehicle', payload);
  return response;
};