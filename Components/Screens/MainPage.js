    import React, { Component,useEffect,useState } from 'react'
    import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity,BackHandler } from 'react-native'
    import bg from '../Images/bg.png'
    import attendance from '../Images/calendar.png'
    import info from '../Images/info.png'
    import settings from '../Images/settings.png'
    import refresh from '../Images/refresh.png'
    import logout from '../Images/logout.png'
    import user from '../Images/user.png'
    import AsyncStorage from '@react-native-async-storage/async-storage'
    import { useFocusEffect } from '@react-navigation/native'

    export default function MainPage({ navigation }) {

        useFocusEffect(
            React.useCallback(() => {
                const backAction = () => {
                    BackHandler.exitApp();
                    return true;
                };
    
                const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    
                return () => backHandler.remove();
            }, [])
        );

        const handleLogOut = async () => {
            await AsyncStorage.setItem("@Login", "false");
            await AsyncStorage.setItem("@UserNumber", "null");
            navigation.navigate("Signin")
        };

        return (

            <ImageBackground source={bg} style={styles.maincontainer}>
                <Text style={styles.heading}>Attendance App</Text>
                <View style={styles.tilesContainer}>

                    <TouchableOpacity style={styles.tile} onPress={() => {
                        navigation.navigate("Attendance")
                    }}>
                        <Image style={styles.img} source={attendance}></Image>
                        <Text style={styles.txt}>Attendance</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tile} onPress={() => {
                        navigation.navigate("Profile")
                    }}>
                        <Image style={styles.img} source={user}></Image>
                        <Text style={styles.txt}>Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tile}>
                        <Image style={styles.img} source={refresh}></Image>
                        <Text style={styles.txt}>Refresh</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tile}>
                        <Image style={styles.img} source={settings}></Image>
                        <Text style={styles.txt}>Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tile} onPress={handleLogOut}>
                        <Image style={styles.img} source={logout}></Image>
                        <Text style={styles.txt}>Log Out</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tile}>
                        <Image style={styles.img} source={info}></Image>
                        <Text style={styles.txt}>Information</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.txt}>2022 BridgeZones</Text>
                    <Text style={styles.txt}>All rights reserved</Text>
                </View>
            </ImageBackground>
        )
    }


    const styles = StyleSheet.create({
        maincontainer: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        tilesContainer: {
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
        },
        tile: {
            width: 140,
            height: 120,
            borderRadius: 10,
            margin: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#4BAAC8',
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
            elevation: 4,
        },
        img: {
            width: 45,
            height: 45,
            resizeMode: 'contain',
        },
        txt: {
            fontSize: 15,
            color: "white",
        },
        heading: {
            fontSize: 30,
            fontWeight: 'bold',
            color: 'white',
            marginTop: 50,
        },
        footer: {
            backgroundColor: '#4BAAC8',
            width: "100%",
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 5,
            marginTop: 20,
            color: 'white',
            // borderRadius:5,
            // marginBottom:1,
        }



    })