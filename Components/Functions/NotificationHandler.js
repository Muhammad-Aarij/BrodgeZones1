// Components/NotificationHandler.js

import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PopNotification } from './Notifications';

const NotificationHandler = () => {
    useEffect(() => {
        const handleForegroundNotification = async (remoteMessage) => {
            const sender = 'User123'; // Set the sender value dynamically
            if (remoteMessage.notification) {
                PopNotification(remoteMessage.notification); // Display notification
                console.log('Foreground notification: ', remoteMessage);
                await saveMessageToAsyncStorage(remoteMessage, sender); // Save message with sender to AsyncStorage
            }
        };

        // Function to save message to AsyncStorage with sender attribute
        const saveMessageToAsyncStorage = async (message, sender) => {
            try {
                const chatArray = await AsyncStorage.getItem('chatArray');
                let parsedChatArray = chatArray ? JSON.parse(chatArray) : [];
                const messageWithSender = { sender, message: message.notification.body };
                parsedChatArray.push(messageWithSender);
                await AsyncStorage.setItem('chatArray', JSON.stringify(parsedChatArray));
                console.log('Message with sender saved to chatArray:', messageWithSender);
            } catch (error) {
                console.error('Error saving message to AsyncStorage:', error);
            }
        };

        // Handle foreground messages (FCM)
        const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
            await handleForegroundNotification(remoteMessage);
        });

        // Handle background messages (FCM)
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            const sender = 'User123'; // Set the sender value dynamically
            console.log('Message handled in the background:', remoteMessage);
            if (remoteMessage.notification) {
                PopNotification(remoteMessage.notification); // Display notification
                await saveMessageToAsyncStorage(remoteMessage, sender); // Save message with sender to AsyncStorage
            }
        });

        // Handle messages when the app is in the killed state
        messaging().getInitialNotification()
            .then(async remoteMessage => {
                const sender = 'User123'; // Set the sender value dynamically
                if (remoteMessage) {
                    console.log('Message handled in the kill state:', remoteMessage);
                    PopNotification(remoteMessage.notification); // Display notification
                    await saveMessageToAsyncStorage(remoteMessage, sender); // Save message with sender to AsyncStorage
                }
            });

        // Handle notification actions in the foreground
        const unsubscribeOnForegroundEvent = notifee.onForegroundEvent(({ type, detail }) => {
            if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'default') {
                console.log('Notification press action in foreground:', detail.notification);
                navigateToChatPage(); // Navigate to ChatPage on notification press
            }
        });

        // Handle notification actions in the background
        const unsubscribeOnBackgroundEvent = notifee.onBackgroundEvent(async ({ type, detail }) => {
            const { notification, pressAction } = detail;
            if (type === EventType.ACTION_PRESS && pressAction.id === 'default') {
                console.log('Notification press action in background:', notification);
                navigateToChatPage(); // Navigate to ChatPage on notification press
            }
        });

        // Clean up the listeners on component unmount
        return () => {
            unsubscribeOnMessage();
            unsubscribeOnForegroundEvent();
            unsubscribeOnBackgroundEvent();
        };
    }, []);

    // Function to navigate to ChatPage
    const navigateToChatPage = () => {
        // Assuming you're using React Navigation, get a navigation object to navigate
        const navigation = useNavigation(); 
        navigation.navigate('ChatPage'); 
    };

    return null; // This component doesn't render anything
};

export default NotificationHandler;
