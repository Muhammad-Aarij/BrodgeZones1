import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import bell from '../Images/bell.png';
import emergency from '../Images/emergency.png';
import medical from '../Images/medical.png';
import casual from '../Images/casual.png';
import GetLeavesforApproval from '../Functions/GetLeavesForApproaval';
import LoaderModal from '../Loaders/LoaderModal';

const { width } = Dimensions.get('window');

export default function LeaveApproval({ navigation }) {
    const [requestList, setRequestList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getlist = async () => {
            setIsLoading(true);
            try {
                const response = await GetLeavesforApproval();
                if (response != null) {
                    setRequestList(response);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        getlist();
    }, []);

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

    return (
        <>
            {isLoading ? (
                <LoaderModal />
            ) : (
                <View style={styles.maincontainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Notification's</Text>
                    </View>
                    <View style={styles.headerbtncontainer}>
                        <TouchableOpacity>
                            <Text style={styles.headerbtn}>All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.headerbtn}>Pending</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.headerbtn}>Approved</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.headerbtn}>Rejected</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Mapping over the request list */}
                    {requestList.map((request, index) => {
                        const { type, image } = getLeaveTypeDetails(request.LeaveTypeId);
                        return (
                            <View key={index} style={styles.datecontainer}>
                                <Text style={styles.date}>Today</Text>
                                <View style={styles.tilecontainer}>
                                    <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('ApproavalPage',{data:request})}>
                                        <View style={styles.tileleft}>
                                            <Image style={styles.img} source={image}></Image>
                                        </View>
                                        <View style={styles.tileright}>
                                            <Text style={styles.heading}>{request.Name}</Text>
                                            <Text style={styles.content}>{type}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                </View>
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
        // height:80,
        // borderWidth:2,
        // marginTop: width * 0.01,
        // marginBottom: 5,
        // paddingTop:13,
        // padding: width * 0.01,
        backgroundColor: '#fff',

    },
    date: {
        paddingBottom: width * 0.012,
        fontFamily: "sans-serif-black",
        fontSize: width * 0.035,
        fontWeight: 'bold',
        color: "rgba(51, 51, 51, 1)",
    },
    tilecontainer: {
        padding: width * 0.025,
        backgroundColor: '#fff',
        gap: width * 0.02,
        // borderWidth: 1,
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
            width: 3,
            height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 2,
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
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 1,
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

        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 1,
    },
    headerbtncontainer: {
        flexDirection: "row",
        justifyContent: 'space-evenly',
        marginBottom: width * 0.025,
        // marginTop: width * 0.025,
        // paddingRight: width * 0.05,
        // backgroundColor:"#e5e5e5",
        // paddingVertical:6,
        // borderRadius:40,
        gap: 12,
    },
})