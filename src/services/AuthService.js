import { tokenService } from './TokenService';
import { navigateAndReset } from '../navigation/RootNavigation';
import { gpsService } from '../services/gps/GpsService';
import { logoutService } from '../services/LogoutService';

class AuthService {
  async logout() {
    try {
      await logoutService();
    } catch (e) {
      console.log('Logout API failed:', e.response?.data || e.message);
    } finally {
      await gpsService.stopTracking();
      // await tokenService.clear();
      navigateAndReset('OnBoardingScreen');
    }
  }

  async forceLogout() {
    await gpsService.stopTracking();
    await tokenService.clear();
    navigateAndReset('OnBoardingScreen');
  }
}

export const authService = new AuthService();