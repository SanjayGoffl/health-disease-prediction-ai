"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CalorieGaugeProps {
    consumed: number;
    goal: number;
}

export function CalorieGauge({ consumed, goal }: CalorieGaugeProps) {
    const percentage = Math.min(100, Math.round((consumed / goal) * 100));
    const remaining = Math.max(0, goal - consumed);

    let color = "text-orange-500";
    let strokeColor = "#f97316"; // orange-500

    if (percentage > 100) {
        color = "text-rose-500";
        strokeColor = "#f43f5e";
    } else if (percentage > 85) {
        color = "text-amber-500";
        strokeColor = "#f59e0b";
    }

    const radius = 80;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[12px] border-secondary/50" />

                <motion.div
                    className="absolute inset-0 rounded-full bg-current opacity-10 blur-xl"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ color: strokeColor }}
                />

                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="rotate-[-90deg] drop-shadow-lg relative z-10"
                >
                    <motion.circle
                        stroke={strokeColor}
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + " " + circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className={cn("text-5xl font-bold tracking-tighter", color)}
                    >
                        {consumed}
                    </motion.span>
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-1">
                        / {goal} kcal
                    </span>
                </div>
            </div>

            <div className="mt-4 text-center">
                <h2 className="text-xl font-bold text-foreground">Daily Calories</h2>
                <p className="text-muted-foreground text-sm max-w-[220px] mx-auto mt-1">
                    {percentage > 100
                        ? `Over by ${consumed - goal} kcal. Consider lighter meals.`
                        : `${remaining} kcal remaining today.`
                    }
                </p>
            </div>
        </div>
    );
}
