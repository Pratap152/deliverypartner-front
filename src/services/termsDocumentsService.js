import apiClient from './ApiClient';

export const getLegalDocuments = async () => {
  const response = await apiClient.get('/api/rider/all/policies');
  return response.data;
};

export const getAgreementStatus = async () => {
  const response = await apiClient.get('/api/rider/consent');
  return response.data;
};

export const saveAgreementStatus = async (payload) => {
  const response = await apiClient.put('/api/rider/consent', payload);
  return response;
}