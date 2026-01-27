"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrendRadarProps {
    data: { subject: string; A: number; fullMark: number }[];
}

export function TrendRadar({ data }: TrendRadarProps) {
    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="items-center pb-2">
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Balance Analysis
                </CardTitle>
            </CardHeader>
            <CardContent className="pb-0">
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                            <PolarGrid stroke="var(--border)" strokeOpacity={0.5} />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                            <Radar
                                name="Health"
                                dataKey="A"
                                stroke="var(--primary)"
                                strokeWidth={3}
                                fill="var(--primary)"
                                fillOpacity={0.2}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
