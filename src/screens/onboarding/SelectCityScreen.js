// import { View, Text ,TouchableOpacity} from 'react-native'
// import React from 'react'
// import AreaSelectionScreen from './AreaSelectionScreen'

// const SelectCityScreen = ({navigation}) => {
//   return (
//     <View style={{flex:1,backgroundColor:"black"}}>
          
//           <View style={{margin:70}}>
//           <Text style={{color:'white'}}>city</Text>
//           <TouchableOpacity onPress={()=>navigation.navigate(AreaSelectionScreen)}>
//             <Text style={{color:"white"}}>Next</Text>
//           </TouchableOpacity>
        
//         </View></View>
//   )
// }

// export default SelectCityScreen;
import Geolocation from "@react-native-community/geolocation";
import AreaSelectionScreen from './AreaSelectionScreen'
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Pressable, PermissionsAndroid } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
const Base_url=" http://10.78.140.252:4000";
export default function SelectCityScreen ({navigation}) {
  const [citiesList,setCitiesList]=useState(['Hyderabad', 'Vijayawada', 'Visakhapatnam', 'Bangalore', 'Chennai', 'Mumbai', 'Pune', 'Delhi']);
  const [selectedCity, setSelectedCity] = useState("Hyderabad");
  const [userLocation, setUserLocation] = useState(null);
  const [searchText,setSearchText]=useState("");
  useEffect(()=>{
    async function fetchCities(){
      const response=await axios.get(Base_url+"/api/location/cities");
      console.log("responce:",response.data.cities);
      setCitiesList(response.data.cities);

    }
    fetchCities();
  },[])
  function handleSearch(text){

    console.log("text",text);
    if(text===""|| searchText==="") return;
    setSearchText(text);
    const filteredCities = citiesList.filter((city) =>
    city.toLowerCase().includes(searchText.toLowerCase()));
    console.log("filteredList",filteredCities,!filteredCities);
    setCitiesList(filteredCities);

  }
  

async function handleGetCurrentLocation(){
  console.log("enterd...");

  const granted = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  ]);

  if (
    granted["android.permission.ACCESS_FINE_LOCATION"] !== "granted" &&
    granted["android.permission.ACCESS_COARSE_LOCATION"] !== "granted"
  ) {
    console.log("Permission denied");
    return;
  }

  Geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
 
                console.log("Latitude:", latitude);
                console.log("Longitude:", longitude);
 
                if (!latitude || !longitude) {
                    console.log("Invalid coordinates");
                    return;
                }
 
                setUserLocation({
                    Latitude: latitude,
                    Longitude: longitude,
                });
 
                // ⬇⬇⬇ REPLACED GOOGLE API WITH FREE OSM API ⬇⬇⬇
                const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
                const response = await axios.get(url);
                console.log(response);
                const area = response.data.locality;
                const city = response.data.city;
                setSelectedCity({city,area})
                const pincode = response.data.postcode;
                console.log(area, city, pincode);
 
                // console.log("OSM API Response:", response.data);
                // console.log("Formatted Address:", response.data.display_name);
    }, 
    (error) => {
      console.log("ERROR:", error);
    },
    {
      enableHighAccuracy: false,
      timeout: 30000,   // increased timeout
      maximumAge: 0,
      distanceFilter: 0,
    }
  );
}
console.log(searchText);
console.log(citiesList);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="arrow-back" size={22} color="#000" />
        <Text style={styles.headerTitle}>Select city</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={18} color="#888" style={{ marginRight: 6 }} />
        <TextInput
          placeholder="Search your work city"
          style={styles.searchInput}
          placeholderTextColor="#999"
          onChangeText={handleSearch}
        />
      </View>
      

      {/* Current Location Row */}
      {/* <Pressable style={styles.locationRow} onPress={handleGetCurrentLocation}>
        <Icon name="location-sharp" size={22} color="#333" />
        <Text style={styles.locationText}>Use Current Location</Text>
      </Pressable> */}

      {/* Divider Bar */}
      <View style={styles.dividerBar}>
        <Text style={styles.dividerText}>Popular search</Text>
      </View>

      {/* Cities List */}
      <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
        {citiesList.map((city) => (
          <TouchableOpacity
            key={city}
            style={[
              styles.cityItem,
              selectedCity === city && styles.citySelected
            ]}
            onPress={() => setSelectedCity(city)}
          >
            <Icon
              name="key-outline"
              size={20}
              color={selectedCity === city ? "#fff" : "#00A8E8"}
            />
            <Text
              style={[
                styles.cityText,
                selectedCity === city && styles.cityTextSelected
              ]}
            >
              {city}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitBtn} onPress={()=>navigation.navigate(AreaSelectionScreen)}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },

  // Search Bar
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },

  // Location Row
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 15,
    color: "#000",
  },

  // Divider
  dividerBar: {
    backgroundColor: "#ccc",
    paddingVertical: 6,
    alignItems: "center",
    borderRadius: 5,
  },
  dividerText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
  },

  // City Item
  cityItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#00A8E8",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 6,
  },
  citySelected: {
    backgroundColor: "#00A8E8",
  },
  cityText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#00A8E8",
  },
  cityTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },

  // Submit Button
  submitBtn: {
    backgroundColor: "#00C2FF",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
