let cached = null;
let timestamp = 0;

export const getCachedSession = async (tokenService) => {
  const now = Date.now();
  if (cached && now - timestamp < 500) {
    return cached;
  }
  cached = await tokenService.get();
  timestamp = now;
  return cached;
};
 