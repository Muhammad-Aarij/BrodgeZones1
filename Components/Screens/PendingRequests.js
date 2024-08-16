import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions, } from 'react-native'
import GetleavesStatus from '../Functions/GetLeavesStatus';
import LoaderModal from '../Loaders/LoaderModal';

const { width } = Dimensions.get('window');

export default function PendingRequests({ route }) {

    const { type } = route.params;
    const [leavesdata, setLeaves] = useState([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLeavesStatus = async () => {
            try {
                setLoading(true);
                const number = await AsyncStorage.getItem('@UserNumber');
                const data = await GetleavesStatus(number);
                if (data) {
                    // console.log(data);
                    setLeaves(data);
                    setLoading(false);
                }
            } catch (e) {
                setError(e.message);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        fetchLeavesStatus();
    }, []);

    return (
        <>
            {isLoading ? <LoaderModal /> : (
                <ScrollView style={styles.mainContainer}>
                    <View style={styles.header}>
                        <Text style={styles.heading}>{type} Requests</Text>
                    </View>

                    <View style={styles.hourscompleted}>
                        {leavesdata != null && leavesdata.map((leave, index) => {
                            const fromDate = new Date(leave.FromDate).toLocaleDateString();
                            const toDate = new Date(leave.ToDate).toLocaleDateString();
                            const statusColor = {
                                Pending: '#E4D00A',
                                Approved: '#4BAAC8',
                                Rejected: '#ff9292'
                            }[leave.Status] || '#4BAAC8';
                            let leaveType = "Leave";
                            switch (leave.LeaveTypeId) {
                                case 1:
                                    leaveType = "Medical Leave";
                                    break;
                                case 2:
                                    leaveType = "Casual Leave";
                                    break;
                                case 3:
                                    leaveType = "Emergency Leave";
                                    break;
                                case 4:
                                    leaveType = "Annual Leave"; 
                                    break;
                                default:
                                    leaveType = "Leave";
                            }
                            return (
                                <View style={styles.hourlines}>
                                    <View styles={{ width: "100%", flexDirection: "row", }}>
                                        <View style={styles.hourline1}>
                                            <Text style={styles.label}>{leaveType} </Text>
                                            <View style={{ ...styles.btn, backgroundColor: statusColor }}>
                                                <Text style={styles.txt}>{leave.Status}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.hours}>
                                            <Text style={styles.timecompleted}>{fromDate} -</Text>
                                            <Text style={styles.timetotal}> {toDate}</Text>
                                        </View>
                                    </View>
                                </View>);
                        })}

                    </View>
                </ScrollView>)
            }
        </>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: width*0.05,
    },
    header: {
        width: '100%',
        height: width*0.18,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: width*0.025,
    },
    heading: {
        fontSize: width*0.06,
        fontFamily: 'sans-serif-black',
        color: '#4BAAC8',
    },
    hourscompleted: {
        width: '100%',
        height: "auto",
        backgroundColor: '#FFFFFF',
        borderRadius: width*0.025,
        padding: width*0.05,
        marginBottom: width*0.05,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
        marginBottom:width*0.12,
    },
    txt: {
        fontSize: width*0.036,
        fontFamily: "sans-serif-light",
        color: 'white',
    },
    hourlines: {
        flexDirection: 'column',
        marginTop: width*0.025,
        borderWidth: width*0.0025,
        borderColor: '#E5E5E5',
        padding: width*0.025,
        borderRadius: width*0.015,
        gap: width*0.025,
    },
    hourline1: {
        width: "100%",
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
    },
    hours: {
        marginTop: width*0.01,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    btn: {
        backgroundColor: '#4BAAC8',
        width: width*0.23,
        height: width*0.08,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: width*0.01,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: width*0.005,

    },
    label: {
        fontSize: width*0.04,
        fontFamily: "sans-serif-regular",
        color: '#404040',
    },
    timetotal: {
        color: "#848884",
        fontWeight: "600",
        fontSize: width*0.034,
    },
    timecompleted: {
        color: "#848884",
        fontWeight: "600",
        fontSize: width*0.034,
    },
})