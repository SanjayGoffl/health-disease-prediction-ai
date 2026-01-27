"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface HealthData {
    screenTime: number;    // hours
    steps: number;         // count
    stress: number;        // 1-10
    sleep: number;         // hours
    water: number;         // liters
}

export interface HealthHistoryItem extends HealthData {
    date: string; // ISO string
    score: number;
}

export interface UserProfile {
    name: string;
    age: number;
    weight: number; // kg
    height: number; // cm
    gender: string;
}

interface HealthContextType {
    healthData: HealthData;
    history: HealthHistoryItem[];
    userProfile: UserProfile;
    updateHealthData: (data: Partial<HealthData>) => void;
    updateUserProfile: (data: Partial<UserProfile>) => void;
    saveDailyLog: () => void;
}

const defaultHealthData: HealthData = {
    screenTime: 6,
    steps: 5000,
    stress: 5,
    sleep: 7,
    water: 2,
};

const defaultUserProfile: UserProfile = {
    name: "User",
    age: 25,
    weight: 70,
    height: 175,
    gender: "Not specified"
};

const HealthContext = createContext<HealthContextType | undefined>(undefined);

// Helper to calculate score (same logic as Dashboard)
const calculateScore = (data: HealthData) => {
    let s = 60;
    s += (data.sleep - 6) * 5;
    s += (data.water - 1.5) * 8;
    s += (data.steps / 2000) * 3;
    s -= (data.stress - 2) * 4;
    s -= (data.screenTime - 3) * 3;
    return Math.min(100, Math.max(0, Math.round(s)));
};

export function HealthProvider({ children }: { children: ReactNode }) {
    const [healthData, setHealthData] = useState<HealthData>(defaultHealthData);
    const [history, setHistory] = useState<HealthHistoryItem[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem("health-data");
        const savedHistory = localStorage.getItem("health-history");
        const savedProfile = localStorage.getItem("health-profile");

        if (savedData) {
            try {
                setHealthData(JSON.parse(savedData));
            } catch (e) {
                console.error("Failed to parse health data", e);
            }
        }

        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }

        if (savedProfile) {
            try {
                setUserProfile(JSON.parse(savedProfile));
            } catch (e) {
                console.error("Failed to parse profile", e);
            }
        }

        setIsLoaded(true);
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("health-data", JSON.stringify(healthData));
            localStorage.setItem("health-history", JSON.stringify(history));
            localStorage.setItem("health-profile", JSON.stringify(userProfile));
        }
    }, [healthData, history, userProfile, isLoaded]);

    const updateHealthData = (data: Partial<HealthData>) => {
        setHealthData(prev => ({ ...prev, ...data }));
    };

    const updateUserProfile = (data: Partial<UserProfile>) => {
        setUserProfile(prev => ({ ...prev, ...data }));
    };

    const saveDailyLog = () => {
        const today = new Date().toISOString().split('T')[0];

        // Remove existing entry for today if any
        const filtered = history.filter(h => h.date.split('T')[0] !== today);

        const newEntry: HealthHistoryItem = {
            ...healthData,
            date: new Date().toISOString(),
            score: calculateScore(healthData)
        };

        setHistory([...filtered, newEntry]);
    };

    return (
        <HealthContext.Provider value={{ healthData, history, userProfile, updateHealthData, updateUserProfile, saveDailyLog }}>
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
