import apiClient from  '../../api/ApiClient';

export const fetchSlotHistory = (weekNumber) => {
  return apiClient.get('/api/slots/history', {
    params: { weekNumber },
  });
};
