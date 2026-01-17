import apiClient from '../../api/ApiClient';

/**
 * Get rider wallet details
 */
export const getWalletDetails = async () => {
  const response = await apiClient.get('/api/profile/wallet');
  return response.data;
};
