import apiClient from '../services/ApiClient';

export const logoutService = async () => {
  return apiClient.delete('/api/rider/logout');
};