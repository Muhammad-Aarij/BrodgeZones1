import React, { Component, useState, useEffect } from 'react'
import { ActivityIndicator, ImageBackground, StyleSheet, Text } from 'react-native';
import homepage from '../Images/homepage.png'
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Homepage({ navigation }) {

    const [initialRoute, setInitialRoute] = useState('');

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const loginStatus = await AsyncStorage.getItem('@Login');
                setTimeout(() => {
                    if (loginStatus === 'true') {
                        navigation.navigate('Mainpage');
                    } else {
                        navigation.navigate('Signin');
                    }
                }, 3000); // 3 seconds timeout
            } catch (error) {
                console.error('Error fetching login status:', error);
                setInitialRoute('Signin');
            }
        };

        checkLoginStatus();
    }, []);

    return (
        <ImageBackground source={homepage} style={styles.main} >
            <ActivityIndicator style={{ marginBottom: "25%" }} size={60} color="#5b90b8" />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    main: {
        width: '100%',
        height: '100%',
        justifyContent: "flex-end",
        alignItems: "center",
        resizeMode: 'contain',
    }
})
