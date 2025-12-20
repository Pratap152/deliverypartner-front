import { tokenService } from './TokenService';
import { sessionService } from './SessionService';
import { navigateAndReset } from '../navigation/RootNavigation';

export const logoutService = {
  async logout(reason = 'MANUAL') {
    console.log('[LOGOUT]', reason);
    await tokenService.clear();
    await sessionService.clear();
    navigateAndReset('LoginEntryScreen', { reason });
  },
};
