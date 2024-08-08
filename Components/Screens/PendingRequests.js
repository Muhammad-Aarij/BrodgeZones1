import React from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, } from 'react-native'

export default function PendingRequests({route}) {
    const { type } = route.params;

    return (
        <ScrollView style={styles.mainContainer}>
            <View style={styles.header}>
                <Text style={styles.heading}>{type} Requests</Text>
            </View>

            <View style={styles.hourscompleted}>
                {/* <Text style={styles.txt}>Statistics</Text> */}
                <View style={styles.hourlines}>
                    <View styles={{ width: "100%", flexDirection: "row", }}>
                        <View style={styles.hourline1}>
                            <Text style={styles.label}>Emergency Leave </Text>
                            <View style={styles.btn}>
                                <Text style={styles.txt}>Approaved</Text>
                            </View>
                        </View>
                        <View style={styles.hours}>
                            <Text style={styles.timecompleted}>Aug 8 -</Text>
                            <Text style={styles.timetotal}> Aug 12</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.hourlines}>
                    <View styles={{ width: "100%", flexDirection: "row", }}>
                        <View style={styles.hourline1}>
                            <Text style={styles.label}>Sick Leave</Text>
                            <View style={{...styles.btn,backgroundColor:"#E4D00A"}}>
                                <Text style={styles.txt}>Pending</Text>
                            </View>
                        </View>
                        <View style={styles.hours}>
                            <Text style={styles.timecompleted}>Aug 8 -</Text>
                            <Text style={styles.timetotal}> Aug 12</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.hourlines}>
                    <View styles={{ width: "100%", flexDirection: "row", }}>
                        <View style={styles.hourline1}>
                            <Text style={styles.label}>Sick Leave</Text>
                            <View style={{...styles.btn,backgroundColor:"#ff9292"}}>
                                <Text style={styles.txt}>Rejected</Text>
                            </View>
                        </View>
                        <View style={styles.hours}>
                            <Text style={styles.timecompleted}>Jul 3 -</Text>
                            <Text style={styles.timetotal}> Jul 9</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 20,
    },
    header: {
        width: '100%',
        height: 70,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
    },
    heading: {
        fontSize: 26,
        fontFamily: 'sans-serif-black',
        color: '#4BAAC8',
    },
    hourscompleted: {
        width: '100%',
        height: "auto",
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
    },
    txt: {
        fontSize: 14,
        fontFamily: "sans-serif-light",
        color: 'white',
    },
    hourlines: {
        flexDirection: 'column',
        marginTop: 10,
        borderWidth: 1.5,
        borderColor: '#E5E5E5',
        padding: 10,
        borderRadius: 7,
        gap: 10,
    },
    hourline1: {
        width: "100%",
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
    },
    hours: {
        marginTop:3,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    btn: {
        backgroundColor: '#4BAAC8',
        width: 100,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,

    },
    label:{
        fontSize: 16,
        fontFamily: "sans-serif-black",
        color: '#4BAAC8',
    },
    timetotal: {
        color: "#848884",
        fontWeight: "600",
        fontSize: 14,
    },
    timecompleted: {
        color: "#848884",
        fontWeight: "600",
        fontSize: 14,
    },
})