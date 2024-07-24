import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from './Components/Screens/SignIn';
import Profile from './Components/Screens/Profile';
import MainPage from './Components/Screens/MainPage';
import Attendance from './Components/Screens/Attendance';
import AttendanceHistory from './Components/Screens/AttendanceHistory';
import { Text } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name="Signin" component={SignIn} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Mainpage" component={MainPage} />
        <Stack.Screen name="Attendance" component={Attendance} />
        <Stack.Screen name="AttendanceHistory" component={AttendanceHistory} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
