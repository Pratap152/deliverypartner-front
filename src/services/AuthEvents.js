const listeners = new Set();

export const AUTH_EVENTS = {
  FORCE_LOGOUT: 'FORCE_LOGOUT',
};

export const authEvents = {
  subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  emit(event) {
    listeners.forEach(cb => cb(event));
  },
};
