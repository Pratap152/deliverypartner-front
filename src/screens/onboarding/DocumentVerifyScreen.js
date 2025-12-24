import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Header from '../../components/common/Header';
import PrimaryButton from '../../components/common/PrimaryButton';

import { useSelector } from 'react-redux';
import { COLORS } from '../../utils/colors';

import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DOCUMENTS = [
  { title: 'Aadhar Card', id: 'aadhaar', route: 'AadharEntryScreen' },
  { title: 'PAN Card', id: 'pan', route: 'PanUploadScreen' },
  { title: 'Driving License', id: 'dl', route: 'LicenseUploadScreen' },
];

const DocumentVerificationScreen = () => {
  const navigation = useNavigation();
  const verifiedDocuments = useSelector(state => state.documents);

  const handleSelect = item => {
    if (verifiedDocuments[item.id]) return;
    navigation.navigate(item.route);
  };

  const isAllDocumentsVerified = Object.values(verifiedDocuments).every(
    value => value === true,
  );

  const handleSubmit = () => {
    navigation.navigate('ProcessingVerificationScreen');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* header */}
        <Header text="Document Verification" />
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          {/* content */}
          <View style={styles.content}>
            <Text
              style={{
                fontFamily: 'Nunito Sans',
                fontSize: 16,
                fontWeight: '600',
                //   textAlign: 'center',
              }}
            >
              Upload focused photos of below documents for faster verification
            </Text>

            <View style={styles.btnsContainer}>
              {DOCUMENTS.map(item => {
                const isVerified = verifiedDocuments[item.id];
                return (
                  <TouchableOpacity
                    onPress={() => handleSelect(item)}
                    key={item.id}
                    disabled={isVerified}
                    style={[styles.btn, isVerified && styles.active]}
                  >
                    <Text style={[styles.btnText, isVerified && styles.active]}>
                      {item.title}
                    </Text>
                    <Ionicons
                      name={isVerified ? 'checkmark' : 'chevron-forward'}
                      size={20}
                      color={isVerified ? COLORS.white : COLORS.border}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View>
            <PrimaryButton
              title={'submit'}
              disabled={isAllDocumentsVerified === false}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DocumentVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: COLORS.white,
  },

  content: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  btn: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.border,
  },
  btnsContainer: {
    marginTop: 30,
    gap: 20,
  },
  btnText: {
    fontFamily: 'Nunito Sans',
    fontSize: 18,
    fontWeight: '400',
  },
  active: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    borderColor: COLORS.primary,
  },
});
