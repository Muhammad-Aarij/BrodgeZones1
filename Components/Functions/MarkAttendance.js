import axios from 'axios';
import { Alert } from 'react-native';

const API_BASE_URL = 'https://api1.bridgecitycabs.com/api/Attendance/MarkAttendance';

const MarkAttendace = async (phoneNumber,Status) => {
    console.log(phoneNumber,Status);
    try {
        const response = await axios.post(`${API_BASE_URL}`, {
            createdBy: "string",
            modifiedBy: "string",
            status: Status,
            phoneNumber: phoneNumber,
        });
        
        if (response.status === 200) {
            console.log("Marked");
            // Alert.alert("","Attendance Marked Successfully");
            return response.data.IsSuccess;
        } else {
            console.log("Not Marked");
            return response.data.IsSuccess;
        }
    } catch (error) {
        console.error('Error Marking Attendance:', error);
        Alert.alert('Network Error',"Could Mark your Attendance, please try again later.");
        return;
    }
};

export default MarkAttendace;
