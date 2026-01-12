// import axios from 'axios';
// import WEBSITE_URL from '../utils/host';
// import { attachAuthInterceptor } from './AuthInterceptor';
// import { attachRetryInterceptor } from './RetryInterceptor';
// import { attachNetworkInterceptor } from './NetworkInterceptor';
// import { attachLoggingInterceptor } from './LoggingInterceptor';

// const apiClient = axios.create({
//   baseURL: WEBSITE_URL,
//   timeout: 30000,
// });


// attachAuthInterceptor(apiClient);
// attachRetryInterceptor(apiClient);
// attachNetworkInterceptor(apiClient);
// attachLoggingInterceptor(apiClient);

// export default apiClient;
import axios from 'axios';
import WEBSITE_URL from '../utils/host';
import { tokenService } from '../services/TokenService';
import { refreshTokenIfNeeded } from './RefreshManager';
import { navigateAndReset } from '../navigation/RootNavigation';

const apiClient = axios.create({
  baseURL: WEBSITE_URL,
  timeout: 15000,
});

/**
 * Attach access token
 */
apiClient.interceptors.request.use(async config => {
  const tokens = await tokenService.get();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  config.headers['Content-Type'] = 'application/json';
  return config;
});

/**
 * Handle INVALID_TOKEN even if backend returns 200
 */
apiClient.interceptors.response.use(
  async response => {
    const data = response?.data;

    if (data?.success === false && data?.error === 'INVALID_TOKEN') {
      try {
        await refreshTokenIfNeeded(true);

        const tokens = await tokenService.get();
        response.config.headers.Authorization =
          `Bearer ${tokens.accessToken}`;

        return apiClient(response.config);
      } catch (err) {
        await tokenService.clear();
        navigateAndReset('LoginEntryScreen');
        return Promise.reject(err);
      }
    }

    return response;
  },
  error => Promise.reject(error)
);

export default apiClient;
