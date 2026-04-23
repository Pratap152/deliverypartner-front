import apiClient from '../../services/ApiClient';

/**
 * Peak hour incentives (ACTIVE only)
 */
export const getPeakHourIncentives = async () => {
  const response = await apiClient.get('/api/rider/incentives/peak');
  return response.data;
};

/**
 * Daily incentive earnings
 */
export const getDailyIncentives = async () => {
  const response = await apiClient.get('/api/rider/incentives/daily');
  return response.data;
};

/**
 * Weekly incentive earnings
 */
export const getWeeklyIncentives = async () => {
  const response = await apiClient.get('/api/rider/incentives/weekly');
  return response.data;
};
