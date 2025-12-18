// import AsyncStorage from '@react-native-async-storage/async-storage';

// const KEY = 'APP_SESSION';

// export const sessionService = {
//   async set(data) {
//     await AsyncStorage.setItem(KEY, JSON.stringify(data));
//   },

//   async get() {
//     const raw = await AsyncStorage.getItem(KEY);
//     return raw ? JSON.parse(raw) : null;
//   },

//   async clear() {
//     await AsyncStorage.removeItem(KEY);
//   },

//   async getVersion() {
//     const session = await this.get();
//     return session?.version;
//   },
// };

import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'SESSION';

export const sessionService = {
  async set(data) {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(data));
  },

  async get() {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  async clear() {
    await AsyncStorage.removeItem(SESSION_KEY);
  },
};
