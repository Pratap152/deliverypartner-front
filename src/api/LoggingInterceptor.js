

export const attachLoggingInterceptor = api => {
  if (!__DEV__) return;

  api.interceptors.request.use(config => {
    console.log('[API REQUEST]', config.url, config.data);
    return config;
  });

  api.interceptors.response.use(
    response => {
      console.log('[API RESPONSE]', response.config.url, response.status);
      return response;
    },
    error => {
      console.log('[API ERROR]', error?.response?.status);
      return Promise.reject(error);
    }
  );
};
