import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  BackHandler,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';

import { getPincodes, savePincode } from '../../services/onboardingApi';
import apiClient from '../../services/ApiClient';
import { SafeAreaView } from 'react-native-safe-area-context';

const isTablet = DeviceInfo.isTablet();
const H_PADDING = isTablet ? 40 : 20;
const CONTENT_MAX_WIDTH = isTablet ? 700 : '100%';

export default function AreaSelectionScreen({ route, navigation }) {

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Exit App",
          "Are you sure you want to exit the app?",
          [
            {
              text: "No",
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: () => BackHandler.exitApp(),
            },
          ]
        );

        return true; // Prevent default behavior
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  const { city } = route.params;

  const [allPincodes, setAllPincodes] = useState([]);
  const [pincodeList, setPincodeList] = useState([]);
  const [selectedPincode, setSelectedPincode] = useState('');
  const [searchText, setSearchText] = useState('');
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(true);

  /* FETCH PINCODES */
  useEffect(() => {
    async function fetchPincodes() {
      setLoading(true);

      try {
        const response = await getPincodes(city);

        const pincodesData = response?.pincodes || [];

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
      } finally {
        setLoading(false);
      }
    }

    fetchPincodes();
  }, [city]);

  /* SEARCH */
  function handleSearch(text) {
    setSearchText(text);

    if (!text.trim()) {
      setPincodeList(allPincodes);
      return;
    }

    const filtered = allPincodes.filter(code => code.includes(text));
    setPincodeList(filtered);
  }

  /* SUBMIT */
  async function handleSubmit() {
    if (!selectedPincode) return;

    const payload = {
      city, pincode: selectedPincode,
    };
    const headers = {
      headers: { 'x-client': 'mobile' },
    }

    try {
      await savePincode(payload, headers,);

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
    <SafeAreaView style={styles.screenWrapper}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{city} - Select Pincode</Text>

          <View style={{ width: isTablet ? 28 : 22 }} />
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={isTablet ? 22 : 18} color="#888" />
          <TextInput
            placeholder="Search pincode"
            style={styles.searchInput}
            onChangeText={handleSearch}
            value={searchText}
            placeholderTextColor="#999"
          />
        </View>

        {/* List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#1F3365" />
            </View>
          ) : pincodeList.length === 0 ? (
            <Text style={styles.emptyText}>No pincodes found</Text>
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
                  size={isTablet ? 24 : 20}
                  color={selectedPincode === code ? '#fff' : '#1F3365'}
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
        <TouchableOpacity
          style={[
            styles.submitButton,
            !selectedPincode && { opacity: 0.5 },
          ]}
          disabled={!selectedPincode}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
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
  },
  loaderContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: isTablet ? 26 : 22,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },

  searchContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: isTablet ? 12 : 10,
    marginBottom: 15,
    alignItems: 'center',
  },

  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: isTablet ? 18 : 14,
    color: '#000',
  },

  listContent: {
    paddingVertical: 10,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
    fontSize: isTablet ? 16 : 14,
  },

  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isTablet ? 16 : 12,
    borderWidth: 1.5,
    borderColor: '#1F3365',
    borderRadius: 10,
    marginVertical: isTablet ? 8 : 5,
  },

  citySelected: {
    backgroundColor: '#1F3365',
  },

  cityText: {
    marginLeft: 10,
    fontSize: isTablet ? 18 : 16,
    color: '#1F3365',
  },

  cityTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  submitButton: {
    width: isTablet ? 600 : '100%',
    alignSelf: 'center',
    backgroundColor: '#1F3365',
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