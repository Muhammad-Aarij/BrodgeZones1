// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import NavigationRoutes from './Components/Routing/NavigationRoutes';

const App = () => {
    return (
        <NavigationContainer>
            <NavigationRoutes />
        </NavigationContainer>
    );
}

export default App;
