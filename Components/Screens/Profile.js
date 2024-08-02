import React, { useEffect, useState } from 'react';
import bg from '../Images/bg.png';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, TextInput, Alert } from 'react-native';
import profile from '../Images/aj.jpg';
import LoaderModal from '../Loaders/LoaderModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetEmployeeProfileDetails from '../Functions/GetEmployeeProfileDetails';
import PostEmployeeProfileDetails from '../Functions/PostEmployeeProfileDetails';

export default function Profile() {
    const [name, setName] = useState('Muhammad Aarij');
    const [email, setEmail] = useState('aarijm5@gmail.com');
    const [contact, setContact] = useState('03219548171');
    const [address, setAddress] = useState('University town, Islamabad');
    const [picture, setPicture] = useState('Call Center');
    const [isLoading, setIsLoading] = useState(false);
    const [isEditable, setIsEditable] = useState(false);

    useEffect(() => {
        const getProfileDetails = async () => {
            try {
                setIsLoading(true);
                const number = await AsyncStorage.getItem('@UserNumber');
                const data = await GetEmployeeProfileDetails(number);
                if (data) {
                    setName(data.Name);
                    setEmail(data.Email);
                    setContact(data.PhoneNumber);
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
        setIsLoading(true);
        const data = {
            createdBy: email,
            modifiedBy: email,
            firstName: name,
            contactNo: contact,
            address: address
        };
        const success = await PostEmployeeProfileDetails(data);
        if (success) {
            Alert.alert('Profile updated successfully');
            setIsEditable(false);
        } else {
            Alert.alert('Failed to update profile');
        }
        setIsLoading(false);
    };

    return (
        <>
            {isLoading ?
                <LoaderModal />
                :
                <ImageBackground source={bg} style={styles.maincontainer}>
                    <Text style={styles.heading}>Profile</Text>
                    <Image style={styles.profileimage} source={{ uri: picture }} />
                    <View style={styles.fielscontainer}>
                        <View style={styles.dataline}>
                            <Text style={styles.txt}>Name </Text>
                            <TextInput
                                placeholder='Name'
                                style={[styles.input, { backgroundColor: isEditable ? '#FFFFFF' : '#F0F0F0', color: isEditable ? 'black' : 'grey' }]}
                                onChangeText={setName}
                                value={name}
                                editable={isEditable}
                            />
                        </View>
                        <View style={styles.dataline}>
                            <Text style={styles.txt}>Contact</Text>
                            <TextInput
                                placeholder='Contact'
                                style={[styles.input, { backgroundColor: !isEditable ? '#FFFFFF' : '#F0F0F0', color: !isEditable ? 'black' : 'grey' }]}
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
                </ImageBackground>
            }
        </>
    );
}

const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
    },
    input: {
        height: 50,
        width: "100%",
        borderColor: '#4BAAC8',
        borderWidth: 1.5,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        fontSize: 15,
    },
    profileimage: {
        marginVertical: 20,
        borderWidth: 5,
        borderRadius: 100,
        borderColor: '#4BAAC8',
        width: 150,
        height: 150,
        overflow: 'hidden',
        shadowColor: "#7e7b7b",
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0,
        shadowRadius: 5,
        elevation: 6,
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 50,
    },
    button: {
        backgroundColor: '#4BAAC8',
        padding: 10,
        borderRadius: 5,
        marginTop: 30,
        marginBottom: 10,
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
        fontSize: 15,
        color: "#4BAAC8",
        marginBottom: 5,
        fontWeight: "bold",
    }
});
