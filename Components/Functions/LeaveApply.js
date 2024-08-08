import axios from 'axios';
import { Alert } from 'react-native';

const LeaveApply = async (data) => {
    try {
        const response = await axios.post('https://api1.bridgecitycabs.com/api/LeaveManage/LeaveApply', data);
        if (response.status === 200) {
            return response.data.IsSuccess;
        } else {
            return response.data.IsSuccess;
        }
    } catch (error) {
        console.error('Error Applying for Leave:', error);
        // Alert.alert('Network Error');
        return false;
    }
};

export default LeaveApply;
