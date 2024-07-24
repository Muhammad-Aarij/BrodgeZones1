import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import VerifyOTP from '../Functions/VerifyOtpCode';
import fetchOTP from '../Functions/GetOtpode';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function OTPInput({ pinCount = 6, navigation,route }) {
    const [otp, setOtp] = useState(Array(pinCount).fill(''));
    const [timer, setTimer] = useState(30);
    const inputRefs = useRef([]);
    
    const handleChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text.replace(/[^0-9]/g, ''); 
        setOtp(newOtp);

        if (text.length > 0 && index < pinCount - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleFetchOTP = async () => {
        const phoneNumber = await AsyncStorage.getItem("@UserNumber");
        console.log("Strted");
        try {
            const otpResult = await fetchOTP(phoneNumber);
            if (otpResult.IsSuccess) {

                console.log(otpResult.OTP);
                setTimer(30); 
            } else {
                Alert.alert('Error', 'Failed to fetch OTP. Please try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch OTP.');
        } finally {
            console.log("endd");

        }
    };

    useEffect(() => {
        const countdownInterval = setTimeout(() => {
            if (timer > 0) {
                setTimer(timer - 1);
            }
        }, 1000);

        return () => clearTimeout(countdownInterval);
    }, [timer]);

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && otp[index] === '') {
            if (index > 0) {
                inputRefs.current[index - 1].focus();
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
            }
        }
    };

    const handleSubmit = async () => {
        const otpCode = otp.join('');
        if (otpCode.length === pinCount) {
            try {
                const verify = await VerifyOTP(otpCode);
                if (verify) {
                    
                    navigation.navigate("Mainpage");
                } else {
                    Alert.alert('Error', 'Invalid OTP code. Please try again.');
                    setOtp(Array(pinCount).fill(''));
                }
            } catch (error) {
                console.error('Network Error:', error);
                Alert.alert('Network Error', 'Failed to verify OTP. Please check your network connection.');
            }
        } else {
            Alert.alert('Error', 'Please complete the OTP input.');
        }
    };

    return (
        <View style={styles.maincontainer}>
            <View style={styles.container}>
                <Text style={{ ...styles.title, fontWeight: 'bold', fontSize: 24, marginBottom: 10 }}>Verification</Text>
                <Text>Enter the 6-digit OTP code sent to <Text style={{fontWeight:"bold"}}>+{route.params.phoneNo}</Text></Text>
                <View style={styles.containerinputs}>
                    {otp.map((_, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={styles.input}
                            keyboardType='numeric'
                            maxLength={1}
                            onChangeText={(text) => handleChange(text, index)}
                            value={otp[index]}
                            textAlign='center'
                            onKeyPress={(e) => handleKeyPress(e, index)}
                        />
                    ))}
                </View>
                <View style={styles.timer}>
                    <Text style={{ ...styles.title, fontWeight: 'bolder', fontSize: 16, fontWeight:"bold" }}>Don't receive the code?</Text>
                    {timer != 0 && <Text style={{ fontSize: 14 }}>Wait {timer} sec</Text>}
                    {timer == 0 && <Text style={{ fontSize: 14 }} onPress={handleFetchOTP}>Send Again</Text>}
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerinputs: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginVertical: 30,
    },
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    input: {
        width: 45,
        height: 50,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#d3d3d3',
        fontSize: 18,
        marginHorizontal: 5,
    },
    button: {
        width: '60%',
        backgroundColor: '#4BAAC8',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        shadowColor:"#7e7b7b",
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0,
        shadowRadius: 5,
        elevation: 6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    timer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        width: '100%',
        gap: 10,


    }
});


