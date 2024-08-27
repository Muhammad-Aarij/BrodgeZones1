import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Image, Pressable, Dimensions, Modal } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Dropdown } from 'react-native-element-dropdown';
import LeaveApply from '../Functions/LeaveApply';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SuccessModal from '../Loaders/SuccessModal';
import FailedModal from '../Loaders/FailedModal';
import history from '../Images/history.png';
import upload from '../Images/upload.png';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import DocumentPicker from 'react-native-document-picker';
import uploadDocuments from '../Functions/UploadDocuments';
import GetListofTeamLeads from '../Functions/GetListofTeamLeads';
import LoaderModal from '../Loaders/LoaderModal';
import GetLeaveAllowedId from '../Functions/GetLeaveAllowedId';
import GetRemainingLeaves from '../Functions/GetRemianingLeaves';

const { width } = Dimensions.get('window');

// e 7 medical 9 casual 8
export default function LeavePage({ navigation }) {
    const [today] = useState(new Date()); // Get the current date

    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [date, setDate] = useState(new Date());
    const [date2, setDate2] = useState(null); // Initially null to show no end date selected
    const [value, setValue] = useState(null);
    const [send, setSendTo] = useState(null);
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [ImagedOc, setImagedOc] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFailModal, setShowFailModal] = useState(false);
    const [error, setError] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [file, setFile] = useState(null);
    const [emplyeeList, setEmployeeList] = useState([]);
    const [RemainingLeaves, setRemianingLeaves] = useState();
    const [LeaveAllowedId, setLeaveAllowedId] = useState(0);
    const [source,setSource] =useState(null); 

    useEffect(() => {
        const getlist = async () => {
            setIsLoading(true);
            try {
                const response = await GetListofTeamLeads();
                if (response != null) {
                    const transformedList = response.map(item => ({
                        label: item.Name,
                        value: item.UserIdentityId
                    }));
                    setEmployeeList(transformedList);
                    // console.log("first employeeee" + emplyeeList[0].label);
                    setIsLoading(false);
                }
                else {
                    setIsLoading(false);
                }
            } catch (e) {
                setIsLoading(false);
                console.error(e);
            }
        };

        getlist();
    }, []);

    const getLeaveTypeDetails = async (id) => {
        setIsLoading(true);
        const phone = await AsyncStorage.getItem("@UserNumber");
        try {
            const getid = await GetLeaveAllowedId(phone, id);
            if (getid) {
                console.log("get RemainingLeaves", getid.RemainingLeaves);
                console.log("get id", getid.LeaveAllowedId);
                setLeaveAllowedId(getid.LeaveAllowedId); // Set LeaveAllowedId state
                setRemianingLeaves(getid); // Set RemainingLeaves state
            } else {
                console.log("Failed to fetch leave details");
            }
        } catch (error) {
            console.error("Error fetching leave details:", error);
        }
        setIsLoading(false);
    };

    const handleDateConfirm = (selectedDate) => {
        setOpen(false);
        setDate(selectedDate);
        setDate2(null);
    };

    const handleDateConfirm2 = (selectedDate) => {
        setDate2(selectedDate);
        setOpen2(false);
    };

    const firstError = useMemo(() => {
        return error.length > 0 ? error[0] : "";
    }, [error]);

    const data = [
        { label: 'Medical Leave', value: '1' },
        { label: 'Casual Leave', value: '2' },
        { label: 'Emergency Leave', value: '3' },
        // { label: 'Annual Leave', value: '4' },
        // { label: 'Other', value: '4' },
    ];

    const renderItem = (item) => (
        <View style={styles.dropdownItem}>
            <Text style={styles.dropdownItemText}>{item.label}</Text>
        </View>
    );
    const renderItem2 = (item) => (
        <View style={styles.dropdownItem}>
            <Text style={styles.dropdownItemText}>{item.label}</Text>
        </View>
    );

    const requestCameraPermission = async () => {
        const result = await request(PERMISSIONS.ANDROID.CAMERA);
        return result;
    };

    const pickImageFromGallery = () => {
        const options = {
            mediaType: 'photo',
            maxWidth: 300,
            maxHeight: 300,
            quality: 1,
        };

        launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                setModalVisible(!modalVisible)
                const file = response.assets[0];
                console.log('Selected file:', file);
                setImagedOc(file);
                setSource(file);
                // uploadDoc(file);
            }
        });
    };

    const takePhotoWithCamera = async () => {
        setFile(null);
        setImagedOc(null);
        const permissionResult = await requestCameraPermission();
        if (permissionResult === RESULTS.GRANTED) {
            const options = {
                mediaType: 'photo',
                maxWidth: 300,
                maxHeight: 300,
                quality: 1,
            };

            launchCamera(options, response => {
                if (response.didCancel) {
                    console.log('User cancelled camera');
                } else if (response.errorCode) {
                    console.log('Camera Error: ', response.errorMessage);
                } else {
                    setModalVisible(!modalVisible)
                    const source = response.assets[0];
                    setImagedOc(source);
                    console.log('Selected file:', source);
                    // uploadDoc(source);
                    setSource(source);
                }
            });
        } else {
            Alert.alert('Camera permission denied');
        }
    };

    const pickDocument = async () => {
        setImagedOc(null);
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });

            if (res && res.length > 0) {
                const file = res[0];
                console.log('Selected file:', file);
                setFile(file);
                // uploadDoc(file);
                setSource(file);
                setModalVisible(false);
            } else {
                console.log('No document selected or invalid response');
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled document picker');
            } else {
                console.error('Document Picker Error: ', err);
            }
        }
    };




    const uploadDoc = async (img) => {
        setIsLoading(true);
        const number = await AsyncStorage.getItem("@UserNumber");
        console.log("Image" + img);
        console.log("Number" + number);
        const sendImg = await uploadDocuments(img, number);

        if (sendImg) {
            setIsLoading(false);
            setPicture(img);
        } else {
            setIsLoading(false);
        }
    };
    const ApplyforLeave = async () => {
        const number = await AsyncStorage.getItem('@UserNumber');
        const mail = await AsyncStorage.getItem('@UserEmail');
        const newErrors = [];

        if (!mail) newErrors.push("User email is required.");
        if (!date) newErrors.push("From date is required.");
        if (!value) newErrors.push("Leave Type is required.");
        if (!send) newErrors.push("Forward To is required.");

        if (newErrors.length > 0) {
            setError([newErrors[0]]); // Store only the first error
            console.log(error);
            return;
        }
        setError([]);

        setIsLoading(true);

        const data = {
            fromDate: date,
            toDate: date2 ? date2 : date,
            phoneNumber: number,
            createdBy: "email@admin.com",
            modifiedBy: "email@admin.com",
            leaveAllowedId: LeaveAllowedId,
            forwardTo: send,
            availed: 1,
            CreatedDate: today,
        };
        if(source!=null)   {
            uploadDoc(source);
        }
        const success = await LeaveApply(data);
        if (success) {
            console.log("success");
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 3000);

            setValue(null);
            setDate(new Date());
            setDate2(null);
            setReason('');
            setDescription('');
            setSendTo('');
            setRemianingLeaves(null);
            setSource(null);
            setImagedOc(null);
            setFile(null);
        } else {
            setShowFailModal(true);
            setTimeout(() => setShowFailModal(false), 3000);
        }
        setIsLoading(false);
    };

    return (
        <>{
            isLoading ?
                <LoaderModal />
                :
                <ScrollView style={styles.mainContainer}>
                    <View style={styles.header}>
                        <Text style={styles.heading}>Apply for Leave</Text>
                        <Pressable style={styles.historybutton} onPress={() => navigation.navigate('Pendingrequests', { type: '' })}>
                            <Image style={styles.img} source={history}></Image>
                        </Pressable>
                    </View>
                    <View style={styles.body}>
                        {/* <View style={styles.bodyline}>
                            <View>
                                <Text>1-Day </Text>
                            </View>
                        </View> */}

                        <View style={styles.bodyline}>
                            <Text style={styles.label}>From</Text>
                            <TouchableOpacity style={styles.button} onPress={() => setOpen(true)}>
                                <Text style={{ fontSize: width * 0.036, color: "white" }}>{date == null ? "Select Date" : date.toDateString()}</Text>
                            </TouchableOpacity>
                            <DatePicker
                                modal
                                mode='date'
                                open={open}
                                date={date || new Date()}
                                minimumDate={new Date()}
                                onConfirm={handleDateConfirm}
                                onCancel={() => setOpen(false)}
                            />
                        </View>
                        <View style={styles.bodyline}>
                            <Text style={styles.label}>To</Text>
                            <TouchableOpacity style={styles.button} onPress={() => setOpen2(true)}>
                                <Text style={{ fontSize: width * 0.036, color: "white" }}>{date2 == null ? "Select Date" : date2.toDateString()}</Text>
                            </TouchableOpacity>
                            <DatePicker
                                modal
                                mode='date'
                                open={open2}
                                date={date2 || date} // Set the initial date for the end date picker
                                minimumDate={date} // Set the minimum selectable date for the end date picker
                                onConfirm={handleDateConfirm2}
                                onCancel={() => setOpen2(false)}
                            />
                        </View>
                        <View style={{ ...styles.bodyline, marginTop: 15, }}>
                            <Text style={styles.label}>Forward To</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={emplyeeList}
                                maxHeight={250}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Employee"
                                searchPlaceholder="Search..."
                                value={send}
                                renderItem={renderItem}
                                onChange={item => {
                                    setSendTo(item.value);
                                }}
                            />
                        </View>
                        <View style={{ ...styles.bodyline, marginTop: 15 }}>
                            <Text style={styles.label}>Select Leave Type</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={data}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Leave Type"
                                searchPlaceholder="Search..."
                                value={value}
                                onChange={
                                    item => {
                                        setValue(item.value);
                                        getLeaveTypeDetails(item.value);
                                    }}
                                renderItem={renderItem2}
                            />
                        </View>
                        {RemainingLeaves != null && <View style={{ ...styles.bodyline, marginTop: 15 }}>
                            <Text style={styles.smalltxt}>Leaves Available : {RemainingLeaves.RemainingLeaves}</Text>
                        </View>}
                        {/* {value === "other" && (
                            <View style={{ ...styles.bodyline, marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={styles.label}>Reason</Text>
                                <TextInput
                                    style={styles.input}
                                    value={reason}
                                    onChangeText={setReason}
                                    placeholder="Enter reason"
                                />
                            </View>
                        )} */}
                        <View style={{ ...styles.bodyline, marginTop: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            {/* <Text style={{ ...styles.label, width: "28%" }}>Upload Proof Document</Text> */}
                            <Pressable style={styles.textArea} onPress={() => {
                                setModalVisible(!modalVisible);
                            }}>
                                <Image source={upload} style={styles.uplaod}>
                                </Image>
                                <View onPress={() => {
                                    setModalVisible(!modalVisible);
                                }}>
                                    <Text style={styles.txt}> {file == null ? "Upload Proof Document" : file.name} </Text>
                                </View>
                            </Pressable>
                        </View>
                        {ImagedOc != null && <View style={{ ...styles.bodyline, marginTop: 15 }}>
                            <Text style={{ ...styles.smalltxt, alignSelf: "center" }}>** Image Added **</Text>
                        </View>}
                        {file != null && <View style={{ ...styles.bodyline, marginTop: 15 }}>
                            <Text style={{ ...styles.smalltxt, alignSelf: "center" }}>** Document Added **</Text>
                        </View>}
                        <View style={{ ...styles.bodyline, marginTop: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

                        </View>
                        <Text style={styles.error}>{firstError}</Text>
                        <View>
                            <TouchableOpacity style={{ ...styles.button, width: 170, }} onPress={ApplyforLeave}>
                                <Text style={{ fontSize: width * 0.036, color: "white" }}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <TouchableOpacity style={styles.modalButton} onPress={pickDocument}>
                                    <Text style={styles.buttonText}>Choose Document</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.modalButton} onPress={pickImageFromGallery}>
                                    <Text style={styles.buttonText}>Choose from Gallery</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={takePhotoWithCamera}>
                                    <Text style={styles.buttonText}>Take Photo</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButtoncross} onPress={() => setModalVisible(!modalVisible)}>
                                    <Text style={styles.buttonTextcross}>X</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    {showSuccessModal && <SuccessModal message={"Request Sent"} />}
                    {showFailModal && <FailedModal />}
                </ScrollView>
        }
        </>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: width * 0.05,
        borderRadius: width * 0.025,
    },
    header: {
        width: "100%",
        height: width * 0.17,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    img: {
        width: width * 0.072,
        height: width * 0.072,
        resizeMode: 'contain',
    },
    heading: {
        fontFamily: "sans-serif-black",
        fontSize: width * 0.060,
        color: '#4BAAC8',
    },
    body: {
        marginTop: width * 0.01,
        marginBottom: width * 0.13,
        width: "100%",
        alignItems: 'center',
        backgroundColor: "white",
        padding: width * 0.05,
        borderRadius: width * 0.025,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
    },
    bodyline: {
        marginTop: width * 0.013,
        width: "100%"
    },
    label: {
        fontSize: width * 0.036,
        color: '#333',
    },
    smalltxt: {
        fontSize: width * 0.032,
        alignSelf: "flex-end",
        color: 'green',
        fontFamily: "sans-serif-regular",
        fontWeight: "900",
    },
    button: {
        backgroundColor: '#4BAAC8',
        padding: width * 0.02,
        borderRadius: width * 0.012,
        marginTop: width * 0.025,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: width * 0.01,
    },
    dropdown: {
        height: 50,
        width: '100%',
        backgroundColor: '#f9f9f9',
        color: "black",
        borderRadius: width * 0.012,
        borderWidth: 1.5,
        borderColor: '#d3d3d3',
        paddingHorizontal: width * 0.025,
        marginTop: width * 0.025,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: width * 0.01,
    },
    placeholderStyle: {
        fontSize: width * 0.034,
        color: '#999',
    },
    selectedTextStyle: {
        fontSize: width * 0.035,
        color: 'black',
    },
    inputSearchStyle: {
        height: width * 0.1,
        fontSize: width * 0.04,
    },
    iconStyle: {
        width: width * 0.05,
        height: width * 0.05,
    },
    icon: {
        marginRight: width * 0.025,
    },
    dropdownItem: {
        padding: width * 0.025,
    },
    dropdownItemText: {
        fontSize: width * 0.035,
        color: '#71797E',
    },
    input: {
        height: width * 0.1,
        borderColor: '#d3d3d3',
        borderWidth: width * 0.005,
        borderRadius: width * 0.01,
        paddingHorizontal: width * 0.025,
        width: '70%',
        backgroundColor: "#f9f9f9",
    },
    textArea: {
        borderColor: '#d3d3d3',
        borderWidth: width * 0.005,
        borderRadius: width * 0.01,
        paddingHorizontal: width * 0.04,
        paddingVertical: width * 0.06,
        color: "black",
        width: '100%',
        height: width * 0.35,
        fontSize: width * 0.036,
        backgroundColor: "#f9f9f9",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    selectedDateText: {
        width: "100%",
        marginTop: width * 0.01,
        fontSize: width * 0.034,
        color: 'grey',
        textAlign: "right",
    },
    error: {
        fontWeight: "500",
        color: "red",
        marginVertical: width * 0.01,
    },
    historybutton: {
        backgroundColor: '#FFFF',
        padding: width * 0.02,
        borderRadius: 5,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: width * 0.01,
    },
    uplaod: {
        width: width * 0.27,
        height: width * 0.27,
        objectFit: "contain",
    },
    txt: {
        fontSize: width * 0.036,
        color: "#969696",
        marginTop: 5,
        marginBottom: width * 0.025,
        textAlign: "center",
        fontWeight: "500",
    },
    buttonText: {
        color: 'white',
        fontSize: width * 0.037,
    },
    buttonTextcross: {
        color: 'white',
        fontSize: width * 0.027,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalView: {
        margin: width * 0.05,
        backgroundColor: 'white',
        borderRadius: width * 0.04,
        padding: width * 0.08,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: width * 0.01,
        elevation: width * 0.013,
    },
    modalButton: {
        backgroundColor: '#4BAAC8',
        borderRadius: width * 0.025,
        padding: width * 0.025,
        elevation: width * 0.005,
        marginVertical: width * 0.012,
        width: width * 0.5,
    },
    modalButtoncross: {
        backgroundColor: 'red',
        borderRadius: width * 0.025,
        // padding: 10,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: width * 0.01,
        marginTop: width * 0.04,
        width: width * 0.08,
        height: width * 0.08,
    },
    modalText: {
        marginBottom: width * 0.04,
        textAlign: 'center',
        fontSize: width * 0.03,
        color: "black",
        fontWeight: 'bold',
    },
});
