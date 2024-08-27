import axios from 'axios';

const uploadDocuments = async (file, number) => {
  const formData = new FormData();

  formData.append('files', {
    uri: file.uri,
    type: file.type, 
    name: file.fileName || file.name, 
  });
  formData.append('Description', 'Medical Evidence');
  formData.append('ContactNo', number);

  try {
    // Make the POST request
    const response = await axios.post('https://api1.bridgecitycabs.com/api/Auth/UploadDocuments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Handle the response
    if (response.data.isSuccess) {
      console.log('Documents uploaded successfully');
    } else {
      console.error('Failed to upload documents:', response.data.message || 'Unknown error');
    }
  } catch (error) {
    console.error('Error uploading documents:', error.response?.data || error.message || error);
  }
};

export default uploadDocuments;
