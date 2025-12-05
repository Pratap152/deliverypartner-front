// import { View, Text } from 'react-native'
// import React from 'react'
// import PersonalInfoScreen from './PersonalInfoScreen'
// import { TouchableOpacity } from 'react-native'

// const AreaSelectionScreen = ({navigation}) => {
//   return (
//      <View style={{margin:70}}>
//           <Text style={{color:'white'}}>city</Text>
//           <TouchableOpacity onPress={()=>navigation.navigate(PersonalInfoScreen)}>
//             <Text style={{color:"white"}}>Next</Text>
//           </TouchableOpacity>
//     </View>
//   )
// }

// export default AreaSelectionScreen
const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyaWRlcklkIjoiNjkzMmI0YTU2NDBlYTg2ZDcyNmIwMTY4IiwicGhvbmUiOiI3MDkzOTAxNTEzIiwiaWF0IjoxNzY0OTMwOTc0LCJleHAiOjE3NjU1MzU3NzR9.FDTHscYGAQZmKKNspilWD27OiefaZpHuOd4EhwvtX28"
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const Base_url = "http://10.78.140.252:4000";

export default function AreaSelectionScreen({ route, navigation }) {
  console.log("routeparams",route);
  const { city } = route.params; 
  // 👈 city passed from SelectCityScreen

  const [allAreas, setAllAreas] = useState([]);   // Full list from API
  const [areaList, setAreaList] = useState([]);   // Filtered list
  const [selectedArea, setSelectedArea] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [errors,setErrors]=useState("");

  // -------------------------------------
  // FETCH AREAS BASED ON SELECTED CITY
  // -------------------------------------
  useEffect(() => {
    async function fetchAreas() {
      try {
        console.log("entered...")
        // const response = await axios.get(
        //   `${Base_url}/api/location/areas?city=${city}`
        // );
        const response = await axios.get(
          `http://10.172.185.5:4000/api/location/areas?city=${city}`
        );
        console.log(response);
        console.log("Areas Response:", response);

        setAllAreas(response.data.areas);
        setAreaList(response.data.areas);
      } catch (err) {
        console.log("Error fetching areas:", err);
        setErrors(err.message);
      }
    }

    fetchAreas();
  }, [city]);

  // -------------------------------------
  // SEARCH FUNCTION (same as in city screen)
  // -------------------------------------
  function handleSearch(text) {
    setSearchText(text);

    if (!text || text.trim() === "") {
      setAreaList(allAreas);
      return;
    }

    const query = text.toLowerCase().trim();

    const filtered = allAreas.filter((area) =>
      (area || "").toLowerCase().includes(query)
    );

    setAreaList(filtered);
  }

  // -------------------------------------
  // SUBMIT → You can navigate to next screen here
  // -------------------------------------
  async function handleSubmit() {
    console.log("city ,selectedarea",city,selectedArea);
    if (!selectedArea) return;
    try{
      const responce=await axios.post("http://10.172.185.5:4000/api/rider/location", 
        {
         "city": city,
         "area": selectedArea
        }
  ,{
      headers: 
      {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-client": "mobile",
      },
  });
      console.log(responce);
      navigation.navigate("VehicleSelectionScreen");
    }catch(e){
      setErrors(e.message);
    }
  }
  if(errors){
  
  return (
  <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
    <Text>{errors}</Text>
  </View>
  )}

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{city} - Select Area</Text>

        <View style={{ width: 22 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={18} color="#888" style={{ marginRight: 6 }} />
        <TextInput
          placeholder="Search area"
          style={styles.searchInput}
          placeholderTextColor="#999"
          onChangeText={handleSearch}
          value={searchText}
        />
      </View>

      {/* Divider */}
      <View style={styles.dividerBar}>
        <Text style={styles.dividerText}>Available areas</Text>
      </View>

      {/* AREA LIST */}
      <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
        {areaList.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#999", marginTop: 20 }}>
            No areas found
          </Text>
        ) : (
          areaList.map((area) => (
            <TouchableOpacity
              key={area}
              style={[
                styles.cityItem,
                selectedArea === area && styles.citySelected,
              ]}
              onPress={() => setSelectedArea(area)}
            >
              <Icon
                name="location-outline"
                size={20}
                color={selectedArea === area ? "#fff" : "#00A8E8"}
              />
              <Text
                style={[
                  styles.cityText,
                  selectedArea === area && styles.cityTextSelected,
                ]}
              >
                {area}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
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

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },

  /* Search Bar */
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

  /* Divider */
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

  /* Area item (same styling as your city screen) */
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

  /* Submit Button */
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
