import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Dimensions, Image, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import LoaderModal from '../Loaders/LoaderModal';
import moment from 'moment';
import GetleavesStatus from '../Functions/GetLeavesStatus';
import bell from '../Images/bell.png';
import emergency from '../Images/emergency.png';
import medical from '../Images/medical.png';
import casual from '../Images/casual.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function PendingRequests({ navigation, route }) {
    const { type } = route.params;
    const [requestList, setRequestList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [requesttype, setRequestType] = useState(`${type} Request`);

    function convertToDateOnly(dateTimeString) {
        const date = new Date(dateTimeString);

        const year = date.getFullYear();
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "June",
            "July", "Aug", "Sept", "Oct", "Nov", "Dec"
        ];
        const month = monthNames[date.getMonth()]; // Get the month name
        const day = date.getDate().toString().padStart(2, '0');

        return `${day}-${month}-${year}`;
    }

    useEffect(() => {
        const getPendingLeaves = async () => {
            setIsLoading(true);
            try {
                const number = await AsyncStorage.getItem('@UserNumber');
                const response = await GetleavesStatus(number);
                if (response != null) {
                    setRequestList(response);
                    console.log(response);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        getPendingLeaves();
    }, []);

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

    const sortedRequests = [...requestList].sort((a, b) => moment(b.CreatedDate) - moment(a.CreatedDate));
    const groupedRequests = sortedRequests.reduce((groups, request) => {
        const dateCategory = categorizeByDate(request.CreatedDate);
        if (!groups[dateCategory]) {
            groups[dateCategory] = [];
        }
        groups[dateCategory].push(request);
        return groups;
    }, {});

    const filteredGroups = Object.keys(groupedRequests).reduce((result, dateCategory) => {
        const filteredRequests = groupedRequests[dateCategory].filter((request) => {
            if (requesttype === 'All' || requesttype === '' || requesttype === 'Request') return true;
            if (requesttype === 'Pending Request') return request.Status === 'Pending';
            if (requesttype === 'Approved Request') return request.Status === 'Approved';
            if (requesttype === 'Rejected Request') return request.Status === 'Rejected';
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return styles.pending;
            case 'Rejected':
                return styles.rejected;
            case 'Approved':
                return styles.approved;
            default:
                return styles.default;
        }
    };

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
                        <ScrollView horizontal style={styles.headerbtncontainer}>
                            <TouchableOpacity onPress={() => setRequestType('All')}>
                                <Text style={styles.headerbtn}>All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setRequestType('Pending Request')}>
                                <Text style={styles.headerbtn}>Pending</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setRequestType('Approved Request')}>
                                <Text style={styles.headerbtn}>Approved</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setRequestType('Rejected Request')}>
                                <Text style={styles.headerbtn}>Rejected</Text>
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
                                <Text style={styles.datecategory}>{dateCategory}</Text>
                                <View style={styles.tilecontainer}>
                                    {filteredGroups[dateCategory].map((request, idx) => {
                                        const { type, image } = getLeaveTypeDetails(request.LeaveTypeId);
                                        return (
                                            <Pressable
                                                key={idx}
                                                style={styles.tile}
                                            >
                                                <View style={styles.tileleft}>
                                                    <Image style={styles.img} source={image} />
                                                </View>
                                                <View style={styles.tileright}>
                                                    <Text style={styles.heading}>{type}</Text>
                                                    <Text style={styles.date}>
                                                        {request.FromDate === request.ToDate
                                                            ? convertToDateOnly(request.FromDate)
                                                            : `${convertToDateOnly(request.FromDate)} - ${convertToDateOnly(request.ToDate)}`}
                                                    </Text>
                                                    <Text style={[styles.content, getStatusColor(request.Status)]}>
                                                        {request.Status}
                                                    </Text>
                                                </View>
                                            </Pressable>
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

                    </>
                    {/* <View style={styles.footer}>
                        <Text style={styles.txt}>2024 BridgeZones ©</Text>
                        <Text style={styles.txt}>All rights reserved</Text>
                    </View> */}
                </ScrollView>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: width * 0.05,
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
        paddingBottom: width * 0.06,
    },
    datecategory: {
        paddingBottom: width * 0.012,
        fontFamily: "sans-serif-black",
        fontSize: width * 0.03,
        color: "rgba(51, 51, 51, 1)",
    },
    date: {
        paddingBottom: width * 0.012,
        fontFamily: "sans-serif-regular",
        fontSize: width * 0.03,
        color: "rgba(51, 51, 51, 1)",
    },
    nocontainer: {
        height: width * 0.27,
        backgroundColor: "rgba(241, 241, 241, 1)",
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: "flex-start",
        marginTop: width * 0.02,
        marginBottom: width * 0.05,
        padding: width * 0.03,
        borderRadius: width * 0.04,
        shadowColor: '#000',
        shadowOffset: {
            width: width * 0.008,
            height: width * 0.008,
        },
        shadowOpacity: 0.25,
        shadowRadius: width * 0.01,
        elevation: width * 0.01,
    },
    tilecontainer: {
        padding: width * 0.025,
        backgroundColor: '#fff',
        gap: width * 0.02,
    },
    tile: {
        backgroundColor: "rgba(241, 241, 241, 1)",
        flexDirection: 'row',
        marginBottom: width * 0.02,
        padding: width * 0.015,
        borderRadius: width * 0.04,
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: {
            width: width * 0.008,
            height: width * 0.008,
        },
        shadowOpacity: 0.015,
        shadowRadius: width * 0.011,
        elevation: width * 0.007,
    },
    tileleft: {
        width: width * 0.17,
        height: width * 0.17,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: width * 0.025,
        margin: width * 0.005,
        backgroundColor: "#FFFFFF",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: width * 0.005,
        },
        shadowOpacity: 0.25,
        shadowRadius: width * 0.01,
        elevation: width * 0.005,
    },
    img: {
        width: width * 0.075,
        height: width * 0.075,
    },
    tileright: {
        flex: 1,
        marginLeft: width * 0.02,
    },
    heading: {
        fontSize: width * 0.032,
        fontFamily: "sans-serif-medium",
        color: "rgba(18, 18, 18, 1)",
        fontWeight: 'bold',
        marginBottom: width * 0.01,
    },
    content: {
        fontSize: width * 0.033,
        fontWeight: "bold",
        backgroundColor: "#FFFFFF",
        borderRadius: width * 0.01,
        width: "40%",
        padding: width * 0.005,
        paddingLeft: width * 0.012,
        shadowColor: '#000',
        shadowOffset: {
            width: width * 0.008,
            height: width * 0.008,
        },
        shadowOpacity: 0.25,
        shadowRadius: width * 0.05,
        elevation: width * 0.005,
    },
    headerbtn: {
        padding: width * 0.025,
        paddingHorizontal: width * 0.04,
        backgroundColor: '#4BAAC8',
        borderRadius: width * 0.04,
        fontFamily: "sans-serif-medium",
        fontSize: width * 0.035,
        color: "#FFFFFF",
        fontWeight: "400",
        marginRight: width * 0.02,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: width * 0.001,
        },
        shadowOpacity: 0.25,
        shadowRadius: width * 0.011,
        elevation: width * 0.005,
    },
    headerbtncontainer: {
        flexDirection: "row",
        marginBottom: width * 0.05,
        gap: width * 0.09,
        width: "auto",
    },
    pending: {
        color: 'orange',
    },
    rejected: {
        color: 'red',
    },
    approved: {
        color: 'green',
    },
    default: {
        color: 'black',
    }
});
