import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'API_RETRY_QUEUE';

export const retryQueue = {
  async add(job) {
    const q = JSON.parse(await AsyncStorage.getItem(KEY)) || [];
    q.push(job);
    await AsyncStorage.setItem(KEY, JSON.stringify(q));
  },

  async process(handler) {
    const q = JSON.parse(await AsyncStorage.getItem(KEY)) || [];
    const remaining = [];

    for (const job of q) {
      try {
        await handler(job);
      } catch {
        remaining.push(job);
      }
    }

    await AsyncStorage.setItem(KEY, JSON.stringify(remaining));
  },
};
