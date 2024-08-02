import React, { Component, useEffect, useState } from 'react'
import { StyleSheet, View, Text, TextInput, Pressable, ImageBackground, Alert, Touchable, TouchableOpacity } from 'react-native'
import bg from '../Images/bg.png'
import fetchOTP from '../Functions/GetOtpode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HandleBiometricAuth from '../Functions/FingerPrintScanner';
import LoaderModal from '../Loaders/LoaderModal';
export default function SignIn({ navigation }) {

    const [phonenumber, setPhoneNumber] = useState('15896478913');
    const [checkerphonenumber, setCheckerPhoneNumber] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handlePhoneNumberChange = (text) => {
        // Remove any non-numeric characters
        const cleaned = text.replace(/[^0-9]/g, '');
        setPhoneNumber(cleaned);
    };

    const handleFingerPrint = async () => {
        const biometriccheck = await HandleBiometricAuth();
        if (biometriccheck) {
            navigation.navigate("Mainpage");
        }
    };

    const handleFetchOTP = async () => {
        if (phonenumber.length < 11) {
            console.log("Incorrect number");
            setCheckerPhoneNumber(true);
            return
        }
        else {
            try {
                setIsLoading(true);
                const otpResult = await fetchOTP(phonenumber);
                if (otpResult.IsSuccess) {
                    await AsyncStorage.setItem('@UserNumber', phonenumber);
                    console.log(otpResult.OTP);
                    setIsLoading(false);
                    navigation.navigate("OTPScreen", {
                        phoneNo: phonenumber, 
                    });
                } else {
                    Alert.alert('Error', 'Incorrect Number Please try again.');
                    setIsLoading(false);
                }
            } catch (error) {
                setIsLoading(false);
                Alert.alert('Error', ' Please try again.');
            } finally {
                console.log("endd");
                setIsLoading(false);
            }
        }
    };

    return (
        <>
            {isLoading ?
                <LoaderModal />
                :
                <ImageBackground source={bg} style={styles.container}>
                    <Text style={styles.txt}>Sign In</Text>
                    <View style={styles.inputcontainer}>
                        <TextInput
                            placeholder='+91'
                            style={{ ...styles.input, width: 50, justifyContent: 'center', alignItems: "center" }}
                            editable={false}
                        />
                        <TextInput
                            placeholder='Enter phone number'
                            style={styles.input}
                            onChangeText={handlePhoneNumberChange}
                            value={phonenumber}
                            keyboardType='numeric'
                            maxLength={11}
                        />
                    </View>
                    <Text style={{ color: '#4BAAC8', marginBottom: 10 }}> {checkerphonenumber ? "Incorrect number" : ""}</Text>

                    <TouchableOpacity style={styles.button} onPress={handleFetchOTP}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Sign In</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.button} onPress={handleFingerPrint}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>FingerPrint Scanner</Text>
                    </TouchableOpacity> */}
                </ImageBackground>}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5'
    },

    txt: {
        fontSize: 34,
        fontFamily:"sans-serif-light",
        // fontWeight: 'bold',
        color: '#4BAAC8',
        marginBottom: 30,
        color: '#4BAAC8',
    },
    inputcontainer: {
        flexDirection: "row",
        gap: 10,
    },
    input: {
        height: 45,
        width: "60%",
        borderColor: '#4BAAC8',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        fontSize: 15,
        color: '#333',

    },
    button: {
        backgroundColor: '#4BAAC8',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: "60%",
        alignItems: 'center',
        justifyContent: 'center',

        shadowColor: "#7e7b7b",
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0,
        shadowRadius: 5,
        elevation: 6,


    }
});