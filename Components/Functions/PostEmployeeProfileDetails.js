import axios from 'axios';
import { Alert } from 'react-native';

const PostEmployeeProfileDetails = async (data) => {
    try {
        const response = await axios.post('https://api1.bridgecitycabs.com/api/Auth/UpdateDriverProfile', data);
        if (response.status === 200) {
            return response.data.IsSuccess;
        } else {
            return response.data.IsSuccess;
        }
    } catch (error) {
        console.error('Error Updating Profile:', error);
        Alert.alert('Network Error');
        return false;
    }
};

export default PostEmployeeProfileDetails;
