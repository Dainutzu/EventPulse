"use client";

import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/state/useThemeStore";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center transition-all hover:bg-[var(--color-surface-elevated)] active:scale-95 shadow-sm"
            aria-label="Toggle Theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === "dark" ? 0 : 180, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {theme === "dark" ? (
                    <Moon size={20} className="text-blue-400" />
                ) : (
                    <Sun size={20} className="text-amber-500" />
                )}
            </motion.div>
        </button>
    );
}
