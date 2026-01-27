"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Need to create this or use standard
import { Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MagicInputProps {
    onAnalysisComplete: (data: any) => void;
}

export function MagicInput({ onAnalysisComplete }: MagicInputProps) {
    const [text, setText] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    const handleAnalyze = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setSuccess(false);

        try {
            const res = await fetch("/api/diary/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed");
            }

            const data = await res.json();
            onAnalysisComplete(data);
            setSuccess(true);

            // Clear success state after 3s
            setTimeout(() => setSuccess(false), 3000);
        } catch (e) {
            console.error(e);
            // Optional: Show error toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <div className="glass-panel p-1 rounded-3xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all shadow-lg">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="How was your day? (e.g., 'Slept 6 hours, felt super stressed...')"
                    className="w-full h-24 p-4 bg-transparent border-none outline-none resize-none text-base placeholder:text-muted-foreground/70"
                />
                <div className="flex justify-between items-center bg-secondary/30 p-2 sm:rounded-b-2xl">
                    <span className="text-xs text-muted-foreground ml-2 hidden sm:inline-block">
                        AI extracts metrics automatically
                    </span>
                    <Button
                        size="sm"
                        onClick={handleAnalyze}
                        disabled={loading || !text.trim()}
                        className="rounded-xl px-4 transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-primary to-emerald-400 border-none"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
                            </>
                        ) : success ? (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" /> Updated!
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" /> Magic Fill
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
