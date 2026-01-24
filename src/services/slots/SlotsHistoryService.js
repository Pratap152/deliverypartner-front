import apiClient from  '../../services/ApiClient';

export const fetchSlotHistory = (weekNumber) => {
  return apiClient.get('/api/slots/history', {
    params: { weekNumber },
  });
};
