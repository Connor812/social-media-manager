import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DataContext = createContext();

const DataProvider = ({ children }) => {
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('userData') ? true : false);

    function logout(e) {
        e.preventDefault();
        sessionStorage.removeItem('userData');
        setIsLoggedIn(false);
        navigate('/login');
    }

    useEffect(() => {
        const userData = sessionStorage.getItem('userData');

        if (userData) {
            const parsedData = JSON.parse(userData);
            const timestamp = parsedData.timestamp;
            const now = new Date().getTime();

            // Calculate the time difference in hours
            const timeDifferenceInHours = (now - timestamp) / (1000 * 60 * 60);

            // Check if more than 5 hours have passed
            if (timeDifferenceInHours > 5) {
                sessionStorage.removeItem('userData');
                setIsLoggedIn(false);
                navigate('/login/Session_Timed_Out');
            }
        }
    }, [navigate]);

    return (
        <DataContext.Provider value={{ data, isLoggedIn, setIsLoggedIn, logout }}>
            {children}
        </DataContext.Provider>
    );
};

export { DataContext, DataProvider };
