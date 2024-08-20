import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Modal, Dimensions } from 'react-native';
import LoaderModal from '../Loaders/LoaderModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetEmployeeProfileDetails from '../Functions/GetEmployeeProfileDetails';
import PostEmployeeProfileDetails from '../Functions/PostEmployeeProfileDetails';
import noimg from '../Images/nouser.jpg';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import UpdateProfileImage from '../Functions/UpdateProfileImage';
import SuccessModal from '../Loaders/SuccessModal';
import FailedModal from '../Loaders/FailedModal';

const { width } = Dimensions.get('window');

export default function Profile() {
    const [name, setName] = useState('');
    const [firstname, setgfirstName] = useState('');
    const [lastname, setlastName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [picture, setPicture] = useState(null);
    const [newpicture, setNewPicture] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFailedModal, setShowFailedModal] = useState(false);


    const requestCameraPermission = async () => {
        const result = await request(PERMISSIONS.ANDROID.CAMERA);
        return result;
    };

    const pickImageFromGallery = () => {
        const options = {
            mediaType: 'photo',
            maxWidth: 300,
            maxHeight: 300,
            quality: 1,
        };

        launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                setModalVisible(!modalVisible)
                const file = response.assets[0];
                setPicture(file.uri);
                setNewPicture(file.uri);
                updateImage(file);
            }
        });
    };

    const takePhotoWithCamera = async () => {
        const permissionResult = await requestCameraPermission();
        if (permissionResult === RESULTS.GRANTED) {
            const options = {
                mediaType: 'photo',
                maxWidth: 300,
                maxHeight: 300,
                quality: 1,
            };

            launchCamera(options, response => {
                if (response.didCancel) {
                    console.log('User cancelled camera');
                } else if (response.errorCode) {
                    console.log('Camera Error: ', response.errorMessage);
                } else {
                    setModalVisible(!modalVisible)
                    const source = { uri: response.assets[0].uri };
                    setModalVisible(false);
                    setNewPicture(source.uri);
                    updateImage(source);
                }
            });
        } else {
            Alert.alert('Camera permission denied');
        }
    };

    const updateImage = async (img) => {
        setIsLoading(true);
        const number = await AsyncStorage.getItem("@UserNumber");
        console.log("Image" + img);
        console.log("Number" + number);
        const sendImg = await UpdateProfileImage(img, number);

        if (sendImg) {
            setIsLoading(false);
            setPicture(img);
        } else {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const getProfileDetails = async () => {
            try {
                setIsLoading(true);
                const number = await AsyncStorage.getItem('@UserNumber');
                const data = await GetEmployeeProfileDetails(number);
                if (data) {
                    setName(data.Name);
                    setEmail(data.Email);
                    setContact(number);
                    setAddress(data.Address);
                    setPicture(data.PicturePath);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        getProfileDetails();
    }, []);

    const handleSave = async () => {
        const number = await AsyncStorage.getItem('@UserNumber');
        setIsLoading(true);
        const data = {
            createdBy: email,
            modifiedBy: email,
            firstName: firstname,
            lastName: lastname,
            contactNo: number,
            address: address,
            email: email
        };
        const success = await PostEmployeeProfileDetails(data);
        if (success) {
            // Alert.alert('Profile updated successfully');
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 3000);
            setIsEditable(false);
        } else {
            setShowFailedModal(true);
            setTimeout(() => setShowFailedModal(false), 3000);
            // Alert.alert('Failed to update profile');
        }
        setIsLoading(false);
    };

    return (
        <>
            {isLoading ?
                <LoaderModal />
                :
                <ScrollView style={styles.maincontainer}
                    contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
                    <View style={styles.header}>
                        <Text style={styles.heading}>Profile</Text>
                    </View>
                    <View style={styles.imageContainer}>
                        {picture == null ? (
                            <Image style={styles.profileimage} source={noimg} />
                        ) : (
                            <Image style={styles.profileimage} source={{ uri: picture }} />
                        )}
                        {
                            <TouchableOpacity style={styles.changeButton} onPress={() => setModalVisible(true)}>
                                <Text style={styles.buttonText}>+</Text>
                            </TouchableOpacity>}
                    </View>
                    <View style={styles.fielscontainer}>
                        {<View style={styles.dataline}>
                            <Text style={styles.txt}>Name </Text>
                            <TextInput
                                placeholder='Name'
                                style={[styles.input, { backgroundColor: '#F0F0F0', color: 'grey' }]}
                                onChangeText={setName}
                                value={name}
                                editable={false}
                            />
                        </View>}
                        {/* {isEditable && <View style={styles.dataline}>
                            <Text style={styles.txt}>First Name </Text>
                            <TextInput
                                placeholder='Enter First Name'
                                style={[styles.input, { backgroundColor: isEditable ? '#FFFFFF' : '#F0F0F0', color: isEditable ? 'black' : 'grey' }]}
                                onChangeText={setgfirstName}
                                value={firstname}
                                editable={isEditable}
                            />
                        </View>}
                      {isEditable &&  <View style={styles.dataline}>
                            <Text style={styles.txt}>last Name </Text>
                            <TextInput
                                placeholder='Enter Last  Name'
                                style={[styles.input, { backgroundColor: isEditable ? '#FFFFFF' : '#F0F0F0', color: isEditable ? 'black' : 'grey' }]}
                                onChangeText={setlastName}
                                value={lastname}
                                editable={isEditable}
                            />
                        </View>} */}
                        <View style={styles.dataline}>
                            <Text style={styles.txt}>Contact</Text>
                            <TextInput
                                placeholder='Contact'
                                style={[styles.input, { backgroundColor: '#F0F0F0', color: 'grey' }]}
                                onChangeText={setContact}
                                value={contact}
                                editable={false}
                            />
                        </View>
                        <View style={styles.dataline}>
                            <Text style={styles.txt}>Email</Text>
                            <TextInput
                                placeholder='Email'
                                style={[styles.input, { backgroundColor: isEditable ? '#FFFFFF' : '#F0F0F0', color: isEditable ? 'black' : 'grey' }]}
                                onChangeText={setEmail}
                                value={email}
                                editable={isEditable}
                            />
                        </View>
                        <View style={styles.dataline}>
                            <Text style={styles.txt}>Address</Text>
                            <TextInput
                                placeholder='Address'
                                style={[styles.input, { backgroundColor: isEditable ? '#FFFFFF' : '#F0F0F0', color: isEditable ? 'black' : 'grey' }]}
                                onChangeText={setAddress}
                                value={address}
                                editable={isEditable}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", gap: 15 }}>
                        {!isEditable && <TouchableOpacity style={{ ...styles.button, width: "45%" }} onPress={() => setIsEditable(true)}>
                            <Text style={{ color: "white" }}>{'Edit'}</Text>
                        </TouchableOpacity>}
                        {isEditable && <TouchableOpacity style={{ ...styles.button, width: "30%" }} onPress={() => setIsEditable(false)}>
                            <Text style={{ color: "white" }}>{'Cancel'}</Text>
                        </TouchableOpacity>}
                        {isEditable && <TouchableOpacity style={{ ...styles.button, width: "45%" }} onPress={handleSave}>
                            <Text style={{ color: "white" }}>Save</Text>
                        </TouchableOpacity>}
                    </View>

                    {/* Image Picker Modal */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Upload Image</Text>
                                <TouchableOpacity style={styles.modalButton} onPress={pickImageFromGallery}>
                                    <Text style={styles.buttonText}>Choose from Gallery</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={takePhotoWithCamera}>
                                    <Text style={styles.buttonText}>Take Photo</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButtoncross} onPress={() => setModalVisible(!modalVisible)}>
                                    <Text style={styles.buttonTextcross}>X</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    {showSuccessModal && <SuccessModal  />}
                    {showFailedModal && <FailedModal message={"Profile could'nt be Updated"} />}
                </ScrollView>
            }
        </>
    );
}

const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        flexDirection: 'column',
        // padding: width * 0.025,
        backgroundColor: '#FFFFFF',
    },
    input: {
        height: width * 0.12,
        width: "100%",
        borderColor: '#4BAAC8',
        borderWidth: 1.5,
        marginBottom: width * 0.025,
        paddingHorizontal: width * 0.025,
        borderRadius: width * 0.02,
        fontSize: width * 0.038,
    },
    profileimage: {
        marginVertical: width * 0.05,
        borderWidth: width * 0.005,
        borderRadius: width * 0.01,
        borderColor: '#4BAAC8',
        width: width * 0.35,
        height: width * 0.35,
        overflow: 'hidden',
        shadowColor: "#7e7b7b",
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0,
        shadowRadius: 5,
        elevation: width * 0.014,
    },
    heading: {
        fontSize: width * 0.065,
        fontWeight: 'bold',
        color: '#4BAAC8',
        marginTop: width * 0.025,
    },
    button: {
        backgroundColor: '#4BAAC8',
        padding: width * 0.025,
        borderRadius: 5,
        marginTop: width * 0.08,
        marginBottom: width * 0.025,
        width: "35%",
        alignItems: 'center',
        justifyContent: 'center',
        color: "white",
    },
    fielscontainer: {
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    dataline: {
        width: "80%",
    },
    txt: {
        fontSize: width * 0.038,
        color: "#4BAAC8",
        marginBottom: 5,
        fontWeight: "bold",
    },
    header: {
        width: "100%",
        height: width * 0.17,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingLeft: width * 0.05,
    },
    heading: {
        fontFamily: "sans-serif-medium",
        fontSize: width * 0.06,
        color: '#4BAAC8',
    },
    imageContainer: {
        position: 'relative',
        marginVertical: width * 0.04,
    },
    profileimage: {
        width: width * 0.38,
        height: width * 0.38,
        borderRadius: width * 0.08,
        borderWidth: width * 0.0065,
        borderColor: "#4BAAC8",
    },
    changeButton: {
        position: 'absolute',
        right: -width * 0.025,
        bottom: -width * 0.025,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4BAAC8',
        borderRadius: width * 0.05,
        width: width * 0.076,
        height: width * 0.07,
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0,
        shadowRadius: 5,
        elevation: width * 0.014,
    },
    buttonText: {
        color: 'white',
        fontFamily: "sans-serif-light",
        fontSize: width * 0.036,
    },
    buttonTextcross: {
        color: 'white',
        fontSize: width * 0.025,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalView: {
        margin: width * 0.05,
        backgroundColor: 'white',
        borderRadius: width * 0.025,
        padding: width * 0.082,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalButton: {
        backgroundColor: '#4BAAC8',
        borderRadius: width * 0.025,
        padding: width * 0.025,
        elevation: 2,
        marginVertical: width * 0.013,
        width: width * 0.5,
    },
    modalButtoncross: {
        backgroundColor: 'red',
        borderRadius: width * 0.025,
        // padding: 10,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: width * 0.01,
        marginTop: width * 0.04,
        width: width * 0.08,
        height: width * 0.08,
    },
    modalText: {
        marginBottom: width * 0.038,
        textAlign: 'center',
        fontSize: width * 0.036,
        color: "#404040",
        fontFamily: "sans-serif-light",
        fontWeight: '800',
    },
});
