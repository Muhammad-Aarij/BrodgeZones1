import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const API_BASE_URL = 'https://api1.bridgecitycabs.com/api/Auth/VerifiyOTPCodeforSignup';

const VerifyOTP = async (OTP) => {
    const phoneNumber = await AsyncStorage.getItem('@UserNumber');
    try {
        const response = await axios.post(API_BASE_URL, {
            phoneNo: phoneNumber,
            otpCode: OTP,
            password: "strings",
            email: "string",
        });

        if (response.status === 200) {
            const data = response.data;
            await AsyncStorage.setItem('@Login', 'true');
            console.log("Success: ", data);
            return data.IsSuccess;
        } else if (response.status === 400) {
            return response.data.IsSuccess;
        }
    } catch (error) {
        console.error('Error Verifying OTP:', error);
        Alert.alert('Network Error',"Error Verifying OTP");
        return  ;
    }
};

export default VerifyOTP;
