import React, { useState } from 'react';
import { StyleSheet, Dimensions, Text, View, TouchableOpacity, Image } from 'react-native';
import user from '../Images/nouser.jpg';
import menu from '../Images/menu.png';
import docs from '../Images/docs.png';
import calendar from '../Images/calendar.png';
import clock from '../Images/clock.png';
import approave from '../Images/approve.png';
import reject from '../Images/reject.png';
import update from '../Images/settings.png';
import ApproaveLeave from '../Functions/ApproaveLeave';
import SuccessModal from '../Loaders/SuccessModal';
import FailedModal from '../Loaders/FailedModal';
import LoaderModal from '../Loaders/LoaderModal';

const { width } = Dimensions.get('window');

export default function AttendanceApprovel({ route }) {
    // const { data } = route.params;
    // const [leavedata, setData] = useState(data);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFailModal, setShowFailModal] = useState(false);
    const [message, setMessage] = useState(false);
    const [disabled, setDisabled] = useState(false);


    function convertToDateOnly(dateTimeString) {
        const date = new Date(dateTimeString);

        const year = date.getFullYear();
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "June",
            "July", "Aug", "Sept", "Oct", "Nov", "Dec"
        ];
        const month = monthNames[date.getMonth()];
        const day = date.getDate().toString().padStart(2, '0');

        return `${day}  ${month}, ${year}`;
    }
    const Submit = async (state) => {
        if (state == "Approved") {
            setMessage("Leave Request Approved");
        } else {
            setMessage("Leave Request Rejected");
        }

        setIsLoading(true);

        const data = {
            fromDate: leavedata.FromDate,
            toDate: leavedata.ToDate,
            phoneNumber: leavedata.Name,
            availed: leavedata.Availed,
            leaveRequestId: leavedata.LeaveRequestId,
            ApprovedBy: leavedata.ForwardTo,
            createdBy: "email@gmail.com",
            modifiedBy: "email@gmail.com",
            Status: state,
        };

        for (var i in data) {
            console.log(data[i]);
        }
        const success = await ApproaveLeave(data);
        if (success) {
            console.log("success");
            setDisabled(true);
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 3000);
        } else {
            setDisabled(true);
            setShowFailModal(true);
            setTimeout(() => setShowFailModal(false), 3000);
        }
        setIsLoading(false);
    };

    return (
        <>
            {isLoading ? (
                <LoaderModal />
            ) : (
                <View style={styles.maincontainer}>
                    <View style={styles.header}>
                        <Image source={user} style={styles.img} />
                        {/* <Text style={styles.title}>{data.Name}</Text> */}
                        <Text style={styles.title}>Muhammad Aarij</Text>
                    </View>

                    <View style={styles.info}>
                        <View style={styles.infotile}>
                            <View style={styles.infotileleft}>
                                <Image source={menu} style={styles.smallimg} />
                                <Text style={styles.txt}>Edit Request</Text>
                            </View>
                            {/* <Text style={styles.txtlight}>{convertToDateOnly(data.FromDate)}</Text> */}
                            <Text style={styles.txtlight}>Check Out</Text>
                        </View>
                        <View style={styles.infotile}>
                            <View style={styles.infotileleft}>
                                <Image source={clock} style={styles.smallimg} />
                                <Text style={styles.txt}>Time</Text>
                            </View>
                            {/* <Text style={styles.txtlight}>{convertToDateOnly(data.ToDate)}</Text> */}
                            <Text style={styles.txtlight}>7:45 pm</Text>
                        </View>
                        <View style={styles.infotile}>
                            <View style={styles.infotileleft}>
                                <Image source={calendar} style={styles.smallimg} />
                                <Text style={styles.txt}>Date</Text>
                            </View>
                            <Text style={styles.txtlight}>27 - Aug 2024</Text>
                            {/* <Text style={styles.txtlight}>{convertToDateOnly(data.ToDate)}</Text> */}
                        </View>

                    </View>

                    <View style={styles.btncontainer}>
                        <TouchableOpacity
                            style={[
                                styles.btn,
                                { backgroundColor: "#de3e1e", width: width * 0.35 },
                                disabled && styles.disabledBtn
                            ]}
                            // onPress={() => { Submit("Rejected") }}
                            disabled={disabled}
                        >
                            <Image source={reject} style={styles.smallimg} />
                            <Text style={styles.btntxt}>Reject</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.btn,
                                { backgroundColor: "#79b433" },
                                disabled && styles.disabledBtn
                            ]}
                            // onPress={() => { Submit("Approved") }}
                            disabled={disabled}
                        >
                            <Image source={update} style={styles.smallimg} />
                            <Text style={styles.btntxt}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.btncontainer}>
                        <TouchableOpacity
                            style={[
                                styles.btn,
                                { backgroundColor: "#79b433" },
                                disabled && styles.disabledBtn
                            ]}
                            // onPress={() => { Submit("Approved") }}
                            disabled={disabled}
                        >
                            <Image source={approave} style={styles.smallimg} />
                            <Text style={styles.btntxt}>Approave</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            {showSuccessModal && <SuccessModal message={message} />}
            {showFailModal && <FailedModal message={message} />}
        </>

    )
}

const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: width * 0.05,
    },
    header: {
        width: '100%',
        height: width * 0.112,
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
    info: {
        width: '100%',
        marginTop: width * 0.05,
        marginBottom: width * 0.05,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: "rgba(241, 241, 241, 1)",
        padding: width * 0.04,
        paddingHorizontal: width * 0.075,
        borderRadius: width * 0.025,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: width * 0.05,
        },
        shadowOpacity: 0.25,
        shadowRadius: width * 0.01,
        elevation: width * 0.01,
    },
    infotile: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: width * 0.0125,
        height: width * 0.125,
        borderBottomWidth: width * 0.001,
        borderBottomColor: '#ccc',
    },
    infotileleft: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: width * 0.0125,
        height: width * 0.085,
    },
    txt: {
        fontSize: width * 0.037,
        fontFamily: "sans-serif-medium",
        color: "rgba(18, 18, 18, 1)",
        fontWeight: "400",
        marginBottom: width * 0.0075,
    },
    txtlight: {
        fontSize: width * 0.033,
        fontFamily: "sans-serif-regular",
        fontWeight: "700",
        color: "#808080",
    },
    btncontainer: {
        width: '100%',
        marginTop: width * 0.05,
        marginBottom: width * 0.05,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    btn: {
        flexDirection: "row",
        width: width * 0.45,
        paddingVertical: width * 0.0175,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: width * 0.0125,
        borderColor: "rgba(241, 241, 241, 1)",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: width * 0.05,
        },
        shadowOpacity: 0.25,
        shadowRadius: width * 0.01,
        elevation: width * 0.01,
    },
    btntxt: {
        fontSize: width * 0.032,
        fontFamily: "sans-serif-regular",
        color: "white",
    },
    img: {
        width: width * 0.1,
        height: width * 0.1,
        borderRadius: width * 0.25,
        marginRight: width * 0.025,
        borderColor: "rgba(241, 241, 241, 1)",
        overflow: 'hidden',
    },
    smallimg: {
        width: width * 0.07,
        height: width * 0.07,
        marginRight: width * 0.025,
        borderColor: "rgba(241, 241, 241, 1)",
        overflow: 'hidden',
    },
    disabledBtn: {
        backgroundColor: 'gray',
        opacity: 0.6,
    },
});
