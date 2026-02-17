"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MacroCardProps {
    label: string;
    value: number;
    goal: number;
    unit: string;
    icon: LucideIcon;
    colorClass: string;
    accentColor: string; // hex for progress bar
}

export function MacroCard({ label, value, goal, unit, icon: Icon, colorClass, accentColor }: MacroCardProps) {
    const percentage = goal > 0 ? Math.min(100, Math.round((value / goal) * 100)) : 0;

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            className={cn(
                "group relative bg-white dark:bg-card border border-border rounded-2xl p-5 shadow-sm transition-all duration-300",
                "hover:shadow-lg hover:border-primary/20 hover:ring-1 hover:ring-primary/20 hover:shadow-primary/5"
            )}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={cn("p-2.5 rounded-xl bg-secondary/50 group-hover:bg-secondary transition-colors", colorClass)}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground/90">{label}</h3>
                        <p className="text-xs text-muted-foreground">{percentage}% of goal</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className={cn("text-xl font-bold font-mono tracking-tight", colorClass)}>
                        {value}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">/ {goal}{unit}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2.5 bg-secondary/60 rounded-full overflow-hidden">
                <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ backgroundColor: accentColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                />
            </div>
        </motion.div>
    );
}
