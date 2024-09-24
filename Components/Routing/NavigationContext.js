// Context/NavigationContext.js

import React, { createContext, useContext, useRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
    const navigationRef = useRef(null);

    return (
        <NavigationContext.Provider value={{ navigationRef }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigationContext = () => useContext(NavigationContext);
