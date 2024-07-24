import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import SignIn from '../Screens/SignIn';
import Profile from '../Screens/Profile';
import MainPage from '../Screens/MainPage';
import Attendance from '../Screens/Attendance';
import AttendanceHistory from '../Screens/AttendanceHistory';
import OTPInput from '../Screens/OptChecker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Homepage from '../Screens/Homepage';

const Stack = createNativeStackNavigator();

const NavigationRoutes = () => {
   

    return (
       
            <Stack.Navigator >
                <Stack.Screen name="Homepage" component={Homepage} options={{headerShown:false}}/>
                <Stack.Screen name="Signin" component={SignIn}  options={{headerShown:false}}/>
                <Stack.Screen name="OTPScreen" component={OTPInput}  options={{headerShown:false}}/>
                <Stack.Screen name="Profile" component={Profile}  options={{headerShown:false}}/>
                <Stack.Screen name="Mainpage" component={MainPage}  options={{headerShown:false}}/>
                <Stack.Screen name="Attendance" component={Attendance}  options={{headerShown:false}}/>
                <Stack.Screen name="AttendanceHistory" component={AttendanceHistory}  options={{headerShown:false}}/>
            </Stack.Navigator>
       
    );
}

export default NavigationRoutes;
