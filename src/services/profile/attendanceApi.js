import apiClient from '../../services/ApiClient';

/**
 * Attendance Dashboard
 */
export const getAttendanceDashboard = (month, year) => {
  return apiClient.get('/api/rider/attendance', {
    params: {
      month,
      year,
    },
  });
};

/**
 * Attendance Details by Date
 */
export const getAttendanceDetails = date => {
  return apiClient.get('/api/rider/attendance/details', {
    params: {
      date,
    },
  });
};

/**
 * Monthly Summary
 */
export const getMonthlySummary = (month, year) => {
  return apiClient.get('/api/rider/attendance/monthly-summary', {
    params: {
      month,
      year,
    },
  });
};

/**
 * Attendance Rules
 */
export const getAttendanceRules = () => {
  return apiClient.get('/api/rider/attendance/rules');
};