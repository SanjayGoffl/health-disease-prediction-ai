"use client";

import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface MetricCardProps {
    label: string;
    value: number;
    unit: string;
    icon: LucideIcon;
    min: number;
    max: number;
    step: number;
    colorClass: string; // e.g., "text-blue-500"
    onChange: (val: number) => void;
    description?: string;
}

export function MetricCard({
    label,
    value,
    unit,
    icon: Icon,
    min,
    max,
    step,
    colorClass,
    onChange,
    description
}: MetricCardProps) {

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
                        {description && <p className="text-xs text-muted-foreground">{description}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <span className={cn("text-xl font-bold font-mono tracking-tight", colorClass)}>
                        {value}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">{unit}</span>
                </div>
            </div>

            <div className="relative pt-2 pb-1">
                <Slider
                    value={[value]}
                    min={min}
                    max={max}
                    step={step}
                    onValueChange={(vals) => onChange(vals[0])}
                    className={cn("cursor-pointer", colorClass)}
                />
                <div className="flex justify-between mt-2 text-[10px] text-muted-foreground uppercase font-medium tracking-wider">
                    <span>Min</span>
                    <span>Max</span>
                </div>
            </div>
        </motion.div>
    );
}
