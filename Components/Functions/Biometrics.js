// import ReactNativeBiometrics from 'react-native-biometrics';

// const checkFingerprintAvailability = async () => {
//     try {
//         const biometrics = new ReactNativeBiometrics();
//         const { available, biometryType } = await biometrics.isSensorAvailable();

//         if (available && biometryType === ReactNativeBiometrics.Biometrics) {
//             console.log('Fingerprint sensor is available.');
//             return true; // Fingerprint is available
//         } else {
//             console.log('Fingerprint sensor is not available or not set up.');
//             return false; // Fingerprint is not available
//         }
//     } catch (error) {
//         console.error('Error checking biometric availability', error.message);
//         return false; // Error checking availability
//     }
// };

// const biometrics = new ReactNativeBiometrics();

// const generateBiometricKey = async () => {
//     try {
//         const { success } = await biometrics.createKeys();
//         if (success) {
//             console.log('Biometric keys created successfully');
//             // You can now send a success response to the server
//         } else {
//             console.error('Failed to create biometric keys');
//         }
//     } catch (error) {
//         console.error('Error creating biometric keys', error.message);
//     }
// };

