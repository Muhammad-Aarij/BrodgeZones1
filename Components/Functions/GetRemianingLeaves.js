import axios from 'axios';
import { Alert } from 'react-native';

const GetRemainingLeaves = async (phoneNumber, id) => {
    try {
        const response = await axios.get(`https://api1.bridgecitycabs.com/api/LeaveManage/GetRemainingLeavesByPhoneNumber?PhoneNumber=${phoneNumber}&LeaveTypeId=${id}`);

        if (response.status === 200) {
            const data = response.data;
            console.log("profile" + JSON.stringify(data));

            console.log('Found matching LeaveTypeId:', id, data.RemainingLeaves);
            return data.RemainingLeaves;;

        } else {
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
