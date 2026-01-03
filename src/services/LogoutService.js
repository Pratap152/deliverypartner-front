import { tokenService } from './TokenService';
import { navigateAndReset } from '../navigation/RootNavigation';

export const logoutService = {
  async forceLogout() {
    await tokenService.clear();
    navigateAndReset('LoginEntryScreen');
  },
};
