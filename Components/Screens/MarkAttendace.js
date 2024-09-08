import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, Text, TouchableOpacity, View, Alert, ScrollView, Platform, PermissionsAndroid, Image, useWindowDimensions, Dimensions } from 'react-native';
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
import set from '../Images/settings.png'
import cancel from '../Images/reject.png'
import DatePicker from 'react-native-date-picker';
import { Dropdown } from 'react-native-element-dropdown';
import CustomModal from '../Loaders/CustomModal';
import away from '../Images/away.png'

const { width } = Dimensions.get('window');
export default function MarkAttendance() {
    const [attendanceData, setAttendanceData] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isCheckOutDisabled, setIsCheckOutDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isloadingthefirstdata, setIsloadingthefirstdata] = useState(true);
    const [formattedTime, setFormattedTime] = useState(moment().format('hh:mm A'));
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [settings, setSettings] = useState(false);
    const [message, setmessage] = useState('');
    const [outside, setOutSide] = useState(false);



    const [selectedStatus, setSelectedStatus] = useState(null);
    // const [selectedStatusValue, setSelectedStatusValue] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [openTimePicker, setOpenTimePicker] = useState(false);

    const statusOptions = [
        { label: 'Checkin Request', value: 'Checkin Request' },
        { label: 'Checkout Request', value: 'Checkout Request' }
    ];

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
    
            // Initialize an empty object to store the attendance data
            const result = {};
    
            data.forEach(item => {
                const date = new Date(item.Date);
                const options = { month: 'short' };
                const monthName = date.toLocaleString('default', options);
                const formattedDate = `${monthName} ${date.getDate()}`;
    
                // Initialize the date entry if it doesn't exist
                if (!result[formattedDate]) {
                    result[formattedDate] = {
                        date: formattedDate,
                        checkIn: "--",
                        checkOut: "--",
                        remarks: []
                    };
                }
    
                // Update check-in and check-out times
                if (item.Status === 'Check In') {
                    result[formattedDate].checkIn = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                } else if (item.Status === 'Check Out') {
                    result[formattedDate].checkOut = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                }
    
                // Store the remarks for the day
                if (item.Remarks) {
                    result[formattedDate].remarks.push(item.Remarks);
                }
            });
    
            // Process the results to keep only the second remark or fallback to the first if only one exists
            const transformedData = Object.values(result).map(item => {
                const remarks = item.remarks;
                const secondRemark = remarks.length > 1 ? remarks[1] : remarks[0] || ""; // Second remark or fallback
    
                return [
                    item.date, 
                    item.checkIn, 
                    item.checkOut, 
                    secondRemark  // Use second remark or fallback
                ];
            });
    
            setAttendanceData(transformedData);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error('Error fetching attendance data:', error);
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
        setIsLoading(true);
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
                if (distance <= 30) {
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
                            setIsLoading(false);
                            Alert.alert('Error', 'Please try again later.');
                        }
                    } catch (error) {
                        setIsLoading(false);
                        console.error(error);
                    }
                } else {
                    setIsLoading(false);
                    setOutSide(true);
                    setTimeout(() => setOutSide(false), 2000);
                    // Alert.alert('Error', 'You are not within the required area of the Office');
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

    const SubmitRequest = async (status,time) => {
        setIsLoading(true);
        console.log(status+ "  "+ time);
        try {
            const number = await AsyncStorage.getItem('@UserNumber');
            const result = await MarkAttendace(number, status,time);
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
                setmessage(status+ " Send");
                setShowSuccessModal(true);

                setTimeout(() =>
                    setShowSuccessModal(false), 3000);
                // setmessage("");
            } else {
                setIsLoading(false);
                Alert.alert('Error', 'Please try again later.');
            }
        } catch (error) {
            setIsLoading(false);
            console.error(error);
        }
    };

    const tableHead = ['Date', 'Check In', 'Check Out', 'Remarks'];
    const widthArr = [75, 75, 85, 75];
    const date = new Date();
    const formattedDate = moment(date).format('MMMM D, YYYY');
    return (
        <>
            {isloadingthefirstdata ?
                <LoaderModal />
                :
                <SafeAreaView style={styles.maincontainer}>
                    <View style={styles.contentContainer}>
                        <View style={styles.attendance}>
                            <View style={styles.dateContainer}>
                                <Text style={styles.date}>{formattedDate}</Text>
                                <TouchableOpacity onPress={() => {
                                    setSettings(!settings);
                                }}>
                                    {settings ?
                                        <Image style={styles.img} source={cancel}></Image>
                                        :
                                        <Image style={styles.img} source={set}></Image>}
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.time}>{formattedTime}</Text>
                        </View>
                        {!settings ?
                            (<>
                                <View style={styles.attendacemarker}>
                                    <View style={[styles.attendaceline, isButtonDisabled && styles.btnDisabled]}>
                                        <TouchableOpacity
                                            style={[styles.btn, isButtonDisabled && styles.btnDisabled]}
                                            onPress={() => handleAttendance("Check In")}
                                            disabled={isButtonDisabled}
                                        >
                                            <Text style={{ fontSize: width * 0.035, color: isButtonDisabled ? "#909090" : "white" }}>
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
                                            <Text style={{ fontSize: width * 0.035, color: isCheckOutDisabled ? "#909090" : "white" }}>
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
                            </>
                            )
                            :
                            <>
                                <View style={[styles.attendacemarker, styles.editcontainer]}>
                                    <View style={styles.noteContainer}>
                                        <Text style={{ ...styles.note, fontFamily: "sans-serif-black" }}>
                                            Note
                                        </Text>
                                        <Text style={styles.note}>
                                            You can only make a request for today's attendance.
                                            Attendance requests for any other day will not be processed or accepted.
                                            Please ensure that you submit your attendance request within the current day.
                                        </Text>
                                    </View>
                                    <View style={styles.dropdownContainer}>
                                        <Text>Select Status</Text>
                                        <Dropdown
                                            style={styles.dropdown}
                                            data={statusOptions}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select status"
                                            value={selectedStatus}
                                            onChange={item => setSelectedStatus(item.value)}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                        />
                                    </View>

                                    {/* <View style={{ ...styles.datePickerContainer, marginBottom: 20, }}>
                                        <Text>Select Date</Text>
                                        <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
                                            <Text style={styles.dateText}>{moment(selectedDate).format('MMMM D, YYYY')}</Text>
                                        </TouchableOpacity>
                                        <DatePicker
                                            style={styles.picker}
                                            modal
                                            open={openDatePicker}
                                            date={selectedDate}
                                            mode="date" // Set mode to "date" to only show the date picker
                                            onConfirm={date => {
                                                setOpenDatePicker(false);
                                                setSelectedDate(date);
                                            }}
                                            onCancel={() => setOpenDatePicker(false)}
                                        />
                                    </View> */}

                                    <View style={styles.timePickerContainer}>
                                        <Text>Select Time</Text>
                                        <TouchableOpacity onPress={() => setOpenTimePicker(true)}>
                                            <Text style={styles.dateText}>{moment(selectedTime).format('hh:mm A')}</Text>
                                        </TouchableOpacity>
                                        <DatePicker
                                            style={styles.picker}
                                            modal
                                            open={openTimePicker}
                                            date={selectedTime}
                                            mode="time"
                                            onConfirm={time => {
                                                setOpenTimePicker(false);
                                                setSelectedTime(time);
                                            }}
                                            onCancel={() => setOpenTimePicker(false)}
                                        />
                                    </View>

                                    <TouchableOpacity
                                        style={[styles.btn, styles.btnEdit]}
                                        onPress={() => SubmitRequest(selectedStatus,selectedTime)}>
                                        <Text style={{ fontSize: width * 0.035, color: "white" }}>
                                            Submit
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                            </>

                        }
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.txt}>2024 BridgeZones ©</Text>
                        <Text style={styles.txt}>All rights reserved</Text>
                    </View>
                    {showSuccessModal && <SuccessModal message={message} />}
                    {outside && <CustomModal message={"You are not within the required area of the Office"} img={away} />}
                </SafeAreaView>}
        </>
    );
}

