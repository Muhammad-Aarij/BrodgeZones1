import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { StackedBarChart } from 'react-native-chart-kit';
import PieChart from 'react-native-pie-chart';
import moment from 'moment';
import LoaderModal from '../Loaders/LoaderModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetAttendanceSheetByPhoneNumber from '../Functions/GetAttendanceSheetByPhoneNumber';
import GetAttendanceYearly from '../Functions/GetAttendanceYearly';
import settings from '../Images/dashboard1.png'
import { Dropdown } from 'react-native-element-dropdown';


const { width } = Dimensions.get('window');
const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `black`,
    style: {
        borderRadius: 16,
        margin: 3,
    },
    propsForLabels: {
        fontSize: 12,
    },
    barPercentage: 1,
    barRadius: 5,
};

const series = [1, 3, 5, 12];
const sliceColor = ['#bfdfae', '#f9e484', '#ff9292', '#f8bd8a'];
const widthAndHeight = 180;

const screenWidth = Dimensions.get('window').width;

function getMonthName(date) {
    const options = { month: 'long' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

const date = new Date();
const formattedDate = moment(date).format(' YYYY');

export default function Dashboard({ navigation }) {
    const [attendanceData, setAttendanceData] = useState({
        labels: [],
        legend: [],
        data: [],
        barColors: []
    });

    const [presentDates, setPresentDates] = useState([]);
    const [absentDates, setAbsentDates] = useState([]);
    const [leaveDates, setLeaveDates] = useState([]);
    const [lateDates, setLateDates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [Employee, setEmployee] = useState(false);

    useEffect(() => {
        const fetchDataAndCheckStatus = async () => {
            try {
                setIsLoading(true);

                const number = await AsyncStorage.getItem('@UserNumber');
                const data = await GetAttendanceSheetByPhoneNumber(number);

                const present = [];
                const absent = [];
                const leave = [];
                const late = [];

                data.forEach(item => {
                    const date = moment(item.Date).format('YYYY-MM-DD');
                    switch (item.Remarks) {
                        case 'Present':
                            present.push(date);
                            break;
                        case 'Absent':
                            absent.push(date);
                            break;
                        case 'Leave':
                            leave.push(date);
                            break;
                        case 'Late':
                            late.push(date);
                            break;
                        default:
                            break;
                    }
                });

                setPresentDates(present);
                setAbsentDates(absent);
                setLeaveDates(leave);
                setLateDates(late);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchYearlyData = async () => {
            try {
                setIsLoading(true);

                const number = await AsyncStorage.getItem('@UserNumber');
                const data = await GetAttendanceYearly(number);

                const monthlyData = Array(12).fill().map(() => ({ Present: 0, Absent: 0 }));

                data.forEach(item => {
                    const month = moment(item.Date).month();
                    if (item.Remarks === 'Present' || item.Remarks === 'Late') {
                        monthlyData[month].Present += 1;
                    } else if (item.Remarks === 'Absent') {
                        monthlyData[month].Absent += 1;
                    }
                });

                const getCurrentMonthIndex = () => new Date().getMonth();

                const generateChartData = (monthlyData) => {
                    const currentMonthIndex = getCurrentMonthIndex();
                    const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                    const labels = allMonths.slice(0, currentMonthIndex + 1);
                    const data = monthlyData.slice(0, currentMonthIndex + 1).map(month => [month.Absent, month.Present]);

                    return {
                        labels,
                        legend: ["Absent", "Present"],
                        data,
                        barColors: ["#ff9292", "#7ED7B9"]
                    };
                };

                setAttendanceData(generateChartData(monthlyData));
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDataAndCheckStatus();
        fetchYearlyData();
    }, []);

    const Employees = [
        { label: 'HR', value: 'HR' },
        { label: 'Team-Lead', value: 'Team-Lead' },
    ];

    const renderItem = (item) => (
        <View style={styles.dropdownItem}>
            <Text style={styles.dropdownItemText}>{item.label}</Text>
        </View>
    );

    return (
        <>
            {isLoading ?
                <LoaderModal />
                :
                <ScrollView style={styles.mainContainer}>
                    <View style={styles.header}>
                        <Image style={styles.img} source={settings} />
                        <Text style={styles.heading}>Dashboard</Text>
                    </View>
                    <View style={styles.hourscompleted}>
                        <Text style={styles.txt}>Select Employee</Text>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={Employees}
                            maxHeight={200}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Employee"
                            searchPlaceholder="Search..."
                            value={Employee}
                            renderItem={renderItem}
                            onChange={item => {
                                setEmployee(item.value);
                            }}
                        />
                    </View>
                    <View style={styles.hourscompleted}>
                        <Text style={styles.txt}>{getMonthName(date)}'s Statistics</Text>
                        <View style={styles.rectangleContainer}>
                            <View style={{ ...styles.rectangle, backgroundColor: "#bfdfae" }}>
                                <Text style={styles.lable}>Present</Text>
                                <Text style={styles.statValue}>{presentDates.length}</Text>
                            </View>
                            <View style={{ ...styles.rectangle, backgroundColor: "#f9e484" }}>
                                <Text style={styles.lable}>Leaves</Text>
                                <Text style={styles.statValue}>{leaveDates.length}</Text>
                            </View>
                            <View style={{ ...styles.rectangle, backgroundColor: "#f8bd8a" }}>
                                <Text style={styles.lable}>Late</Text>
                                <Text style={styles.statValue}>{lateDates.length}</Text>
                            </View>
                            <View style={{ ...styles.rectangle, backgroundColor: "#ff9292" }}>
                                <Text style={styles.lable}>Absent</Text>
                                <Text style={styles.statValue}>{absentDates.length}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.piechartcontainer}>
                        <Text style={styles.txt}>Leave Statistics {formattedDate}</Text>
                        <View style={styles.monthContainerinner}>
                            <View style={styles.statistics}>
                                {sliceColor.map((color, index) => (
                                    <View key={index} style={styles.statisticsline}>
                                        <View style={{ ...styles.color, backgroundColor: color }} />
                                        <Text style={styles.colorTxt}>{['Casual', 'Medical', 'Emergency', 'Remaining'][index]}: </Text>
                                    </View>
                                ))}
                            </View>
                            <PieChart
                                coverRadius={0.65}
                                widthAndHeight={widthAndHeight}
                                series={series}
                                sliceColor={sliceColor}
                            />
                        </View>
                    </View>
                    <View style={styles.requests}>
                        <Text style={styles.txt}>Requests</Text>
                        <View style={styles.requesttilescontainer}>
                            {['Pending', 'Approved', 'Rejected'].map((type, index) => (
                                <TouchableOpacity
                                    key={type}
                                    style={{ ...styles.requesttiles, width: index === 1 ? "35%" : "26%", backgroundColor: index === 1 ? "#4BAAC8" : "#9dcede" }}
                                    onPress={() => navigation.navigate('Pendingrequests', { type })}
                                >
                                    <Text style={{ ...styles.lable, color: index === 1 ? "white" : "#454545" }}>{type}</Text>
                                    <Text style={{ color: index === 1 ? "white" : "#36454F", fontSize: 15 }}>{3}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <View style={styles.hourscompleted}>
                        <View style={styles.colordisplay}>
                            <View style={styles.statisticsline}>
                                <View style={{ ...styles.color, backgroundColor: "#7ED7B9" }} />
                                <Text style={styles.colorTxt}>Present's </Text>
                            </View>
                            <View style={styles.statisticsline}>
                                <View style={{ ...styles.color, backgroundColor: "#ff9292" }} />
                                <Text style={styles.colorTxt}>Absent's</Text>
                            </View>
                        </View>
                        <View style={styles.chartContainer}>
                            <ScrollView horizontal>
                                <StackedBarChart
                                    data={attendanceData}
                                    width={screenWidth * 2}
                                    height={220}
                                    chartConfig={chartConfig}
                                    withHorizontalLabels={true}
                                />
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>
            }
        </>
    );
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: "#eeedec"
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
        fontSize: width * 0.065,
        fontFamily: 'sans-serif-black',
        color: '#4BAAC8',
    },
    img: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginRight: 7,
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
        fontSize: width * 0.04,
        marginVertical: 5,
        fontFamily: "sans-serif-black",
        color: '#4BAAC8',
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
    },
    hours: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    rectangle: {
        width: '23%',
        height: 100,
        flexDirection: 'column',
        justifyContent: "space-evenly",
        alignItems: 'center',
        paddingHorizontal: 5,
        backgroundColor: '#4BAAC8',
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
    requests: {
        flexDirection: "column",
        justifyContent: "space-evenly",
        width: '100%',
        height: "auto",
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        gap: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
    },
    requesttilescontainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%",
    },
    requesttiles: {
        width: '26%',
        height: 100,
        flexDirection: 'column',
        justifyContent: "center",
        gap: 7,
        alignItems: 'center',
        paddingHorizontal: 5,
        backgroundColor: '#9dcede',
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
    button: {

    },
    lable: {
        color: "black",
        fontWeight: "500",
        fontSize: width * 0.035,
    },
    timetotal: {
        color: "#848884",
        fontWeight: "600",
        fontSize: 14,
    },
    timecompleted: {
        color: "#848884",
        // fontWeight: "bold",
        fontSize: 14,
    },
    piechartcontainer: {
        width: '100%',
        height: "auto",
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
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
    monthContainerinner: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 25,
        marginTop: 10,
        paddingHorizontal: 5,
        backgroundColor: 'white',

    },
    statistics: {
        flexDirection: 'column',
        gap: 10,
    },
    statisticsline: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    color: {
        width: 12,
        height: 12,
        borderRadius: 4,
        marginRight: 5,
    },
    chartContainer: {
        // marginVertical: 10,
        // paddingHorizontal: 10,
    },
    colordisplay: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    colorTxt: {
        fontSize: width * 0.033,
        color: "#71797E",
    },
    rectangleContainer: {
        flexDirection: "row",
        marginTop: 10,
        justifyContent: "space-evenly",
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
    dropdownItem: {
        padding: 10,
        backgroundColor: '#4BAAC8',  
    },
    dropdownItemText: {
        fontSize: 16,
        color: 'white',
    },
});
