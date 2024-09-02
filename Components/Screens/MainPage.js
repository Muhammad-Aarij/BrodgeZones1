import React, { Component, useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, BackHandler, PermissionsAndroid, Pressable, Dimensions } from 'react-native'
// import bg from '../Images/bg.png'
import attendance from '../Images/calendar2.png'
import settings from '../Images/dashboard.png'
import leave from '../Images/leave.png'
import logout from '../Images/logout.png'
import user from '../Images/user.png'
import mappin from '../Images/map-pin.png'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
// import LinearGradient from 'react-native-linear-gradient';
import bell from '../Images/bell.png';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
const { width } = Dimensions.get('window');


export default function MainPage({ navigation }) {
    const [role, setRole] = useState(false);

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

        const getRole = async () => {
            const role = await AsyncStorage.getItem("@role");
            if (role == "true") {
                setRole(true);
            }
            else {
                setRole(false);
            }
            console.log("Role" + role);
        };
        getRole();
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

        <View style={styles.maincontainer}>
            <View style={styles.top}>
                <View style={styles.header}>
                    <Text style={styles.heading}>Attendance App</Text>
                    {/* {role && <Pressable onPress={() => { */}
                    {<Pressable onPress={() => {
                        navigation.navigate("LeaveApproaval");
                    }}>
                        <Image source={bell} style={styles.notifications}></Image>
                    </Pressable>}
                </View>
                <View style={styles.tilesContainer}>

                    <TouchableOpacity style={styles.tile} onPress={() => {
                        navigation.navigate("Dashboard");
                    }}>
                        <Image style={styles.img} source={settings}></Image>
                        <Text style={styles.txt}>Dashboard </Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.tile} onPress={() => {
                        navigation.navigate("Markattendance");
                    }}>
                        <Image style={styles.img} source={mappin}></Image>
                        <Text style={styles.txt}>Attendance </Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.tile} onPress={() => {
                        navigation.navigate("AttendanceHistory")
                    }}>
                        <Image style={styles.img} source={attendance}></Image>
                        <Text style={styles.txt}>Attendance</Text>
                        <Text style={styles.txt}>Calendar</Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.tile} onPress={() => {
                        navigation.navigate("Leave")
                    }}>
                        <Image style={styles.img} source={leave}></Image>
                        <Text style={styles.txt}>Leave </Text>
                        <Text style={styles.txt}>Request</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.tile} onPress={() => {
                        navigation.navigate("Profile")
                    }}>
                        <Image style={styles.img} source={user}></Image>
                        <Text style={styles.txt}>Profile</Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.tile} onPress={handleLogOut}>
                        <Image style={styles.img} source={logout}></Image>
                        <Text style={styles.txt}>Log Out</Text>
                    </TouchableOpacity>


                </View>
            </View>
            <View style={styles.footer}>
                <Text style={styles.txt}>2024 BridgeZones ©</Text>
                <Text style={styles.txt}>All rights reserved</Text>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: "#FFFFFF",
    },

    tilesContainer: {
        flexWrap: 'wrap',
        flex: 1,
        // borderWidth:5,
        // borderColor:"red",
        flexDirection: 'row',
        // justifyContent: 'space-around',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    tile: {
        width: width * 0.35,
        height: width * 0.35,
        borderRadius: width * 0.025,
        margin: width * 0.025,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4BAAC8',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: width * 0.005,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: width * 0.01,
    },
    img: {
        width: width * 0.13,
        height: width * 0.12,
        resizeMode: 'contain',
        marginBottom: width * 0.015,
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
        padding: width * 0.01,
        marginTop: width * 0.05,
        color: 'white',
        // borderRadius:5,
        // marginBottom:1,
    },
    gradient: {
        borderRadius: width * 0.04, // or any other value you need
        margin: width * 0.01, // adjust as needed
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: width * 0.055,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: width * 0.01,
    },
    header: {
        marginVertical: width * 0.06,
        flexDirection: "row",
        // borderWidth: 2,
        height: width * 0.17,
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: width * 0.1,

    },
    heading: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#4BAAC8',
        fontFamily: 'sans-serif-black',
    },
    notifications: {
        width: width * 0.065,
        height: width * 0.065,
        resizeMode: 'contain',
    },
    top: {
        width: "100%",

    },
})