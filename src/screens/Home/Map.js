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

//         <Marker
//           coordinate={{ latitude: 15.8358, longitude: 80.3645 }}
//           title="Driver"
//           description="Delivery partner"
//         />
        
//         <Marker
//           coordinate={{ latitude: 15.8278, longitude: 80.3568 }}
//           title="Restuarant"
//           pinColor="green"
//         />

//       </MapView>
//     </View>
//   );
// };

// export default Map;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });
