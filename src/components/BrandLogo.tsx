import React from "react";
import { motion } from "framer-motion";

interface BrandLogoProps {
    size?: number;
    className?: string;
    rounded?: string;
}

/**
 * BrandLogo provides a consistent, desktop-grade rendering of the Event Pulse icon.
 * Adheres to brand requirements: square container, 12-15% safe margin padding,
 * and consistent corner radius.
 */
export const BrandLogo = ({
    size = 48,
    className = "",
    rounded = "rounded-2xl"
}: BrandLogoProps) => {
    const padding = Math.round(size * 0.12); // Slightly tighter padding for better logo visibility

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`relative bg-white ${rounded} overflow-hidden flex items-center justify-center border border-[var(--color-border)] shadow-xl ${className}`}
            style={{
                width: size,
                height: size,
                padding: `${padding}px`
            }}
        >
            <img
                src="/icons/icon-512x512.png"
                alt="University Logo"
                className="w-full h-full object-contain"
            />
        </motion.div>
    );
};
