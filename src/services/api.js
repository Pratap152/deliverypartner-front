import axios from 'axios';
import WEBSITE_URL from '../utils/host';
import { tokenService } from './TokenService';

let isRefreshing = false;
let queue = [];

const processQueue = token => {
  queue.forEach(cb => cb(token));
  queue = [];
};

const api = axios.create({
  baseURL: WEBSITE_URL,
});

api.interceptors.request.use(async config => {
  const { accessToken } = await tokenService.get();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise(resolve =>
          queue.push(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          }),
        );
      }

      isRefreshing = true;

      try {
        const { refreshToken } = await tokenService.get();

        const res = await axios.post(
          `${WEBSITE_URL}/api/mobile/refresh-token`,
          { refreshToken },
        );

        const { accessToken: newAccess, refreshToken: newRefresh } =
          res.data.data;

        await tokenService.set({
          accessToken: newAccess,
          refreshToken: newRefresh,
        });

        processQueue(newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (e) {
        await tokenService.clear();
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
