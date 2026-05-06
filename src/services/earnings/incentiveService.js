import apiClient from '../../services/ApiClient';

/**
 * Peak hour incentives (ACTIVE only)
 */
export const getPeakHourIncentives = async () => {
  const response = await apiClient.get('/rider/peak-slot-programs');
  return response.data;
};

/**
 * Daily incentive earnings
 */
export const getDailyIncentives = async () => {
  const response = await apiClient.get('/api/rider/programs/daily');
  return response.data;
};

/**
 * Weekly incentive earnings
 */
export const getWeeklyIncentives = async () => {
  const response = await apiClient.get('/api/rider/programs/weekly');
  return response.data;
};

export const getWeeklyIncentivesProgress = async () => {
  try {
    const response = await apiClient.get('/api/rider/programs/weekly/progress');
    return response.data;
  } catch (error) {
    throw error?.response?.data || error.message;
  }
};

export const getDailyIncentivesProgress = async () => {
  try {
    const response = await apiClient.get('/api/rider/program/daily/progress');
    return response.data;
  } catch (error) {
    throw error?.response?.data || error.message;
  }
};

export const getPeakIncentivesProgress = async () => {
  try {
    const response = await apiClient.get('/rider/peak-progress');
    return response.data;
  } catch (error) {
    throw error?.response?.data || error.message;
  }
};
