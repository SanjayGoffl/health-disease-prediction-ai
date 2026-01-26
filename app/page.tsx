"use client";

import { HealthProvider } from "@/lib/health-context";
import DashboardPanel from "@/components/dashboard-panel";
import ChatPanel from "@/components/chat-panel";
import { Activity } from "lucide-react";

export default function Home() {
  return (
    <HealthProvider>
      <main className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b-2 border-border bg-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-sm bg-primary p-2">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">HealthPredict</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Health Twin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Grid - Hybrid Layout */}
        <div className="container mx-auto p-6">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            {/* Left: Visual Dashboard */}
            <DashboardPanel />

            {/* Right: AI Consultant Chat */}
            <ChatPanel />
          </div>
        </div>
      </main>
    </HealthProvider>
  );
}
