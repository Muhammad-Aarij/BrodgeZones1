import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PopNotification } from './Components/Functions/Notifications';
// Function to save message to AsyncStorage with sender attribute
const saveMessageToAsyncStorage = async (message, sender) => {
    try {
      // Get the existing chatArray from AsyncStorage
      const chatArray = await AsyncStorage.getItem('chatArray');
      let parsedChatArray = chatArray ? JSON.parse(chatArray) : [];
  
      // Construct the message object with sender and message
      const messageWithSender = { sender, message: message.notification.body };
  
      // Add the new message to the chatArray
      parsedChatArray.push(messageWithSender);
  
      // Save the updated array back to AsyncStorage
      await AsyncStorage.setItem('chatArray', JSON.stringify(parsedChatArray));
  
      console.log('Message with sender saved to chatArray:', messageWithSender);
    } catch (error) {
      console.error('Error saving message to AsyncStorage:', error);
    }
  };
  
  // Function to handle notification press action
  function navigateToChatPage() {
    // Assuming you're using React Navigation, get a navigation object to navigate
    const navigation = useNavigation(); 
    navigation.navigate('ChatPage'); 
  }
  
  // Function to handle foreground notifications
  const handleForegroundNotification = async (remoteMessage) => {
    const sender = 'User123'; // Set the sender value dynamically
    if (remoteMessage.notification) {
      PopNotification(remoteMessage.notification); // Display notification
      console.log('Foreground notification: ', remoteMessage);
      await saveMessageToAsyncStorage(remoteMessage, sender); // Save message with sender to AsyncStorage
    }
  };
  
  // Handle foreground messages (FCM)
  const unsubscribe = messaging().onMessage(async remoteMessage => {
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
  messaging()
    .getInitialNotification()
    .then(async remoteMessage => {
      const sender = 'User123'; // Set the sender value dynamically
      if (remoteMessage) {
        console.log('Message handled in the kill state:', remoteMessage);
        PopNotification(remoteMessage.notification); // Display notification
        await saveMessageToAsyncStorage(remoteMessage, sender); // Save message with sender to AsyncStorage
      }
    });
  
  // Handle notification actions in the foreground
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'default') {
      console.log('Notification press action in foreground:', detail.notification);
      navigateToChatPage(); // Navigate to ChatPage on notification press
    }
  });
  
  // Handle notification actions in the background
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;
  
    if (type === EventType.ACTION_PRESS && pressAction.id === 'default') {
      console.log('Notification press action in background:', notification);
      navigateToChatPage(); // Navigate to ChatPage on notification press
    }
  });
  
  // Register the main app component
  AppRegistry.registerComponent(appName, () => App);
  