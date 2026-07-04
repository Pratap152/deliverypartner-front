import React, { createContext, useContext, useEffect,useState } from "react";
import { gpsService } from '../services/gps/GpsService';

const GPSContext = createContext();

export const useGPS = () => useContext(GPSContext);

export const GPSProvider = ({ children }) => {
    const [location, setLocation] = useState(null);

    useEffect(() => {
        gpsService.initializeTracking(setLocation);
    }, []);

    return (
        <GPSContext.Provider
            value={{
            location,
            currentLocation: location
                ? {
                    latitude: location.latitude,
                    longitude: location.longitude,
                }
                : null,
            currentHeading: location?.heading ?? 0,
        }}>
            {children}
        </GPSContext.Provider>
    );
};