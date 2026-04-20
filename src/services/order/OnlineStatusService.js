// services/userService.js
import apiClient from '../ApiClient';

export const getRiderOnlineStatus = async () => {
  try {
    const response = await apiClient.get('/api/status/online-status');
    return response.data;
  } catch (error) {
    throw error?.response?.data || error.message;
  }
};