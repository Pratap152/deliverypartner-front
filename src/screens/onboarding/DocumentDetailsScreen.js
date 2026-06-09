import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    Image,
    Alert,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    PermissionsAndroid,
    Platform,
    BackHandler
} from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import {
    responsiveWidth,
    responsiveHeight,
    responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import PrimaryButton from '../../components/common/PrimaryButton';
import { setSelectedVehicle } from '../../redux/slices/vehicleSlice';
import apiClient from '../../services/ApiClient';
import { SafeAreaView } from 'react-native-safe-area-context';

const DocumentDetailsScreen = ({ navigation }) => {

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

    const dispatch = useDispatch();

    const selectedVehicle = useSelector(state => state.vehicle.selectedVehicle);
    const [dlNumber, setDlNumber] = useState('');
    const [panNumber, setPanNumber] = useState('');
    const [localSelected, setLocalSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [dlError, setDlError] = useState("");
    const [panError, setPanError] = useState("");
    const [photoError, setPhotoError] = useState("");

    const handleSelect = type => {
        setLocalSelected(type);
        dispatch(setSelectedVehicle(type));
    };

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "Camera Permission",
                        message: "App needs camera access to take your selfie",
                        buttonPositive: "OK",
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                return false;
            }
        }
        return true;
    };

    const requestGalleryPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                let permission;

                if (Platform.Version >= 33) {
                    // Android 13+
                    permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
                } else {
                    // Android 12 and below
                    permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
                }

                const granted = await PermissionsAndroid.request(permission, {
                    title: "Gallery Permission",
                    message: "App needs access to your photos",
                    buttonPositive: "OK",
                });

                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                return false;
            }
        }
        return true;
    };

    const validateImage = (image) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        const maxSize = 2 * 1024 * 1024;

        if (!image?.type || !allowedTypes.includes(image.type)) {
            return "Only JPG and PNG images are allowed";
        }

        if (image.fileSize && image.fileSize > maxSize) {
            return "Image size should be less than 2MB";
        }

        return null;
    };

    const takeSelfie = async () => {

        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            Alert.alert("Permission denied", "Camera permission is required");
            return;
        }

        const result = await launchCamera({
            mediaType: "photo",
            cameraType: "front",
            quality: 0.7,
            saveToPhotos: false
        });

        if (result.didCancel) return;

        if (result.errorCode) {
            Alert.alert("Error", result.errorMessage || "Camera error");
            return;
        }

        if (result.assets && result.assets.length > 0) {
            const selectedImage = result.assets[0];

            const error = validateImage(selectedImage);
            if (error) {
                Alert.alert("Error", error);
                return;
            }

            setPhoto(selectedImage);
        }
    };

    const pickImageFromGallery = async () => {

        const hasPermission = await requestGalleryPermission();
        if (!hasPermission) {
            Alert.alert("Permission denied", "Gallery permission is required");
            return;
        }

        const result = await launchImageLibrary({
            mediaType: "photo",
            quality: 0.7,
        });

        if (result.didCancel) return;

        if (result.errorCode) {
            Alert.alert("Error", result.errorMessage || "Gallery error");
            return;
        }

        if (result.assets && result.assets.length > 0) {
            const selectedImage = result.assets[0];

            const error = validateImage(selectedImage);
            if (error) {
                Alert.alert("Error", error);
                return;
            }

            setPhoto(selectedImage);
        }
    };

    const dlValidate = (dlNumber) => {
        let valid = true;

        const dlRegex = /^[A-Z]{2}[0-9]{2,3}[0-9]{4}[0-9]{7}$/;
        if (!dlNumber?.trim()) {
            setDlError("Driving License number is required");
            valid = false;
        } else if (!dlRegex.test(dlNumber)) {
            setDlError("Driving License Format is wrong");
            valid = false;
        }

        return valid;
    };

    const panValidate = (panNumber) => {
        let valid = true;

        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panNumber?.trim()) {
            setPanError("PAN number is required");
            valid = false;
        } else if (!panRegex.test(panNumber)) {
            setPanError("PAN number format is wrong");
            valid = false;
        }

        return valid;
    };

    const handleDLNumber = (dl) => {
        setDlNumber(dl);
        if (dlValidate(dl)) {
            setDlError("");
        }
    };

    const handlePanNumber = (pan) => {
        setPanNumber(pan);
        if (panValidate(pan)) {
            setPanError("");
        }
    };

    const handleSubmit = async () => {
        let isDLValid = dlValidate(dlNumber);
        let isPANValid = panValidate(panNumber);
        if (!photo) {
            setPhotoError("Photo is required");
        }
        if (!isDLValid || !isPANValid || !selectedVehicle || !photo) {
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("dlNumber", dlNumber.trim());
            formData.append("panNumber", panNumber.trim());
            formData.append("type", selectedVehicle);

            formData.append("selfie", {
                uri: photo.uri,
                type: photo.type || "image/jpeg",
                name: photo.fileName || "selfie.jpg",
            });

            const res = await apiClient.post(
                "/api/company/rider/document",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (res.data.success) {
                navigation.replace("SplashScreen");
            }

        } catch (error) {
            Alert.alert("Error", "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>

            {/* SCROLLABLE CONTENT */}
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: responsiveWidth(5),
                    paddingBottom: 140
                }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.header}>Document Details</Text>

                <Text style={styles.sideHeading}>Driving License Number</Text>
                <Text style={styles.hintText}>Example: AP1234567890123</Text>
                <TextInput
                    placeholder="Enter Driving License Number"
                    placeholderTextColor="#888"
                    style={styles.input}
                    maxLength={16}
                    value={dlNumber}
                    onChangeText={t => handleDLNumber(t.toUpperCase())}
                />
                {dlError && <Text style={styles.error}>{dlError}</Text>}

                <Text style={styles.sideHeading}>PAN Number</Text>
                <Text style={styles.hintText}>Example: ABCDE1234F</Text>
                <TextInput
                    placeholder="Enter PAN Number"
                    placeholderTextColor="#888"
                    style={styles.input}
                    maxLength={10}
                    value={panNumber}
                    onChangeText={t => handlePanNumber(t.toUpperCase())}
                />
                {panError && <Text style={styles.error}>{panError}</Text>}

                <Text style={styles.sideHeading}>Select Vehicle Type</Text>
                <Pressable
                    style={[styles.card, localSelected === 'bike' && styles.selectedCard]}
                    onPress={() => handleSelect('bike')}
                >
                    <Image source={require('../../assets/Bike.png')} style={styles.image} />
                    <Text style={[styles.text, localSelected === 'bike' && styles.selectedText]}>
                        Bike / Scooty
                    </Text>
                    {localSelected === 'bike' && <Ionicons name="checkmark" size={20} color="#fff" />}
                </Pressable>

                <Pressable
                    style={[styles.card, localSelected === 'ev' && styles.selectedCard]}
                    onPress={() => handleSelect('ev')}
                >
                    <Image source={require('../../assets/Ev.png')} style={styles.image} />
                    <Text style={[styles.text, localSelected === 'ev' && styles.selectedText]}>
                        EV Vehicle
                    </Text>
                    {localSelected === 'ev' && <Ionicons name="checkmark" size={20} color="#fff" />}
                </Pressable>

                <Text style={styles.sideHeading}>Upload Selfie</Text>
                <View style={styles.uploadCard}>
                    {photo ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                            <Image source={{ uri: photo.uri }} style={{ width: 80, height: 120 }} />
                            <TouchableOpacity onPress={() => setPhoto(null)} style={styles.removeButton}>
                                <Text style={{ color: "#fff" }}>Remove Photo</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity onPress={takeSelfie} style={styles.upload}>
                                <Text style={styles.uploadText}>Camera</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={pickImageFromGallery} style={styles.upload}>
                                <Text style={styles.uploadText}>Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                {photoError && <Text style={styles.error}>{photoError}</Text>}
            </ScrollView>

            {/* FIXED BUTTON */}
            <View style={styles.fixedButton}>
                <PrimaryButton
                    title={loading ? 'Submitting...' : 'Submit'}
                    onPress={handleSubmit}
                    disabled={loading}
                    bgColor="#00B5CC"
                    textColor="#fff"
                />
            </View>

        </SafeAreaView>
    );
};

export default DocumentDetailsScreen;

const styles = StyleSheet.create({
    header: {
        fontSize: responsiveFontSize(3),
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 15
    },
    sideHeading: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: wp(4),
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: wp('2.5%'),
        padding: hp('1.2%'),
        marginBottom: hp('1'),
        width: wp('90%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'black'
    },
    error: {
        color: "#F67C71",
        fontSize: 13
    },
    hintText: {
        fontSize: 13,
        color: "#6B7280",
        marginBottom: 4,
    },
    card: {
        width: responsiveWidth(90),
        height: responsiveHeight(8),
        flexDirection: 'row',
        alignItems: 'center',
        padding: responsiveWidth(4),
        marginBottom: responsiveHeight(2),
        borderWidth: 1.5,
        borderColor: '#73d1df',
        borderRadius: responsiveWidth(3),
        backgroundColor: '#fff',
    },
    selectedCard: {
        backgroundColor: '#00B5CC',
        borderColor: '#00B5CC',
    },
    image: {
        width: responsiveWidth(20),
        height: responsiveHeight(5),
        resizeMode: 'contain',
    },
    text: {
        fontSize: responsiveFontSize(2.1),
        fontWeight: '400',
        color: '#000',
        marginLeft: responsiveWidth(3),
        flex: 1,
    },
    selectedText: {
        color: '#fff',
    },
    uploadCard: {
        marginTop: 5,
        marginBottom: 5,
        alignItems: 'center',
        borderColor: '#dcd3d1',
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 30,
    },
    upload: {
        paddingHorizontal: 50,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#00B5CC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadText: {
        color: '#FFFFFF',
    },
    removeButton: {
        padding: 6,
        backgroundColor: "#F67C71",
        borderRadius: 6
    },
    fixedButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
        borderColor: '#eee'
    }
});