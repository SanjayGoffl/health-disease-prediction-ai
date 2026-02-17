"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, onSnapshot, collection, query, orderBy, limit } from "firebase/firestore";

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

export interface NutritionData {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    calorieGoal: number;
    proteinGoal: number;
    carbsGoal: number;
    fatGoal: number;
    fiberGoal: number;
}

export interface MealEntry {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface HealthContextType {
    healthData: HealthData;
    history: HealthHistoryItem[];
    updateHealthData: (data: Partial<HealthData>) => void;
    saveDailyLog: () => Promise<void>;
    nutritionData: NutritionData;
    meals: MealEntry[];
    addMeal: (meal: Omit<MealEntry, 'id'>) => void;
    removeMeal: (id: string) => void;
}

const defaultHealthData: HealthData = {
    screenTime: 6,
    steps: 5000,
    stress: 5,
    sleep: 7,
    water: 2,
};

const defaultNutritionData: NutritionData = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    calorieGoal: 2000,
    proteinGoal: 150,
    carbsGoal: 250,
    fatGoal: 65,
    fiberGoal: 30,
};

const HealthContext = createContext<HealthContextType | undefined>(undefined);

// Helper to calculate score (same logic as Dashboard)
export const calculateScore = (data: HealthData) => {
    let s = 60;
    s += (data.sleep - 6) * 5;
    s += (data.water - 1.5) * 8;
    s += (data.steps / 2000) * 3;
    s -= (data.stress - 2) * 4;
    s -= (data.screenTime - 3) * 3;
    return Math.min(100, Math.max(0, Math.round(s)));
};

export function HealthProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [healthData, setHealthData] = useState<HealthData>(defaultHealthData);
    const [history, setHistory] = useState<HealthHistoryItem[]>([]);
    const [nutritionData, setNutritionData] = useState<NutritionData>(defaultNutritionData);
    const [meals, setMeals] = useState<MealEntry[]>([]);

    // Subscribe to Firestore when user is logged in
    useEffect(() => {
        if (!user) {
            // Fallback to local storage or defaults for guest mode if desired, 
            // but for this app we force login for dashboard access.
            setHistory([]);
            return;
        }

        // 1. Listen to Today's Log
        const today = new Date().toISOString().split('T')[0];
        const todayDocRef = doc(db, "users", user.uid, "daily_logs", today);

        const unsubscribeToday = onSnapshot(todayDocRef, (doc) => {
            if (doc.exists()) {
                // If we have data for today, load it into the sliders
                const data = doc.data() as HealthData;
                // Only update if different to avoid jitter? 
                // Actually simpler to just set it. 
                // We merge with default to ensure all fields exist
                setHealthData({ ...defaultHealthData, ...data });
            } else {
                // No data for today yet, keep defaults or reset?
                // setHealthData(defaultHealthData); 
                // Ideally we don't reset if user just logged in, we let them see defaults
            }
        });

        // 2. Listen to History (Last 30 days)
        const historyQuery = query(
            collection(db, "users", user.uid, "daily_logs"),
            orderBy("date", "desc"), // Newest first
            limit(30)
        );

        const unsubscribeHistory = onSnapshot(historyQuery, (snapshot) => {
            const items: HealthHistoryItem[] = snapshot.docs.map(doc => ({
                ...(doc.data() as HealthData),
                date: doc.id, // Using the doc ID (YYYY-MM-DD) as date
                score: doc.data().score || calculateScore(doc.data() as HealthData)
            })).reverse(); // Reverse to have oldest first for graphs if needed
            setHistory(items);
        });

        return () => {
            unsubscribeToday();
            unsubscribeHistory();
        };
    }, [user]);

    const updateHealthData = (data: Partial<HealthData>) => {
        setHealthData(prev => ({ ...prev, ...data }));
    };

    const saveDailyLog = async () => {
        if (!user) return;

        const today = new Date().toISOString().split('T')[0];
        const score = calculateScore(healthData);

        try {
            await setDoc(doc(db, "users", user.uid, "daily_logs", today), {
                ...healthData,
                score,
                date: today,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error saving daily log:", error);
        }
    };

    // Nutrition: recalculate totals when meals change
    React.useEffect(() => {
        const totals = meals.reduce(
            (acc, meal) => ({
                calories: acc.calories + meal.calories,
                protein: acc.protein + meal.protein,
                carbs: acc.carbs + meal.carbs,
                fat: acc.fat + meal.fat,
                fiber: acc.fiber + meal.fiber,
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
        );
        setNutritionData(prev => ({ ...prev, ...totals }));
    }, [meals]);

    // Persist nutrition to Firestore
    React.useEffect(() => {
        if (!user || meals.length === 0) return;
        const today = new Date().toISOString().split('T')[0];
        setDoc(doc(db, "users", user.uid, "nutrition", today), {
            meals,
            updatedAt: new Date().toISOString()
        }).catch(err => console.error("Error saving nutrition:", err));
    }, [meals, user]);

    // Load nutrition from Firestore
    React.useEffect(() => {
        if (!user) return;
        const today = new Date().toISOString().split('T')[0];
        const nutritionDocRef = doc(db, "users", user.uid, "nutrition", today);
        const unsub = onSnapshot(nutritionDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.meals && Array.isArray(data.meals)) {
                    setMeals(data.meals);
                }
            }
        });
        return () => unsub();
    }, [user]);

    const addMeal = (meal: Omit<MealEntry, 'id'>) => {
        const newMeal: MealEntry = { ...meal, id: `meal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` };
        setMeals(prev => [...prev, newMeal]);
    };

    const removeMeal = (id: string) => {
        setMeals(prev => prev.filter(m => m.id !== id));
    };

    return (
        <HealthContext.Provider value={{ healthData, history, updateHealthData, saveDailyLog, nutritionData, meals, addMeal, removeMeal }}>
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
