import apiClient from './ApiClient';

export const saveBankDetails = async (payload) => {
  const response = await apiClient.post("/api/rider/bank/bank-details", payload);
  return response.data;
};