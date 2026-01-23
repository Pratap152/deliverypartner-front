// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { Provider } from 'react-redux';
// import AppNavigator from './src/navigation/AppNavigator';
// import { store } from './src/redux/store';
// import { AuthProvider } from './src/hooks/useAuth';
// import { navigationRef } from './src/navigation/RootNavigation';
// import { GPSProvider, useGPS } from './src/context/GPSContext';
// import EnableGPSModal from './src/components/map/GPSModal';



// const GlobalGPSPopup = () => {
//   const { showPopup, requestGPS, hidePopup } = useGPS();

//   return (
//     <EnableGPSModal
//       visible={showPopup}
//       onAllow={requestGPS}
//       onDeny={hidePopup}
//     />
//   );
// };


// const App = () => {
//   return (
//     <GPSProvider>
//        <Provider store={store}>
//       <AuthProvider>
//         <NavigationContainer ref={navigationRef}>
//           <AppNavigator />
//           <GlobalGPSPopup /> {/* 🔥 Overlay entire app */}
//         </NavigationContainer>
//       </AuthProvider>
//     </Provider>
//     </GPSProvider>
   
//   );
// };

// export default App;

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from './src/navigation/RootNavigation';
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { AuthProvider } from "./src/hooks/useAuth";
import { GPSProvider } from "./src/context/GPSContext";
import { RiderProvider } from "./src/context/RiderContext";
import AppNavigator from "./src/navigation/AppNavigator";

const App = () => {
  return (
    <GPSProvider>
      <Provider store={store}>
        <AuthProvider>
          <NavigationContainer ref={navigationRef}>
            <RiderProvider>
              <AppNavigator />
            </RiderProvider>
          </NavigationContainer>
        </AuthProvider>
      </Provider>
    </GPSProvider>
  );
};

export default App;
