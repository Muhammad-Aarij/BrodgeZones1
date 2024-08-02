import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import PieChart from 'react-native-pie-chart';
import LoaderModal from '../Loaders/LoaderModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetAttendanceSheetByPhoneNumber from '../Functions/GetAttendanceSheetByPhoneNumber';
import { Calendar } from 'react-native-calendars';

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
                console.log(data);

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
            markedDates[date] = { selected: true, marked: true, selectedColor: 'green' };
        });
        absentDates.forEach(date => {
            markedDates[date] = { selected: true, marked: true, selectedColor: '#DB162F' };
        });
        leaveDates.forEach(date => {
            markedDates[date] = { selected: true, marked: true, selectedColor: '#ffdf00' };
        });
        lateDates.forEach(date => {
            markedDates[date] = { selected: true, marked: true, selectedColor: '#FFA836' };
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
    const sliceColor = ['#32CD32', '#ffdf00', '#DB162F', '#FFA836'];
    const widthAndHeight = 180;
    const formattedDate = moment(date).format('MMMM YYYY'); // August 1, 2024


    return (
        <>
            {isLoading ? <LoaderModal /> : (
                
                <View style={styles.mainContainer}>
                    <View style={styles.header}>
                        <Text style={styles.heading}>Summary</Text>
                        {/* <Pressable onPress={() => { setSearch(!search) }}>
                            <Image source={require('../Images/magnifying.png')} style={styles.img} />
                        </Pressable> */}
                    </View>

                    {!search && (
                        <View style={styles.monthContainer}>
                            <Text style={{ fontSize: 16, color: '#3D3C3A', marginBottom: 5, fontWeight: 'bold' }}>Statistics</Text>
                            <Text style={{ fontSize: 16, color: '#3D3C3A', marginBottom: 10,  }}>{formattedDate}</Text>
                            <View style={styles.monthContainerinner}>
                                <View style={styles.statistics}>
                                    <View style={styles.statisticsline}>
                                        <View style={{ ...styles.color, backgroundColor: '#32CD32' }}></View>
                                        <Text style={styles.colorTxt}>Present: {presentDates.length}</Text>
                                    </View>
                                    <View style={styles.statisticsline}>
                                        <View style={{ ...styles.color, backgroundColor: '#FFA836' }}></View>
                                        <Text style={styles.colorTxt}>Late: {lateDates.length}</Text>
                                    </View>
                                    <View style={styles.statisticsline}>
                                        <View style={{ ...styles.color, backgroundColor: '#ffdf00' }}></View>
                                        <Text style={styles.colorTxt}>Leaves: {leaveDates.length}</Text>
                                    </View>
                                    <View style={styles.statisticsline}>
                                        <View style={{ ...styles.color, backgroundColor: '#DB162F' }}></View>
                                        <Text style={styles.colorTxt}>Absent: {absentDates.length}</Text>
                                    </View>
                                </View>
                                <PieChart coverRadius={0.65}
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
                                onDayPress={(day) => console.log('selected day', day)}
                                monthFormat={'MMMM yyyy'}
                                hideArrows={true}
                                markedDates={getMarkedDates()}
                                renderHeader={() => <View />} 

                            />
                        </View>
                    )}

                    {search && (
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
                    )}

                    {search && (
                        <View style={styles.searchresult}>
                            <Text style={{ fontSize: 16, marginBottom: 10, fontWeight: '900', alignSelf: 'center' }}>{'Search Result'}</Text>
                            <View style={styles.dailyline}>
                                <Text style={styles.txt}>22-07-2024</Text>
                                <Text style={styles.txt}>Present</Text>
                            </View>
                        </View>
                    )}
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 20,
        alignItems: 'center',
    },
    calendarcontainer: {
        width: '100%',
        // marginTop: 25,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    header: {
        width: '100%',
        height: 70,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    heading: {
        fontSize: 30,
        fontFamily: 'sans-serif-black',
        color: '#4BAAC8',
    },
    monthContainer: {
        marginTop: 10,
        padding: 20,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
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
    colorTxt: {
        fontWeight: '300',
        color: '#3D3C3A',
    },
    img: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    searchsection: {
        height: 159,
        width: '100%',
        backgroundColor: '#4BAAC8',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 7,
        padding: 10,
        marginTop: 10,
    },
    button: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        marginTop: '5%',
        marginBottom: 10,
        width: '35%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    searchresult: {
        flexDirection: 'column',
        width: '100%',
        backgroundColor: '#f1f1f1',
        padding: 20,
        borderRadius: 7,
        marginTop: 20,
    },
    txt: {
        fontSize: 16,
        color: 'black',
    },
    dailyline: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
        marginVertical: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderStyle: 'solid',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
});
