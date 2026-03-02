import React from "react";
import { BrandLogo } from "./BrandLogo";

export const BrandingFooter = () => {
    return (
        <footer className="py-12 px-6 flex flex-col items-center justify-center opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <BrandLogo size={32} rounded="rounded-lg" className="mb-3" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
                Event Pulse &copy; 2026
            </span>
            <div className="h-[1px] w-8 bg-[var(--color-border)] mt-4 mb-2" />
            <span className="text-[9px] font-bold text-[var(--color-text-muted)]">
                Your Campus. Connected.
            </span>
        </footer>
    );
};
