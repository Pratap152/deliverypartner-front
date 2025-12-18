import NetInfo from '@react-native-community/netinfo';

export const waitForInternet = async () => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    console.log('[NETWORK] Offline — waiting');
    throw new Error('NO_INTERNET');
  }
};
