// import axios from 'axios';
// import WEBSITE_URL from '../utils/host';
// import { tokenService } from './TokenService';

// let isRefreshing = false;
// let queue = [];

// // ✅ Safe queue processor
// const processQueue = (token, error = null) => {
//   queue.forEach(promise => {
//     if (error) promise.reject(error);
//     else promise.resolve(token);
//   });
//   queue = [];
// };

// const apiClient = axios.create({
//   baseURL: WEBSITE_URL,
//   timeout: 15000,
// });

// // ================= REQUEST =================
// apiClient.interceptors.request.use(async config => {
//   if (config.skipAuth) return config;

//   const { accessToken } = await tokenService.get();

//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }

//   return config;
// });

// // ================= RESPONSE =================
// apiClient.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.skipAuth
//     ) {
//       originalRequest._retry = true;

//       // 🛑 Already refreshing → queue
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           queue.push({
//             resolve: token => {
//               originalRequest.headers.Authorization = `Bearer ${token}`;
//               resolve(apiClient(originalRequest));
//             },
//             reject,
//           });
//         });
//       }

//       isRefreshing = true;

//       try {
//         const { refreshToken } = await tokenService.get();

//         if (!refreshToken) {
//           throw new Error('No refresh token');
//         }

//         // ✅ USE SAME INSTANCE
//         const res = await apiClient.post(
//           '/api/mobile/refresh-token',
//           { refreshToken },
//           { skipAuth: true },
//         );

//         const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
//           res.data.data;

//         await tokenService.set({
//           accessToken: newAccessToken,
//           refreshToken: newRefreshToken,
//         });

//         processQueue(newAccessToken);

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return apiClient(originalRequest);
//       } catch (err) {
//         processQueue(null, err);

//         const { authEvents, AUTH_EVENTS } = require('./AuthEvents');

//         // 1️⃣ NETWORK ERROR → LOGOUT
//         if (err.request && !err.response) {
//           authEvents.emit(AUTH_EVENTS.FORCE_LOGOUT);
//           return Promise.reject(err);
//         }

//         // 2️⃣ REFRESH TOKEN INVALID → LOGOUT
//         const isRefreshCall = err.config?.url?.includes('refresh-token');

//         if (
//           isRefreshCall &&
//           (err.response?.status === 401 || err.response?.status === 403)
//         ) {
//           authEvents.emit(AUTH_EVENTS.FORCE_LOGOUT);
//         }

//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   },
// );

// export default apiClient;
import axios from 'axios';
import WEBSITE_URL from '../utils/host';
import { tokenService } from './TokenService';
import { authEvents, AUTH_EVENTS } from './AuthEvents';

let isRefreshing = false;
let queue = [];

// process queued requests
const processQueue = (token, error = null) => {
  queue.forEach(promise => {
    if (error) promise.reject(error);
    else promise.resolve(token);
  });
  queue = [];
};

const apiClient = axios.create({
  baseURL: WEBSITE_URL,
  timeout: 15000,
});

// ================= REQUEST =================
apiClient.interceptors.request.use(async config => {
  if (config.skipAuth) return config;

  const { accessToken } = await tokenService.get();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// ================= RESPONSE =================
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

      // ⏳ Refresh already running → queue
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

        if (!refreshToken) {
          throw new Error('NO_REFRESH_TOKEN');
        }

        const res = await apiClient.post(
          '/api/mobile/refresh-token',
          { refreshToken },
          { skipAuth: true },
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          res.data.data;

        await tokenService.set({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });

        processQueue(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(null, err);

        // 🌐 NETWORK ERROR → LOGOUT
        if (err.request && !err.response) {
          authEvents.emit(AUTH_EVENTS.FORCE_LOGOUT);
        }

        // 🔐 REFRESH TOKEN INVALID → LOGOUT
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

export default apiClient;

import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const EarningsClient = fetchBaseQuery({
  baseUrl: WEBSITE_URL,
});
