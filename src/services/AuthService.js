import { tokenService } from './TokenService';
import { navigateAndReset } from '../navigation/RootNavigation';
import { store, persistor } from '../redux/store';
import { clearKitCompleted } from '../redux/slices/kitSlice';

class AuthService {
  async logout() {
    await tokenService.clear();

    store.dispatch(clearKitCompleted());
    await persistor.purge();

    navigateAndReset('OnBoardingScreen');
  }

  async forceLogout() {
    await tokenService.clear();

    store.dispatch(clearKitCompleted());
    await persistor.purge();

    navigateAndReset('OnBoardingScreen');
  }
}

export const authService = new AuthService();
