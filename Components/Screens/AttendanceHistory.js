import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import PieChart from 'react-native-pie-chart';
import LoaderModal from '../Loaders/LoaderModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetAttendanceSheetByPhoneNumber from '../Functions/GetAttendanceSheetByPhoneNumber';
import { Calendar } from 'react-native-calendars';
const { width } = Dimensions.get('window');

export default function AttendanceHistory() {
    const [search, setSearch] = useState(false);
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);
    const [presentDates, setPresentDates] = useState([]);
    const [absentDates, setAbsentDates] = useState([]);
    const [leaveDates, setLeaveDates] = useState([]);
    const [lateDates, setLateDates] = useState([]);

    useEffect(() => {
        const fetchDataAndCheckStatus = async () => {
            try {
                setIsLoading(true);
        
                const number = await AsyncStorage.getItem('@UserNumber');
                const data = await GetAttendanceSheetByPhoneNumber(number);
        
                // Object to hold all remarks by date
                const dateRemarksMap = {};
        
                // Populate the map with remarks
                data.forEach(item => {
                    const date = moment(item.Date).format('YYYY-MM-DD');
                    if (!dateRemarksMap[date]) {
                        dateRemarksMap[date] = [];
                    }
                    dateRemarksMap[date].push(item.Remarks);
                });
        
                // Initialize arrays for each status
                const present = [];
                const absent = [];
                const leave = [];
                const late = [];
        
                // Process the collected remarks
                Object.entries(dateRemarksMap).forEach(([date, remarks]) => {
                    console.log(`Date: ${date}, Remarks: ${remarks.join(', ')}`); // Print remarks for each day
        
                    // If there are multiple remarks for the same day, use the second one
                    const remarkToUse = remarks.length > 1 ? remarks[1] : remarks[0];
        
                    switch (remarkToUse) {
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
                        case 'Checked Out':
                            present.push(date);
                            break;
                        default:
                            break;
                    }
                });
        
                // Store the dates in state
                setPresentDates(present);
                setAbsentDates(absent);
                setLeaveDates(leave);
                setLateDates(late);
        
            } catch (error) {
                console.error('Error fetching attendance data:', error);
            } finally {
                setIsLoading(false);
            }
        };  
    
        fetchDataAndCheckStatus();
    }, []);
    

    const handleDateConfirm = (selectedDate) => {
        setOpen(false);
        setDate(selectedDate);
        setSelectedDate(selectedDate);
    };

    const getMarkedDates = () => {
        const markedDates = {};

        presentDates.forEach(date => {
            markedDates[date] = { selected: true, marked: true, selectedColor: '#bfdfae' };
        });
        absentDates.forEach(date => {
            markedDates[date] = { selected: true, marked: true, selectedColor: '#ff9292' };
        });
        leaveDates.forEach(date => {
            markedDates[date] = { selected: true, marked: true, selectedColor: '#f9e484' };
        });
        lateDates.forEach(date => {
            markedDates[date] = { selected: true, marked: true, selectedColor: '#f8bd8a' };
        });

        return markedDates;
    };

    // Calculate series
    const presentCount = presentDates.length > 0 ? presentDates.length : 0;
    const leaveCount = leaveDates.length > 0 ? leaveDates.length : 0;
    const absentCount = absentDates.length > 0 ? absentDates.length : 0;
    const lateCount = lateDates.length > 0 ? lateDates.length : 0;

    const totalDatesCount = presentCount + leaveCount + absentCount + lateCount;

    const series = totalDatesCount === 0 ? [1, 0, 0, 0] : [presentCount, leaveCount, absentCount, lateCount];
    const sliceColor = ['#bfdfae', '#f9e484', '#ff9292', '#f8bd8a'];
    const widthAndHeight = width*0.4;
    const formattedDate = moment(date).format('MMMM YYYY'); // August 1, 2024


    return (
        <>
            {isLoading ? <LoaderModal /> : (
                
                <View style={styles.mainContainer}>
                    <View style={styles.header}>
                        <Text style={styles.heading}>Attendance Summary</Text>
                        {/* <Pressable onPress={() => { setSearch(!search) }}>
                            <Image source={require('../Images/magnifying.png')} style={styles.img} />
                        </Pressable> */}
                    </View>

                    {!search && (
                        <View style={styles.monthContainer}>
                            <Text style={{ fontSize: width*0.04, color: '#3D3C3A', marginBottom: width*0.012, fontWeight: 'bold' }}>Statistics</Text>
                            <Text style={{ fontSize: width*0.041, color: '#3D3C3A', marginBottom: width*0.015,  }}>{formattedDate}</Text>
                            <View style={styles.monthContainerinner}>
                                <View style={styles.statistics}>
                                    <View style={styles.statisticsline}>
                                        <View style={{ ...styles.color, backgroundColor: '#bfdfae' }}></View>
                                        <Text style={styles.colorTxt}>Present: {presentDates.length}</Text>
                                    </View>
                                    <View style={styles.statisticsline}>
                                        <View style={{ ...styles.color, backgroundColor: '#f8bd8a' }}></View>
                                        <Text style={styles.colorTxt}>Late: {lateDates.length}</Text>
                                    </View>
                                    <View style={styles.statisticsline}>
                                        <View style={{ ...styles.color, backgroundColor: '#f9e484' }}></View>
                                        <Text style={styles.colorTxt}>Leaves: {leaveDates.length}</Text>
                                    </View>
                                    <View style={styles.statisticsline}>
                                        <View style={{ ...styles.color, backgroundColor: '#ff9292' }}></View>
                                        <Text style={styles.colorTxt}>Absent: {absentDates.length}</Text>
                                    </View>
                                </View>
                                <PieChart coverRadius={width*0.0016}
                                    widthAndHeight={widthAndHeight} series={series} sliceColor={sliceColor} />
                            </View>
                        </View>
                    )}

                    {!search && (
                        <View style={styles.calendarcontainer}>
                            <Calendar
                                current={new Date()}
                                minDate={moment().startOf('month').format('YYYY-MM-DD')}
                                maxDate={moment().endOf('month').format('YYYY-MM-DD')}
                                // onDayPress={(day) => console.log('selected day', day)}
                                monthFormat={'MMMM yyyy'}
                                hideArrows={true}
                                markedDates={getMarkedDates()}
                                renderHeader={() => <View />} 
                            />
                            
                        </View>
                    )}

                    {/* {search && (
                        <View style={styles.searchsection}>
                            <Text>{selectedDate ? selectedDate.toDateString() : 'No Date Selected'}</Text>
                            <View style={{ flexDirection: 'row', gap: 15 }}>
                                <TouchableOpacity style={styles.button} onPress={() => setOpen(true)}>
                                    <Text>Select Date</Text>
                                </TouchableOpacity>
                            </View>
                            <DatePicker
                                modal
                                mode='date'
                                open={open}
                                date={date}
                                maximumDate={date}
                                onConfirm={handleDateConfirm}
                                onCancel={() => setOpen(false)}
                            />
                        </View>
                    )} */}

                    {/* {search && (
                        <View style={styles.searchresult}>
                            <Text style={{ fontSize: 16, marginBottom: 10, fontWeight: '900', alignSelf: 'center' }}>{'Search Result'}</Text>
                            <View style={styles.dailyline}>
                                <Text style={styles.txt}>22-07-2024</Text>
                                <Text style={styles.txt}>Present</Text>
                            </View>
                        </View>
                    )} */}
                </View>
            )}
        </>
    );
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: width * 0.05,
        alignItems: 'center',
    },
    calendarcontainer: {
        width: '100%',
        borderRadius: width * 0.025,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: width * 0.025,
        },
        shadowOpacity: 0.22,
        shadowRadius: width * 0.0555,
        elevation: width * 0.008,
    },
    header: {
        width: '100%',
        height: width * 0.18,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: width * 0.01,
        marginTop: width * 0.025,
    },
    heading: {
        fontSize: width * 0.055,
        fontFamily: 'sans-serif-black',
        color: '#4BAAC8',
    },
    monthContainer: {
        marginTop: width * 0.025,
        padding: width * 0.05,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: width * 0.025,
        borderTopRightRadius: width * 0.025,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: width * 0.025,
        },
        shadowOpacity: 0.22,
        shadowRadius: width * 0.0555,
        elevation: width * 0.008,
    },
    monthContainerinner: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: width * 0.061,
        marginTop: width * 0.025,
        paddingHorizontal: width * 0.015,
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
        marginRight: width * 0.014,
    },
    colorTxt: {
        fontWeight: '300',
        color: '#3D3C3A',
        fontSize: width * 0.035,
    },
    img: {
        width: width * 0.1,
        height: width * 0.1,
        resizeMode: 'contain',
    },
    txt: {
        fontSize: width * 0.04,
        color: 'black',
    },
});
