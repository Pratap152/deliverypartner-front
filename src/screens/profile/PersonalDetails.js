import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '../../redux/slices/profileSlice';

const PersonalDetailsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { data: profile, loading } = useSelector(state => state.profile);

  const [form, setForm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageModal, setImageModal] = useState(false);

  /*  FETCH PROFILE  */
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProfile());
    }, [dispatch]),
  );

  /*  SYNC FORM  */
  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.personalInfo?.fullName || '',
        email: profile.personalInfo?.email || '',
        dob: profile.personalInfo?.dob || '',
        phoneNumber: profile.phone?.number || '',
        countryCode: profile.phone?.countryCode || '+91',
        streetAddress: profile.location?.streetAddress || '',
        area: profile.location?.area || '',
        city: profile.location?.city || '',
        state: profile.location?.state || '',
        pincode: profile.location?.pincode || '',
        selfie: profile.selfie || null,
      });
    }
  }, [profile]);

  /*  HELPERS  */
  const handleChange = (key, value) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const getSelfieUri = selfie => {
    if (!selfie) return null;
    if (typeof selfie === 'string') return selfie;
    if (selfie?.url) return selfie.url;
    if (selfie?.uri) return selfie.uri;
    return null;
  };

  const pickImage = async () => {
    const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
    if (!res.didCancel && res.assets?.length) {
      handleChange('selfie', res.assets[0].uri);
    }
  };

  /*  SAVE PROFILE (REDUX) */
  const handleSave = () => {
    const formData = new FormData();

    formData.append('email', form.email);

    formData.append('countryCode', form.countryCode);

    formData.append('phoneNumber', form.phoneNumber);

    formData.append('streetAddress', form.streetAddress);

    formData.append('area', form.area);

    formData.append('city', form.city);

    formData.append('state', form.state);

    formData.append('pincode', form.pincode);

    if (form.selfie && typeof form.selfie === 'string') {
      formData.append('selfie', {
        uri: form.selfie,

        name: 'selfie.jpg',

        type: 'image/jpeg',
      });
    }

    dispatch(updateProfile(formData))
      .unwrap()

      .then(() => {
        Alert.alert('Success', 'Profile updated successfully');

        setIsEditing(false);

        dispatch(fetchProfile());
      })

      .catch(() => {
        Alert.alert('Error', 'Update failed');
      });
  };

  if (loading && !profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00B2C9" />
      </View>
    );
  }

  if (!form) return null;

  const selfieUri = getSelfieUri(form.selfie);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={rf(2.5)} color="#101828" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Personal Information</Text>

        <TouchableOpacity
          onPress={() => {
            if (isEditing && profile) {
              setForm({
                fullName: profile.personalInfo?.fullName || '',
                email: profile.personalInfo?.email || '',
                dob: profile.personalInfo?.dob || '',
                phoneNumber: profile.phone?.number || '',
                countryCode: profile.phone?.countryCode || '+91',
                streetAddress: profile.location?.streetAddress || '',
                area: profile.location?.area || '',
                city: profile.location?.city || '',
                state: profile.location?.state || '',
                pincode: profile.location?.pincode || '',
                selfie: profile.selfie || null,
              });
            }
            setIsEditing(p => !p);
          }}
        >
          <Text style={styles.editText}>{isEditing ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
        <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: rh('6%') }} 
                                        keyboardShouldPersistTaps="handled">
          {/* PROFILE CARD */}
          <View style={styles.profileCard}>
            <TouchableOpacity
              onPress={() =>
                isEditing ? pickImage() : selfieUri && setImageModal(true)
              }
            >
              <View style={styles.avatarOuterWrapper}>
                <View style={[styles.avatarWrapper, isEditing && styles.avatarEditing]}>
                  {selfieUri ? (
                    <Image source={{ uri: selfieUri }} style={styles.avatar} />
                  ) : (
                    <View style={styles.placeholder}>
                      <Ionicons name="person" size={rf(6)} color="#98A2B3" />
                    </View>
                  )}
                </View>

                {isEditing && (
                  <View style={styles.addIcon}>
                    <Ionicons name="camera" size={rf(2)} color="#FFF" />
                  </View>
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.profileInfo}>
              <Text style={styles.name}>{form.fullName}</Text>
              <Text style={styles.driverId}>Driver ID: DRV123456</Text>
            </View>
          </View>

          {/* BASIC INFO */}
          <Section title="Basic Information">
            <Label text="Full Name"/>
            <Field
              editable={false}
              value={form.fullName}
              onChangeText={v => handleChange('fullName', v)}
              isEditing={isEditing}
            />

            <Label text="Email" />
            <Field
              editable={isEditing}
              value={form.email}
              onChangeText={v => handleChange('email', v)}
              isEditing={isEditing}
            />

            <Label text="Phone Number" />
            <Field
              editable={false}
              value={form.phoneNumber}
              keyboardType="phone-pad"
              onChangeText={v => handleChange('phoneNumber', v)}
              isEditing={isEditing}
            />

            <Label text="Date of Birth" />
            <Field
              editable={false}
              value={form.dob}
              onChangeText={v => handleChange('dob', v)}
              isEditing={isEditing}
            />
          </Section>

          {/* ADDRESS */}
          <Section title="Address" iconName="location-outline">
            <View style={styles.row}>
              <View style={styles.rowInput}>
                <Label text="Area" />
                <Field
                  editable={false}
                  value={form.area}
                  onChangeText={v => handleChange('area', v)}
                  isEditing={isEditing}
                />
              </View>
              <View style={styles.rowInput}>
                <Label text="City" />
                <Field
                  editable={false}
                  value={form.city}
                  onChangeText={v => handleChange('city', v)}
                  isEditing={isEditing}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.rowInput}>
                <Label text="State" />
                <Field
                  editable={false}
                  value={form.state}
                  onChangeText={v => handleChange('state', v)}
                  isEditing={isEditing}
                />
              </View>
              <View style={styles.rowInput}>
                <Label text="Pincode" />
                <Field
                  editable={false}
                  value={form.pincode}
                  keyboardType="number-pad"
                  onChangeText={v => handleChange('pincode', v)}
                  isEditing={isEditing}
                />
              </View>
            </View>
          </Section>

          {/* SAVE BUTTON */}
          {isEditing && (
            <TouchableOpacity
              style={[styles.saveButton, loading && { opacity: 0.7 }]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.saveText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          )}

          <View style={{ height: rh(4) }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* IMAGE MODAL */}
      <Modal visible={imageModal} transparent animationType="fade">
        <View style={styles.modal}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setImageModal(false)}
          >
            <Ionicons name="close" size={rf(3)} color="#FFF" />
          </TouchableOpacity>

          {selfieUri && (
            <Image source={{ uri: selfieUri }} style={styles.fullImage} />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default PersonalDetailsScreen;

const Section = ({ title, iconName, children }) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      {iconName && (
        <Ionicons
          name={iconName}
          size={rf(2.2)}
          color="#101828"
          style={{ marginRight: rw(2) }}
        />
      )}
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

const Label = ({ iconName, text }) => (
  <View style={styles.labelRow}>
    {iconName && (
      <Ionicons
        name={iconName}
        size={rf(1.8)}
        color="#667085"
        style={{ marginRight: rw(1.5) }}
      />
    )}
    <Text style={styles.labelText}>{text}</Text>
  </View>
);

const Field = ({ editable, isEditing, style, ...props }) => {
  const isDisabled = isEditing && !editable;
  return( 
    <TextInput
        {...props}
      editable={isEditing ? editable : false}
      style={[
        styles.input,
        isEditing && editable && styles.activeInput,   
        isDisabled && styles.disabledInput,          
      ]}  
      />
    );
  };


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    height: rh(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: rw(4),
    backgroundColor: '#FFFFFF',
  },

  headerTitle: {
    fontSize: rf(2.3),
    fontWeight: '600',
    color: '#101828',
  },

  editText: {
    fontSize: rf(2),
    fontWeight: '600',
    color: '#00B2C9',
  },

  profileCard: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: rw(4),
    marginHorizontal: rw(4),
    marginTop: rh(1.5),
    borderRadius: rw(3),
    elevation: 2,
  },

  avatar: {
    width: rw(20),
    height: rw(20),
    borderRadius: rw(10),
  },

  profileInfo: { marginLeft: rw(4) },

  name: {
    fontSize: rf(2.2),
    fontWeight: '600',
    color: '#101828',
  },

  driverId: {
    fontSize: rf(1.7),
    color: '#667085',
    marginTop: rh(0.6),
  },

  sectionCard: {
    backgroundColor: '#FFF',
    marginHorizontal: rw(4),
    marginTop: rh(1.8),
    borderRadius: rw(3),
    padding: rw(4),
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: rh(1.4),
  },

  sectionTitle: {
    fontSize: rf(2),
    fontWeight: '600',
    color: '#101828',
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: rh(0.6),
  },

  labelText: {
    fontSize: rf(1.7),
    color: '#667085',
    fontWeight: '500',
  },

  input: {
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: rw(2),
    paddingHorizontal: rw(3.5),
    paddingVertical: rh(1.5),
    fontSize: rf(1.9),
    marginBottom: rh(1.8),
    backgroundColor: '#f9f9fa',
    color: '#101828',
  },

  activeInput: {
    borderColor: '#00B2C9',
    backgroundColor: '#FFFFFF',
  },

  disabledInput: {
    backgroundColor: '#F2F4F7',
    color: '#98A2B3',
    borderColor: '#E4E7EC',
  },

  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowInput: { width: '48%' },

  saveButton: {
    backgroundColor: '#00B2C9',
    marginHorizontal: rw(4),
    marginTop: rh(2.5),
    paddingVertical: rh(1.8),
    borderRadius: rw(2),
    alignItems: 'center',
  },

  saveText: {
    color: '#FFF',
    fontSize: rf(2.1),
    fontWeight: '600',
  },

  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullImage: { width: '100%', height: '100%' },

  placeholder: {
    width: rw(20),
    height: rw(20),
    borderRadius: rw(10),
    backgroundColor: '#F2F4F7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarOuterWrapper: {
    width: rw(20),
    height: rw(20),
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: rw(10),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00B2C9',
    width: rw(6),
    height: rw(6),
    borderRadius: rw(3),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },

  closeButton: {
    position: 'absolute',
    top: rh(5),
    right: rw(4),
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: rw(10),
    height: rw(10),
    borderRadius: rw(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEditing: {
    borderWidth: 4,
    borderColor: '#00B2C9',
  },
});
