import axios from 'axios';

const API_BASE_URL = 'https://api1.bridgecitycabs.com/api/Auth/GetOTPCodeforPassengerSignup';

const fetchOTP = async (phoneNumber) => {
    try {
        const response = await axios.post(`${API_BASE_URL}`, {
            phonenumber: phoneNumber,
        });

        if (response.status === 200) {
            return {
                OTP: response.data.OTP,
                IsSuccess: response.data.IsSuccess,
              
            };
        } else {
            throw new Error('Failed to fetch OTP');
        }
    } catch (error) {
        console.error('Error fetching OTP:', error);
        throw error;
    }
};

export default fetchOTP;
