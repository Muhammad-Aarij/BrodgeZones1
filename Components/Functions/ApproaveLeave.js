import axios from 'axios';
import { Alert } from 'react-native';

const ApproaveLeave = async (data) => {
    try {
        const response = await axios.post('https://api1.bridgecitycabs.com/api/LeaveManage/ApproveLeaveRequest', data);
        if (response.status === 200) {
            return response.data.IsSuccess;
        } else {
            return response.data.IsSuccess;
        }
    } catch (error) {
        console.error('Error Applying for Leave:', error);
        return false;
    }
};

export default ApproaveLeave;
