import axios from 'axios';
import { Alert } from 'react-native';

const GetLeavesforApproval = async (phoneNumber) => {
    try {
        // const response = await axios.get(`https://api1.bridgecitycabs.com/api/LeaveManage/GetLeavesStatus?PhoneNumber=${phoneNumber}`);
        const response = await axios.get(`https://api1.bridgecitycabs.com/api/LeaveManage/GetLeavesforApproval?PhoneNumber=923445287742`);
        // console.log(response);
        if (response.status === 200) {
            console.log("profile"+response.data);
            return response.data;
        } else {
            return response;
        }
    } catch (error) {
        console.error('Error Getting the Requested Leaves', error);
        // Alert.alert('Network Error');
        return;
    }
};

export default GetLeavesforApproval;
