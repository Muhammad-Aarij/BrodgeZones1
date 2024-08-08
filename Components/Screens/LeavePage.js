import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Image, Pressable, Dimensions } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Dropdown } from 'react-native-element-dropdown';
import LeaveApply from '../Functions/LeaveApply';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SuccessModal from '../Loaders/SuccessModal';
import FailedModal from '../Loaders/FailedModal';
import settings from '../Images/contact-form.png';
import history from '../Images/history.png';

const { width } = Dimensions.get('window');

// e 7 medical 9 casual 8
export default function LeavePage({ navigation }) {
    const [today] = useState(new Date()); // Get the current date
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [date, setDate] = useState(new Date());
    const [date2, setDate2] = useState(null); // Initially null to show no end date selected
    const [value, setValue] = useState(null);
    const [send, setSendTo] = useState(null);
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFailModal, setShowFailModal] = useState(false);
    const [error, setError] = useState('');

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
        { label: 'Short Leave', value: 'short leave' },
        { label: 'Casual Leave', value: '2' },
        { label: 'Emergency Leave', value: '1' },
        { label: 'Medical Leave', value: 'medical leave' },
        { label: 'Other', value: 'other' },
    ];
    const sendTo = [
        { label: 'HR', value: 'HR' },
        { label: 'Team-Lead', value: 'Team-Lead' },
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

    const ApplyforLeave = async () => {
        const number = await AsyncStorage.getItem('@UserNumber');
        const mail = await AsyncStorage.getItem('@UserEmail');
        const newErrors = [];

        if (!mail) newErrors.push("User email is required.");
        if (!date) newErrors.push("Starting date is required.");
        if (!date2) newErrors.push("Ending date is required.");
        if (!value) newErrors.push("Reason is required.");
        if (!send) newErrors.push("Forward To is required.");

        if (newErrors.length > 0) {
            setError([newErrors[0]]); // Store only the first error
            console.log(error);
            return;
        }
        setError([]);

        setIsLoading(true);
        const data = {
            createdBy: mail,
            modifiedBy: mail,
            leaveTypeId: value,
            fromDate: date,
            toDate: date2,
            phoneNumber: number,
            availed: 0,
            approvedBy: send
        };
        console.log("Leave Request Data" + data);
        const success = await LeaveApply(data);
        if (success) {
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 3000);

            setValue(null);
            setDate(new Date());
            setDate2(null);
            setReason('');
            setDescription('');
            setSendTo('');
        } else {
            setShowFailModal(true);
            setTimeout(() => setShowFailModal(false), 3000);
        }
        setIsLoading(false);
    };

    return (
        <>
            <ScrollView style={styles.mainContainer}>
                <View style={styles.header}>
                    <Text style={styles.heading}>Apply for Leave</Text>
                    <Pressable style={styles.historybutton} onPress={() => navigation.navigate('Pendingrequests', { type: '' })}>
                        <Image style={styles.img} source={history}></Image>
                    </Pressable>
                </View>
                <View style={styles.body}>
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
                            data={sendTo}
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
                        <Text style={styles.label}>Select Reason</Text>
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
                            placeholder="Select Reason"
                            searchPlaceholder="Search..."
                            value={value}
                            onChange={item => {
                                setValue(item.value);
                            }}
                            renderItem={renderItem2}
                        />
                    </View>
                    {value === "other" && (
                        <View style={{ ...styles.bodyline, marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={styles.label}>Reason</Text>
                            <TextInput
                                style={styles.input}
                                value={reason}
                                onChangeText={setReason}
                                placeholder="Enter reason"
                            />
                        </View>
                    )}
                    <View style={{ ...styles.bodyline, marginTop: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={styles.textArea}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Enter description"
                            placeholderTextColor={"grey"}
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                    <Text style={styles.error}>{firstError}</Text>
                    <View>
                        <TouchableOpacity style={{ ...styles.button, width: 170, }} onPress={ApplyforLeave}>
                            <Text style={{ fontSize: width * 0.036, color: "white" }}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            {showSuccessModal && <SuccessModal message={"Request Sent"} />}
            {showFailModal && <FailedModal />}
        </>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 20,
        borderRadius: 10,
    },
    header: {
        width: "100%",
        height: 70,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    img: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
    },
    heading: {
        fontFamily: "sans-serif-black",
        fontSize: width * 0.060,
        color: '#4BAAC8',
    },
    body: {
        marginTop: 5,
        marginBottom: 50,
        width: "100%",
        alignItems: 'center',
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
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
        marginTop: 5,
        width: "100%"
    },
    label: {
        fontSize: width * 0.036,
        color: '#333',
    },
    button: {
        backgroundColor: '#4BAAC8',
        padding: 8,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    dropdown: {
        height: 50,
        width: '100%',
        backgroundColor: '#f9f9f9',
        color: "black",
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: '#d3d3d3',
        paddingHorizontal: 10,
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#999',
    },
    selectedTextStyle: {
        fontSize: width * 0.036,
        color: 'black',
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    icon: {
        marginRight: 10,
    },
    dropdownItem: {
        padding: 10,
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#71797E',
    },
    input: {
        height: 40,
        borderColor: '#d3d3d3',
        borderWidth: 1.5,
        borderRadius: 5,
        paddingHorizontal: 10,
        width: '70%',
        backgroundColor: "#f9f9f9",
    },
    textArea: {
        borderColor: '#d3d3d3',
        borderWidth: 1.5,
        borderRadius: 5,
        paddingHorizontal: 10,
        color: "black",
        width: '70%',
        height: 150,
        fontSize: width * 0.036,
        backgroundColor: "#f9f9f9",
    },
    selectedDateText: {
        width: "100%",
        marginTop: 5,
        fontSize: 14,
        color: 'grey',
        textAlign: "right",
    },
    error: {
        fontWeight: "500",
        color: "red",
        marginVertical: 5,
    },
    historybutton: {
        backgroundColor: '#FFFF',
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    }
});
