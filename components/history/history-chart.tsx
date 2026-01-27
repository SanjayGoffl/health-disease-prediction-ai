"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card } from "@/components/ui/card";

const mockData = [
    { day: "1", score: 65 },
    { day: "5", score: 70 },
    { day: "10", score: 68 },
    { day: "15", score: 75 },
    { day: "20", score: 85 },
    { day: "25", score: 82 },
    { day: "30", score: 90 },
];

interface HistoryChartProps {
    data?: { day: string; score: number }[];
}

export function HistoryChart({ data = mockData }: HistoryChartProps) {
    return (
        <Card className="p-6 rounded-3xl border-none shadow-sm glass-panel">
            <h3 className="text-lg font-semibold mb-6">Health Score Trend</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.1} />
                        <XAxis
                            dataKey="day"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 100]}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-background border border-border p-3 rounded-lg shadow-xl text-sm">
                                            <p className="font-bold mb-1">Day {payload[0].payload.day}</p>
                                            <p className="text-primary">Score: {payload[0].value}</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="hsl(var(--primary))"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "hsl(var(--background))", strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
