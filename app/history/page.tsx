"use client";

import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HistoryChart } from "@/components/history/history-chart";
import Link from "next/link";
import { motion } from "framer-motion";

import { useHealth } from "@/lib/health-context";

export default function HistoryPage() {
    const { history } = useHealth();

    // Transform history for Chart
    const chartData = history.length > 0 ? history.map(h => ({
        day: new Date(h.date).toLocaleDateString('en-US', { weekday: 'short' }),
        score: h.score
    })) : undefined;

    // Mock Calendar Grid (Keep for aesthetics, maybe map real data later)
    const days = Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        score: Math.floor(Math.random() * (100 - 60) + 60),
        status: Math.random() > 0.7 ? "excellent" : Math.random() > 0.4 ? "good" : "warning"
    }));

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-4 flex flex-col items-center">

            <div className="max-w-4xl w-full space-y-8">

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Monthly Patterns</h1>
                    <p className="text-muted-foreground">Track your vitality trends over time.</p>
                </div>

                {/* Trend Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <HistoryChart data={chartData} />
                </motion.div>

                {/* History Logs */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold px-2">Recent Logs</h2>
                    {history.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground bg-secondary/20 rounded-2xl">
                            No logs yet. Click "Save Day" in Dashboard to start tracking!
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {history.slice().reverse().map((log, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-secondary/10 rounded-xl border border-border/50">
                                    <div className="flex gap-4 items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${log.score >= 80 ? "bg-emerald-500" : log.score >= 60 ? "bg-amber-500" : "bg-red-500"
                                            }`}>
                                            {log.score}
                                        </div>
                                        <div>
                                            <p className="font-medium">{new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(log.date).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-right text-muted-foreground">
                                        <div>😴 {log.sleep}h</div>
                                        <div>💧 {log.water}L</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-center pt-8">
                    <Button variant="outline" className="rounded-full" asChild>
                        <Link href="/dashboard">Back to Dashboard</Link>
                    </Button>
                </div>

            </div>
        </div>
    )
}
