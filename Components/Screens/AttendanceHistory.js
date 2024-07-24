import React, { Component, useState } from 'react'
import { View, Text, Image, StyleSheet, Pressable, TouchableOpacity, ScrollView } from 'react-native'
import magnifying from '../Images/magnifying.png'
import DatePicker from 'react-native-date-picker'


export default function AttendanceHistory() {
    const [search, setSearch] = useState(false);
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null)

    const handleDateConfirm = (selectedDate) => {
        setOpen(false);
        setDate(selectedDate);
        setSelectedDate(selectedDate); // Update selectedDate state
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.header}>
                <Text style={styles.heading}>Summary</Text>
                <Pressable onPress={() => { setSearch(!search) }} >
                    <Image source={magnifying} style={styles.img}></Image>
                </Pressable>
            </View>

            {!search && 
            <View style={styles.monthContainer}>
                <Text style={{ fontSize: 16, color: "white", marginBottom: 10 }}>Month's Statistics</Text>
                <View style={styles.monthline}>
                    <Text style={styles.txt}>Present</Text>
                    <Text style={styles.txt}>21</Text>
                </View>
                <View style={styles.monthline}>
                    <Text style={styles.txt}>Absent</Text>
                    <Text style={styles.txt}>3</Text>
                </View>
                <View style={styles.monthline}>
                    <Text style={styles.txt}>Total</Text>
                    <Text style={styles.txt}>24</Text>
                </View>
                <View style={styles.monthline}>
                    <Text style={styles.txt}>Percentage</Text>
                    <Text style={styles.txt}>80%</Text>
                </View>
            </View>}
            {!search && <ScrollView style={styles.dailyattendance}>
                <Text style={{ fontSize: 16, marginBottom: 10,fontWeight:"800"  }}>{"Attendance History"}</Text>

               
                    <View style={styles.dailyline}>
                        <Text style={styles.txt}>22-07-2024</Text>
                        <Text style={styles.txt}>Present</Text>
                    </View>
                    <View style={styles.dailyline}>
                        <Text style={styles.txt}>21-07-2024</Text>
                        <Text style={styles.txt}>Absent</Text>
                    </View>
                    <View style={styles.dailyline}>
                        <Text style={styles.txt}>20-07-2024</Text>
                        <Text style={styles.txt}>Present</Text>
                    </View>
                    <View style={styles.dailyline}>
                        <Text style={styles.txt}>20-07-2024</Text>
                        <Text style={styles.txt}>Present</Text>
                    </View>
                    <View style={styles.dailyline}>
                        <Text style={styles.txt}>20-07-2024</Text>
                        <Text style={styles.txt}>Present</Text>
                    </View>
                    <View style={styles.dailyline}>
                        <Text style={styles.txt}>20-07-2024</Text>
                        <Text style={styles.txt}>Present</Text>
                    </View>
                    <View style={styles.dailyline}>
                        <Text style={styles.txt}>20-07-2024</Text>
                        <Text style={styles.txt}>Present</Text>
                    </View>
                    <View style={styles.dailyline}>
                        <Text style={styles.txt}>20-07-2024</Text>
                        <Text style={styles.txt}>Present</Text>
                    </View>
                    <View style={styles.dailyline}>
                        <Text style={styles.txt}>20-07-2024</Text>
                        <Text style={styles.txt}>Present</Text>
                    </View>
           

            </ScrollView>}

            {search &&
                <View style={styles.searchsection}>

                    <Text>{selectedDate ? selectedDate.toDateString() : "No Date Selected"}</Text>
                    <View style={{ flexDirection: "row", gap: 15 }}>
                        <TouchableOpacity style={styles.button} onPress={() => setOpen(true)}>
                            <Text>Select Date</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <Text>Search</Text>
                        </TouchableOpacity>
                    </View>
                    <DatePicker
                        modal
                        mode='date'
                        open={open}
                        date={date}
                        maximumDate={date}
                        onConfirm={handleDateConfirm}
                        onCancel={() => setOpen(false)}
                    />
                </View>}
            {search &&
                <View style={styles.searchresult}>
                    <Text style={{ fontSize: 16, marginBottom: 10, fontWeight:"900",alignSelf:"center"}}>{"Search Result"}</Text>

                    <View style={styles.dailyline}>
                        <Text style={styles.txt}>22-07-2024</Text>
                        <Text style={styles.txt}>Present</Text>
                    </View>
                   
                </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    header: {
        width: "100%",
        height: 70,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        marginTop: 10,
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#4BAAC8',
    },

    monthContainer: {
        marginTop: 10,
        padding: 20,
        width: "70%",
        backgroundColor: '#4BAAC8',
        borderRadius: 7,
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
    },
    monthline: {
        flexDirection: 'row',
        width: "100%",
        justifyContent: "space-between",
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
        marginVertical: 10,
        backgroundColor: "white",
        borderRadius: 5,
    },
    txt: {
        fontSize: 16,
        color: 'black',
    },
    dailyattendance: {
        marginTop: 20,
        padding: 20,
        width: "100%",
        // backgroundColor: '#d3d3d3',
        borderRadius: 7,
        flexDirection: "column",
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    dailyline: {
        flexDirection: 'row',
        width: "100%",
        justifyContent: "space-between",
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
        marginVertical: 10,
        backgroundColor: "white",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderStyle: 'solid',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },

    img: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    searchsection: {
        height: 159,
        width: "100%",
        backgroundColor: '#4BAAC8',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 7,
        padding: 10,
        marginTop: 10,
    },
    button: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        marginTop: "5%",
        marginBottom: 10,
        width: "35%",
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    searchresult: {
        flexDirection: "column",
        width: "100%",
        backgroundColor: "#f1f1f1",
        padding: 20,
        borderRadius: 7,
        marginTop: 20,
    }

})