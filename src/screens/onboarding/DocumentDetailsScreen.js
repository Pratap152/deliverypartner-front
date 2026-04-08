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
} from 'react-native';
import {
    responsiveWidth,
    responsiveHeight,
    responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { launchCamera } from "react-native-image-picker";
import PrimaryButton from '../../components/common/PrimaryButton';
import { setSelectedVehicle } from '../../redux/slices/vehicleSlice';
import apiClient from '../../services/ApiClient';

const DocumentDetailsScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    const selectedVehicle = useSelector(state => state.vehicle.selectedVehicle);
    const [dlNumber, setDlNumber] = useState('');
    const [panNumber, setPanNumber] = useState('');
    const [localSelected, setLocalSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [errors, setErrors] = useState({
        dlNumber: "",
        panNumber: "",
    })

    const handleSelect = type => {
        setLocalSelected(type);
        dispatch(setSelectedVehicle(type));
    };

    const validateImage = (image) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!image?.type || !allowedTypes.includes(image.type)) {
            return "Only JPG and PNG images are allowed";
        }

        if (image.fileSize && image.fileSize > maxSize) {
            return "Image size should be less than 2MB";
        }

        return null;
    };

    const takeSelfie = async () => {
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

    const validate = () => {
        let valid = true;

        const newErrors = {
            dlNumber: "",
            panNumber: "",
        }

        const dlRegex = /^[A-Z]{2}[0-9]{2,3}[0-9]{4}[0-9]{7}$/;
        if (!dlNumber.trim()) {
            newErrors.dlNumber = "Driving License number is required";
            valid = false;
        } else if (!dlRegex.test(dlNumber)) {
            newErrors.dlNumber = "Driving License Format is wrong";
            valid = false;
        }

        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panNumber.trim()) {
            newErrors.panNumber = "PAN number is required";
            valid = false;
        } else if (!panRegex.test(panNumber)) {
            newErrors.panNumber = "PAN number format is wrong";
            valid = false;
        }

        setErrors(newErrors);

        return valid;
    }

    const handleSubmit = async () => {
        if(!validate() || !selectedVehicle || !photo) {
            Alert.alert("Missing", "Fill all fields");
            return;
        }

        console.log(dlNumber, panNumber, selectedVehicle, photo);

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

                if (res.data.nextStage === "EMPLOYEEKYC_VERIFICATION") {
                    navigation.navigate("SplashScreen");
                }
            }

        } catch (error) {
            console.log(error);
            console.log(error?.response.data);
            console.log(error?.response.status);
            Alert.alert("Error", "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                <Text style={styles.header}>Document Details</Text>

                <View style={{ width: 30 }}></View>
            </View>

            <Text style={styles.sideHeading}>Driving License Number</Text>

            <TextInput
                placeholder="Enter Driving License Number"
                placeholderTextColor="#888"
                style={styles.input}
                maxLength={16}
                value={dlNumber}
                onChangeText={t => setDlNumber(t.toUpperCase())}
                autoCapitalize="characters"
            />
            {errors.dlNumber && <Text style={styles.error}>{errors.dlNumber}</Text>}

            <Text style={styles.sideHeading}>PAN Number</Text>

            <TextInput
                placeholder="Enter PAN Number"
                placeholderTextColor="#888"
                style={styles.input}
                maxLength={10}
                value={panNumber}
                onChangeText={t => setPanNumber(t.toUpperCase())}
                autoCapitalize="characters"
            />
            {errors.panNumber && <Text style={styles.error}>{errors.panNumber}</Text>}

            <Text style={styles.sideHeading}>Select Vehicle Type</Text>

            {/* Bike */}
            <Pressable
                style={[styles.card, localSelected === 'bike' && styles.selectedCard]}
                onPress={() => handleSelect('bike')}
            >
                <Image source={require('../../assets/Bike.png')} style={styles.image} />
                <Text
                    style={[styles.text, localSelected === 'bike' && styles.selectedText]}
                >
                    Bike / Scooty
                </Text>

                {localSelected === 'bike' && (
                    <Ionicons
                        name="checkmark"
                        size={responsiveFontSize(3.5)}
                        color="#fff"
                    />
                )}
            </Pressable>

            {/* EV */}
            <Pressable
                style={[styles.card, localSelected === 'ev' && styles.selectedCard]}
                onPress={() => handleSelect('ev')}
            >
                <Image source={require('../../assets/Ev.png')} style={styles.image} />
                <Text
                    style={[styles.text, localSelected === 'ev' && styles.selectedText]}
                >
                    EV Vehicle
                </Text>

                {localSelected === 'ev' && (
                    <Ionicons
                        name="checkmark"
                        size={responsiveFontSize(3.5)}
                        color="#fff"
                    />
                )}
            </Pressable>

            <Text style={styles.sideHeading}>Upload Selfie</Text>
            <View style={styles.uploadCard}>
                {photo ? (
                    <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                        <Image
                            source={{ uri: photo.uri }}
                            style={{ width: 80, height: 120, }}
                        />
                        {/* Remove Button */}
                        <TouchableOpacity
                            onPress={() => setPhoto(null)}
                            style={styles.removeButton}
                        >
                            <Text style={{ color: "#fff", textAlign: "center" }}>
                                Remove Photo
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity onPress={takeSelfie} style={styles.upload}>
                        <Text style={styles.uploadText}>Upload Selfie</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <PrimaryButton
                    title={loading ? 'Submitting...' : 'Submit'}
                    onPress={handleSubmit}
                    disabled={loading}
                    bgColor="#00B5CC"
                    textColor="#fff"
                />
            </View>

        </View>
    );
};

export default DocumentDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: responsiveWidth(5),
        backgroundColor: '#fff',
    },

    header: {
        fontSize: responsiveFontSize(3),
        fontWeight: '700',
        textAlign: 'center',
        marginVertical: responsiveHeight(2),
    },

    sideHeading: {
        marginTop: 10,
        marginBottom: 10,
        fontWeight: '600',
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    error: {
        color: "#F67C71",
        fontSize: 13
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
        fontSize: responsiveFontSize(2.2),
        fontWeight: '600',
        color: '#000',
        marginLeft: responsiveWidth(3),
        flex: 1,
    },

    selectedText: {
        color: '#fff',
    },
    uploadCard: {
        marginTop: 5,
        alignItems: 'center',
        borderColor: '#dcd3d1',
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 30,

    },
    upload: {
        width: 210,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#00B5CC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadText: {
        color: '#FFFFFF',
    },
    removeButton: {
        marginTop: 5,
        padding: 6,
        backgroundColor: "#F67C71",
        borderRadius: 6
    }
});
