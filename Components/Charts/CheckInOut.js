import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const AttendancePieChart = ({ startTime, status, checkout, endtime }) => {
    // Convert startTime to a Date object with validation
    const parseDate = (dateString) => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
    };

    console.log(startTime, );
    console.log(status );
    console.log(checkout );
    console.log(endtime );

    const totalHours = 0.15; // Total time set to 0.5 hours for testing
    const totalSeconds = totalHours * 3600; // Convert hours to seconds

    const [endTimeDate, setEndTimeDate] = useState(parseDate(endtime));
    const [startTimeDate, setStartTimeDate] = useState(parseDate(startTime));
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const validStartTime = parseDate(startTime);
        console.log("Status" + status)
        if (status === "Check In" && validStartTime) {
            setStartTimeDate(validStartTime);

            const interval = setInterval(() => {
                const now = new Date();
                const elapsed = Math.floor((now - validStartTime) / 1000); // Elapsed time in seconds
                setElapsedTime(elapsed > totalSeconds ? totalSeconds : elapsed);
            }, 1000); // Update every second

            return () => clearInterval(interval);
        } else if (status === "Check Out") {
            // setElapsedTime(totalSeconds); // Set progress to full if checked out
        }
    }, [status, startTime]); // Dependencies

    const elapsedPercentage = (elapsedTime / totalSeconds) * 100;

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    };
    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        if (isNaN(date.getTime())) {
            return null; // Invalid date
        }

        const hours = date.getHours();
        const minutes = date.getMinutes();
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        return formattedTime;
    };

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", width: "100%", height: "60%", paddingTop: 35 }}>
                <View style={styles.timer}>
                    <Text style={{ ...styles.footer, fontFamily: "sans" }}>
                        {status === "Check In" || "Check Out" ? "Time Completed:" : "Start"}
                    </Text>
                    <Text style={{ ...styles.footer, fontWeight: "bold", fontSize: 30, alignSelf: "center" }}>
                        {formatTime(elapsedTime)}
                    </Text>
                </View>
                <AnimatedCircularProgress
                    size={120}
                    width={15}
                    fill={elapsedPercentage}
                    tintColor="#7CFC00"
                    backgroundColor="white"
                    padding={0}
                />
            </View>

            <View style={styles.timess}>
                {status == "Check In"  && <Text style={styles.text}>Start Time : {formatDateTime(startTime)}</Text>}
                {status == "CheckOut"  && <Text style={styles.text}>Start Time : {formatDateTime(startTime)}</Text>}
                {checkout && <Text style={styles.text}>Finishing Time :{formatDateTime(endtime)}</Text>}
            </View>
        </View>


    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 250,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#4BAAC8',
        flexDirection: "column",
        gap: 15,
        borderRadius: 10,
        // borderBottomEndRadius: 10,
        // borderBottomLeftRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    timer: {
        fontSize: 24,
        marginBottom: 20,
    },
    timess: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: 50,
        color: "white",
        width: "100%",
        height: 27,
        // backgroundColor: "grey",
    },
    footer: {
        fontSize: 16,
        color: "white",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    text: {
        color: "white",
        fontSize: 14
    }
});

export default AttendancePieChart;
