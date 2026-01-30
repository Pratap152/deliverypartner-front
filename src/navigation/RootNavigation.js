import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export const navigate = (route,params )=> {
  if (navigationRef.isReady()) {
    navigationRef.navigate(route,params)
  };
};
export function navigateAndReset(routeName) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: routeName }],
    });
  }
}