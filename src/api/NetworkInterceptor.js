// src/api/NetworkInterceptor.js
import { sessionService } from '../services/SessionService';
import { logoutService } from '../services/LogoutService';
import axios from 'axios';
import { tokenService } from '../services/TokenService';

let isRefreshing = false;
let queue = [];

export const attachNetworkInterceptor = api => {
  api.interceptors.request.use(async config => {
    const token = await tokenService.getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    res => res,
    async error => {
      const original = error.config;

      if (error.response?.status !== 401 || original._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(resolve => queue.push(resolve)).then(token => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await tokenService.getRefreshToken();

        const { data } = await axios.post(
          `${WEBSITE_URL}/api/mobile/refresh-token`,
          { refreshToken }
        );

        await tokenService.saveTokens(data);

        queue.forEach(cb => cb(data.accessToken));
        queue = [];

        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (e) {
        await logoutService.forceLogout();
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
  );
};
