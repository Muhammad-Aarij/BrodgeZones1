/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import SignIn from './Components/Screens/SignIn';
import OptChecker from './Components/Screens/OptChecker';
import MainPage from './Components/Screens/MainPage';
import Attendance from  './Components/Screens/Attendance';
import Profile from './Components/Screens/Profile';
 import AttendanceHistory from './Components/Screens/AttendanceHistory';
AppRegistry.registerComponent(appName, () => App);
