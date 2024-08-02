import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Dropdown } from 'react-native-element-dropdown';

export default function LeavePage() {
    const [today] = useState(new Date()); // Get the current date

    const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [date, setDate] = useState(new Date());
    const [date2, setDate2] = useState(new Date());
    const [value, setValue] = useState(null);
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');

    const handleDateConfirm = (selectedDate) => {
        setOpen(false);
        setDate(selectedDate);
    };

    const handleDateConfirm2 = (selectedDate) => {
        setOpen2(false);
        setDate2(selectedDate);
    };

    const data = [
        { label: 'Sick Leave', value: 'sick_leave' },
        { label: 'Casual Leave', value: 'casual_leave' },
        { label: 'Annual Leave', value: 'annual_leave' },
        { label: 'Paternity Leave', value: 'paternity_leave' },
        { label: 'Unpaid Leave', value: 'unpaid_leave' },
        { label: 'Personal Leave', value: 'personal_leave' },
        { label: 'Medical Appointment', value: 'medical_appointment' },
        { label: 'Public Holiday', value: 'public_holiday' },
        { label: 'Other', value: 'other' },
    ];

    const renderItem = (item) => (
        <View style={styles.dropdownItem}>
            <Text style={styles.dropdownItemText}>{item.label}</Text>
        </View>
    );

    return (
        <ScrollView style={styles.mainContainer}>
            <View style={styles.header}>
                <Text style={styles.heading}>Apply for Leave</Text>
            </View>
            <View style={styles.body}>
                <View style={{ ...styles.bodyline, flexDirection: "row", justifyContent: "flex-end" }}>
                    {/* <Text style={styles.label}>Applying Date</Text> */}
                    <Text style={{ ...styles.label, fontWeight: "bold" }}>{formattedDate}</Text>
                </View>
                <View style={styles.bodyline}>
                    <Text style={styles.label}>Starting Date</Text>
                    <TouchableOpacity style={styles.button} onPress={() => setOpen(true)}>
                        <Text style={{ color: "white" }}>Select Date</Text>
                    </TouchableOpacity>
                    <DatePicker
                        modal
                        mode='date'
                        open={open}
                        date={date}
                        minimumDate={date}
                        onConfirm={handleDateConfirm}
                        onCancel={() => setOpen(false)}
                    />
                </View>
                <View style={styles.bodyline}>
                    <Text style={styles.label}>Ending Date</Text>
                    <TouchableOpacity style={styles.button} onPress={() => setOpen2(true)}>
                        <Text style={{ color: "white" }}>Select Date</Text>
                    </TouchableOpacity>
                    <DatePicker
                        modal
                        mode='date'
                        open={open2}
                        date={date2}
                        minimumDate={date}
                        onConfirm={handleDateConfirm2}
                        onCancel={() => setOpen2(false)}
                    />
                </View>
                <View style={styles.bodyline}>
                    <Text style={styles.label}>Forward To</Text>
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
                        placeholder="Select item"
                        searchPlaceholder="Search..."
                        value={value}
                        // onChange={item => {
                        //     setValue(item.value);
                        // }}
                        renderItem={renderItem}
                    />
                </View>
                <View style={styles.bodyline}>
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
                        placeholder="Select item"
                        searchPlaceholder="Search..."
                        value={value}
                        onChange={item => {
                            setValue(item.value);
                        }}
                        renderItem={renderItem}
                    />
                </View>
                {value == "other" && <View style={{ ...styles.bodyline, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={styles.label}>Reason</Text>
                    <TextInput
                        style={styles.input}
                        value={reason}
                        onChangeText={setReason}
                        placeholder="Enter reason"
                    />
                </View>}
                
                <View style={{ ...styles.bodyline, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.textArea}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter description"
                        multiline
                        numberOfLines={4}
                    />
                </View>
                <View>
                    <TouchableOpacity style={{ ...styles.button, width: 170 }}>
                        <Text style={{ color: "white" }}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // justifyContent: 'flex-start',
        padding: 20,
        borderRadius: 10,
        // alignItems: 'center',
    },
    header: {
        width: "100%",
        height: 70,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 10,
    },
    heading: {
        fontFamily: "sans-serif-black",
        fontSize: 30,
        // fontWeight: 'bold',
        color: '#4BAAC8',
    },
    body: {
        marginTop: 20,
        marginBottom: 50,
        width: "100%",
        alignItems: 'center',
        // borderWidth:2,
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,

        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.23,
        // shadowRadius: 2.62,
        // elevation: 4,
    },
    bodyline: {
        marginBottom: 20,
        width: "100%",
    },
    label: {
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#4BAAC8',
        padding: 10,
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
        fontSize: 16,
        color: '#333',
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
        // borderBottomWidth: 1,
        // borderBottomColor: '#4BAAC8',
    },
    dropdownItemText: {
        fontSize: 16,
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
        width: '70%',
        height: 150,
        backgroundColor: "#f9f9f9",
        //  shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.23,
        // shadowRadius: 2.62,
        // elevation: 4,
    },
});
