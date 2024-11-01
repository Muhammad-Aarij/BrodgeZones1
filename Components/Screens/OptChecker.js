import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert, Dimensions, Image } from 'react-native';
import VerifyOTP from '../Functions/VerifyOtpCode';
import fetchOTP from '../Functions/GetOtpode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoaderModal from '../Loaders/LoaderModal';
const { width } = Dimensions.get('window');
import sign from '../Images/otp.png';

export default function OTPInput({ pinCount = 6, navigation, route }) {
    const [otp, setOtp] = useState(Array(pinCount).fill(''));
    const [timer, setTimer] = useState(30);
    const inputRefs = useRef([]);
    const [isLoading, setIsLoading] = useState(false);


    const handleChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text.replace(/[^0-9]/g, '');
        setOtp(newOtp);

        if (text.length > 0 && index < pinCount - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const initializeChatArray = async () => {
        try {
            // Check if 'chatArray' exists in AsyncStorage
            const chatArray = await AsyncStorage.getItem('chatArray');

            if (chatArray === null) {
                // If 'chatArray' doesn't exist, initialize it with an empty array [{}]
                await AsyncStorage.setItem('chatArray', JSON.stringify([{}]));

                console.log('chatArray initialized and stored');
            } else {
                console.log('chatArray already exists');
            }
        } catch (error) {
            console.error('Error accessing AsyncStorage:', error);
        }
    };

    const handleFetchOTP = async () => {
        setOtp(Array(pinCount).fill(''));
        inputRefs.current[0].focus();
        const phoneNumber = await AsyncStorage.getItem("@UserNumber");
        console.log("Strted");
        try {
            setIsLoading(true);
            const otpResult = await fetchOTP(phoneNumber);
            if (otpResult.IsSuccess) {
                console.log(otpResult.OTP);
                setTimer(30);
                setIsLoading(false);
            } else {
                Alert.alert('Error', 'Failed to fetch OTP. Please try again.');
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
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
            setIsLoading(true);
            const verify = await VerifyOTP(otpCode);
            if (verify.IsSuccess) {
                setIsLoading(false);
                await AsyncStorage.setItem("@Login", "true");
                initializeChatArray();
                if (verify.Role == "Admin") {
                    await AsyncStorage.setItem("@role", "true");
                }
                else {
                    await AsyncStorage.setItem("@role", "false");
                }
                navigation.navigate("Mainpage");
            } else {
                setIsLoading(false);
                Alert.alert('Error', 'Invalid OTP code. Please try again');
            }
        }
        else {
            setIsLoading(false);
            Alert.alert('Error', 'Please complete the OTP input.');
        }
    };

    return (
        <>
            {
                isLoading ?
                    <LoaderModal />
                    :
                    <View style={[StyleSheet.absoluteFillObject, styles.maincontainer]}>
                        <Image style={styles.img} source={sign} />

                        <View style={styles.container}>
                            <Text style={{ ...styles.title, fontWeight: 'bold', fontSize: 24, marginBottom: 10, color: "#71797E" }}>Verification</Text>
                            <Text style={{ color: "#818589" }}>Enter the 6-digit OTP code sent to <Text style={{ fontWeight: "bold", color: "#71797E" }}>+{route.params.phoneNo}</Text></Text>
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
                                <Text style={{ color: "#818589", fontWeight: 'bolder', fontSize: 16, fontWeight: "bold" }}>Don't receive the code?</Text>
                                {timer != 0 && <Text style={{ fontSize: 14, color: "#848884" }}>Wait {timer} sec</Text>}
                                {timer == 0 && <Text style={{ fontSize: 14, color: "#848884" }} onPress={handleFetchOTP}>Send Again</Text>}
                            </View>
                            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>}
        </>
    );
}
// input opt txtarea
const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the alpha value for desired transparency
    },
    containerinputs: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginVertical: width * 0.078,
    },
    container: {
        backgroundColor: "rgba(255, 255, 255, 0.95)", // Slightly transparent white background
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: "50%",
        paddingHorizontal: width * 0.05,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    },
    input: {
        width: width * 0.11,
        height: width * 0.11,
        borderWidth: width * 0.004,
        borderRadius: width * 0.01,
        borderColor: '#d3d3d3',
        fontSize: width * 0.043,
        color: "grey",
        marginHorizontal: width * 0.012,
    },
    button: {
        width: '60%',
        backgroundColor: '#4BAAC8',
        paddingVertical: width * 0.025,
        paddingHorizontal: width * 0.05,
        borderRadius: 5,
        shadowColor: "#7e7b7b",
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0,
        shadowRadius: 5,
        elevation: width * 0.012,
    },
    buttonText: {
        color: '#fff',
        fontSize: width * 0.04,
        textAlign: 'center',
    },
    timer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: width * 0.08,
        width: '100%',
        gap: width * 0.025,
    },
    img: {
        // borderWidth: 3,
        // borderColor: '#4BAAC8',
        // borderRadius: width * 0.03,
        width: width * 0.7,
        height: width * 0.8,
        resizeMode: 'contain',
        // marginBottom: width * 0.01,
        marginTop: width * 0.1,
        alignSelf: 'center',
        opacity: 0.6,
    },
});
