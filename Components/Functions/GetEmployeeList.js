import axios from 'axios';
import { Alert } from 'react-native';

const GetEmployeeList = async () => {
    try {
        const response = await axios.get(`https://api1.bridgecitycabs.com/api/LeaveManage/GetListofTeamLeads`);
        // console.log(response);
        if (response.status === 200) {
            // console.log("List"+response.data);
            return response.data;
        } else {
            return response;
        }
    } catch (error) {
        console.error('Error Getting the List of team leads:', error);
        return;
    }
};

export default GetEmployeeList;
