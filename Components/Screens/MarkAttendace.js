import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, Text, TouchableOpacity, View, Alert, ScrollView, Platform, PermissionsAndroid, Animated, useWindowDimensions, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MarkAttendace from '../Functions/MarkAttendance';
import { Table, Row } from 'react-native-table-component';
import GetAttendanceSheetByPhoneNumber from '../Functions/GetAttendanceSheetByPhoneNumber';
import Loader from '../Loaders/Loader';
import Geolocation from 'react-native-geolocation-service';
import { getDistance } from 'geolib';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import moment from 'moment';
import LoaderModal from '../Loaders/LoaderModal';
import SuccessModal from '../Loaders/SuccessModal';

const { width } = Dimensions.get('window');
export default function MarkAttendance() {
    const [attendanceData, setAttendanceData] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isCheckOutDisabled, setIsCheckOutDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isloadingthefirstdata, setIsloadingthefirstdata] = useState(true);
    const [formattedTime, setFormattedTime] = useState(moment().format('hh:mm A'));
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setFormattedTime(moment().format('hh:mm A'));
        }, 1000); // Update every second

        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, []);

    useEffect(() => {
        const fetchDataAndCheckStatus = async () => {
            try {
                setIsloadingthefirstdata(true);
                await fetchAttendanceSheet();
                await checkTodayStatus();
            } catch (error) {
                console.error(error);
            } finally {
                setIsloadingthefirstdata(false);
            }
        };

        fetchDataAndCheckStatus();
    }, []);

    const fetchAttendanceSheet = async () => {
        try {
            setIsLoading(true);
            const number = await AsyncStorage.getItem('@UserNumber');
            const data = await GetAttendanceSheetByPhoneNumber(number);
            const transformedData = Object.values(data.reduce((acc, item) => {
                const date = new Date(item.Date);
                const options = { month: 'long' };
                const monthName = date.toLocaleString('default', options);
                const formattedDate = `${monthName} ${date.getDate()}`;
                if (!acc[formattedDate]) {
                    acc[formattedDate] = {
                        date: formattedDate,
                        checkIn: "--",
                        checkOut: "--",
                        remarks: ""
                    };
                }
                if (item.Status === 'Check In') {
                    acc[formattedDate].checkIn = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                } else if (item.Status === 'Check Out') {
                    acc[formattedDate].checkOut = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                }

                acc[formattedDate].remarks = item.Remarks || acc[formattedDate].remarks;

                return acc;
            }, {})).map(item => [item.date, item.checkIn, item.checkOut, item.remarks]);

            setAttendanceData(transformedData);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error(error);
        }
    };

    const checkTodayStatus = async () => {
        try {
            const number = await AsyncStorage.getItem('@UserNumber');
            const data = await GetAttendanceSheetByPhoneNumber(number);
            const today = moment().startOf('day').toDate();

            let checkInFound = false;
            let checkOutFound = false;

            data.forEach(item => {
                const date = moment(item.Date).startOf('day').toDate();
                if (date.getTime() === today.getTime()) {
                    if (item.Status === 'Check In') {
                        checkInFound = true;
                    } else if (item.Status === 'Check Out') {
                        checkOutFound = true;
                    }
                }
            });

            setIsButtonDisabled(checkInFound);
            // setIsCheckOutDisabled(checkOutFound);
        } catch (error) {
            console.error(error);
        }
    };

    const officeCoordinates = {
        latitude: 33.5985076,
        longitude: 73.1544386
    };

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

    const handleAttendance = async (status) => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'Location permission not granted.');
            return;
        }

        Geolocation.getCurrentPosition(
            async (position) => {
                const distance = getDistance(
                    { latitude: position.coords.latitude, longitude: position.coords.longitude },
                    officeCoordinates
                );
                setIsloadingthefirstdata(true);
                if (distance <= 50) {
                    try {
                        const number = await AsyncStorage.getItem('@UserNumber');
                        const result = await MarkAttendace(number, status);
                        if (result) {
                            if (status === "Check In") {
                                await AsyncStorage.setItem('@CheckedIn', status);
                                setIsButtonDisabled(true);
                                fetchAttendanceSheet();
                            } else {
                                await AsyncStorage.setItem('@CheckedIn', status);
                                setIsCheckOutDisabled(true);
                                fetchAttendanceSheet();
                            }
                            setShowSuccessModal(true);
                            setTimeout(() => setShowSuccessModal(false), 3000);
                        } else {
                            Alert.alert('Error', 'Please try again later.');
                        }
                    } catch (error) {
                        console.error(error);
                    }
                } else {
                    Alert.alert('Error', 'You are not within the required radius.');
                }
                setIsloadingthefirstdata(false);
            },
            (error) => {
                setIsloadingthefirstdata(false);
                Alert.alert('Error', 'Failed to get your location.');
                console.error(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    const tableHead = ['Date', 'Check In', 'Check Out', 'Remarks'];
    const widthArr = [75, 75, 85, 75];
    const date = new Date();
    const formattedDate = moment(date).format('MMMM D, YYYY'); // August 1, 2024

    return (
        <>
            {isloadingthefirstdata ?
                <LoaderModal />
                :
                <SafeAreaView style={styles.maincontainer}>
                    <View style={styles.contentContainer}>
                        <View style={styles.attendance}>
                            <Text style={styles.date}>{formattedDate}</Text>
                            <Text style={styles.time}>{formattedTime}</Text>
                        </View>
                        <View style={styles.attendacemarker}>
                            <View style={[styles.attendaceline, isButtonDisabled && styles.btnDisabled]}>
                                <TouchableOpacity
                                    style={[styles.btn, isButtonDisabled && styles.btnDisabled]}
                                    onPress={() => handleAttendance("Check In")}
                                    disabled={isButtonDisabled}
                                >
                                    <Text style={{ fontSize: width * 0.04, color: isButtonDisabled ? "#909090" : "white" }}>
                                        Check In
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.attendaceline, isCheckOutDisabled && styles.btnDisabled]}>
                                <TouchableOpacity
                                    style={[styles.btn, isCheckOutDisabled && styles.btnDisabled]}
                                    onPress={() => handleAttendance("Check Out")}
                                    disabled={isCheckOutDisabled}
                                >
                                    <Text style={{ fontSize: width * 0.04, color: isCheckOutDisabled ? "#909090" : "white" }}>
                                        Check Out
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ ...styles.attendacemarker, paddingHorizontal: 20, flex: 1 }}>
                            {!isLoading ?
                                <View>
                                    <Table borderStyle={{ alignSelf: "center" }}>
                                        <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={{ color: "black", backgroundColor: "#F0FFFF", fontSize: width * 0.035, marginBottom: 10, alignSelf: "center", }} />
                                    </Table>
                                    <ScrollView style={styles.dataWrapper}>
                                        <Table borderStyle={{ borderWidth: 0 }}>
                                            {
                                                attendanceData.map((rowData, index) => (
                                                    <Row
                                                        key={index}
                                                        data={rowData}
                                                        widthArr={widthArr}
                                                        style={StyleSheet.flatten([styles.row, index % 2 && { backgroundColor: '', borderRadius: 5, }])}
                                                        textStyle={[styles.rowTextStyle, index % 2 === 0 && styles.evenIndexText]}
                                                    />
                                                ))
                                            }
                                        </Table>
                                    </ScrollView>
                                </View>
                                :
                                <Loader />
                            }
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.txt}>2024 BridgeZones ©</Text>
                        <Text style={styles.txt}>All rights reserved</Text>
                    </View>
                    {showSuccessModal && <SuccessModal />}
                </SafeAreaView>}
        </>
    );
}

