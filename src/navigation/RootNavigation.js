import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export const navigate = (route, params) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(route, params);
  }
};

export const navigateAndReset = (routeName, params) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName, params }],
      })
    );
  }
};
