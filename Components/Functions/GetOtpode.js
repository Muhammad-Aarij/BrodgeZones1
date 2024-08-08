import axios from 'axios';
import { Alert } from 'react-native';

const API_BASE_URL = 'https://api1.bridgecitycabs.com/api/Auth/GetOTPCodeforDriverSignup';

const fetchOTP = async (phoneNumber) => {
    console.log("in fetchOTP");
    try {
        const response = await axios.post(`${API_BASE_URL}`, {
            phonenumber: phoneNumber,
        });
        
        if (response.status === 200) {
            Alert.alert(response.data.OTP);
            return {
                OTP: response.data.OTP,
                Email:response.data.Email,
                IsSuccess: response.data.IsSuccess,
            };
        } else {
            return response.IsSuccess;
        }
    } catch (error) {
        console.error('Error fetching OTP:', error);
        Alert.alert('Network Error')    ;
        return;
    }
};

export default fetchOTP;
