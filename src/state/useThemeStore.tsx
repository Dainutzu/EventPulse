"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark");
    const [isMounted, setIsMounted] = useState(false);

    // Initial hydration and system preference check
    useEffect(() => {
        setIsMounted(true);
        const stored = localStorage.getItem("app_theme") as Theme | null;

        if (stored) {
            setTheme(stored);
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setTheme(prefersDark ? "dark" : "light");
        }
    }, []);

    // Sync theme with HTML class and LocalStorage
    useEffect(() => {
        if (!isMounted) return;

        const root = window.document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("app_theme", theme);
    }, [theme, isMounted]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {/* The wrapper div helps prevent layout shifts during hydration */}
            <div className={isMounted ? "opacity-100" : "opacity-0"} style={{ transition: "opacity 0.2s ease" }}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export function useThemeStore() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useThemeStore must be used within a ThemeProvider");
    }
    return context;
}
