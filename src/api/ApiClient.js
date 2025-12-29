import axios from 'axios';
import WEBSITE_URL from '../utils/host';
import { attachAuthInterceptor } from './AuthInterceptor';
import { attachRetryInterceptor } from './RetryInterceptor';
import { attachNetworkInterceptor } from './NetworkInterceptor';
import { attachLoggingInterceptor } from './LoggingInterceptor';

const apiClient = axios.create({
  baseURL: WEBSITE_URL,
  timeout: 30000,
});


attachAuthInterceptor(apiClient);
attachRetryInterceptor(apiClient);
attachNetworkInterceptor(apiClient);
attachLoggingInterceptor(apiClient);

export default apiClient;
