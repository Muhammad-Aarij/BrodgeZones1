import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, BackHandler, PermissionsAndroid, Pressable, Dimensions } from 'react-native';
import bg from '../Images/green.png';
import attendance from '../Images/calendar2.png';
import settings from '../Images/dashboard.png';
import leave from '../Images/leave.png';
import logout from '../Images/logout.png';
import user from '../Images/user.png';
import mappin from '../Images/map-pin.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import bell from '../Images/bell.png';

const { width } = Dimensions.get('window');

export default function MainPage({ navigation }) {
    const [role, setRole] = useState(false);

    // var age=10;
    // var name="bsdk";
    // const tex = {
    //     name: "aarij", 
    //     age: 20,
    //     print: function() {
    //         console.log("name: " + this.name + ", age: " + this.age);
    //     },
    // };

    // tex.print();

    useEffect(() => {
        const requestLocationPermission = async () => {
            if (Platform.OS === 'ios') {
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
            setRole(role === "true");
        };
        getRole();
    }, []);

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
        navigation.navigate("Signin");
    };

    return (
        <ImageBackground source={bg} style={styles.maincontainer}>
            <View style={styles.top}>
                <View style={styles.header}>
                    <Text style={styles.heading}>Attendance App</Text>
                    <Pressable onPress={() => navigation.navigate("LeaveApproaval")}>
                        <Image source={bell} style={styles.notifications} />
                    </Pressable>
                </View>
                <View style={styles.tilesContainer}>
                    <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate("Dashboard")}>
                        <Image style={styles.img} source={settings} />
                        <Text style={styles.txt}>Dashboard</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate("Markattendance")}>
                        <Image style={styles.img} source={mappin} />
                        <Text style={styles.txt}>Attendance</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate("AttendanceHistory")}>
                        <Image style={styles.img} source={attendance} />
                        <Text style={styles.txt}>Attendance</Text>
                        <Text style={styles.txt}>Calendar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate("Leave")}>
                        <Image style={styles.img} source={leave} />
                        <Text style={styles.txt}>Leave</Text>
                        <Text style={styles.txt}>Request</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate("Profile")}>
                        <Image style={styles.img} source={user} />
                        <Text style={styles.txt}>Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate("Chatpage")}>
                        <Image style={styles.img} source={user} />
                        <Text style={styles.txt}>Chat</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.tile} onPress={handleLogOut}>
                        <Image style={styles.img} source={logout} />
                        <Text style={styles.txt}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.footer}>
                <Text style={styles.txt}>2024 BridgeZones ©</Text>
                <Text style={styles.txt}>All rights reserved</Text>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tilesContainer: {
        flexWrap: 'wrap',
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tile: {
        width: width * 0.36,
        height: width * 0.32,
        borderRadius: width * 0.025,
        margin: width * 0.025,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 218, 93, 0.6)', // Adjust opacity to allow background image to show
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: width * 0.003,
        // },
        // shadowOpacity: 0.23,
        // shadowRadius: 2.02,
        // elevation: width * 0.008,
        overflow: 'hidden', // Make sure the content stays inside the tile
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
        backgroundColor: 'rgba(0, 218, 93, 0.6)', // Adjust opacity to allow background image to show
        width: "100%",
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: width * 0.01,
        marginTop: width * 0.05,
        color: 'white',
    },
    header: {
        marginVertical: width * 0.06,
        flexDirection: "row",
        height: width * 0.17,
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: width * 0.1,
    },
    heading: {
        fontSize: width * 0.065,
        fontWeight: 'bold',
        color: 'white',
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
});
