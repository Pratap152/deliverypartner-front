import apiClient from './ApiClient';

export const uploadMultipart = async (url, formData) => {
  return apiClient.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });
};
