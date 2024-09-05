import axios from 'axios';
import moment from 'moment';  // Ensure moment is imported
import { Alert } from 'react-native';

const API_BASE_URL = 'https://api1.bridgecitycabs.com/api/Attendance/MarkAttendance';

const MarkAttendance = async (phoneNumber, Status, time) => {
    try {
        const payload = {
            createdBy: "string",
            modifiedBy: "string",
            status: Status,
            phoneNumber: phoneNumber,
        };

        if (time !== 0) {
            const formattedTime = moment(time).format('YYYY-MM-DD HH:mm:ss');
            payload.CreatedDate = formattedTime;
            payload.ModifiedDate = formattedTime;
            console.log("Time in API: " + formattedTime);  // Log formatted time
        }

        const response = await axios.post(API_BASE_URL, payload);

        if (response.status === 200) {
            console.log("Date: " + payload.CreatedDate);
            console.log("Marked");
            return response.data.IsSuccess;
        } else {
            console.log("Not Marked");
            return response.data.IsSuccess;
        }
    } catch (error) {
        console.error('Error Marking Attendance:', error.response || error.message);
        Alert.alert('Network Error', "Could not mark your attendance. Please try again later.");
        return false; // Return a default value or handle error state as needed
    }
};

export default MarkAttendance;
