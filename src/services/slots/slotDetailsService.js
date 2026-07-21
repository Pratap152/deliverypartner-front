import apiClient from '../../services/ApiClient';

/**
 * Get Slot / Shift Details by Date
 * Endpoint:
 * GET /api/rider/slot-details?date=YYYY-MM-DD
 */

export const getSlotDetails = async (date) => {
  try {
    const response = await apiClient.get('/api/rider/slot-details', {
      params: {
        date,
      },
    });

    return response.data;
  } catch (error) {
    console.log('Slot Details API Error:', error?.response?.data || error);

    throw error;
  }
};