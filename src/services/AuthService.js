import { tokenService } from './TokenService';
import { navigateAndReset } from '../navigation/RootNavigation';

class AuthService {
  async logout() {
    await tokenService.clear();
    navigateAndReset('OnBoardingScreen'); // ✅ correct screen
  }

  async forceLogout() {
    await tokenService.clear();
    navigateAndReset('OnBoardingScreen'); // ✅ correct screen
  }
}
export const authService = new AuthService();
