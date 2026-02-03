import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react'

// Define the structure of vehicle data primarily from the VIN lookup.
interface VehicleData {
    vin?: string;
    year?: number;
    make_name?: string;
    model_name?: string;
    trim?: string;
    body_type?: string;
    engine_type?: string;
    fuel_type?: string;
    horsepower?: number;
    transmission?: string;
    wheel_system_display?: string;
}

// Define the context type including the vehicle data and functions to update/clear it.
interface VehicleContextType {
    vehicleData: VehicleData | null;
    setVehicleData: (data: VehicleData | null) => void;
    clearVehicleData: () => void;
}

// Creates the context for the vehicle data and will be used below by the hook.
const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

// Provides the vehicle data context and the data to Session Storage to remain across reloads.
export function VehicleProvider({ children }: { children: ReactNode }) {
    // To fix issue of losing data on page reload
    const [vehicleData, setVehicleData] = useState<VehicleData | null>(() => {
        const saved = sessionStorage.getItem('vehicleData');
        return saved ? JSON.parse(saved) : null;
    });
    // Update both state and session storage
    const updateVehicleData = (data: VehicleData | null) => {
        setVehicleData(data);
        // If data exists, save to session storage, otherwise, remove it
        if (data) {
            sessionStorage.setItem('vehicleData', JSON.stringify(data));
        } else {
            sessionStorage.removeItem('vehicleData');
        }
    }
    // Clear vehicle data from both state and session storage
    const clearVehicleData = () => {
        setVehicleData(null);
        sessionStorage.removeItem('vehicleData');
    };

    return (
        <VehicleContext.Provider value = {{
            vehicleData,
            setVehicleData: updateVehicleData,
            clearVehicleData
        }}>
            {children}
        </VehicleContext.Provider>
    );
}

// Hook to access the vehicle data context across files.
export function useVehicle() {
    const context = useContext(VehicleContext);
    if (context === undefined) {
        throw new Error("useVehicle has to be used within a VehicleProvider.")
    }
    return context;
}