// import axios from 'axios';
// import WEBSITE_URL from '../utils/host';
// import { tokenService } from '../services/TokenService';

// let refreshing = false;
// let subscribers = [];

// const notifySubscribers = token => {
//   subscribers.forEach(cb => cb(token));
//   subscribers = [];
// };

// const subscribe = cb => {
//   subscribers.push(cb);
// };

// export const refreshTokenIfNeeded = async () => {
//   const { accessToken, refreshToken, accessExpiry } = await tokenService.get();

//   console.log('🔄 Refresh check:', {
//     hasAccess: !!accessToken,
//     hasRefresh: !!refreshToken,
//     accessExpiry,
//   });

//   // ✅ If no refresh token, just continue with current access token
//   if (!refreshToken) {
//     return accessToken;
//   }

//   // ✅ If access token is still valid → DO NOTHING
//   if (accessExpiry && !tokenService.willExpireSoon(accessExpiry)) {
//     return accessToken;
//   }

//   // ⏳ If already refreshing, wait
//   if (refreshing) {
//     return new Promise(resolve => subscribe(resolve));
//   }

//   refreshing = true;

//   try {
//     console.log('🔁 Refreshing token…');

//     const res = await axios.post(`${WEBSITE_URL}/api/mobile/refresh-token`, {
//       refreshToken,
//     });

//     const {
//       accessToken: newAccessToken,
//       refreshToken: newRefreshToken,
//       accessExpiry: newAccessExpiry,
//       refreshExpiry: newRefreshExpiry,
//     } = res.data;

//     await tokenService.set({
//       accessToken: newAccessToken,
//       refreshToken: newRefreshToken || refreshToken,
//       accessExpiry: newAccessExpiry,
//       refreshExpiry: newRefreshExpiry,
//     });

//     notifySubscribers(newAccessToken);
//     return newAccessToken;
//   } catch (err) {
//     console.log('⚠️ Refresh failed, keeping existing session');

//     // ❌ DO NOT CLEAR TOKENS HERE
//     notifySubscribers(accessToken);
//     return accessToken;
//   } finally {
//     refreshing = false;
//   }
// };
import axios from 'axios';
import WEBSITE_URL from '../utils/host';
import { tokenService } from '../services/TokenService';

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
        processQueue(null);
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
