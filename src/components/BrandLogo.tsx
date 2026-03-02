import React from "react";

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
    const padding = Math.round(size * 0.15); // 15% safe margin padding

    return (
        <div
            className={`relative bg-[#1C1C1E] ${rounded} overflow-hidden flex items-center justify-center border border-white/10 shadow-xl ${className}`}
            style={{
                width: size,
                height: size,
                padding: `${padding}px`
            }}
        >
            <img
                src="/icons/icon-512x512.png"
                alt="Event Pulse"
                className="w-full h-full object-contain"
            />
        </div>
    );
};
