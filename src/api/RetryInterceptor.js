// import axios from 'axios';
// import { SessionService } from '../services/SessionService';
// import { RetryQueue } from '../services/RetryQueue';
// import { logoutService } from '../services/LogoutService';
// import { WEBSITE_URL } from '../config/constants';
// import { tokenService } from '../services/TokenService';

// let isRefreshing = false;

// export const attachRetryInterceptor = api => {
//   api.interceptors.response.use(
//     res => res,
//     async error => {
//       const originalRequest = error.config;

//       if (error.response?.status !== 401 || originalRequest._retry) {
//         return Promise.reject(error);
//       }

//       originalRequest._retry = true;

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           RetryQueue.add({
//             resolve: accessToken => {
//               originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//               resolve(api(originalRequest));
//             },
//             reject,
//           });
//         });
//       }

//       isRefreshing = true;

//       try {
//         const refreshToken = await tokenService.getRefreshToken();

//         const response = await axios.post(
//           `${WEBSITE_URL}/api/mobile/refresh-token`,
//           { refreshToken }
//         );

//         const { accessToken, refreshToken: newRefresh } = response.data;

//         await tokenService.set({
//           accessToken,
//           refreshToken: newRefresh,
//         });

//         RetryQueue.resolve(accessToken);
//         originalRequest.headers.Authorization = `Bearer ${accessToken}`;

//         return api(originalRequest);
//       } catch (err) {
//         RetryQueue.reject(err);
//         await logoutService.forceLogout();
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }
//   );
// };
import { refreshToken } from './RefreshManager';
import { tokenService } from '../services/TokenService';
import { logoutService } from '../services/LogoutService';

export const attachRetryInterceptor = api => {
  api.interceptors.response.use(
    res => res,
    async error => {
      const original = error.config;

      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;

        try {
          const newToken = await refreshToken();
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        } catch {
          await logoutService.forceLogout();
        }
      }

      return Promise.reject(error);
    }
  );
};
