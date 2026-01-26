"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface HealthData {
    screenTime: number;    // hours
    steps: number;         // count
    stress: number;        // 1-10
    sleep: number;         // hours
    water: number;         // liters
}

interface HealthContextType {
    healthData: HealthData;
    updateHealthData: (data: Partial<HealthData>) => void;
}

const defaultHealthData: HealthData = {
    screenTime: 6,
    steps: 5000,
    stress: 5,
    sleep: 7,
    water: 2,
};

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export function HealthProvider({ children }: { children: ReactNode }) {
    const [healthData, setHealthData] = useState<HealthData>(defaultHealthData);

    const updateHealthData = (data: Partial<HealthData>) => {
        setHealthData(prev => ({ ...prev, ...data }));
    };

    return (
        <HealthContext.Provider value={{ healthData, updateHealthData }}>
            {children}
        </HealthContext.Provider>
    );
}

export function useHealth() {
    const context = useContext(HealthContext);
    if (!context) {
        throw new Error("useHealth must be used within HealthProvider");
    }
    return context;
}
