// src/services/SessionService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'ONBOARDING_COMPLETE';
const USER_META_KEY = 'USER_META';

class SessionService {
  async setOnboardingComplete(value = true) {
    await AsyncStorage.setItem(
      ONBOARDING_KEY,
      JSON.stringify(value)
    );
  }

  async isOnboardingComplete() {
    const raw = await AsyncStorage.getItem(ONBOARDING_KEY);
    return raw ? JSON.parse(raw) : false;
  }

  async setUserMeta(meta) {
    await AsyncStorage.setItem(
      USER_META_KEY,
      JSON.stringify(meta)
    );
  }

  async getUserMeta() {
    const raw = await AsyncStorage.getItem(USER_META_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  async clear() {
    await AsyncStorage.multiRemove([
      ONBOARDING_KEY,
      USER_META_KEY,
    ]);
  }
}

export const sessionService = new SessionService();
