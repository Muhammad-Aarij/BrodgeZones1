import axios from 'axios';
import { Alert } from 'react-native';

const API_BASE_URL = 'https://api1.bridgecitycabs.com/api/DriverManage/UploadDriverPicture';

const UpdateProfileImage = async (file, phoneNumber) => {
    try {
        // Create a FormData instance
        const formData = new FormData();

        // Append the file to the FormData object
        formData.append('files', {
            uri: file.uri,
            type: file.type || 'image/jpeg', // Use provided type or default to 'image/jpeg'
            name: file.fileName || 'profile.jpg', // Use provided name or default to 'profile.jpg'
        });

        // Append other fields
        formData.append('DriverId', '31');
        formData.append('ContactNo', phoneNumber);
        formData.append('Description', 'Picture');

        // Make the POST request
        const response = await axios.post(API_BASE_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Handle the response
        if (response.status === 200) {
            Alert.alert("Profile Image Successfully Updated");
            return response.data.IsSuccess;
        } else if (response.status === 400) {
            return response.data.IsSuccess;
        }
    } catch (error) {
        console.error('Error updating Profile Image:', error);
        Alert.alert('Network Error', 'Error Updating Profile Image');
        return false;
    }
};

export default UpdateProfileImage;
