import axios from 'axios';
import { Alert } from 'react-native';

const API_BASE_URL = 'https://api1.bridgecitycabs.com/api/Attendance/GetAttendanceSheetByPhoneNumber';
const month=  new Date().getUTCMonth()+1;
const dayOfMonth = new Date().getDate();

const GetAttendanceSheetByPhoneNumber = async (phoneNumber) => {
    try {
        const response = await axios.get(`${API_BASE_URL}?PhoneNumber=${phoneNumber}&FromDate=2024-${month}-01&ToDate=2024-${month}-${dayOfMonth}`);
        // console.log(response);
        if (response.status === 200) {
            return response.data;
        } else {
            return response;
        }
    } catch (error) {
        console.error('Error Attendance Data:', error);
        Alert.alert('Network Error');
        return;
    }
};

export default GetAttendanceSheetByPhoneNumber;
