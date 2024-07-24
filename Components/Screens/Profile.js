import React, { useState } from 'react'
import bg from '../Images/bg.png'
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, TextInput } from 'react-native'
import profile from '../Images/aj.jpg'
export default function Profile() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [contact, setContact] = useState('')
    const [designation, setDesignation] = useState('')
    const [address, setAddress] = useState('')
    return (
        <ImageBackground source={bg} style={styles.maincontainer}>
            <Text style={styles.heading}>Profile</Text>
            <Image style={styles.profileimage} source={profile}></Image>
            <TextInput
                placeholder='Name'
                style={styles.input}
                onChangeText={setName}
                value={name}
            />
            <TextInput
                placeholder='Contact'
                style={styles.input}
                onChangeText={setEmail}
                value={contact}
            />
            <TextInput
                placeholder='Email'
                style={styles.input}
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                placeholder='Designation'
                style={styles.input}
                onChangeText={setDesignation}
                value={designation}
            />
            <TextInput
                placeholder='Address'
                style={styles.input}
                onChangeText={setAddress}
                value={address}
            />

            <View style={{flexDirection:"row",gap:15}}>
                <TouchableOpacity style={styles.button}>
                    <Text>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text>Save</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    input: {
        height: 50,
        width: "85%",
        borderColor: '#4BAAC8',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        fontSize: 18,
        color: '#333'
    },
    profileimage:{
        marginBottom: 30,
        borderWidth: 1,
        borderRadius:100,
        borderColor: '#4BAAC8',
        width: 150,
        height: 150,
        overflow: 'hidden'
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 50,
    },
    button: {
        backgroundColor: '#4BAAC8',
        padding: 10,
        borderRadius: 5,
        marginTop: "5%",
        marginBottom: 10,
        width: "35%",
        alignItems: 'center',
        justifyContent: 'center'
    }
})