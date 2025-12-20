// import { View, Text ,TouchableOpacity} from 'react-native'
// import React from 'react'
// import SelectCityScreen from './SelectCityScreen'

// const AppPermissionScreen = ({navigation}) => {
//   return (
//     <View style={{flex:1,backgroundColor:"black"}}>
          
//           <View style={{margin:70}}>
//           <Text style={{color:'white'}}>AppPermissionScreen</Text>
//           <TouchableOpacity onPress={()=>navigation.navigate(SelectCityScreen)}>
//             <Text style={{color:"white"}}>Next</Text>
//           </TouchableOpacity>
        
//         </View></View>
//   )
// }

// export default AppPermissionScreen
const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyaWRlcklkIjoiNjkzNDAxOTZiNjQ2M2M5ZTNjM2E1NGMzIiwicGhvbmUiOiI3MDkzOTAxNTEzIiwiaWF0IjoxNzY1MDE4NDc4LCJleHAiOjE3NjU2MjMyNzh9.sWedT2Diz5MxEsAINOR6m5MGoQCJW8dpRrVqc_Kqy_Y"
 import SelectCityScreen from './SelectCityScreen'
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Image, Platform } from 'react-native';
import { 
  request, RESULTS,
  PERMISSIONS, 
  openSettings,
  requestNotifications,
  check
} from 'react-native-permissions';
// import Icon from 'react-native-vector-icons/Ionicons';
import PermissionItem from "../../components/onboarding/AppPermissions/PermissionItem";
import axios from 'axios';
import WEBSITE_URL from "../../utils/host";
import { useAuth } from '../../hooks/useAuth';
import PrimaryButton from "../../components/common/PrimaryButton";

 const APP_PERMISSIONS = {
  location: {
    title: "Location",
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  },

  backgroundLocation: {
    title: "Background Location",
    android: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
    ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
  },

  camera: {
    title: "Camera",
    android: PERMISSIONS.ANDROID.CAMERA,
    ios: PERMISSIONS.IOS.CAMERA,
  },

  notification: {
    title: "Notifications",
    android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
    ios: PERMISSIONS.IOS.NOTIFICATIONS,
}};



const AppPermissionScreen = ({navigation}) => {
const [permissionStatus,setPermissionStatus]=useState({
  location:"location",
  backgroundLocation:"",
  camera:"",
  notification:"",
})
const [error,setError]=useState("");
const { authToken } = useAuth();
async function handleSubmit(){
  try{
  const response = await axios.post(WEBSITE_URL+'/api/rider/permissions',{
  "camera": true,
  "foregroundLocation": true,
  "backgroundLocation": true,
},{
  headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
      "x-client": "mobile",
    },
});
navigation.navigate(SelectCityScreen);
  }
  catch(e){
    console.log(e);
    setError(e.message);
  }
}
// async function handleNotification() {
//   try {
//     if (Platform.OS !== 'android') {
//       console.log("Not Android");
//       return true;
//     }

//     // Check API version
//     const apiLevel = Platform.constants.Release;  // e.g. "13", "12", "11"

//     // Only Android 13+ requires POST_NOTIFICATIONS
//     const isAndroid13Plus = parseInt(apiLevel, 10) >= 13;

//     if (!isAndroid13Plus) {
//       console.log("Android < 13 → Permission not required");
//       return true;
//     }

//     const permission = PERMISSIONS.ANDROID.POST_NOTIFICATIONS;

//     if (!permission) {
//       throw new Error("POST_NOTIFICATIONS permission constant is null. Update react-native-permissions.");
//     }

//     // Check current status
//     const currentStatus = await check(permission);
//     console.log("CURRENT:", currentStatus);

//     if (currentStatus === RESULTS.GRANTED) {
//       console.log("Already granted");
//       return true;
//     }

//     // Ask permission
//     const result = await request(permission);
//     console.log("REQUEST RESULT:", result);

//     if (result === RESULTS.GRANTED) {
//       console.log("Permission Granted");
//       return true;
//     }

//     if (result === RESULTS.BLOCKED) {
//       console.log("Permission Blocked → Open Settings");
//       return false;
//     }

//     console.log("Permission Denied");
//     return false;

//   } catch (err) {
//     console.log("ERROR:", err);
//     return false;
//   }
// }
async function handleLocation(permissionType){
 
  const perm=(Platform.OS === "android"? APP_PERMISSIONS[permissionType].android: APP_PERMISSIONS[permissionType].ios);
  const permission = await check(perm);
  
  if (permission==="granted"){
    
    setPermissionStatus((status)=>({...status,[permissionType]:"granted"}));
    return "granted";
  }
  if(permission==="denied"){
    const responce=await request(perm);  
      if(responce==="blocked"){
        setPermissionStatus((status)=>({...status,[permissionType]:"granted"}));
        openSettings("application")
      }
      setPermissionStatus((status)=>({...status,[permissionType]:responce}));
    return responce;
  }
  if (permission==="blocked"){
    setPermissionStatus((status)=>({...status,[permissionType]:"granted"}));
    openSettings("application");
  }
} 

if(error){
  
return (
<View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
  <Text>{error}</Text>
</View>
)}
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require("../../assets/permissionsImage.png")}/>
      </View>
      <Text style={styles.title}>
        We need the following permissions to serve you better
      </Text>
      <View style={{width:"100%",height:450,alignItems:"center",
    justifyContent:"center"}}>
      <PermissionItem
        icon="location"
        title="Location"
        desc="We need this permission to intelligently surface location and allocate orders"
        permissionStatus={permissionStatus}
        onPress={()=>handleLocation("location")}
        isEnabled={permissionStatus.location!=="granted"}
      />

      <PermissionItem
        icon="locate"
        title="Background Location"
        desc="We require background location permission for accurate rider updates and geographical detection"
        permissionStatus={permissionStatus}
        onPress={()=>handleLocation("backgroundLocation")}
        // isDisabled={permissionStatus.backgroundLocation==="granted"||permissionStatus.backgroundLocation===""}
        isEnabled={permissionStatus.location==="granted"&&permissionStatus.backgroundLocation!=="granted"}
      />

      <PermissionItem
        icon="camera"
        title="Camera"
        desc="We need this permission to scan codes and take picture"
        permissionStatus={permissionStatus}
        // isDisabled={permissionStatus.backgroundLocation==="granted"||permissionStatus.backgroundLocation===""}
        isEnabled={permissionStatus.backgroundLocation==="granted"&&permissionStatus.camera!=="granted"}
        onPress={()=>handleLocation("camera")}
      />

      {/* <PermissionItem
        icon="notifications"
        title="Push Notifications"
        desc="We need this permission to show push notifications"
        permissionStatus={permissionStatus}
        isEnabled={true}
        onPress={handleNotification}
      /> */}
      </View>


      {permissionStatus.backgroundLocation==="granted"&&permissionStatus.location==="granted"&&permissionStatus.camera==="granted"&& 
      // <TouchableOpacity style={styles.button} onPress={handleSubmit} >
      //   <Text style={styles.buttonText}>Submit</Text>
      // </TouchableOpacity>}
      <PrimaryButton
          title="Submit"
            onPress={handleSubmit}
             bgColor="#00B5CC"
           textColor="#fff"
         />}
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  placeholderBox: {
    width: 200,
    height: 120,
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    marginBottom: 20
  },
  container: {
    padding: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 25,
    textAlign: 'center'
  },
 
  button: {
    backgroundColor: '#56dcee',
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default AppPermissionScreen;
