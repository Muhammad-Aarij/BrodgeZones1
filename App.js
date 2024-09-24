import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Alert, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import NavigationRoutes from './Components/Routing/NavigationRoutes';
import notifee from '@notifee/react-native';
import { PopNotification } from './Components/Functions/Notifications';

const App = () => {
    useEffect(() => {
        requestUserPermission();
    }, []);

    const requestUserPermission = async () => {
        if (Platform.OS === 'ios') {
            // Request permission for notifications on iOS
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;
            if (enabled) {
                console.log('Authorization status:', authStatus);
            } else {
                console.log('Notification permissions not granted:', authStatus);
            }
        }

        // Get the FCM token
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
            console.log('FCM Token:', fcmToken);
            // TODO: You can send this token to your backend for future notifications
        } else {
            console.log('Failed to get FCM token');
        }
    };

    // const displayNotifications = async notification => {
    //     try {
    //         // Create a notification channel
    //         const channelId = await notifee.createChannel({
    //             id: 'default',
    //             name: 'Default Channel',
    //             sound: 'default',
    //             vibration: true,
    //         });
    //         console.log('Notification channel created:', channelId);

    //         // Display the notification
    //         await notifee.displayNotification({
    //             title: notification.title,
    //             body: notification.body,
    //             android: {
    //                 channelId,
    //                 sound: 'default',
    //             },
    //             ios: {
    //                 sound: 'default',
    //             },
    //         });
    //         console.log('Notification displayed successfully');
    //     } catch (error) {
    //         console.error('Error displaying notification:', error);
    //     }
    // };

    return (
        <NavigationContainer>
            <NavigationRoutes />
        </NavigationContainer>
    );
};

export default App;