const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        backgroundColor: "#eeedec",
        paddingTop: 17,
        flexDirection: 'column',
    },
    attendacemarker: {
        width: "100%",
        // height: "auto",
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "space-evenly",
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        paddingTop: "5%",
        paddingBottom: "5%",
    },
    btn: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#4BAAC8",
        width: 150,
        paddingVertical: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#4BAAC8",
        color: "black",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    btnDisabled: {
        borderRadius: 5,
        backgroundColor: "#e0e0e0",
        borderColor: "#b0b0b0",
        color: "gray",
    },
    txt: {
        fontSize: width * 0.037,
        color: "white",
    },
    footerText: {
        fontSize: 16,
        color: 'black',
    },
    footer: {
        backgroundColor: '#4BAAC8',
        width: "100%",
        height: "auto",
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        marginTop: 15,
        paddingVertical:10,
        color: 'white',
    },
    row: {
        backgroundColor: "#a1dcef",
        borderRadius: 5,
    },
    status: {

        width: "100%",
        height: 200,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 30,
        paddingTop: 70,
        paddingBottom: 30,
        backgroundColor: '#4BAAC8',
        flexDirection: "column",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    statusTextBig: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    statusTextSmall: {
        fontSize: 16,
        color: 'white',
    },
    dailyline: {
        flexDirection: 'row',
        width: "100%",
        justifyContent: "space-between",
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginVertical: 10,
        backgroundColor: "white",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderStyle: 'solid',
    },
    contentContainer: {
        flex: 1, // This makes the container take all available space except for the footer
        width: "100%",
        // height:"100%",
        paddingHorizontal: 15,
        // height: "70%",
    },

    attendance: {
        width: "100%",
        marginTop: 15,
        flexDirection: "column",
        justifyContent: "space-evenly",
        borderRadius: 10,
        backgroundColor: "#4BAAC8",
        paddingVertical: 35,
        paddingHorizontal: 25,
    },
    date: {
        fontSize: width * 0.078,
        color: "white",
        marginBottom: 10,
        // fontWeight:"bold",
        fontFamily: "sans-serif-condensed",

    },
    time: {
        fontFamily: "sans-serif-thin",
        fontSize: width * 0.045,
        color: "white",
    },
    rowTextStyle: {
        color: "#666362",
        fontSize: width * 0.035,
        paddingTop: 7,
        alignSelf: "center",
        paddingBottom: 7,
    },
    evenIndexText: {
        fontSize: width * 0.035,
        color: "#494F55",
    },
    line: {
        width: "100%",
        height: 1,
        backgroundColor: '#D3D3D3',
        marginVertical: 1.5,
        borderColor: '#D3D3D3',
    }

});