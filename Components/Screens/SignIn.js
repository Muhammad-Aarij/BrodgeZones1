import React, { Component, useState } from 'react'
import { StyleSheet, View, Text, TextInput, Pressable } from 'react-native'

export default function SignIn({navigation}) {

    const [phonenumber, setPhoneNumber] = useState('');
    
    const handlePhoneNumberChange = (text) => {
        // Remove any non-numeric characters
        const cleaned = text.replace(/[^0-9]/g, '');
        setPhoneNumber(cleaned);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.txt}>Sign In</Text>
            <TextInput
                placeholder='Enter phone number'
                style={styles.input}
                onChangeText={handlePhoneNumberChange}
                value={phonenumber}
                 keyboardType='numeric'
                 maxLength={11}
            />

            <Pressable style={styles.button} onPress={()=>{
                navigation.navigate("Mainpage")
            }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Sign In</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5'
    },

    txt: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#4BAAC8',
        marginBottom: 60,
        color: '#4BAAC8',
    },
    input: {
        height: 60,
        width: "85%",
        borderColor: '#4BAAC8',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        fontSize: 18,
        color: '#333'
    },
    button: {
        backgroundColor: '#4BAAC8',
        padding: 10,
        borderRadius: 5,
        marginTop: "5%",
        marginBottom: 10,
        width: "60%",
        alignItems: 'center',
        justifyContent: 'center'
    }
});