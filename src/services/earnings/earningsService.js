import apiClient from '../../services/ApiClient';

/**
 * Dashboard summary (today, week, month)
 */
export const getEarningsSummary = async () => {
  const response = await apiClient.get('/api/rider/earnings/new/summary');
  return response.data;
};

export const getWeeklyBarChart = async () => {
  const response = await apiClient.get('/api/rider/earnings/new/weekly-chart');
  return response.data;
};






