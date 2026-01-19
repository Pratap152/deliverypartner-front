import apiClient from '../../services/ApiClient';

/**
 * Peak hour incentives (ACTIVE only)
 */
export const getPeakHourIncentives = async () => {
  const response = await apiClient.get('/api/home/peakhours-incentives');
  return response.data;
};

/**
 * Daily incentive earnings
 */
export const getDailyIncentives = async () => {
  const response = await apiClient.get('/api/home/incentives/daily-earning');
  return response.data;
};

/**
 * Weekly incentive earnings
 */
export const getWeeklyIncentives = async () => {
  const response = await apiClient.get('/api/home/incentives/weekly-earning');
  return response.data;
};
