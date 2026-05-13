import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, G, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

const COLORS = {
  BLACK: '#000000',
  RED: '#FF0000',
  NAVY_BLUE: '#000080',
};

export const VehicleMarker = ({ size = 65 }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <Svg width={size} height={size} viewBox="0 0 50 50">
      <Defs>
        <LinearGradient id="gradVehicle" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="white" />
          <Stop offset="1" stopColor="#f0f0f0" />
        </LinearGradient>
      </Defs>
      
      {/* Container */}
      <Circle cx="25" cy="25" r="22" fill="url(#gradVehicle)" stroke={COLORS.NAVY_BLUE} strokeWidth="3" />
      <Circle cx="25" cy="25" r="19" fill={COLORS.NAVY_BLUE} fillOpacity="0.05" />

      {/* Detailed Bike/Scooter Icon */}
      <G transform="translate(10, 10) scale(1.25)">
        <Path 
          d="M19.14 12.94c-1.21 0-2.2.98-2.2 2.2 0 1.21.99 2.19 2.2 2.19s2.2-.98 2.2-2.19c0-1.22-.99-2.2-2.2-2.2zM12 11h-2v1.5c0 .28.22.5.5.5h1.5v-2zm7.14 3.09c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.5-1.1 1.1-1.1zm-8.24-5.32c-.11-.2-.31-.33-.55-.33-.33 0-.6.27-.6.6s.27.6.6.6c.24 0 .44-.13.55-.33l1.83.61c.07.02.14.03.22.03.28 0 .52-.19.58-.47.08-.32-.12-.64-.44-.72l-2.22-.74zM12 16h-1c-1.1 0-2 .9-2 2s.9 2 2 2h1c1.1 0 2-.9 2-2s-.9-2-2-2zm0 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm7.14-11c-1.21 0-2.2.98-2.2 2.2 0 1.21.99 2.19 2.2 2.19s2.2-.98 2.2-2.19c0-1.22-.99-2.2-2.2-2.2zm0 3.29c-.61 0-1.1-.49-1.1-1.1s.49-1.1 1.1-1.1 1.1.49 1.1 1.1-.49 1.1-1.1 1.1zM11 6c-1.1 0-2 .9-2 2v2h2V8l2-.67V6h-2z"
          fill={COLORS.NAVY_BLUE}
        />
        <Path 
          d="M17.5 13H15v-1h2.5v1zM15 15h2.5v-1H15v1zM11.5 13.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"
          fill={COLORS.NAVY_BLUE}
        />
      </G>
    </Svg>
  </View>
);

export const StoreMarker = ({ size = 65 }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <Svg width={size} height={size} viewBox="0 0 50 50">
      <Defs>
        <LinearGradient id="gradStore" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="white" />
          <Stop offset="1" stopColor="#fffafa" />
        </LinearGradient>
      </Defs>
      
      {/* Container */}
      <Circle cx="25" cy="25" r="22" fill="url(#gradStore)" stroke={COLORS.RED} strokeWidth="3" />
      <Circle cx="25" cy="25" r="19" fill={COLORS.RED} fillOpacity="0.05" />

      {/* Detailed Store/Shop Icon */}
      <G transform="translate(10, 10) scale(1.25)">
        <Path 
          d="M20 4H4v2h16V4zm1 10V6l-1-2H4L3 6v8c0 1.1.9 2 2 2h1v4h10v-4h1c1.1 0 2-.9 2-2v-4zm-9 4H8v-4h4v4zm5-4H7V8h10v6z" 
          fill={COLORS.RED} 
        />
        <Rect x="9" y="15" width="2" height="3" fill={COLORS.RED} />
        <Rect x="13" y="15" width="2" height="3" fill={COLORS.RED} />
      </G>
    </Svg>
  </View>
);
