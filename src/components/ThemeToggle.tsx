"use client";

import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/state/useThemeStore";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <button
            onClick={toggleTheme}
            className="group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all duration-300 hover:shadow-lg hover:shadow-black/5 active:scale-[0.98]"
            aria-label="Toggle Theme"
        >
            <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                    {theme === "dark" ? (
                        <motion.div
                            key="moon"
                            initial={{ y: 20, opacity: 0, rotate: -45 }}
                            animate={{ y: 0, opacity: 1, rotate: 0 }}
                            exit={{ y: -20, opacity: 0, rotate: 45 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Moon size={18} className="text-blue-400" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ y: 20, opacity: 0, rotate: -45 }}
                            animate={{ y: 0, opacity: 1, rotate: 0 }}
                            exit={{ y: -20, opacity: 0, rotate: 45 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Sun size={18} className="text-amber-500" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <span className="text-[13px] font-bold tracking-tight text-[var(--color-text-main)] group-hover:text-[var(--color-accent)] transition-colors">
                {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>

            <div className="ml-1 w-8 h-4 bg-[var(--color-surface-elevated)] rounded-full relative p-0.5 border border-[var(--color-border)]">
                <motion.div
                    className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_rgba(58,130,246,0.5)]"
                    animate={{ x: theme === "dark" ? 0 : 16 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            </div>
        </button>
    );
}