const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        backgroundColor: "#eeedec",
        paddingTop: width * 0.04,
        flexDirection: 'column',
    },
    attendacemarker: {
        width: "100%",
        // height: "auto",
        marginTop: width * 0.04,
        flexDirection: "row",
        justifyContent: "space-evenly",
        borderRadius: width * 0.025,
        backgroundColor: "#FFFFFF",
        paddingTop: "5%",
        paddingBottom: "5%",
    },
    btn: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#4BAAC8",
        width: width * 0.37,
        paddingVertical: width * 0.025,
        borderRadius: width * 0.01,
        borderWidth: width * 0.002,
        borderColor: "#4BAAC8",
        color: "black",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: width * 0.01,
    },
    btnDisabled: {
        borderRadius: width * 0.01,
        backgroundColor: "#e0e0e0",
        borderColor: "#b0b0b0",
        color: "gray",
    },
    txt: {
        fontSize: width * 0.037,
        color: "white",
    },
    footerText: {
        fontSize: width * 0.04,
        color: 'black',
    },
    footer: {
        backgroundColor: '#4BAAC8',
        width: "100%",
        height: "auto",
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: width * 0.01,
        marginTop: width * 0.04,
        paddingVertical: width * 0.025,
        color: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    row: {
        backgroundColor: "#a1dcef",
        borderRadius: width * 0.013,
    },


    contentContainer: {
        flex: 1, // This makes the container take all available space except for the footer
        width: "100%",
        // height:"100%",
        paddingHorizontal: 15,
    },

    attendance: {
        width: "100%",
        marginTop: width * 0.04,
        flexDirection: "column",
        justifyContent: "space-evenly",
        borderRadius: width * 0.025,
        backgroundColor: "#4BAAC8",
        paddingVertical: width * 0.08,
        paddingHorizontal: width * 0.06,
    },
    date: {
        fontSize: width * 0.06,
        color: "white",
        marginBottom: width * 0.025,
        // fontWeight:"bold",
        fontFamily: "sans-serif-condensed",

    },
    time: {
        fontFamily: "sans-serif-thin",
        fontSize: width * 0.040,
        color: "white",
    },
    rowTextStyle: {
        color: "#666362",
        fontSize: width * 0.035,
        paddingTop: width * 0.02,
        alignSelf: "center",
        paddingBottom: width * 0.017,
    },
    evenIndexText: {
        fontSize: width * 0.035,
        color: "#494F55",
    },
    line: {
        width: "100%",
        height: 1,
        backgroundColor: '#D3D3D3',
        marginVertical: width * 0.005,
        borderColor: '#D3D3D3',
    },

    img: {
        width: width * 0.085,
        height: width * 0.085,
    },
    dateContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    dropdownContainer: {
        marginVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    dropdown: {
        height: 40,
        width: "58%",
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    datePickerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    timePickerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    dateText: {
        fontSize: 14,
        color: '#333',
    },
    editcontainer: {
        flexDirection: "column",
        padding: 20,
    },
    picker: {
        height: 40,
        // width:"60%",
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    btnEdit: {
        alignSelf: "center",
        marginTop: 30,
        color: "#ffffFF",
    },
    placeholderStyle: {
        fontSize: 14,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    noteContainer: {
        flexDirection: "column",
        width: "100%",
        padding: 15,
        marginBottom: 20,
        backgroundColor: "#F5F5F5",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
    },
    note: {
        textAlign: "center",
        color: "grey",
    },
});