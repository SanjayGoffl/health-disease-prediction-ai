"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Mail, Shield, Bell, LogOut, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-4 md:px-8 flex flex-col items-center">
            <div className="max-w-2xl w-full space-y-8">

                {/* Header / Digital Passport */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/20 to-secondary/50" />

                    <div className="relative mt-4 mb-4">
                        <div className="w-24 h-24 rounded-full bg-white p-1 shadow-xl">
                            <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                                <User className="w-10 h-10 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold">User Profile</h1>
                    <p className="text-muted-foreground">Standard Member • Since Jan 2026</p>

                    <div className="flex gap-2 mt-6">
                        <div className="px-4 py-2 rounded-full bg-secondary/50 text-xs font-medium uppercase tracking-wider">
                            ID: 883-291
                        </div>
                        <div className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium uppercase tracking-wider">
                            Health Score: 85
                        </div>
                    </div>
                </motion.div>

                {/* Settings Sections */}
                <div className="space-y-6">

                    {/* Section 1: Account */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card border border-border rounded-2xl p-6 shadow-sm"
                    >
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" /> Personal Details
                        </h2>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label>Full Name</Label>
                                <Input defaultValue="Alex Doe" className="bg-secondary/20" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <Input defaultValue="alex@example.com" className="bg-secondary/20" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Section 2: Preferences */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card border border-border rounded-2xl p-6 shadow-sm"
                    >
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary" /> Notifications & Privacy
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Daily Reminders</Label>
                                    <p className="text-xs text-muted-foreground">Receive morning check-ins</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Health Alerts</Label>
                                    <p className="text-xs text-muted-foreground">Notify on abnormal trends</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </div>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="pt-4 flex flex-col gap-3"
                    >
                        <Button variant="outline" className="w-full justify-between h-12 rounded-xl">
                            <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Data & Privacy</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button variant="destructive" className="w-full h-12 rounded-xl opacity-90 hover:opacity-100">
                            <LogOut className="mr-2 w-4 h-4" /> Sign Out
                        </Button>
                    </motion.div>

                </div>

            </div>
        </div>
    );
}
