import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export const navigate = (route,params )=> {
  if (navigationRef.isReady()) {
    navigationRef.navigate(route,params)
  };
};
