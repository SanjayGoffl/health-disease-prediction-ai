"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
    message: string;
    type?: "info" | "success" | "error";
    duration?: number;
    onClose: () => void;
}

export function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
    React.useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColor = {
        info: "bg-blue-500",
        success: "bg-emerald-500",
        error: "bg-rose-500",
    };

    return (
        <div
            className={cn(
                "fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-white text-sm shadow-lg animate-in slide-in-from-bottom-5",
                bgColor[type]
            )}
        >
            {message}
        </div>
    );
}
