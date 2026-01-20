import apiClient from '../../services/ApiClient';

/**
 * Dashboard summary (today, week, month)
 */
export const getEarningsSummary = async () => {
  const response = await apiClient.get('/api/earnings/summary');
  return response.data;
};





