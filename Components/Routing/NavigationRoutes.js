import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../Screens/SignIn';
import Profile from '../Screens/Profile';
import MainPage from '../Screens/MainPage';
import AttendanceHistory from '../Screens/AttendanceHistory';
import OTPInput from '../Screens/OptChecker';
import Homepage from '../Screens/Homepage';
import BiometricAuth from '../Functions/FingerPrintScanner';
import MarkAttendance from '../Screens/MarkAttendace';
import LeavePage from '../Screens/LeavePage';
import Dashboard from '../Screens/Dashboard';
import PendingRequests from '../Screens/PendingRequests';
import LeaveApproaval from '../Screens/LeaveApproaval';
import ApproavalPage from '../Screens/ApproavalPage';
import AttendanceApprovel from '../Screens/AttendanceApprovel';
import ChatScreen from '../Screens/Chatpage';

const Stack = createNativeStackNavigator();

const NavigationRoutes = () => {


    return (
        // <Stack.Navigator  initialRouteName='OTPScreen'>
        <Stack.Navigator >
            <Stack.Screen name="Homepage" component={Homepage} options={{ headerShown: false }} />
            <Stack.Screen name="Signin" component={SignIn} options={{ headerShown: false }} />
            <Stack.Screen name="OTPScreen" component={OTPInput} options={{ headerShown: false }} />
            <Stack.Screen name="Fingerprintscanner" component={BiometricAuth} options={{ headerShown: false }} />
            <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
            <Stack.Screen name="Pendingrequests" component={PendingRequests} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name="Mainpage" component={MainPage} options={{ headerShown: false }} />
            <Stack.Screen name="Markattendance" component={MarkAttendance} options={{ headerShown: false }} />
            <Stack.Screen name="AttendanceHistory" component={AttendanceHistory} options={{ headerShown: false }} />
            <Stack.Screen name="Leave" component={LeavePage} options={{ headerShown: false }} />
            <Stack.Screen name="LeaveApproaval" component={LeaveApproaval} options={{ headerShown: false }} />
            <Stack.Screen name="ApproavalPage" component={ApproavalPage} options={{ headerShown: false, title: "Leave Request" }} />
            <Stack.Screen name="AttendaceApproaval" component={AttendanceApprovel} options={{ headerShown: false, title: "Leave Request" }} />
            <Stack.Screen name="Chatpage" component={ChatScreen} options={{ headerShown: false }} />


        </Stack.Navigator>
    );
}

export default NavigationRoutes;
