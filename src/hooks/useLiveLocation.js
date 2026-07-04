import { useEffect, useState } from "react";
import Geolocation from "@react-native-community/geolocation";
import { useGPS } from '../context/GPSContext';

export const useLiveLocation = () => {
    return useGPS();
};
