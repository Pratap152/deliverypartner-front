import { tokenService } from './TokenService';
import { navigateAndReset } from '../navigation/RootNavigation';
import {gpsService} from '../services/gps/GpsService';

class AuthService {
  async logout() {
    await gpsService.stopTracking();
    await tokenService.clear();

    navigateAndReset('OnBoardingScreen');
  }

  async forceLogout() {
    await gpsService.stopTracking();
    await tokenService.clear();

    navigateAndReset('OnBoardingScreen');
  }
}

export const authService = new AuthService();