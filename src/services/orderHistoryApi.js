import apiClient from './ApiClient';

const ORDER_FILTER_MAP = {
  all: undefined,
  today: 'daily',
  week: 'weekly',
  month: 'monthly',
};

export const getOrderHistory = async ({
  filter = 'all',
  page = 1,
  limit = 10,
}) => {
  try {
    const normalizedFilter = filter?.toLowerCase();
    const response = await apiClient.get('/api/rider/orders/history', {
      params: {
        filter: ORDER_FILTER_MAP[normalizedFilter],
        page,
        limit,
      },
    });

    return response.data;
  } catch (error) {
    console.log(
      'Order History API Error:',
      error?.response?.data || error.message,
    );
    throw error;
  }
};
