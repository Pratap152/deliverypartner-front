import apiClient from '../ApiClient';

export const getWalletDetails = async () => {
  const response = await apiClient.get('/api/rider/get/wallet');
  return response.data;
};