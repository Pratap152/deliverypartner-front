// // api/AuthInterceptor.js
// import { tokenService } from '../services/TokenService';
// import { refreshTokenIfNeeded } from './RefreshManager';

// export const attachAuthInterceptor = api => {
//   api.interceptors.request.use(async config => {
//     const accessToken = await tokenService.getAccessToken();
//     const expiry = await tokenService.getExpiry();

//     if (!accessToken) return config;

//     if (tokenService.willExpireSoon(expiry.accessExpiry)) {
//       const newToken = await refreshTokenIfNeeded();
//       config.headers.Authorization = `Bearer ${newToken}`;
//     } else {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }

//     return config;
//   });
// };
import { tokenService } from '../services/TokenService';

export const attachAuthInterceptor = api => {
  api.interceptors.request.use(async config => {
    const token = await tokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};
