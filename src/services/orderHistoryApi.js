import axios from 'axios';
import { tokenService } from '../services/TokenService';
import WEBSITE_URL from '../utils/host';

export const getOrderHistory = async ({
  filter = 'weekly',
  page = 1,
  limit = 10,
}) => {
  try {
    const token = await tokenService.getAccessToken();
    if (!token) {
      Alert.alert('Auth Error', 'Token not found. Please login again.');
      return;
    }

    const response = await axios.get(
      `${WEBSITE_URL}/api/profile/orders/history`,
      {
        params: { filter, page, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log('Order History API Error:', error);
    throw error;
  }
};
