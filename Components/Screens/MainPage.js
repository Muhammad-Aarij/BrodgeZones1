import React, { Component, useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, BackHandler, PermissionsAndroid } from 'react-native'
import bg from '../Images/bg.png'
import attendance from '../Images/calendar2.png'
import settings from '../Images/dashboard.png'
import leave from '../Images/leave.png'
import logout from '../Images/logout.png'
import user from '../Images/user.png'
import mappin from '../Images/map-pin.png'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';


export default function MainPage({ navigation }) {

    useEffect(() => {
        const requestLocationPermission = async () => {
            if (Platform.OS === 'ios') {
                const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
                return result === RESULTS.GRANTED;
            } else if (Platform.OS === 'android') {
                const result = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'We need your location to mark attendance',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                return result === PermissionsAndroid.RESULTS.GRANTED;
            }
            return false;
        };
        requestLocationPermission();
    }, [])

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
        await AsyncStorage.setItem("@CheckedIn", "null");
        navigation.navigate("Signin")
    };

    return (

        <ImageBackground source={bg} style={styles.maincontainer}>
            <Text style={styles.heading}>Attendance App</Text>
            <View style={styles.tilesContainer}>

                {/* <LinearGradient
                colors={['#0abcf9', '#2c69d1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
                > */}

                <TouchableOpacity style={styles.tile} onPress={() => {
                    navigation.navigate("Dashboard");
                }}>
                    <Image style={styles.img} source={settings}></Image>
                    <Text style={styles.txt}>Dashboard </Text>
                </TouchableOpacity>
                {/* </LinearGradient> */}

                {/* <LinearGradient
                    colors={['#0abcf9', '#2c69d1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                > */}

                <TouchableOpacity style={styles.tile} onPress={() => {
                    navigation.navigate("Markattendance");
                }}>
                    <Image style={styles.img} source={mappin}></Image>
                    {/* <Text style={styles.txt}>Mark </Text> */}
                    <Text style={styles.txt}>Attendance </Text>
                </TouchableOpacity>
                {/* </LinearGradient> */}




                {/* <TouchableOpacity style={styles.tile} onPress={() => {
                    navigation.navigate("Attendance")
                }}>
                    <Image style={styles.img} source={attendance}></Image>
                    <Text style={styles.txt}>Attendance</Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity style={styles.tile}>
                    <Image style={styles.img} source={refresh}></Image>
                    <Text style={styles.txt}>Refresh</Text>
                </TouchableOpacity> */}

                {/* <LinearGradient
                    colors={['#0abcf9', '#2c69d1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                > */}
                <TouchableOpacity style={styles.tile} onPress={() => {
                    navigation.navigate("Leave")
                }}>
                    <Image style={styles.img} source={leave}></Image>
                    <Text style={styles.txt}>Leave </Text>
                    <Text style={styles.txt}>Request</Text>
                </TouchableOpacity>
                {/* </LinearGradient>
                <LinearGradient
                    colors={['#0abcf9', '#2c69d1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                > */}

                <TouchableOpacity style={styles.tile} onPress={() => {
                    navigation.navigate("AttendanceHistory")
                }}>
                    <Image style={styles.img} source={attendance}></Image>
                    <Text style={styles.txt}>Attendance</Text>
                    <Text style={styles.txt}>Calendar</Text>
                </TouchableOpacity>
                {/* </LinearGradient>

                <LinearGradient
                    colors={['#0abcf9', '#2c69d1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                > */}

                <TouchableOpacity style={styles.tile} onPress={() => {
                    navigation.navigate("Profile")
                }}>
                    <Image style={styles.img} source={user}></Image>
                    <Text style={styles.txt}>Profile</Text>
                </TouchableOpacity>
                {/* </LinearGradient>

                <LinearGradient
                    colors={['#0abcf9', '#2c69d1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                > */}

                <TouchableOpacity style={styles.tile} onPress={handleLogOut}>
                    <Image style={styles.img} source={logout}></Image>
                    <Text style={styles.txt}>Log Out</Text>
                </TouchableOpacity>
                {/* </LinearGradient> */}

            </View>
            <View style={styles.footer}>
                <Text style={styles.txt}>2024 BridgeZones ©</Text>
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
        height: 130,
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
        marginBottom: 5,
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 50,
        fontFamily: 'Roboto-black',
    },
    txt: {
        fontSize: 15,
        color: "white",
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
    },
    gradient: {
        borderRadius: 15, // or any other value you need
        margin: 5, // adjust as needed
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
})