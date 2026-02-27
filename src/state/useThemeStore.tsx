"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark");
    const [isHydrated, setIsHydrated] = useState(false);

    // Initial hydration
    useEffect(() => {
        const stored = localStorage.getItem("app_theme") as Theme | null;
        if (stored) {
            setTheme(stored);
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            // Uncomment if you want to default to system theme if no storage
            // setTheme("light");
        }
        setIsHydrated(true);
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (!isHydrated) return;

        const root = window.document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("app_theme", theme);
    }, [theme, isHydrated]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {/* Prevent flash move logic to layout if needed, but this works for most cases */}
            <div className={isHydrated ? "" : "invisible"}>
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
