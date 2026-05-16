import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import apiClient from '../../services/ApiClient';

const isTablet = DeviceInfo.isTablet();
const H_PADDING = isTablet ? 40 : 20;
const CONTENT_MAX_WIDTH = isTablet ? 700 : '100%';
const titleFont = isTablet ? 26 : 20;
const inputFont = isTablet ? 18 : 14;
const cityFont = isTablet ? 18 : 16;
const iconSize = isTablet ? 24 : 20;

export default function SelectCityScreen({ navigation }) {
  const [allCities, setAllCities] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await apiClient.get('/api/location/cities');
        const cities = response?.data?.cities || [];
        setAllCities(cities);
        setCitiesList(cities);
        if (cities.length > 0) {
          setSelectedCity(cities[0]);
          setSearchText(cities[0]);
        }
      } catch (err) {
        console.log('Error fetching cities', err);
      }
    }
    fetchCities();
  }, []);

  function handleSearch(text) {
    setSearchText(text);
    setSelectedCity(text);
    if (!text || text.trim() === '') {
      setCitiesList(allCities);
      return;
    }
    const query = text.toLowerCase().trim();
    const filtered = allCities.filter(city =>
      (city || '').toLowerCase().includes(query),
    );
    setCitiesList(filtered);
  }

  return (
    <View style={styles.screenWrapper}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Select city</Text>
          <View style={{ width: 22 }} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon
            name="search-outline"
            size={isTablet ? 22 : 18}
            color="#888"
            style={{ marginRight: 6 }}
          />
          <TextInput
            placeholder="Search your work city"
            style={styles.searchInput}
            placeholderTextColor="#999"
            onChangeText={handleSearch}
            value={selectedCity}
          />
        </View>

        {/* Divider */}
        <View style={styles.dividerBar}>
          <Text style={styles.dividerText}>Popular search</Text>
        </View>

        {/* Cities List */}
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {citiesList.length === 0 ? (
            <Text style={styles.emptyText}>No cities found</Text>
          ) : (
            citiesList.map(city => (
              <TouchableOpacity
                key={city}
                style={[
                  styles.cityItem,
                  selectedCity === city && styles.citySelected,
                ]}
                onPress={() => {
                  setSelectedCity(city);
                  setSearchText(city);
                }}
              >
                <Icon
                  name="home-outline"
                  size={iconSize}
                  color={selectedCity === city ? '#fff' : '#00A8E8'}
                />
                <Text
                  style={[
                    styles.cityText,
                    selectedCity === city && styles.cityTextSelected,
                  ]}
                >
                  {city}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* Submit */}
        <TouchableOpacity
            style={[
              styles.submitButton,
              !selectedCity && { opacity: 0.5 },
            ]}
            disabled={!selectedCity}
            onPress={() =>
              navigation.navigate('AreaSelectionScreen', {
                city: selectedCity,
              })
            }
          >
            <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    paddingHorizontal: H_PADDING,
    paddingTop: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: titleFont,
    fontWeight: '600',
    color: '#000',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: isTablet ? 12 : 8,
    marginBottom: 15,
  },

  searchInput: {
    flex: 1,
    fontSize: inputFont,
    color: '#000',
  },

  dividerBar: {
    backgroundColor: '#ccc',
    paddingVertical: isTablet ? 10 : 6,
    alignItems: 'center',
    borderRadius: 5,
  },

  dividerText: {
    fontSize: isTablet ? 16 : 14,
    color: '#555',
    fontWeight: '600',
  },

  listContent: {
    paddingVertical: 10,
  },

  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: isTablet ? 16 : 14,
  },

  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#00A8E8',
    borderRadius: 12,
    paddingVertical: isTablet ? 16 : 12,
    paddingHorizontal: isTablet ? 20 : 15,
    marginVertical: isTablet ? 8 : 6,
  },

  citySelected: {
    backgroundColor: '#00A8E8',
  },

  cityText: {
    marginLeft: 10,
    fontSize: cityFont,
    color: '#00A8E8',
  },

  cityTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
 submitButton: {
  width: isTablet ? 600 : '100%',
  alignSelf: 'center',
  backgroundColor: '#00B5CC',
  paddingVertical: isTablet ? 18 : 15,
  borderRadius: 40,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 20,
  marginBottom: 10,
},

submitButtonText: {
  color: '#fff',
  fontSize: isTablet ? 22 : 18,
  fontWeight: '700',
},
});