import AsyncStorage from "@react-native-async-storage/async-storage";

const memoryCache = new Map();

export const EarningsCache = {
  async get(key) {
    if (memoryCache.has(key)) return memoryCache.get(key);

    const raw = await AsyncStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      memoryCache.set(key, parsed);
      return parsed;
    }
    return null;
  },

  async set(key, value) {
    memoryCache.set(key, value);
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
};
