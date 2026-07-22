import apiClient from  '../../services/ApiClient';

export const fetchSlotHistory = (weekNumber) => {
  return apiClient.get('/api/rider/slots/history', {
    params: { weekNumber },
  });
};
