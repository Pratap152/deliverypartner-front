import axios from 'axios';
import WEBSITE_URL from '../utils/host';
import { tokenService } from './TokenService';
import { authEvents, AUTH_EVENTS } from './AuthEvents';
import { Platform } from 'react-native';

let isRefreshing = false;
let queue = [];

/* ================= QUEUE ================= */
const processQueue = (token, error = null) => {
  queue.forEach(promise => {
    if (error) promise.reject(error);
    else promise.resolve(token);
  });
  queue = [];
};

const apiClient = axios.create({
  baseURL: WEBSITE_URL,
  timeout: 60000,
});

/* ================= REQUEST ================= */
apiClient.interceptors.request.use(config => {
  if (config.skipAuth) return config;

  const { accessToken } = tokenService.getSync();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

/* ================= RESPONSE ================= */
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest?.skipAuth
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const { refreshToken } = await tokenService.get();
        if (!refreshToken) throw new Error('NO_REFRESH_TOKEN');

        const res = await apiClient.post(
          '/api/mobile/refresh-token',
          { refreshToken },
          { skipAuth: true },
        );

        const { accessToken, refreshToken: newRefresh } = res.data.data;

        await tokenService.set({
          accessToken,
          refreshToken: newRefresh,
        });

        processQueue(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(null, err);

        if (err.request && !err.response) {
          authEvents.emit(AUTH_EVENTS.FORCE_LOGOUT);
        }

        const isRefreshCall = err.config?.url?.includes('refresh-token');
        if (
          isRefreshCall &&
          (err.response?.status === 401 || err.response?.status === 403)
        ) {
          authEvents.emit(AUTH_EVENTS.FORCE_LOGOUT);
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

/* ===================================================== */
/* ================= FCM HELPERS (NEW) ================= */
/* ===================================================== */

/**
 * Save / update FCM token
 * Called on:
 * - login
 * - app launch
 * - token refresh
 */
export const updateFcmToken = async ({
  fcmToken,
  appVersion,
  deviceType = 'mobile',
}) => {
  if (!fcmToken) return;

  try {
    const response = await apiClient.post(
      '/api/rider/save-fcm-token',
      {
        fcmToken,
      }
    );

    console.log(
      'FCM token sync success:',
      response.data
    );
  } catch (err) {
    console.log(
      'FCM token sync failed:',
      err?.response?.data || err
    );
  }
};

/**
 * Remove FCM token (logout / uninstall safety)
 */
// export const deleteFcmToken = async token => {
//   try {
//     await apiClient.delete('/api/mobile/fcm-token', {
//       data: { token },
//     });
//   } catch (err) {
//     console.log('FCM token delete failed:', err?.response?.data || err);
//   }
// };

export default apiClient;
