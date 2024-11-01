import React, { useState, useCallback } from 'react';
import { Dimensions, StyleSheet, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import bell from '../Images/bell.png';
import emergency from '../Images/emergency.png';
import medical from '../Images/medical.png';
import casual from '../Images/casual.png';
import inn from '../Images/in.png';
import out from '../Images/out.png';
import GetLeavesforApproval from '../Functions/GetLeavesForApproaval';
import LoaderModal from '../Loaders/LoaderModal';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetAttendanceRequestList from '../Functions/GetAttendanceRequestList';

const { width } = Dimensions.get('window');

export default function LeaveApproval({ navigation }) {
    const [requestList, setRequestList] = useState([]);
    const [attendancerequestList, setAttendanceRequestList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [requesttype, setRequestType] = useState('');
    const [selectedLeave, setSelectedLeave] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const getlist = async () => {
                setIsLoading(true);
                try {
                    const number = await AsyncStorage.getItem("@UserNumber");
                    const response = await GetLeavesforApproval();
                    if (response && response.length > 0) {
                        setRequestList(response);
                    } else {
                        setRequestList([]); // Handle empty state
                    }
                } catch (e) {
                    console.error(e);
                } finally {
                    setIsLoading(false);
                }
            };
            const getAttendancelist = async () => {
                setIsLoading(true);
                try {
                    const response = await GetAttendanceRequestList();
                    if (response && response.length > 0) {
                        setAttendanceRequestList(response);
                    } else {
                        setAttendanceRequestList([]); 
                    }
                } catch (e) {
                    console.error(e);
                } finally {
                    setIsLoading(false);
                }
            };


            getlist();
            getAttendancelist();
            
        }, [])
    );

    // Helper function to determine leave type and image source
    const getLeaveTypeDetails = (LeaveTypeId) => {
        switch (LeaveTypeId) {
            case 1:
                return { type: 'Medical Leave Request', image: medical };
            case 2:
                return { type: 'Casual Leave Request', image: casual };
            case 3:
                return { type: 'Emergency Leave Request', image: emergency };
            default:
                return { type: 'Unknown Leave Type', image: bell };
        }
    };

    // Function to categorize requests by date
    const categorizeByDate = (date) => {
        const today = moment().startOf('day');
        const yesterday = moment().subtract(1, 'days').startOf('day');
        const requestDate = moment(date).startOf('day');

        if (requestDate.isSame(today, 'd')) {
            return 'Today';
        } else if (requestDate.isSame(yesterday, 'd')) {
            return 'Yesterday';
        } else {
            return requestDate.format('DD MMMM YYYY');
        }
    };

    // Sort the requests by CreatedDate and then categorize them
    const sortedRequests = [...requestList].sort((a, b) => moment(b.CreatedDate) - moment(a.CreatedDate));
    const groupedRequests = sortedRequests.reduce((groups, request) => {
        const dateCategory = categorizeByDate(request.CreatedDate);
        if (!groups[dateCategory]) {
            groups[dateCategory] = [];
        }
        groups[dateCategory].push(request);
        return groups;
    }, {});

    // Filter the grouped requests based on the selected request type
    const filteredGroups = Object.keys(groupedRequests).reduce((result, dateCategory) => {
        const filteredRequests = groupedRequests[dateCategory].filter((request) => {
            if (requesttype === 'All' || requesttype === '') return true;
            if (requesttype === 'Pending') return request.Status === 'Pending';
            if (requesttype === 'Approved') return request.Status === 'Approved';
            if (requesttype === 'Rejected') return request.Status === 'Rejected';
            if (requesttype === 'Medical Leaves') return request.LeaveTypeId === 1;
            if (requesttype === 'Casual Leaves') return request.LeaveTypeId === 2;
            if (requesttype === 'Emergency Leaves') return request.LeaveTypeId === 3;
            return false;
        });
        if (filteredRequests.length > 0) {
            result[dateCategory] = filteredRequests;
        }
        return result;
    }, {});

    return (
        <>
            {isLoading ? (
                <LoaderModal />
            ) : (
                <ScrollView style={styles.maincontainer} >
                    <>
                        <View style={styles.header}>
                            <Text style={styles.title}>Notification's</Text>
                        </View>
                        <View style={styles.categoryContainer}>
                            <TouchableOpacity style={{ ...styles.categorybtn, borderTopLeftRadius: width * 0.04, backgroundColor: selectedLeave ? '#4BAAC8' : "#C0C0C0" }} onPress={() => { setSelectedLeave(true) }}>
                                <Text style={{ ...styles.categorytext }}>Leave Request</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ ...styles.categorybtn, borderBottomRightRadius: width * 0.04, backgroundColor: selectedLeave ? "#C0C0C0" : '#4BAAC8' }} onPress={() => { setSelectedLeave(false) }}>
                                <Text style={styles.categorytext}>Attendance Request</Text>
                            </TouchableOpacity>
                        </View>

                        {selectedLeave ?
                            (<>
                                <ScrollView horizontal style={styles.headerbtncontainer}>
                                    <TouchableOpacity onPress={() => setRequestType('All')}>
                                        <Text style={styles.headerbtn}>All</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setRequestType('Pending')}>
                                        <Text style={styles.headerbtn}>Pending</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setRequestType('Medical Leaves')}>
                                        <Text style={styles.headerbtn}>Medical Leaves</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setRequestType('Casual Leaves')}>
                                        <Text style={styles.headerbtn}>Casual Leaves</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setRequestType('Emergency Leaves')}>
                                        <Text style={styles.headerbtn}>Emergency Leaves</Text>
                                    </TouchableOpacity>
                                </ScrollView>

                                {Object.keys(filteredGroups).map((dateCategory, index) => (
                                    <View key={index} style={styles.datecontainer}>
                                        <Text style={styles.date}>{dateCategory}</Text>
                                        <View style={styles.tilecontainer}>
                                            {filteredGroups[dateCategory].map((request, idx) => {
                                                const { type, image } = getLeaveTypeDetails(request.LeaveTypeId);
                                                return (
                                                    <TouchableOpacity
                                                        key={idx}
                                                        style={styles.tile}
                                                        onPress={() => navigation.navigate('ApproavalPage', { data: request })}
                                                    >
                                                        <View style={styles.tileleft}>
                                                            <Image style={styles.img} source={image} />
                                                        </View>
                                                        <View style={styles.tileright}>
                                                            <Text style={styles.heading}>{request.Name}</Text>
                                                            <Text style={styles.content}>{type}</Text>
                                                            <Text style={styles.content}>{request.Status}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    </View>
                                ))}

                                {Object.keys(filteredGroups).length === 0 && (
                                    <View style={styles.nocontainer}>
                                        <Text>No {requesttype} Available</Text>
                                    </View>
                                )}
                            </>)
                            :
                            (
                                <>
                                    <View style={styles.datecontainer}>
                                        <Text style={styles.date}>Today</Text>
                                        <View style={styles.tilecontainer}>
                                            {attendancerequestList.map((request, idx) => {
                                                const isCheckin = request.Status.toLowerCase().includes("checkin");
                                                const imageSource = isCheckin ? inn : out;
                                                const requestTitle = isCheckin ? "Check In Request" : "Check Out Request";
                                                
                                                return (
                                                    <TouchableOpacity
                                                        key={idx}
                                                        style={styles.tile}
                                                        onPress={() => navigation.navigate('AttendaceApproaval', { data: request })}
                                                    >
                                                        <View style={styles.tileleft}>
                                                            <Image style={styles.img} source={imageSource} />
                                                        </View>
                                                        <View style={styles.tileright}>
                                                            <Text style={styles.heading}>{request.Name}</Text>
                                                            <Text style={styles.content}>{requestTitle}</Text>
                                                            {/* <Text style={styles.content}>{request.Status}</Text> */}
                                                        </View>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    </View>
                                </>
                            )
                        }

                    </>

                </ScrollView >
            )
            }
        </>
    );
}
const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: width * 0.05,
        // paddingBottom:width*0.1,
        // borderWidth: width * 0.01, // Example
        // borderColor:"red",
    },
    header: {
        width: '100%',
        height: width * 0.18,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: width * 0.025,
        marginTop: width * 0.025,
    },
    title: {
        fontSize: width * 0.065,
        fontFamily: 'sans-serif-black',
        color: '#4BAAC8',
    },
    datecontainer: {
        backgroundColor: '#fff',
        paddingBottom: width * 0.025, // Example
    },
    date: {
        paddingBottom: width * 0.012,
        fontFamily: "sans-serif-black",
        fontSize: width * 0.035,
        fontWeight: 'bold',
        color: "rgba(51, 51, 51, 1)",
    },
    nocontainer: {
        height: width * 0.3, // Example
        backgroundColor: "rgba(241, 241, 241, 1)",
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: "flex-start",
        marginTop: width * 0.02,
        marginBottom: width * 0.05,
        padding: width * 0.03,
        borderRadius: width * 0.04,
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: {
            width: width * 0.005, // Example
            height: width * 0.003, // Example
        },
        shadowOpacity: 0.25,
        shadowRadius: width * 0.01, // Example
        elevation: width * 0.006, // Example
    },
    tilecontainer: {
        padding: width * 0.025,
        backgroundColor: '#fff',
        gap: width * 0.02,
        // borderWidth: width * 0.01, // Example
        // borderColor: '#ccc',
    },
    tile: {
        backgroundColor: "rgba(241, 241, 241, 1)",
        flexDirection: 'row',
        marginBottom: width * 0.02,
        padding: width * 0.013,
        borderRadius: width * 0.04,
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: {
            width: width * 0.003, // Example
            height: width * 0.003, // Example
        },
        shadowOpacity: 0.25,
        shadowRadius: width * 0.01, // Example
        elevation: width * 0.002, // Example
    },
    tileleft: {
        width: width * 0.12,
        height: width * 0.12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: width * 0.025,
        margin: width * 0.005,
        backgroundColor: "#FFFFFF",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: width * 0.002, // Example
        },
        shadowOpacity: 0.25,
        shadowRadius: width * 0.01, // Example
        elevation: width * 0.001, // Example
    },
    img: {
        width: width * 0.06,
        height: width * 0.06,
    },
    tileright: {
        flex: 1,
        marginLeft: width * 0.03,
    },
    heading: {
        fontSize: width * 0.037,
        fontFamily: "sans-serif-black",
        color: "rgba(18, 18, 18, 1)",
        fontWeight: 'bold',
        marginBottom: width * 0.01,
    },
    content: {
        fontSize: width * 0.033,
    },
    headerbtn: {
        padding: width * 0.025,
        paddingHorizontal: width * 0.04,
        backgroundColor: '#4BAAC8',
        borderRadius: width * 0.06,
        fontFamily: "sans-serif-medium",
        fontSize: width * 0.035,
        color: "#FFFFFF",
        fontWeight: "400",
        marginRight: width * 0.004, // Example

        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: width * 0.002, // Example
        },
        shadowOpacity: 0.25,
        shadowRadius: width * 0.01, // Example
        elevation: width * 0.001, // Example
    },
    headerbtncontainer: {
        flexDirection: "row",
        marginBottom: width * 0.055,
        gap: width * 0.03,
        width: "auto",
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
        paddingBottom: width * 0.02, // Example
    },
    txt: {
        fontSize: width * 0.04, // Example
        color: "white",
    },

    categoryContainer: {
        flexDirection: "row",
        marginBottom: width * 0.055,
        width: "100%",
        justifyContent: "center",
    },
    categorytext: {
        fontSize: width * 0.032,
        color: "white",
        fontWeight: "bold",
    },
    categorybtn: {
        padding: width * 0.025,
        paddingHorizontal: width * 0.06,
        backgroundColor: '#4BAAC8',
        fontFamily: "sans-serif-medium",
        fontSize: width * 0.035,
        color: "#FFFFFF",
        fontWeight: "400",

        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: width * 0.005,
            height: width * 0.005, // Example
        },
        shadowOpacity: 0.25,
        shadowRadius: width * 0.01, // Example
        elevation: width * 0.005, // Example
    },
});
