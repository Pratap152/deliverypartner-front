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

  const [allPincodes, setAllPincodes] = useState([]);
  const [pincodeList, setPincodeList] = useState([]);
  const [selectedPincode, setSelectedPincode] = useState('');
  const [searchText, setSearchText] = useState('');
  const [errors, setErrors] = useState('');

  /* ================= FETCH PINCODES ================= */
  useEffect(() => {
    async function fetchPincodes() {
      try {
        const response = await apiClient.get(
          `/api/location/areas?city=${city}`
        );

        const pincodesData = response?.data?.pincodes || [];

        // Extract only unique pincodes using reduce
        const uniquePincodes = pincodesData.reduce((acc, item) => {
          if (!acc.includes(item.code)) {
            acc.push(item.code);
          }
          return acc;
        }, []);

        setAllPincodes(uniquePincodes);
        setPincodeList(uniquePincodes);
      } catch (err) {
        console.log('Error fetching pincodes:', err);
        setErrors(err.message);
      }
    }

    fetchPincodes();
  }, [city]);

  /* ================= SEARCH ================= */
  function handleSearch(text) {
    setSearchText(text);

    if (!text.trim()) {
      setPincodeList(allPincodes);
      return;
    }

    const filtered = allPincodes.filter(code =>
      code.includes(text)
    );

    setPincodeList(filtered);
  }

  /* ================= SUBMIT ================= */
  async function handleSubmit() {
    if (!selectedPincode) return;

    try {
      await apiClient.post(
        '/api/rider/location',
        {
          city,
          pincode: selectedPincode,
        },
        {
          headers: {
            'x-client': 'mobile',
          },
        }
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

        <Text style={styles.headerTitle}>{city} - Select Pincode</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={18} color="#888" />
        <TextInput
          placeholder="Search pincode"
          style={styles.searchInput}
          onChangeText={handleSearch}
          value={searchText}
        />
      </View>

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {pincodeList.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No pincodes found
          </Text>
        ) : (
          pincodeList.map(code => (
            <TouchableOpacity
              key={code}
              style={[
                styles.cityItem,
                selectedPincode === code && styles.citySelected,
              ]}
              onPress={() => {
                setSelectedPincode(code);
                setSearchText(code);
              }}
            >
              <Icon
                name="location-outline"
                size={20}
                color={selectedPincode === code ? '#fff' : '#00A8E8'}
              />

              <Text
                style={[
                  styles.cityText,
                  selectedPincode === code && styles.cityTextSelected,
                ]}
              >
                {code}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Submit */}
      <PrimaryButton
        title="Submit"
        onPress={handleSubmit}
        bgColor="#00B5CC"
        textColor="#fff"
        disabled={!selectedPincode}
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
  },
  cityItem: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#00A8E8',
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
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
  },
});