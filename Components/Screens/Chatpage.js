import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Image,
    Alert,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import send from '../Images/send.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native';

const ChatScreen = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [recipientToken, setRecipientToken] = useState('evdMquNLQd-QmhGWj6-wIT:APA91bGQCywS-_BE_QsEm0fG2R3iHOQ-xBuO3wxTKKq-qTeyZNPR5fl8d3YBKlu1-OhCkQffr7jZPt52_J1UQZXI3i-nytGwIthbVmR2zO2hRrYSU0MmpYW4_DeSQGwewlESqvxLbZj_'); // Store recipient FCM token for testing
    const [currentToken, setCurrentToken] = useState('');
    const [AuthToken, setAuthToken] = useState('');

    const { AccessToken } = NativeModules;

    const fetchAccessToken = () => {
        AccessToken.getAccessToken(
            (token) => {
                setAuthToken(token);
                console.log('Access token:', token);
            },
            (error) => {
                console.error('Error fetching token:', error);
            }
        );
    };
    useEffect(() => {
        fetchAccessToken();
        // Get FCM Token of the current user (this will be for the sender)
        messaging()
            .getToken()
            .then(token => {
                console.log('FCM Token:', token);
                setCurrentToken(token); // Set current token in state
            });

        // Listen for incoming FCM messages
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
            const { body } = remoteMessage.notification;
            const newMessage = { id: Date.now().toString(), message: body, sender: 'other' };
            setMessages(prevMessages => [...prevMessages, newMessage]);
            await saveMessagesToStorage([...messages, newMessage]); // Save message to AsyncStorage
        });

        fetchMessages(); // Fetch saved messages from AsyncStorage

        return unsubscribe;
    }, []);

    // Function to fetch messages from AsyncStorage
    const fetchMessages = async () => {
        try {
            const chatArray = await AsyncStorage.getItem('chatArray');
            if (chatArray) {
                const parsedMessages = JSON.parse(chatArray);
                console.log('Fetched messages:', parsedMessages); // Log fetched messages
                setMessages(parsedMessages);
            }
        } catch (error) {
            console.error('Error fetching messages from AsyncStorage:', error);
        }
    };

    

    // Function to save messages to AsyncStorage
    const saveMessagesToStorage = async (messagesToSave) => {
        try {
            await AsyncStorage.setItem('chatArray', JSON.stringify(messagesToSave));
        } catch (error) {
            console.error('Error saving messages to AsyncStorage:', error);
        }
    };

    // Function to copy current FCM token to clipboard
    // const copyToClipboard = () => {
    //     Clipboard.setString(currentToken);
    //     Alert.alert('Copied', 'FCM Token copied to clipboard');
    // };

    const sendMessage = async () => {
        if (message.trim()) {
            // Display the sent message on the sender's UI
            const newMessage = { id: Date.now().toString(), message, sender: 'current' };
            const updatedMessages = [...messages, newMessage];
            setMessages(updatedMessages);
            setMessage('');

            // Save the message to AsyncStorage
            await saveMessagesToStorage(updatedMessages);

            const body = {
                message: {
                    token: recipientToken, // Recipient's FCM token
                    notification: {
                        title: 'New Message',
                        body: message,
                    },
                },
            };

            try {
                const response = await fetch(`https://fcm.googleapis.com/v1/projects/attendanceapp-83b7a/messages:send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${AuthToken}`, // Bearer token for authentication
                    },
                    body: JSON.stringify(body),
                });

                const responseText = await response.text();
                if (response.ok) {
                    console.log('Message sent successfully to FCM:', responseText);
                } else {
                    console.error('Error sending FCM message:', responseText);
                }
            } catch (error) {
                console.error('Error sending FCM message:', error);
            }
        }
    };

    const renderMessage = ({ item }) => {
        const isCurrentUser = item.sender === 'current';
        return (
            <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}>
                <Text style={[styles.messageText, isCurrentUser ? styles.currentMessage : styles.otherMessage]}>
                    {item.message}
                </Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={90}
        >
            <View style={styles.tokenContainer}>
                <Text style={styles.tokenText}>Current App FCM Token:</Text>
                <TouchableOpacity >
                    <Text style={styles.token} selectable>{currentToken}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    value={recipientToken}
                    onChangeText={setRecipientToken}
                    placeholder="Enter recipient's FCM token for testing..."
                />
            </View>

            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.chatContainer}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholderTextColor={"grey"}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type a message..."
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Image source={send} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    tokenContainer: {
        padding: 10,
        backgroundColor: '#eaeaea',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    tokenText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    token: {
        fontSize: 14,
        color: '#007AFF',
        marginTop: 5,
    },
    chatContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        padding: 10,
    },
    messageContainer: {
        maxWidth: '70%',
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 5,
    },
    currentUserMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#54F166',
    },
    otherUserMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#DCF8C6',
    },
    messageText: {
        fontSize: 16,
    },
    currentMessage: {
        color: 'black',
    },
    otherMessage: {
        color: 'grey',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderColor: '#ccc',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        color:"grey",
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 40,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
    },
    sendButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 20,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatScreen;
