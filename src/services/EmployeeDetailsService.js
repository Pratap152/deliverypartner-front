import apiClient from '../services/ApiClient';

export const uploadEmployeeDetails = async payload => {
  const response = await apiClient.post('/api/rider/company/rider/employee', payload);
  return response.data;
};