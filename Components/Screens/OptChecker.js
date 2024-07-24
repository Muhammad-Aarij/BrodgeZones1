import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';

export default function OTPInput({ pinCount = 6, onSubmit }) {
    const [otp, setOtp] = useState(Array(pinCount).fill(''));
    const inputRefs = useRef([]);

    const handleChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text.replace(/[^0-9]/g, ''); // Only allow numbers
        setOtp(newOtp);

        // Move to next input if current input is filled
        if (text.length > 0 && index < pinCount - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

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

    const handleSubmit = () => {
        const otpCode = otp.join('');
        if (otpCode.length === pinCount) {
            onSubmit(otpCode);
        } else {
            Alert.alert('Error', 'Please complete the OTP input.');
        }
    };

    return (
        <View style={styles.maincontainer}>
            <View style={styles.container}>
                <Text style={{ ...styles.title, fontWeight: 'bold', fontSize: 24, marginBottom: 10 }}>Verification</Text>
                <Text>Enter the 6-digit OTP code sent to +1687342154</Text>
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
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});


