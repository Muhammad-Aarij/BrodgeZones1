import axios from 'axios';
import { Alert } from 'react-native';

const GetRemainingLeaves = async (phoneNumber, id) => {
    try {
        const response = await axios.get(`https://api1.bridgecitycabs.com/api/LeaveManage/GetRemainingLeavesByPhoneNumber?PhoneNumber=${phoneNumber}&LeaveTypeId=${id}`);

        if (response.status === 200) {
            const data = response.data;
            console.log('API Data:', data);
            
            if (data && data.RemainingLeaves !== undefined) {
                console.log("remainingLeaves:", data.RemainingLeaves);
                return data.RemainingLeaves;
            } else {
                console.warn('Data does not contain RemainingLeaves:', data);
                return null;
            }
        }
         else {
            console.warn('Unexpected response status:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error Getting the Remaining Leaves:', error);
        Alert.alert('Network Error');
        return null;
    }
};

export default GetRemainingLeaves;
