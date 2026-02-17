"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Moon, Droplets, Footprints, Flame, MonitorSmartphone, Sparkles, Download, Bell, CheckCircle, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/dashboard/metric-card";
import { HealthGauge } from "@/components/dashboard/health-gauge";
import { MagicInput } from "@/components/dashboard/magic-input";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { jsPDF } from "jspdf";

import { useHealth } from "@/lib/health-context";
import { useAuth } from "@/components/auth-provider";
import { Toast } from "@/components/ui/toast";

const TrendRadar = dynamic(() => import('@/components/dashboard/trend-radar').then(mod => mod.TrendRadar), {
    ssr: false,
    loading: () => <div className="h-[250px] w-full bg-secondary/20 animate-pulse rounded-xl" />
});

export default function DashboardPage() {
    // 1. Sync with Global Context (Persisted)
    const { healthData, updateHealthData, saveDailyLog, nutritionData } = useHealth();
    const { user } = useAuth();

    // 2. Destructure for easier usage
    const { sleep, water, steps, stress, screenTime: screen } = healthData;
    const [score, setScore] = React.useState(82);

    // 3. Dynamic Time & Greeting
    const [greeting, setGreeting] = React.useState("Good Day");
    const [vibe, setVibe] = React.useState("bg-background");

    // Feature States
    const [saved, setSaved] = React.useState(false);
    const [reminderActive, setReminderActive] = React.useState(false);
    const [toast, setToast] = React.useState<{ message: string; type: "info" | "success" | "error" } | null>(null);

    React.useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting("Good Morning");
            setVibe("from-amber-50/50 to-emerald-50/50"); // Warm start
        } else if (hour < 18) {
            setGreeting("Good Afternoon");
            setVibe("from-emerald-50/50 to-cyan-50/50"); // Productive
        } else {
            setGreeting("Good Evening");
            setVibe("from-slate-50/50 to-indigo-50/50"); // Calm night
        }
    }, []);

    // 4. Calculate Score
    React.useEffect(() => {
        let s = 60;
        s += (sleep - 6) * 5;
        s += (water - 1.5) * 8;
        s += (steps / 2000) * 3;
        s -= (stress - 2) * 4;
        s -= (screen - 3) * 3;
        s = Math.min(100, Math.max(0, Math.round(s)));
        setScore(s);
    }, [sleep, water, steps, stress, screen]);

    // 5. Handlers
    const handleAIUpdate = (data: any) => {
        updateHealthData({
            sleep: data.sleep ?? sleep,
            water: data.water ?? water,
            steps: data.steps ?? steps,
            stress: data.stress ?? stress,
            screenTime: data.screen ?? screen
        });
        setToast({ message: "Metrics updated by AI!", type: "success" });
    };

    const handleSave = () => {
        saveDailyLog();
        setSaved(true);
        setToast({ message: "Daily log saved to history!", type: "success" });
        setTimeout(() => setSaved(false), 2000);
    };

    const handleExport = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("HealthPredict Daily Report", 20, 20);

        doc.setFontSize(12);
        const currentDate = new Date();
        doc.text(`Date: ${currentDate.toLocaleDateString()}`, 20, 30);
        doc.text(`Overall Score: ${score}/100`, 20, 40);

        doc.text("Metrics:", 20, 50);
        doc.text(`- Sleep: ${sleep} hours`, 30, 60);
        doc.text(`- Water: ${water} L`, 30, 70);
        doc.text(`- Steps: ${steps}`, 30, 80);
        doc.text(`- Stress: ${stress}/10`, 30, 90);
        doc.text(`- Screen Time: ${screen} hours`, 30, 100);

        doc.save("health-report.pdf");
        setToast({ message: "Report downloaded!", type: "success" });
    };

    const toggleReminder = () => {
        if (!reminderActive) {
            if (Notification.permission === "granted") {
                setReminderActive(true);
                setToast({ message: "Water reminders enabled!", type: "success" });
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        setReminderActive(true);
                        setToast({ message: "Water reminders enabled!", type: "success" });
                    }
                });
            } else {
                setToast({ message: "Notifications denied. Enable in browser settings.", type: "error" });
            }
        } else {
            setReminderActive(false);
            setToast({ message: "Reminders disabled.", type: "info" });
        }
    };

    // Radar Data
    const radarData = [
        { subject: 'Sleep', A: (sleep / 10) * 100, fullMark: 100 },
        { subject: 'Hydration', A: (water / 4) * 100, fullMark: 100 },
        { subject: 'Activity', A: Math.min(100, (steps / 10000) * 100), fullMark: 100 },
        { subject: 'Calmness', A: ((10 - stress) / 10) * 100, fullMark: 100 },
        { subject: 'Detox', A: ((12 - screen) / 12) * 100, fullMark: 100 },
    ];

    return (
        <div className={`min-h-screen pt-24 pb-20 px-4 md:px-8 bg-gradient-to-br ${vibe} transition-colors duration-1000`}>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <motion.h1
                            key={greeting}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl font-bold tracking-tight text-foreground"
                        >
                            {greeting}, {user?.displayName?.split(" ")[0] || "User"}
                        </motion.h1>
                        <p className="text-muted-foreground text-sm">Here’s your daily health snapshot.</p>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        <Button
                            onClick={toggleReminder}
                            variant="outline"
                            size="icon"
                            className={reminderActive ? "border-blue-500 text-blue-500 bg-blue-50" : ""}
                            title="Water Reminder"
                        >
                            <Bell className="w-4 h-4" />
                        </Button>

                        <Button
                            onClick={handleExport}
                            variant="outline"
                            size="icon"
                            title="Export PDF"
                        >
                            <Download className="w-4 h-4" />
                        </Button>

                        <Button
                            onClick={handleSave}
                            variant={saved ? "default" : "outline"}
                            className={saved ? "bg-green-500 hover:bg-green-600 text-white border-green-600" : "border-primary/20 hover:border-primary/50"}
                        >
                            {saved ? (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Saved
                                </>
                            ) : (
                                "Save Day"
                            )}
                        </Button>

                        <Button asChild className="rounded-full shadow-lg bg-gradient-to-r from-primary to-emerald-400 hover:shadow-primary/25 transition-all hover:scale-105">
                            <Link href="/chat">
                                <Sparkles className="mr-2 w-4 h-4 text-white" />
                                Ask AI Consultant
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Magic Input (Hybrid Add-on) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto w-full"
                >
                    <MagicInput onAnalysisComplete={handleAIUpdate} />
                </motion.div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Column: Inputs (8 cols) */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <MetricCard
                            label="Sleep Duration"
                            value={sleep}
                            unit="hrs"
                            icon={Moon}
                            min={3} max={12} step={0.5}
                            colorClass="text-indigo-500"
                            onChange={(val) => updateHealthData({ sleep: val })}
                            description="Quality rest hours"
                        />
                        <MetricCard
                            label="Water Intake"
                            value={water}
                            unit="L"
                            icon={Droplets}
                            min={0.5} max={5} step={0.1}
                            colorClass="text-cyan-500"
                            onChange={(val) => updateHealthData({ water: val })}
                            description="Daily hydration level"
                        />
                        <MetricCard
                            label="Steps Count"
                            value={steps}
                            unit="steps"
                            icon={Footprints}
                            min={0} max={20000} step={500}
                            colorClass="text-emerald-500"
                            onChange={(val) => updateHealthData({ steps: val })}
                            description="Physical movement"
                        />
                        <MetricCard
                            label="Stress Level"
                            value={stress}
                            unit="/ 10"
                            icon={Flame}
                            min={1} max={10} step={1}
                            colorClass="text-rose-500"
                            onChange={(val) => updateHealthData({ stress: val })}
                            description="Perceived mental load"
                        />
                        <MetricCard
                            label="Screen Time"
                            value={screen}
                            unit="hrs"
                            icon={MonitorSmartphone}
                            min={0} max={16} step={0.5}
                            colorClass="text-amber-500"
                            onChange={(val) => updateHealthData({ screenTime: val })}
                            description="Digital exposure"
                        />
                        <Link href="/calories" className="block">
                            <motion.div
                                whileHover={{ y: -4, scale: 1.01 }}
                                className="group relative bg-white dark:bg-card border border-border rounded-2xl p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-orange-300/40 hover:ring-1 hover:ring-orange-300/30 cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-orange-50 group-hover:bg-orange-100 transition-colors text-orange-500">
                                            <Apple className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground/90">Calories</h3>
                                            <p className="text-xs text-muted-foreground">Tap to track meals</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xl font-bold font-mono tracking-tight text-orange-500">
                                            {nutritionData.calories}
                                        </span>
                                        <span className="text-xs text-muted-foreground ml-1">/ {nutritionData.calorieGoal} kcal</span>
                                    </div>
                                </div>
                                <div className="relative h-2.5 bg-secondary/60 rounded-full overflow-hidden">
                                    <motion.div
                                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-orange-400 to-amber-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, Math.round((nutritionData.calories / nutritionData.calorieGoal) * 100))}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                            </motion.div>
                        </Link>
                    </div>

                    {/* Right Column: Viz (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Score Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-panel rounded-3xl p-6 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-12 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
                            <HealthGauge score={score} />
                        </motion.div>

                        {/* Radar Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="glass-panel rounded-3xl p-6"
                        >
                            <TrendRadar data={radarData} />
                        </motion.div>
                    </div>

                </div>

            </div>

            {/* Toast Notifications */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
