import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react'

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

interface VehicleContextType {
    vehicleData: VehicleData | null;
    setVehicleData: (data: VehicleData | null) => void;
    clearVehicleData: () => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export function VehicleProvider({ children }: { children: ReactNode }) {
    // To fix issue of losing data on page reload
    const [vehicleData, setVehicleData] = useState<VehicleData | null>(() => {
        const saved = sessionStorage.getItem('vehicleData');
        return saved ? JSON.parse(saved) : null;
    });

    const updateVehicleData = (data: VehicleData | null) => {
        setVehicleData(data);

        if (data) {
            sessionStorage.setItem('vehicleData', JSON.stringify(data));
        } else {
            sessionStorage.removeItem('vehicleData');
        }
    }

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

export function useVehicle() {
    const context = useContext(VehicleContext);
    if (context === undefined) {
        throw new Error("useVehicle has to be used within a VehicleProvider.")
    }
    return context;
}