import ReactNativeBiometrics from 'react-native-biometrics';
import { Alert } from 'react-native';

const biometrics = new ReactNativeBiometrics();

const HandleFaceIDAuth = async () => {
    try {
        const { available, biometryType } = await biometrics.isSensorAvailable();
        if (available && biometryType === ReactNativeBiometrics.FaceID) {
            const { success } = await biometrics.simplePrompt({
                promptMessage: 'Confirm Your Face ID'
            });
            if (success) {
                console.log('Authenticated successfully');
                return true;
            } else {
                Alert.alert('Authentication failed');
                return false;
            }
        } else {
            Alert.alert('Face ID authentication not available');
            return false;
        }
    } catch (error) {
        Alert.alert('Error in the biometric process', error.message);
        return false;
    }
};

export default HandleFaceIDAuth;
