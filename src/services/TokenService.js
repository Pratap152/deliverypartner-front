import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'AUTH_TOKENS';

class TokenService {
  async set({ accessToken, refreshToken, expiresIn }) {
    const expiry = Date.now() + expiresIn * 1000; // ⏱ timeout here

    const data = {
      accessToken,
      refreshToken,
      expiry,
    };

    await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(data));
  }

  async get() {
    const raw = await AsyncStorage.getItem(TOKEN_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  async clear() {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }

  isExpired(expiry) {
    if (!expiry) return true;
    return Date.now() > expiry - 30_000; // refresh 30s early
  }
}

export const tokenService = new TokenService();
