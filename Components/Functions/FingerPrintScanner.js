import ReactNativeBiometrics from 'react-native-biometrics';
import { Alert } from 'react-native';

const biometrics = new ReactNativeBiometrics();

const HandleBiometricAuth = async () => {
    try {
        const { available, biometryType } = await biometrics.isSensorAvailable();
        if ((available) ) {
            const { success } = await biometrics.simplePrompt({
                promptMessage: 'Confirm Your Fingerprint'
            });
            if (success) {
                console.log('Authenticated successfully');
                return true;
            } else {
                Alert.alert('Authentication failed');
                return false;
            }
        } else {
            Alert.alert('Biometrics not available');
            return false;
        }
    } catch (error) {
        console.log(error.message);
        Alert.alert('Error in the biometric process', error.message);
        return false;
    }
};

export default HandleBiometricAuth;
    