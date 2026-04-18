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
import PrimaryButton from '../../components/common/PrimaryButton';

import apiClient from '../../services/ApiClient';

export default function SelectCityScreen({ navigation }) {
  const [allCities, setAllCities] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [searchText, setSearchText] = useState('');

  /* ================= FETCH CITIES ================= */
  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await apiClient.get('/api/location/cities');

        const cities = response?.data?.cities || [];

        setAllCities(cities);
        setCitiesList(cities);

        // set default selected city (first item)
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

  /* ================= SEARCH ================= */
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
          size={18}
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
      <ScrollView contentContainerStyle={{ paddingVertical: 10 }} showsVerticalScrollIndicator={false}>
        {citiesList.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>
            No cities found
          </Text>
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
                size={20}
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

      {/* ✅ ONLY ONE BUTTON (PrimaryButton) */}
      <PrimaryButton
        title="Submit"
        onPress={() =>
          navigation.navigate('AreaSelectionScreen', {
            city: selectedCity,
          })
        }
        bgColor="#00B5CC"
        textColor="#fff"
        disabled={!selectedCity}
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
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
    paddingVertical: 8,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },

  dividerBar: {
    backgroundColor: '#ccc',
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 5,
  },
  dividerText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },

  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#00A8E8',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 6,
  },
  citySelected: {
    backgroundColor: '#00A8E8',
  },
  cityText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#00A8E8',
  },
  cityTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },

  submitBtn: {
    backgroundColor: '#00C2FF',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});