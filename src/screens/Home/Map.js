<<<<<<< Updated upstream
// import React, { useEffect } from "react";
// import { View, StyleSheet } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import Geolocation from '@react-native-community/geolocation';


// Geolocation.setRNConfiguration({
//     authorizationLevel:'always',
//     enableBackgroundLocationUpdates:true,
//     locationProvider:'auto',
//     skipPermissionRequests:false
// });

// // useEffect(
// //     (Geolocation.requestAuthorization(
// //         ()=>{
// //             //success 
// //         },
// //         ()=>{
// //             //error
// //         }
// //     )),
// //     [])

// Geolocation.getCurrentPosition(({coords})=>{

//   const {latitude,longitude} =  coords  
//     console.log(latitude,longitude);
    
// },
// (error)=>{console.log(error);
// },
// {
//     maximumAge:0,
//     enableHighAccuracy:true,
// })

// const Map = () => {
//   return (
//     <View style={styles.container}>
//       <MapView
//         style={StyleSheet.absoluteFillObject}
//         zoomControlEnabled={true}
//         showsUserLocation={true}
//         initialRegion={{
//           latitude: 17.385044,
//           longitude: 78.486671,
//           latitudeDelta: 0.05,
//           longitudeDelta: 0.05,
//         }}
//       >
//         <Marker
//           coordinate={{ latitude: 15.8512, longitude:80.3840}}
//           title="User"
//           pinColor="darkblue"
//           description="Pickup location"
//         />
=======
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';


Geolocation.setRNConfiguration({
    authorizationLevel:'always',//foreground,background,quit
    enableBackgroundLocationUpdates:true,//when using toggle online/offline it must be true
    locationProvider:'auto',
    skipPermissionRequests:false
});



const Map = () => {

  const [coordinate,setCoordinate] = useState({latitude:0,longitude:0});

  Geolocation.getCurrentPosition(({coords})=>{

  const {latitude,longitude} =  coords  
  setCoordinate({latitude:latitude,longitude:longitude})
    
},
(error)=>{console.log(error);
},
{
    maximumAge:0,
    enableHighAccuracy:true,
})
  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        zoomControlEnabled={true}
        showsUserLocation={true}
      >
        {/* <Marker
          coordinate={{ latitude: 15.8512, longitude:80.3840}}
          title="User"
          pinColor="darkblue"
          description="Pickup location"
        />
>>>>>>> Stashed changes

//         <Marker
//           coordinate={{ latitude: 15.8358, longitude: 80.3645 }}
//           title="Driver"
//           description="Delivery partner"
//         />
        
<<<<<<< Updated upstream
//         <Marker
//           coordinate={{ latitude: 15.8278, longitude: 80.3568 }}
//           title="Restuarant"
//           pinColor="green"
//         />

//       </MapView>
//     </View>
//   );
// };
=======
        <Marker
          coordinate={{ latitude: 15.8278, longitude: 80.3568 }}
          title="Restuarant"
          pinColor="green"
        /> */}
      {coordinate &&
       <Marker
          coordinate={{ latitude: coordinate.latitude, longitude: coordinate.longitude}}
          title="Current Location"
          pinColor="green"
        />
      }
      </MapView>
    </View>
  );
};
>>>>>>> Stashed changes

// export default Map;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });
