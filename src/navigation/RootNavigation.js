import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export const navigateAndReset = route => {
  if (!navigationRef.isReady()) return;

  navigationRef.reset({
    index: 0,
    routes: [{ name: route }],
  });
};
