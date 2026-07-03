import apiClient from './ApiClient';

export const getLegalDocuments = async () => {
  const response = await apiClient.get('/api/rider/all/policies');
  return response.data;
};