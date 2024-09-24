import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import { AppState } from 'react-native';

export const PopNotification = async (msg) => {
    console.log('Message received:', msg);
    try {
        const channelId = 'bridge2300';
        const largeIcon = 'ic_launcher_round'; // Reference the drawable resource (without extension)

        await notifee.createChannel({
            id: channelId,
            sound: 'notification',
            name: 'iqbal',
            description: 'default',
            importance: AndroidImportance.HIGH,
            visibility: AndroidVisibility.PUBLIC,
        });

        // Access properties directly from msg
        const title = msg.title;
        const body = msg.body;

        // console.log("MSG title: " + title + " MSG Body: " + body);

        // Check if title and body exist
        if (!title || !body) {
            console.error('Notification title or body is missing in the message');
            return;
        }

        // Display the notification
        const notification = {
            title: title,
            body: body,
            android: {
                channelId: channelId,
                smallIcon: 'ic_launcher_round', // You can also use another small icon if needed
                largeIcon: largeIcon, // Set the large icon to your custom image
            },
            // Uncomment and configure for iOS if needed
            // ios:{
            //     channelId: channelId,
            //     smallIcon: largeIcon,
            // }
        };
        const notificationId = await notifee.displayNotification(notification);

        if (AppState?.currentState === 'active') {
            // console.log('App is in the foreground');
        }

        // Schedule the cancellation after 3 seconds
        setTimeout(async () => {
            // Cancel the notification after 3 seconds
            await notifee.cancelNotification(notificationId);
        }, 3000);

    } catch (error) {
        console.error('Error displaying/canceling notification:', error);
    }
};
