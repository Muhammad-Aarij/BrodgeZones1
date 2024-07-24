import React, { Component, useState } from 'react'
import { StyleSheet, View, Text, TextInput, Pressable,ImageBackground,Alert, Touchable, TouchableOpacity } from 'react-native'
import bg from '../Images/bg.png'
import fetchOTP from '../Functions/GetOtpode';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SignIn({ navigation }) {

    const [phonenumber, setPhoneNumber] = useState('15896478912');

    const handlePhoneNumberChange = (text) => {
        // Remove any non-numeric characters
        const cleaned = text.replace(/[^0-9]/g, '');
        setPhoneNumber(cleaned);
    };

    const handleFetchOTP = async () => {
        // setLoading(true);
        console.log("Strted");
        try {
            const otpResult = await fetchOTP(phonenumber);
            if (otpResult.IsSuccess) {
                await AsyncStorage.setItem('@UserNumber', phonenumber);
                console.log(otpResult.OTP);
                navigation.navigate("OTPScreen",{
                    phoneNo: phonenumber,
                });
            } else {
                Alert.alert('Error', 'Failed to fetch OTP. Please try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch OTP. Please try again.');
        } finally {
            console.log("endd");
        //   setLoading(false);
        }
      };

    return (
        <ImageBackground source={bg} style={styles.container}>
            <Text style={styles.txt}>Sign In</Text>
            <TextInput
                placeholder='Enter phone number'
                style={styles.input}
                onChangeText={handlePhoneNumberChange}
                value={phonenumber}
                keyboardType='numeric'
                maxLength={11}
            />

            <TouchableOpacity style={styles.button} onPress={handleFetchOTP}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Sign In</Text>
            </TouchableOpacity>
        </ImageBackground>
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
        fontWeight: 'bold',
        color: '#4BAAC8',
        marginBottom: 60,
        color: '#4BAAC8',
    },
    input: {
        height: 60,
        width: "85%",
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
        marginTop: "5%",
        marginBottom: 10,
        width: "60%",
        alignItems: 'center',
        justifyContent: 'center',
        
        shadowColor:"#7e7b7b",
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0,
        shadowRadius: 5,
        elevation: 6,
        
        
    }
});