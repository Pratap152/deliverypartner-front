import { tokenService } from '../services/TokenService';
import { navigateAndReset } from '../navigation/RootNavigation';

export const ForceLogout = async (reason = 'Session expired') => {
  await tokenService.clear();
  navigateAndReset('LoginEntryScreen', { reason });
};
