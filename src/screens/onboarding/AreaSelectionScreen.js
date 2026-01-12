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

import apiClient from '../../services/ApiClient';
import PrimaryButton from '../../components/common/PrimaryButton';

export default function AreaSelectionScreen({ route, navigation }) {
  const { city } = route.params;

  const [allAreas, setAllAreas] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [errors, setErrors] = useState('');

  /* ================= FETCH AREAS ================= */
  useEffect(() => {
    async function fetchAreas() {
      try {
        const response = await apiClient.get(
          `/api/location/areas?city=${city}`,
        );

        setAllAreas(response.data.areas);
        setAreaList(response.data.areas);
      } catch (err) {
        console.log('Error fetching areas:', err);
        setErrors(err.message);
      }
    }

    fetchAreas();
  }, [city]);

  /* ================= SEARCH ================= */
  function handleSearch(text) {
    setSearchText(text);

    if (!text || text.trim() === '') {
      setAreaList(allAreas);
      return;
    }

    const query = text.toLowerCase().trim();
    const filtered = allAreas.filter(area =>
      (area || '').toLowerCase().includes(query),
    );

    setAreaList(filtered);
  }

  /* ================= SUBMIT ================= */
  async function handleSubmit() {
    if (!selectedArea) return;

    try {
      await apiClient.post(
        '/api/rider/location',
        {
          city,
          area: selectedArea,
        },
        {
          headers: {
            'x-client': 'mobile',
          },
        },
      );

      navigation.replace('SplashScreen');
    } catch (e) {
      setErrors(e.message);
    }
  }

  if (errors) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{errors}</Text>
      </View>
    );
  }

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
        <Icon
          name="search-outline"
          size={18}
          color="#888"
          style={{ marginRight: 6 }}
        />
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

      {/* Area List */}
      <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
        {areaList.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>
            No areas found
          </Text>
        ) : (
          areaList.map(area => (
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
                color={selectedArea === area ? '#fff' : '#00A8E8'}
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

      <PrimaryButton
        title="Submit"
        onPress={handleSubmit}
        bgColor="#00B5CC"
        textColor="#fff"
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
    fontSize: 18,
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
});
