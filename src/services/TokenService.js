import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

// In memory cache
let memoryAccessToken = null;
let memoryRefreshToken = null;
let hydrated = false;

async function hydrateOnce() {
  if (hydrated) return;

  const [access, refresh] = await Promise.all([
    AsyncStorage.getItem(ACCESS_KEY),
    AsyncStorage.getItem(REFRESH_KEY),
  ]);
  console.log(access);
  console.log(refresh);

  memoryAccessToken = access;
  memoryRefreshToken = refresh;
  hydrated = true;
}

export const tokenService = {
  //  ASYNC (used only at app start / refresh)
  async get() {
    if (!hydrated) {
      await hydrateOnce();
    }

    return {
      accessToken: memoryAccessToken,
      refreshToken: memoryRefreshToken,
    };
  },

  //  SYNC (used inside interceptors)
  getSync() {
    return {
      accessToken: memoryAccessToken,
      refreshToken: memoryRefreshToken,
    };
  },

 async set({ accessToken, refreshToken }) {
  memoryAccessToken = accessToken;
  memoryRefreshToken = refreshToken;
  hydrated = true;

  await AsyncStorage.setItem(ACCESS_KEY, accessToken);
  await AsyncStorage.setItem(REFRESH_KEY, refreshToken);

//   console.log(
//     "VERIFY STORAGE",
//     await AsyncStorage.getItem(ACCESS_KEY),
//     await AsyncStorage.getItem(REFRESH_KEY)
//   );
  },

  async clear() {
    memoryAccessToken = null;
    memoryRefreshToken = null;
    hydrated = true;

    await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY]);
  },
};
