let queue = [];

export const RetryQueue = {
  add: promiseHandlers => {
    queue.push(promiseHandlers);
  },

  resolve: token => {
    queue.forEach(p => p.resolve(token));
    queue = [];
  },

  reject: error => {
    queue.forEach(p => p.reject(error));
    queue = [];
  },

  clear: () => {
    queue = [];
  },
};
