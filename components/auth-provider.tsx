"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);

            // Protected routes logic
            const publicRoutes = ["/", "/login", "/signup"];
            const isPublic = publicRoutes.includes(pathname);

            if (!user && !isPublic) {
                // Redirect to login if trying to access protected route while logged out
                router.push("/login");
            } else if (user && (pathname === "/login" || pathname === "/signup")) {
                // Redirect to dashboard if trying to access auth pages while logged in
                router.push("/dashboard");
            }
        });

        return () => unsubscribe();
    }, [pathname, router]);

    const signOut = async () => {
        await firebaseSignOut(auth);
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
