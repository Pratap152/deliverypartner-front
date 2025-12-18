// import axios from 'axios';
// import WEBSITE_URL from '../utils/host';
// import { tokenService } from '../services/TokenService';
// import { logoutService } from '../services/LogoutService';

// let refreshing = null;

// export const refreshTokenIfNeeded = async (force = false) => {
//   if (refreshing && !force) return refreshing;

//   refreshing = (async () => {
//     try {
//       const tokens = await tokenService.get();
//       if (!tokens?.refreshToken) throw 'NO_REFRESH';

//       console.log('[AUTH] Refreshing token');

//       const res = await axios.post(`${WEBSITE_URL}/api/mobile/refresh-token`, {
//         refreshToken: tokens.refreshToken,
//       });

//       const newTokens = {
//         accessToken: res.data.accessToken,
//         refreshToken: res.data.refreshToken,
//         expiry: Date.now() + res.data.expiresIn * 1000,
//       };

//       await tokenService.set(newTokens);
//       console.log('[AUTH] Token refreshed');
//       return newTokens.accessToken;
//     } catch (e) {
//       console.log('[AUTH] Refresh failed');
//       logoutService.logout('REFRESH_FAILED');
//       throw e;
//     } finally {
//       refreshing = null;
//     }
//   })();

//   return refreshing;
// };

import WEBSITE_URL from '../utils/host';
import { tokenService } from '../services/TokenService';

let refreshPromise = null;

export const refreshTokenIfNeeded = async (force = false) => {
  if (refreshPromise && !force) return refreshPromise;

  refreshPromise = (async () => {
    const tokens = await tokenService.get();
    if (!tokens?.refreshToken) throw new Error('No refresh token');

    console.log('🔄 Refreshing token...');

    const res = await fetch(`${WEBSITE_URL}/api/mobile/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    });

    if (!res.ok) {
      await tokenService.clear();
      throw new Error('Refresh failed');
    }

    const data = await res.json();

    await tokenService.set({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
    });

    console.log('✅ Token refreshed');
    return data.accessToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
};
