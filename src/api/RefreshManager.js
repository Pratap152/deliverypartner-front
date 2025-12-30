import axios from 'axios';
import WEBSITE_URL from '../utils/host';
import { tokenService } from '../services/TokenService';

let refreshing = false;
let subscribers = [];

const notifySubscribers = token => {
  subscribers.forEach(cb => cb(token));
  subscribers = [];
};

const subscribe = cb => {
  subscribers.push(cb);
};

export const refreshTokenIfNeeded = async (force = false) => {
  const { accessToken, refreshToken, accessExpiry } = await tokenService.get();
  console.log("Storing tokens:", { accessToken, refreshToken});
  if (!refreshToken) throw new Error('No refresh token');

  // if (
  //   !force &&
  //   accessExpiry &&
  //   !tokenService.willExpireSoon(accessExpiry)
  // ) {
  //   return accessToken;
  // }

  if (refreshing) {
    return new Promise(resolve => subscribe(resolve));
  }

  refreshing = true;

  try {
    const res = await axios.post(`${WEBSITE_URL}/api/mobile/refresh-token`, {
      refreshToken,
    });

    const {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    } = res.data;
console.log("Storing tokens:", { newAccessToken, newRefreshToken });
    await tokenService.set({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken || refreshToken,
    });

    notifySubscribers(newAccessToken);
    return newAccessToken;
  } catch (err) {
    await tokenService.clear();
    notifySubscribers(null);
    throw err;
  } finally {
    refreshing = false;
  }
};
