"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronDown, Trash2 } from "lucide-react";
import type { MealEntry } from "@/lib/health-context";

interface MealSectionProps {
    title: string;
    icon: string;
    meals: MealEntry[];
    onRemove: (id: string) => void;
}

export function MealSection({ title, icon, meals, onRemove }: MealSectionProps) {
    const [isOpen, setIsOpen] = React.useState(meals.length > 0);
    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);

    React.useEffect(() => {
        if (meals.length > 0) setIsOpen(true);
    }, [meals.length]);

    return (
        <motion.div
            layout
            className="bg-white dark:bg-card border border-border rounded-2xl shadow-sm overflow-hidden transition-all"
        >
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <div className="text-left">
                        <h3 className="font-semibold text-foreground/90">{title}</h3>
                        <p className="text-xs text-muted-foreground">
                            {meals.length === 0
                                ? "No items yet"
                                : `${meals.length} item${meals.length > 1 ? 's' : ''} · ${totalCalories} kcal`
                            }
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {totalCalories > 0 && (
                        <span className="text-sm font-bold text-orange-500 font-mono">{totalCalories}</span>
                    )}
                    <ChevronDown className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform duration-300",
                        isOpen && "rotate-180"
                    )} />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="border-t border-border/50">
                            {meals.length === 0 ? (
                                <div className="p-4 text-center text-sm text-muted-foreground/60 italic">
                                    Use the AI input below to add items
                                </div>
                            ) : (
                                <div className="divide-y divide-border/30">
                                    {meals.map((meal) => (
                                        <div
                                            key={meal.id}
                                            className="flex items-center justify-between px-4 py-3 group hover:bg-secondary/20 transition-colors"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{meal.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    P: {meal.protein}g · C: {meal.carbs}g · F: {meal.fat}g
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-mono font-semibold text-orange-500">
                                                    {meal.calories} kcal
                                                </span>
                                                <button
                                                    onClick={() => onRemove(meal.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-50 text-muted-foreground hover:text-rose-500 transition-all"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
