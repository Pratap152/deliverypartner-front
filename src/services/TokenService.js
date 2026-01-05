// services/TokenService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

const REFRESH_KEY = 'REFRESH_TOKEN';
const META_KEY = 'TOKEN_META';

export const tokenService = {
  async set({ accessToken, refreshToken, accessExpiry, refreshExpiry }) {
    console.log("Storing tokens:", { accessToken, refreshToken});
    await Keychain.setGenericPassword('access', accessToken);
    await AsyncStorage.setItem(REFRESH_KEY, refreshToken);
    await AsyncStorage.setItem(
      META_KEY,
      JSON.stringify({ accessExpiry, refreshExpiry })
    );
  },



  // ✅ ADD THIS METHOD
  async get() {
    const creds = await Keychain.getGenericPassword();
    const refreshToken = await AsyncStorage.getItem(REFRESH_KEY);
    const metaRaw = await AsyncStorage.getItem(META_KEY);

    const meta = metaRaw ? JSON.parse(metaRaw) : null;
    

    return {
      accessToken: creds ? creds.password : null,
      refreshToken,
      accessExpiry: meta?.accessExpiry ?? null,
      refreshExpiry: meta?.refreshExpiry ?? null,
    };
  },

  async getAccessToken() {
    const creds = await Keychain.getGenericPassword();
    return creds ? creds.password : null;
  },

  async getRefreshToken() {
    return AsyncStorage.getItem(REFRESH_KEY);
  },

  async getExpiry() {
    const raw = await AsyncStorage.getItem(META_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  async clear() {
    await Keychain.resetGenericPassword();
    await AsyncStorage.multiRemove([REFRESH_KEY, META_KEY]);
  },

  isExpired(expiry) {
    return !expiry || Date.now() >= expiry;
  },

  willExpireSoon(expiry, buffer = 2 * 60 * 1000) {
    return expiry && expiry - Date.now() <= buffer;
  },
};
