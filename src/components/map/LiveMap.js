// // import React, { useImperativeHandle, useRef, forwardRef } from "react";
// // import MapView from "react-native-maps";
// // import RiderMarker from "./RiderMarker";
// // import SourceMarker from "./SourceMarker";
// // import DestinationMarker from "./DestinationMarker";
// // import RoutePolyline from "./RoutePolyline";
// // import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
// // import { Platform } from "react-native";

// // const SOURCE = { latitude: 19.0896, longitude: 72.8656 };
// // const DEST = { latitude: 19.1015, longitude: 72.8743 };


// // const LiveMap = ({ riderRef }) => {
// //   return (
// //     <MapView
// //        style={{ flex: 1 }}
// //       initialRegion={{
// //         latitude: SOURCE.latitude,
// //         longitude: SOURCE.longitude,
// //         latitudeDelta: 0.05,
// //         longitudeDelta: 0.05,
// //       }}
// //     >
// //       <SourceMarker coordinate={SOURCE} />
// //       <DestinationMarker coordinate={DEST} />
// //       <RoutePolyline source={SOURCE} destination={DEST} />
// //       <RiderMarker ref={riderRef} />

// //     </MapView>
// //   );
// // };

// // export default LiveMap;
// import React from 'react';
// import MapView from 'react-native-maps';
// import RiderMarker from './RiderMarker';
// import SourceMarker from './SourceMarker';
// import DestinationMarker from './DestinationMarker';
// import RoutePolyline from './RoutePolyline';

// const SOURCE = { latitude: 19.0896, longitude: 72.8656 };
// const DEST = { latitude: 19.1015, longitude: 72.8743 };

// const LiveMap = () => {
//   return (
//     <MapView
//       style={{ flex: 1 }}
//       initialRegion={{
//         latitude: SOURCE.latitude,
//         longitude: SOURCE.longitude,
//         latitudeDelta: 0.05,
//         longitudeDelta: 0.05,
//       }}
//     >
//       <SourceMarker coordinate={SOURCE} />
//       <DestinationMarker coordinate={DEST} />
//       <RoutePolyline source={SOURCE} destination={DEST} />
//       <RiderMarker />
//     </MapView>
//   );
// };

// export default LiveMap;
// import React from 'react';
// import MapView, { Marker, Polyline } from 'react-native-maps';

// const LiveMap = ({
//   mapRef,
//   riderPosition,
//   heading,
//   pickup,
//   drop,
//   route,
// }) => {
//   return (
//     <MapView ref={mapRef} style={{ flex: 1 }}>

//       {/* ✅ SAFE POLYLINE */}
//       {Array.isArray(route) && route.length > 1 && (
//   <Polyline
//     coordinates={route}
//     strokeColor="#1E90FF"
//     strokeWidth={5}
//   />
// )}

//       <Marker coordinate={pickup} />
//       <Marker coordinate={drop} />

//       <Marker.Animated
//         coordinate={riderPosition}
//         rotation={heading}
//         flat
//       />
//     </MapView>
//   );
// };

// export default React.memo(LiveMap);
// ----------------------------------------------------------------------
import React, { useImperativeHandle, forwardRef, useRef } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_API_KEY } from '../../config/env';

const isValidCoord = coord =>
  coord &&
  typeof coord.latitude === 'number' &&
  typeof coord.longitude === 'number';

const LiveMap = forwardRef(({
  riderPosition,
  heading = 0,
  pickup,
  drop,
  // route is now handled by MapViewDirections, but we can keep it if we want to show a fallback
}, ref) => {
  const mapRef = useRef(null);

  useImperativeHandle(ref, () => ({
    fitToCoordinates: (coords) => {
      mapRef.current?.fitToCoordinates(coords, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    },
    getCamera: async () => {
      return await mapRef.current?.getCamera();
    },
    animateCamera: (camera) => {
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  }));

  const origin = riderPosition || pickup;
  const destination = drop || pickup;

  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      initialRegion={
        isValidCoord(pickup)
          ? {
            latitude: pickup.latitude,
            longitude: pickup.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }
          : undefined
      }
    >

      {/* Real Directions */}
      {isValidCoord(riderPosition) && (isValidCoord(pickup) || isValidCoord(drop)) && (
        <MapViewDirections
          origin={riderPosition}
          destination={pickup || drop}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={4}
          strokeColor="#1E90FF"
          optimizeWaypoints={true}
        />
      )}

      {/* ✅ SAFE PICKUP */}
      {isValidCoord(pickup) && (
        <Marker coordinate={pickup} title="Pickup" pinColor="orange" />
      )}

      {/* ✅ SAFE DROP */}
      {isValidCoord(drop) && (
        <Marker coordinate={drop} title="Drop" pinColor="red" />
      )}

      {/* ✅ SAFE RIDER MARKER */}
      {riderPosition && (
        <Marker.Animated
          coordinate={riderPosition}
          rotation={heading}
          flat
          anchor={{ x: 0.5, y: 0.5 }}
        >
          {/* Use the custom image or Icon inside if needed, mimicking RiderMarker */}
          {/* For now, let's just use the default marker or import RiderMarker content if we want that specific motorbike icon */}
        </Marker.Animated>
      )}
    </MapView>
  );
});

export default React.memo(LiveMap);
