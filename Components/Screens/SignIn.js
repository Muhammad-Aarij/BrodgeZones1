import React, { Component, useEffect, useState } from 'react'
import { StyleSheet, View, Text, TextInput, BackHandler, ImageBackground, Alert, Touchable, TouchableOpacity, Dimensions } from 'react-native'
import bg from '../Images/bg.png'
import { useFocusEffect } from '@react-navigation/native'

import fetchOTP from '../Functions/GetOtpode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HandleBiometricAuth from '../Functions/FingerPrintScanner';
import LoaderModal from '../Loaders/LoaderModal';
const { width } = Dimensions.get('window');

export default function SignIn({ navigation }) {

    const [phonenumber, setPhoneNumber] = useState('15034161315');
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
    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                BackHandler.exitApp();
                return true;
            };

            const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

            return () => backHandler.remove();
        }, [])
    );

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
                    if (otpResult.Email == null) {
                        await AsyncStorage.setItem('@UserEmail', "No_Email");
                    }
                    else {
                        await AsyncStorage.setItem('@UserEmail', otpResult.Email);
                    }
                    console.log(otpResult.OTP);
                    console.log("Email" + otpResult.Email);
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
                console.log(error);
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
                    <Text style={{ color: '#ff9292', marginVertical: 10, fontFamily: "sans-serif-medium" }}> {checkerphonenumber ? "Incorrect number" : ""}</Text>
                    <View style={styles.inputcontainer}>
                        <TextInput
                            placeholder='+1'
                            style={{ ...styles.input, width: width * 0.12, justifyContent: 'center', alignItems: "center" }}
                            value='+1'
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
        fontSize: width * 0.08,
        fontFamily: "sans-serif-medium",
        // fontWeight: 'bold',
        color: '#4BAAC8',
        color: '#4BAAC8',
    },
    inputcontainer: {
        flexDirection: "row",
        gap: width * 0.025,
    },
    input: {
        height: width * 0.12,
        width: "60%",
        borderColor: '#4BAAC8',
        borderWidth: width * 0.003,
        marginBottom: width * 0.025,
        paddingHorizontal: width * 0.025,
        borderRadius: width * 0.013,
        fontSize: width * 0.036,
        color: '#404040',

    },
    button: {
        backgroundColor: '#4BAAC8',
        padding: width * 0.025,
        borderRadius: width * 0.013,
        marginVertical: width * 0.05,
        width: width * 0.43,
        alignItems: 'center',
        justifyContent: 'center',

        shadowColor: "#7e7b7b",
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0,
        shadowRadius: 5,
        elevation: width * 0.013,


    }
});