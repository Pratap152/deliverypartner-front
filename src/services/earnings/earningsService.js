import apiClient from '../../services/ApiClient';

/**
 * Dashboard summary (today, week, month)
 */

export const getDailyEarnings = async () => {
  const response = await apiClient.get('/api/rider/earnings/new/new_daily');
  return response.data;
};

export const getEarningsSummary = async () => {
  const response = await apiClient.get('/api/rider/earnings/new/new_summary');
  return response.data;
};

export const getWeeklyBarChart = async () => {
  const response = await apiClient.get('/api/rider/earnings/new/new_weekly-chart');
  return response.data;
};







