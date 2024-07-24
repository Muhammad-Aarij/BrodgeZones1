import React, { useState } from 'react'
import bg from '../Images/bg.png'
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, TextInput } from 'react-native'
import profile from '../Images/aj.jpg'


export default function Profile() {
    const [name, setName] = useState('Muhammad Aarij')
    const [email, setEmail] = useState('aarijm5@gmail.com')
    const [contact, setContact] = useState('03219548171')
    const [designation, setDesignation] = useState('Call Center')
    const [address, setAddress] = useState('University town ,Islamabd')


    return (
        <ImageBackground source={bg} style={styles.maincontainer}>
            <Text style={styles.heading}>Profile</Text>
            <Image style={styles.profileimage} source={profile}></Image>
            <TextInput
                placeholder='Name'
                style={styles.input}
                onChangeText={setName}
                value={name}
                editable={false}
            />
            <TextInput
                placeholder='Contact'
                style={styles.input}
                onChangeText={setEmail}
                value={contact}
                editable={false}
            />
            <TextInput
                placeholder='Email'
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                editable={false}
            />
            <TextInput
                placeholder='Designation'
                style={styles.input}
                onChangeText={setDesignation}
                value={designation}
                editable={false}
            />
            <TextInput
                placeholder='Address'
                style={styles.input}
                onChangeText={setAddress}
                value={address}
                editable={false}
            />

            <View style={{flexDirection:"row",gap:15}}>
                <TouchableOpacity style={styles.button}>
                    <Text style={{color:"white"}}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={{color:"white"}}>Save</Text>
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
        fontSize: 15,
        color:"grey",
    },
    profileimage:{
        marginVertical: 30,
        borderWidth: 1,
        borderRadius:100,
        borderColor: '#4BAAC8',
        width: 150,
        height: 150,
        overflow: 'hidden',
        shadowColor:"#7e7b7b",
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0,
        shadowRadius: 5,
        elevation: 6,
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
        marginTop: 30,
        marginBottom: 10,
        width: "35%",
        alignItems: 'center',
        justifyContent: 'center',
        color:"white",
    }
})