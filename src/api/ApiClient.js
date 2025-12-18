import axios from 'axios';
import WEBSITE_URL from '../utils/host';
import { tokenService } from '../services/TokenService';
import { refreshTokenIfNeeded } from './RefreshManager';

const apiClient = axios.create({
  baseURL: WEBSITE_URL,
  timeout: 20000,
});

apiClient.interceptors.request.use(async config => {
  const tokens = await tokenService.get();
  if (!tokens?.accessToken) return config;

  if (tokenService.isExpired(tokens.expiry)) {
    console.log('⏳ Access token expired, refreshing...');
    const newToken = await refreshTokenIfNeeded();
    config.headers.Authorization = `Bearer ${newToken}`;
  } else {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  config.headers.Accept = 'application/json';
  return config;
});

apiClient.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      console.log('⚠️ 401 intercepted, trying refresh');
      original._retry = true;

      try {
        const token = await refreshTokenIfNeeded(true);
        original.headers.Authorization = `Bearer ${token}`;
        return apiClient(original);
      } catch {
        // ❌ DO NOT logout here
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  }
);

export default apiClient;
