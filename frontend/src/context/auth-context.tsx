import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
    token: string | null;
    setToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setTokenState] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("token");
        if (saved) {
            setTokenState(saved);
        }
    }, []);

    const setToken = (t: string | null) => {
        if (t) {
            localStorage.setItem("token", t);
            setTokenState(t);
        } else {
            localStorage.removeItem("token");
            setTokenState(null);
        }
    };

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
}