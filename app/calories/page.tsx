"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Beef, Wheat, Droplet, Leaf, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalorieGauge } from "@/components/calories/calorie-gauge";
import { MacroCard } from "@/components/calories/macro-card";
import { MealSection } from "@/components/calories/meal-section";
import { useHealth } from "@/lib/health-context";

export default function CaloriesPage() {
    const { nutritionData, meals, addMeal, removeMeal } = useHealth();

    const [text, setText] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [mealType, setMealType] = React.useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('snack');

    const handleFoodAnalyze = async () => {
        if (!text.trim()) return;
        setLoading(true);

        try {
            const res = await fetch("/api/food/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, mealType }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed");
            }

            const data = await res.json();

            if (data.items && Array.isArray(data.items)) {
                data.items.forEach((item: any) => {
                    addMeal({
                        name: item.name,
                        calories: item.calories || 0,
                        protein: item.protein || 0,
                        carbs: item.carbs || 0,
                        fat: item.fat || 0,
                        fiber: item.fiber || 0,
                        mealType: data.mealType || mealType,
                    });
                });
            }

            setText("");
        } catch (e: any) {
            console.error("Food analysis error:", e);
        } finally {
            setLoading(false);
        }
    };

    // Filter meals by type
    const breakfastMeals = meals.filter(m => m.mealType === 'breakfast');
    const lunchMeals = meals.filter(m => m.mealType === 'lunch');
    const dinnerMeals = meals.filter(m => m.mealType === 'dinner');
    const snackMeals = meals.filter(m => m.mealType === 'snack');

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-gradient-to-br from-orange-50/40 to-amber-50/30">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-2">
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold tracking-tight text-foreground"
                    >
                        Nutrition Tracker
                    </motion.h1>
                    <p className="text-muted-foreground text-sm">
                        Track meals with AI. Just describe what you ate.
                    </p>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left: Macros (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Macro Cards - 2x2 Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <MacroCard
                                label="Protein"
                                value={nutritionData.protein}
                                goal={nutritionData.proteinGoal}
                                unit="g"
                                icon={Beef}
                                colorClass="text-red-500"
                                accentColor="#ef4444"
                            />
                            <MacroCard
                                label="Carbs"
                                value={nutritionData.carbs}
                                goal={nutritionData.carbsGoal}
                                unit="g"
                                icon={Wheat}
                                colorClass="text-amber-500"
                                accentColor="#f59e0b"
                            />
                            <MacroCard
                                label="Fat"
                                value={nutritionData.fat}
                                goal={nutritionData.fatGoal}
                                unit="g"
                                icon={Droplet}
                                colorClass="text-blue-500"
                                accentColor="#3b82f6"
                            />
                            <MacroCard
                                label="Fiber"
                                value={nutritionData.fiber}
                                goal={nutritionData.fiberGoal}
                                unit="g"
                                icon={Leaf}
                                colorClass="text-emerald-500"
                                accentColor="#10b981"
                            />
                        </div>

                        {/* Meal Sections */}
                        <div className="space-y-3">
                            <h2 className="text-lg font-semibold text-foreground/80 px-1">Today&apos;s Meals</h2>
                            <MealSection title="Breakfast" icon="🌅" meals={breakfastMeals} onRemove={removeMeal} />
                            <MealSection title="Lunch" icon="☀️" meals={lunchMeals} onRemove={removeMeal} />
                            <MealSection title="Dinner" icon="🌙" meals={dinnerMeals} onRemove={removeMeal} />
                            <MealSection title="Snacks" icon="🍿" meals={snackMeals} onRemove={removeMeal} />
                        </div>
                    </div>

                    {/* Right: Gauge (4 cols) */}
                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-panel rounded-3xl p-6 relative overflow-hidden sticky top-28"
                        >
                            <div className="absolute top-0 right-0 p-12 bg-orange-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
                            <CalorieGauge
                                consumed={nutritionData.calories}
                                goal={nutritionData.calorieGoal}
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Magic Input — stuck at bottom */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto w-full"
                >
                    <div className="glass-panel p-1 rounded-3xl overflow-hidden focus-within:ring-2 focus-within:ring-orange-400/50 transition-all shadow-lg">
                        {/* Meal Type Selector */}
                        <div className="flex gap-1 px-3 pt-3">
                            {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setMealType(type)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${mealType === type
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="e.g. I had 2 eggs and toast for breakfast..."
                            className="w-full h-20 p-4 bg-transparent border-none outline-none resize-none text-base placeholder:text-muted-foreground/70"
                        />
                        <div className="flex justify-between items-center bg-secondary/30 p-2 sm:rounded-b-2xl">
                            <span className="text-xs text-muted-foreground ml-2 hidden sm:inline-block">
                                AI extracts food items & nutrients
                            </span>
                            <Button
                                size="sm"
                                onClick={handleFoodAnalyze}
                                disabled={loading || !text.trim()}
                                className="rounded-xl px-4 transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-orange-500 to-amber-400 border-none text-white"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2" /> Add Food
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
