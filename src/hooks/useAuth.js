// import { createContext, useContext, useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [authToken, setAuthToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Load token on app start
//   useEffect(() => {
//     const loadToken = async () => {
//       try {
//         const token = await AsyncStorage.getItem("authToken");
//         if (token) setAuthToken(token);
//       } catch (e) {
//         console.log("Error loading token:", e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadToken();
//   }, []);

//   // Save token whenever it changes
//   useEffect(() => {
//     const saveToken = async () => {
//       if (authToken) {
//         await AsyncStorage.setItem("authToken", authToken);
//       } else {
//         await AsyncStorage.removeItem("authToken");
//       }
//     };

//     saveToken();
//   }, [authToken]);

//   const logout = async () => {
//     setAuthToken(null);
//     await AsyncStorage.removeItem("authToken");
//   };

//   return (
//     <AuthContext.Provider value={{ authToken, setAuthToken, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// src/hooks/useAuth.js
// import { createContext, useContext, useEffect, useState } from 'react';
// import { tokenService } from '../services/TokenService';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [authToken, setAuthToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Load token on app start
//   useEffect(() => {
//     const bootstrap = async () => {
//       const tokens = await tokenService.get();
//       setAuthToken(tokens?.accessToken || null);
//       setLoading(false);
//     };
//     bootstrap();
//   }, []);

//   const login = async (tokenPayload) => {
//     await tokenService.set(tokenPayload);
//     setAuthToken(tokenPayload.accessToken);
//   };

//   const logout = async () => {
//     await tokenService.clear();
//     setAuthToken(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         authToken,
//         loading,
//         login,
//         logout,
//         isAuthenticated: !!authToken,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);

  const logout = async () => {
    setAuthToken(null);
  };

  const login = async (tokenPayload) => {
    setAuthToken(tokenPayload);
  };

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, login,logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
