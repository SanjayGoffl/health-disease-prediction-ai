"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useHealth } from "@/lib/health-context";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from "recharts";
import { Smartphone, Footprints, Brain, Moon, Droplets, Activity } from "lucide-react";

export default function DashboardPanel() {
    const { healthData, updateHealthData } = useHealth();

    // Calculate  risk score (simplistic)
    const calculateRiskScore = () => {
        let score = 100;
        if (healthData.screenTime > 8) score -= 20;
        if (healthData.steps < 5000) score -= 15;
        if (healthData.stress > 7) score -= 20;
        if (healthData.sleep < 6) score -= 25;
        if (healthData.water < 2) score -= 10;
        return Math.max(0, score);
    };

    const riskScore = calculateRiskScore();
    const riskLevel = riskScore > 75 ? "Excellent" : riskScore > 50 ? "Good" : riskScore > 30 ? "Moderate" : "Poor";
    const riskColor = riskScore > 75 ? "health-excellent" : riskScore > 50 ? "health-good" : riskScore > 30 ? "health-warning" : "health-danger";

    // Radar data for visualization
    const radarData = [
        { metric: "Activity", value: Math.min(100, (healthData.steps / 100)) },
        { metric: "Sleep", value: (healthData.sleep / 8) * 100 },
        { metric: "Hydration", value: (healthData.water / 3) * 100 },
        { metric: "Stress", value: ((10 - healthData.stress) / 10) * 100 },
        { metric: "Screen", value: ((12 - healthData.screenTime) / 12) * 100 },
    ];

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            {/* Risk Gauge */}
            <Card className="card-pro animate-smooth rounded-sm p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Activity className="h-24 w-24" />
                </div>
                <div className="text-center relative z-10">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Health Risk Score</p>
                    <div className="my-6">
                        <div className="relative inline-block">
                            <svg className="h-40 w-40 drop-shadow-xl" viewBox="0 0 120 120">
                                {/* Background circle */}
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="54"
                                    fill="none"
                                    stroke="var(--muted-foreground)"
                                    strokeWidth="8"
                                    className="opacity-20"
                                />
                                {/* Progress circle */}
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="54"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    className={riskColor}
                                    strokeDasharray={`${(riskScore / 100) * 339} 339`}
                                    transform="rotate(-90 60 60)"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-4xl font-bold ${riskColor} text-glow-excellent tracking-tighter`}>{riskScore}</span>
                            </div>
                        </div>
                    </div>
                    <p className={`text-xl font-bold ${riskColor} tracking-tight`}>{riskLevel}</p>
                </div>
            </Card>

            {/* Daily Inputs */}
            <Card className="card-pro animate-smooth rounded-sm p-6">
                <h3 className="mb-6 text-lg font-bold tracking-tight flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Daily Metrics
                </h3>
                <div className="space-y-6">
                    {/* Screen Time */}
                    <div className="space-y-3 group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                                <Smartphone className="h-4 w-4" />
                                <label className="text-sm font-medium">Screen Time</label>
                            </div>
                            <span className="text-sm font-bold text-chart-5 bg-chart-5/10 px-2 py-0.5 rounded-sm">{healthData.screenTime}h</span>
                        </div>
                        <Slider
                            value={[healthData.screenTime]}
                            onValueChange={(val) => updateHealthData({ screenTime: val[0] })}
                            min={0}
                            max={16}
                            step={0.5}
                            className="cursor-pointer"
                        />
                    </div>

                    {/* Steps */}
                    <div className="space-y-3 group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                                <Footprints className="h-4 w-4" />
                                <label className="text-sm font-medium">Steps</label>
                            </div>
                            <span className="text-sm font-bold text-chart-1 bg-chart-1/10 px-2 py-0.5 rounded-sm">{healthData.steps.toLocaleString()}</span>
                        </div>
                        <Slider
                            value={[healthData.steps]}
                            onValueChange={(val) => updateHealthData({ steps: val[0] })}
                            min={0}
                            max={15000}
                            step={500}
                            className="cursor-pointer"
                        />
                    </div>

                    {/* Stress */}
                    <div className="space-y-3 group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                                <Brain className="h-4 w-4" />
                                <label className="text-sm font-medium">Stress Level</label>
                            </div>
                            <span className="text-sm font-bold text-chart-3 bg-chart-3/10 px-2 py-0.5 rounded-sm">{healthData.stress}/10</span>
                        </div>
                        <Slider
                            value={[healthData.stress]}
                            onValueChange={(val) => updateHealthData({ stress: val[0] })}
                            min={1}
                            max={10}
                            step={1}
                            className="cursor-pointer"
                        />
                    </div>

                    {/* Sleep */}
                    <div className="space-y-3 group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                                <Moon className="h-4 w-4" />
                                <label className="text-sm font-medium">Sleep Duration</label>
                            </div>
                            <span className="text-sm font-bold text-chart-2 bg-chart-2/10 px-2 py-0.5 rounded-sm">{healthData.sleep}h</span>
                        </div>
                        <Slider
                            value={[healthData.sleep]}
                            onValueChange={(val) => updateHealthData({ sleep: val[0] })}
                            min={0}
                            max={12}
                            step={0.5}
                            className="cursor-pointer"
                        />
                    </div>

                    {/* Water */}
                    <div className="space-y-3 group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                                <Droplets className="h-4 w-4" />
                                <label className="text-sm font-medium">Water Intake</label>
                            </div>
                            <span className="text-sm font-bold text-chart-4 bg-chart-4/10 px-2 py-0.5 rounded-sm">{healthData.water}L</span>
                        </div>
                        <Slider
                            value={[healthData.water]}
                            onValueChange={(val) => updateHealthData({ water: val[0] })}
                            min={0}
                            max={5}
                            step={0.25}
                            className="cursor-pointer"
                        />
                    </div>
                </div>
            </Card>

            {/* Health Radar */}
            <Card className="card-pro animate-smooth rounded-sm p-6">
                <h3 className="mb-4 text-lg font-bold tracking-tight">Health Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                        <defs>
                            <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <PolarGrid stroke="var(--border)" />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Health"
                            dataKey="value"
                            stroke="var(--primary)"
                            strokeWidth={3}
                            fill="url(#colorHealth)"
                            fillOpacity={0.2}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--border)',
                                borderRadius: '4px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
}
