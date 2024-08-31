import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import { StackedBarChart } from 'react-native-chart-kit';
import PieChart from 'react-native-pie-chart';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetAttendanceSheetByPhoneNumber from '../Functions/GetAttendanceSheetByPhoneNumber';
import GetAttendanceYearly from '../Functions/GetAttendanceYearly';
import settings from '../Images/dashboard1.png';
import { Dropdown } from 'react-native-element-dropdown';
import GetRemianingLeaves from '../Functions/GetRemianingLeaves';
import GetleavesStatus from '../Functions/GetLeavesStatus';
import GetEmployeeList from '../Functions/GetEmployeeList';
import Loader from '../Loaders/Loader';

const { width } = Dimensions.get('window');

// BarChart Configuration
const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `black`,
    style: {
        borderRadius: width * 0.04,
        margin: width * 0.01,
    },
    propsForLabels: {
        fontSize: width * 0.03,
        margin: 3,
    },
    barPercentage: 1,
    barRadius: width * 0.019,
    formatYLabel: (yValue) => `${Math.floor(yValue)}`,
};


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
    const [currentEmployeeNumber, setcurrentEmployeeNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading1, setIsLoading1] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [isLoading3, setIsLoading3] = useState(false);
    const [isLoading4, setIsLoading4] = useState(false);
    const [Employee, setEmployee] = useState(false);
    const [casualRemaining, setCasualRemaining] = useState(0);
    const [emergencyRemaining, setEmergencyRemaining] = useState(0);
    const [medicalRemaining, setMedicalRemaining] = useState(0);
    const [annualRemaining, setAnnualRemaining] = useState(0);
    const [emplyeeList, setEmployeeList] = useState([]);
    const [numberNew, setnumber] = useState("");
    const [role, setRole] = useState(false);
    const [leaveCount, setLeaveCount] = useState({
        Pending: 0,
        Approved: 0,
        Rejected: 0
    });

    useEffect(() => {
        const getNumber = async () => {
            const Usernumber = await AsyncStorage.getItem('@UserNumber');
            setnumber(Usernumber);
            const role = await AsyncStorage.getItem("@role");
            if (role == "true") {
                setRole(true);
            }
            else {
                setRole(false);
            }
            console.log("Role" + role);

        };
        getNumber();

    }, [])

    const fetchDataAndCheckStatus = async (number) => {
        try {
            setIsLoading1(true);

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
            setIsLoading1(false);
        } catch (error) {
            setIsLoading1(false);
            console.error(error);
        }
    };

    const fetchYearlyData = async (number) => {
        try {
            setIsLoading3(true);

            // const number = await AsyncStorage.getItem('@UserNumber');
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

                const filteredData = monthlyData.slice(0, currentMonthIndex + 1).filter(month => month.Present !== 0 || month.Absent !== 0);
                const labels = allMonths.slice(0, currentMonthIndex + 1).filter((_, index) => monthlyData[index].Present !== 0 || monthlyData[index].Absent !== 0);
                const data = filteredData.map(month => {
                    const barData = [];
                    if (month.Absent !== 0) barData.push(month.Absent);
                    if (month.Present !== 0) barData.push(month.Present);
                    return barData;
                });

                // Adjust the legend to only include "Absent" or "Present" if those bars exist
                const legend = [];
                if (filteredData.some(month => month.Absent !== 0)) legend.push("Absent");
                if (filteredData.some(month => month.Present !== 0)) legend.push("Present");
                return {
                    labels,
                    legend,
                    data,
                    barColors: ["#ff9292", "#7ED7B9"].slice(0, legend.length)
                };

            };
            setAttendanceData(generateChartData(monthlyData));
            setIsLoading3(false); // 2000 ms = 2 seconds

        } catch (error) {
            setIsLoading3(false);
            console.error(error);
        }

    };

    const fetchRemainingLeaves = async (number) => {
        try {
            setIsLoading(true);
            // const number = await AsyncStorage.getItem('@UserNumber');
            const medicalLeaves = await GetRemianingLeaves(number, 1);
            const casualLeaves = await GetRemianingLeaves(number, 2);
            const emergencyLeaves = await GetRemianingLeaves(number, 3);

            // Set the remaining leaves correctly
            setMedicalRemaining(10 - medicalLeaves || 0);
            setCasualRemaining(8 - casualLeaves || 0);
            setEmergencyRemaining(7 - emergencyLeaves || 0);

            // Calculate the annual remaining leaves based on the initial annual count
            setAnnualRemaining(0 + (medicalLeaves || 0) + (casualLeaves || 0) + (emergencyLeaves || 0));

            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        } catch (error) {
            console.error(error);
        setIsLoading(false);
        } 
    };

    const fetchLeavesStatus = async (number) => {
        try {
            setIsLoading2(true);
            // const number = await AsyncStorage.getItem('@UserNumber');
            const data = await GetleavesStatus(number);
            if (data) {
                // console.log(data);

                const calculateLeaveStatusCounts = (leaves) => {
                    const statusCounts = {
                        Pending: 0,
                        Approved: 0,
                        Rejected: 0
                    };

                    leaves.forEach(leave => {
                        if (leave.Status === "Pending") {
                            statusCounts.Pending += 1;
                        } else if (leave.Status === "Approved") {
                            statusCounts.Approved += 1;
                        } else if (leave.Status === "Rejected") {
                            statusCounts.Rejected += 1;
                        }
                    });

                    return statusCounts;
                };

                const leaveDates = calculateLeaveStatusCounts(data);
                setLeaveCount(leaveDates);
                setIsLoading2(false);
            }
        } catch (e) {
            setIsLoading2(false);
            setError(e.message);
        }

    };

    const getlist = async () => {
        setIsLoading4(true);
        try {
            const response = await GetEmployeeList();
            if (response != null) {
                const transformedList = response.map(item => ({
                    label: item.Name,
                    value: item.PhoneNumber
                }));
                setEmployeeList(transformedList);
                // console.log("first employeeee" + emplyeeList[0].label);
                setIsLoading4(false);
            }
            else {
                setIsLoading4(false);
            }
        } catch (e) {
            setIsLoading4(false);
            console.error(e);
        }
    };
    useEffect(() => {
        const getnumber=async ()=>{
            const number = await AsyncStorage.getItem('@UserNumber');
            getlist();
            fetchLeavesStatus(number);
            fetchDataAndCheckStatus(number);
            fetchYearlyData(number);
            fetchRemainingLeaves(number);
        }

        getnumber();
    }, []);


    const update =async (numberNew)=>{
        fetchLeavesStatus();
        fetchDataAndCheckStatus(numberNew);
        fetchYearlyData(numberNew);
        fetchRemainingLeaves(numberNew);
    };

    const renderItem = (item) => (
        <View style={styles.dropdownItem}>
            <Text style={styles.dropdownItemText}>{item.label}</Text>
        </View>
    );
    widthAndHeight = 180;
    const series = [medicalRemaining, casualRemaining, emergencyRemaining, annualRemaining];
    const sliceColor = ['#f8bd8a', '#f9e484', '#ff9292', '#bfdfae'];

    // Check if all values in the series are zero
    const validSeries = series.some(value => value > 0) ? series : [1, 1, 1, 1]; // Fallback to prevent error

    return (
        <>
            <ScrollView style={styles.mainContainer}>
                <View style={styles.header}>
                    <Image style={styles.img} source={settings} />
                    <Text style={styles.heading}>Dashboard</Text>
                </View>
                {/* {role && */}
                    {<View style={styles.hourscompleted}>
                        <Text style={styles.txt}>Select Employee</Text>
                        {isLoading4 ?
                        <Loader/>
                        :
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={emplyeeList}
                            maxHeight={200}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Employee"
                            searchPlaceholder="Search..."
                            value={Employee}
                            renderItem={renderItem}
                            onChange={item => {
                                setEmployee(item.value);
                                setnumber(item.value);
                                // console.log(number);
                                update(item.value);
                            }}
                        />}
                    </View>}
                <View style={styles.hourscompleted}>
                    <Text style={styles.txt}>{getMonthName(date)}'s Statistics</Text>
                    <View style={styles.rectangleContainer}>
                        {isLoading1 ? (
                            <Loader />
                        ) : (
                            <>
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
                            </>
                        )}
                    </View>

                </View>
                <View style={styles.piechartcontainer}>
                    <Text style={styles.txt}>Leave Statistics {formattedDate}</Text>
                    <View style={styles.monthContainerinner}>
                        {isLoading ?
                            <Loader />
                            :
                            <>
                                <View style={styles.statistics}>
                                    <View style={styles.statisticsline}>
                                        <View style={{ ...styles.color, backgroundColor: "#f9e484" }} ></View>
                                        <Text style={styles.colorTxt}>Casual: {casualRemaining} </Text>
                                    </View>
                                    <View style={styles.statisticsline}>
                                        <View style={{ ...styles.color, backgroundColor: "#f8bd8a" }} ></View>
                                        <Text style={styles.colorTxt}>Medical: {medicalRemaining} </Text>
                                    </View>
                                    <View style={styles.statisticsline}>
                                        <View style={{ ...styles.color, backgroundColor: "#ff9292" }} ></View>
                                        <Text style={styles.colorTxt}>Emergency: {emergencyRemaining} </Text>
                                    </View>
                                    <View style={styles.statisticsline}>
                                        <View style={{ ...styles.color, backgroundColor: "#bfdfae" }} ></View>
                                        <Text style={styles.colorTxt}>Remaining: {annualRemaining} </Text>
                                    </View>
                                </View>
                                <PieChart
                                    coverRadius={0.65}
                                    widthAndHeight={widthAndHeight}
                                    series={validSeries}
                                    sliceColor={sliceColor}
                                />
                            </>
                        }
                    </View>
                </View>
                <View style={styles.requests}>
                    <Text style={styles.txt}>Requests</Text>
                    {isLoading2 ?
                        <Loader />
                        :
                        <View style={styles.requesttilescontainer}>
                            {['Pending', 'Approved', 'Rejected'].map((type, index) => (
                                <TouchableOpacity
                                    key={type}
                                    style={{ ...styles.requesttiles, width: index === 1 ? "35%" : "26%", backgroundColor: index === 1 ? "#4BAAC8" : "#9dcede" }}
                                    onPress={() => navigation.navigate('Pendingrequests', { type })}
                                >
                                    <Text style={{ ...styles.lable, color: index === 1 ? "white" : "#454545" }}>{type}</Text>
                                    <Text style={{ color: index === 1 ? "white" : "#36454F", fontSize: 15 }}>{leaveCount[type]}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>}
                </View>
                <View style={{ ...styles.hourscompleted, marginBottom: width * 0.1 }}>
                    {isLoading3 ?
                        <Loader /> :
                        <>
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
                                        width={screenWidth * 1.8}
                                        height={width * 0.52}
                                        chartConfig={chartConfig}
                                        withHorizontalLabels={true}
                                    />
                                </ScrollView>
                            </View>
                        </>}
                </View>
            </ScrollView>

        </>
    );
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: width * 0.05,
        backgroundColor: "#eeedec"
    },
    header: {
        width: '100%',
        height: width * 0.17,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: width * 0.025,
    },
    heading: {
        fontSize: width * 0.065,
        fontFamily: 'sans-serif-black',
        color: '#4BAAC8',
    },
    img: {
        width: width * 0.08,
        height: width * 0.08,
        resizeMode: 'contain',
        marginRight: width * 0.015,
    },
    hourscompleted: {
        width: '100%',
        height: "auto",
        backgroundColor: '#FFFFFF',
        borderRadius: width * 0.025,
        padding: width * 0.05,
        marginBottom: width * 0.05,
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
        marginVertical: width * 0.014,
        fontFamily: "sans-serif-black",
        color: '#4BAAC8',
    },
    hourlines: {
        flexDirection: 'column',
        marginTop: width * 0.025,
        borderWidth: width * 0.005,
        borderColor: '#E5E5E5',
        padding: width * 0.025,
        borderRadius: width * 0.017,
        gap: width * 0.025,
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
        height: width * 0.25,
        flexDirection: 'column',
        justifyContent: "space-evenly",
        alignItems: 'center',
        paddingHorizontal: width * 0.014,
        backgroundColor: '#4BAAC8',
        borderRadius: width * 0.025,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: width * 0.005,
    },
    requests: {
        flexDirection: "column",
        justifyContent: "space-evenly",
        width: '100%',
        height: "auto",
        backgroundColor: '#FFFFFF',
        borderRadius: width * 0.025,
        padding: width * 0.05,
        marginBottom: width * 0.05,
        gap: width * 0.025,
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
        height: width * 0.25,
        flexDirection: 'column',
        justifyContent: "center",
        gap: 7,
        alignItems: 'center',
        paddingHorizontal: width * 0.014,
        backgroundColor: '#9dcede',
        borderRadius: width * 0.025,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: width * 0.005,
    },
    button: {

    },
    lable: {
        color: "#404040",
        fontWeight: "500",
        fontSize: width * 0.035,
    },
    statValue: {
        color: "#404040",
        fontWeight: "300",
        fontSize: width * 0.035,

    },
    timetotal: {
        color: "#848884",
        fontWeight: "600",
        fontSize: width * 0.035,
    },
    timecompleted: {
        color: "#848884",
        // fontWeight: "bold",
        fontSize: width * 0.035,
    },
    piechartcontainer: {
        width: '100%',
        height: "auto",
        backgroundColor: '#FFFFFF',
        borderRadius: width * 0.025,
        padding: width * 0.05,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: width * 0.05,
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
        gap: width * 0.06,
        marginTop: width * 0.025,
        paddingHorizontal: width * 0.014,
        backgroundColor: 'white',

    },
    statistics: {
        flexDirection: 'column',
        gap: width * 0.025,
    },
    statisticsline: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    color: {
        width: width * 0.03,
        height: width * 0.03,
        borderRadius: width * 0.01,
        marginRight: width * 0.013,
    },
    chartContainer: {
        marginBottom: 10,
        // paddingHorizontal: 10,
    },
    colordisplay: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: width * 0.025,
        marginBottom: width * 0.025,
        backgroundColor: 'white',
    },
    colorTxt: {
        fontSize: width * 0.033,
        color: "#71797E",
    },
    rectangleContainer: {
        flexDirection: "row",
        marginTop: width * 0.025,
        justifyContent: "space-evenly",
    },
    dropdown: {
        height: width * 0.12,
        width: '100%',
        backgroundColor: '#f9f9f9',
        color: "black",
        borderRadius: width * 0.012,
        borderWidth: width * 0.002,
        borderColor: '#d3d3d3',
        paddingHorizontal: width * 0.025,
        marginTop: width * 0.025,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.23,
        // shadowRadius: 1.62,
        // elevation: width*0.0001,
    },
    placeholderStyle: {
        fontSize: width * 0.037,
        color: '#999',
    },
    selectedTextStyle: {
        fontSize: width * 0.036,
        color: 'black',
    },
    dropdownItem: {
        padding: width * 0.025,
        // backgroundColor: '#4BAAC8',
        borderBottomWidth: 1,
        borderColor: 'white',
        // paddingRight:5,
        // paddingLeft:10,
    },
    dropdownItemText: {
        fontSize: width * 0.037,
        color: '#404040',
    },
});
