import axios from 'axios';
import { Alert } from 'react-native';

const GetAttendanceRequestList = async (phoneNumber) => {
    try {
        const response = await axios.get(`https://api1.bridgecitycabs.com/api/Attendance/GetAttendanceRequestList`);
        if (response.status === 200) {
            return response.data;
        } else {
            return response;
        }
    } catch (error) {
        console.error('Error Getting the Attendance Requests', error);
        // Alert.alert('Network Error');
        return;
    }
};

export default GetAttendanceRequestList;
