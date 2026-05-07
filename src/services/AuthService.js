import { tokenService } from './TokenService';
import { navigateAndReset } from '../navigation/RootNavigation';

class AuthService {
  async logout() {
    await tokenService.clear();
    navigateAndReset('OnBoardingScreen'); 
  }

  async forceLogout() {
    await tokenService.clear();
    navigateAndReset('OnBoardingScreen'); 
  }
}
export const authService = new AuthService();
