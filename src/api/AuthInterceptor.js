import { logoutService } from '../services/LogoutService';
import { sessionService } from '../services/SessionService';

export const attachAuthInterceptor = api => {
  api.interceptors.response.use(
    r => r,
    async error => {
      const code = error.response?.data?.errorCode;

      if (code === 'DEVICE_CHANGED') {
        logoutService.logout('DEVICE_CHANGED');
      }

      const serverVersion = error.response?.data?.sessionVersion;
      const localVersion = await sessionService.getVersion();

      if (serverVersion && serverVersion !== localVersion) {
        logoutService.logout('SESSION_MISMATCH');
      }

      return Promise.reject(error);
    }
  );
};
