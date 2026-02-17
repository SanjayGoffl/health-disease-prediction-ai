"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, MessageSquare, Home, LogIn, User, Apple } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
    const pathname = usePathname();
    const { user, signOut } = useAuth();

    // Define nav items based on auth state
    const navItems = user
        ? [
            { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { href: "/calories", label: "Nutrition", icon: Apple },
            { href: "/chat", label: "AI Chat", icon: MessageSquare },
        ]
        : [
            { href: "/", label: "Home", icon: Home },
        ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 inset-x-0 z-50 flex justify-center pt-6 px-4 pointer-events-none"
        >
            <div className="bg-background/80 backdrop-blur-md border border-border shadow-lg rounded-full px-6 py-3 pointer-events-auto flex items-center gap-1">
                <Link href="/" className="mr-6 font-bold text-lg flex items-center gap-2 text-primary">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-white">
                        <ActivityIcon className="w-5 h-5" />
                    </div>
                    <span className="hidden sm:inline">HealthTwin</span>
                </Link>

                <div className="flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2",
                                    isActive
                                        ? "text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute inset-0 bg-primary rounded-full shadow-md"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                <div className="ml-6 pl-6 border-l border-border">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-md hover:scale-105 transition-transform overflow-hidden relative">
                                    {user.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt={user.displayName || "User"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        user.displayName ? user.displayName[0].toUpperCase() : <User className="w-4 h-4" />
                                    )}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="cursor-pointer">Profile Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/history" className="cursor-pointer">History</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive focus:bg-destructive/10 cursor-pointer"
                                    onClick={signOut}
                                >
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login">
                            <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                <LogIn className="w-4 h-4" />
                                <span className="hidden sm:inline">Sign In</span>
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </motion.nav>
    );
}

function ActivityIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}
